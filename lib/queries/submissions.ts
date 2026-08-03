import { supabase } from "@/lib/supabase";

export type SubmissionStatus =
  | "submitted"
  | "in_review"
  | "needs_revision"
  | "approved";

export type SubmissionFile = {
  id: string;
  submission_id: string;
  file_name: string;
  storage_path: string;
  uploaded_by: string;
  uploaded_by_role: "student" | "admin";
  created_at: string;
};

export type SubmissionComment = {
  id: string;
  submission_id: string;
  author_id: string;
  author_role: "student" | "admin";
  message: string;
  created_at: string;
};

export type Submission = {
  id: string;
  assignment_id: string;
  user_id: string;
  status: SubmissionStatus;
  created_at: string;
  updated_at: string;
  files: SubmissionFile[];
  comments: SubmissionComment[];
};

const BUCKET = "assignment-submissions";

function logSupabaseError(label: string, error: any) {
  console.error(
    label,
    JSON.stringify(
      {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
      },
      null,
      2
    )
  );
}

/**
 * بترجع submission_id بتاع الطالبة لهذا الواجب — تعمله لو مش موجود.
 */
export async function getOrCreateSubmission(
  assignmentId: string,
  userId: string
): Promise<string> {
  const { data: existing, error: findError } = await supabase
    .from("assignment_submissions")
    .select("id")
    .eq("assignment_id", assignmentId)
    .eq("user_id", userId)
    .maybeSingle();

  if (findError) {
    logSupabaseError("getOrCreateSubmission find error:", findError);
  }

  if (existing) return existing.id;

  const { data: created, error: createError } = await supabase
    .from("assignment_submissions")
    .insert({ assignment_id: assignmentId, user_id: userId, status: "submitted" })
    .select("id")
    .single();

  if (createError || !created) {
    throw createError ?? new Error("تعذّر إنشاء التسليم");
  }

  return created.id;
}

export async function getSubmission(
  submissionId: string
): Promise<Submission | null> {
  const { data: submission, error } = await supabase
    .from("assignment_submissions")
    .select("*")
    .eq("id", submissionId)
    .maybeSingle();

  if (error || !submission) {
    if (error) logSupabaseError("getSubmission error:", error);
    return null;
  }

  const [{ data: files }, { data: comments }] = await Promise.all([
    supabase
      .from("assignment_submission_files")
      .select("*")
      .eq("submission_id", submissionId)
      .order("created_at", { ascending: true }),
    supabase
      .from("assignment_submission_comments")
      .select("*")
      .eq("submission_id", submissionId)
      .order("created_at", { ascending: true }),
  ]);

  return {
    ...submission,
    files: files ?? [],
    comments: comments ?? [],
  };
}

export async function uploadSubmissionFile(
  submissionId: string,
  file: File,
  uploadedBy: string,
  uploadedByRole: "student" | "admin"
) {
  // Supabase Storage بيرفض مفاتيح فيها حروف عربية أو مسافات، فلازم
  // ننضّف اسم الملف قبل استخدامه في المسار — لكن بنحافظ على الاسم
  // الأصلي في file_name عشان يظهر صح للمستخدم عند العرض والتحميل
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${submissionId}/${Date.now()}_${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file);

  if (uploadError) throw uploadError;

  const { error: insertError } = await supabase
    .from("assignment_submission_files")
    .insert({
      submission_id: submissionId,
      file_name: file.name,
      storage_path: path,
      uploaded_by: uploadedBy,
      uploaded_by_role: uploadedByRole,
    });

  if (insertError) throw insertError;

  // لو الطالبة رفعت ملف جديد بعد ما الأدمن طلب تعديل، الحالة
  // ترجع "submitted" تلقائيًا — معناها إنها ردّت على الملاحظات
  if (uploadedByRole === "student") {
    await supabase
      .from("assignment_submissions")
      .update({ status: "submitted", updated_at: new Date().toISOString() })
      .eq("id", submissionId);
  }
}

export async function getSubmissionFileUrl(storagePath: string) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60 * 10);

  if (error || !data?.signedUrl) {
    if (error) logSupabaseError("getSubmissionFileUrl error:", error);
    return null;
  }

  return data.signedUrl;
}

export async function addSubmissionComment(
  submissionId: string,
  authorId: string,
  authorRole: "student" | "admin",
  message: string
) {
  const { error } = await supabase.from("assignment_submission_comments").insert({
    submission_id: submissionId,
    author_id: authorId,
    author_role: authorRole,
    message,
  });

  if (error) throw error;

  await supabase
    .from("assignment_submissions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", submissionId);
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: SubmissionStatus
) {
  const { error } = await supabase
    .from("assignment_submissions")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", submissionId);

  if (error) throw error;
}

/**
 * لوحة الأدمن: كل التسليمات المحتاجة مراجعة (submitted أو in_review)،
 * الأقدم تحديثًا أولًا.
 *
 * ملاحظة الإصلاح: كانت الدالة بتعمل join متداخل مباشر مع course_assignments
 * و profiles في نفس الاستعلام، وده سبّب خطأ Supabase غامض (نفس نوع
 * المشكلة اللي واجهناها قبل كده مع العلاقات المتداخلة). دلوقتي بنجيب
 * التسليمات الأول، وبعدين بنجيب العناوين والملفات الشخصية في استعلامين
 * منفصلين، وبنربطهم يدويًا بالكود — نفس الأسلوب المستخدم في
 * getEnrollments() وأثبت نجاحه.
 */
export async function listSubmissionsForReview() {
  const { data: submissions, error } = await supabase
    .from("assignment_submissions")
    .select("id, assignment_id, user_id, status, created_at, updated_at")
    .in("status", ["submitted", "in_review"])
    .order("updated_at", { ascending: true });

  if (error) {
    logSupabaseError("listSubmissionsForReview error:", error);
    return [];
  }

  if (!submissions || submissions.length === 0) {
    return [];
  }

  const assignmentIds = Array.from(
  new Set(
    submissions
      .map((s) => s.assignment_id)
      .filter((id): id is string => !!id)
  )
);

const userIds = Array.from(
  new Set(
    submissions
      .map((s) => s.user_id)
      .filter((id): id is string => !!id)
  )
);

  const [{ data: assignments, error: assignmentsError }, { data: profiles, error: profilesError }] =
    await Promise.all([
      supabase.from("course_assignments").select("id, title").in("id", assignmentIds),
      supabase.from("profiles").select("id, full_name, email").in("id", userIds),
    ]);

  if (assignmentsError) {
    logSupabaseError("listSubmissionsForReview assignments error:", assignmentsError);
  }
  if (profilesError) {
    logSupabaseError("listSubmissionsForReview profiles error:", profilesError);
  }

  const assignmentsMap: Map<string, any> = new Map(
    (assignments || []).map((a: any) => [a.id, a])
  );
  const profilesMap: Map<string, any> = new Map(
    (profiles || []).map((p: any) => [p.id, p])
  );

  return submissions.map((s) => ({
    ...s,
    course_assignments: assignmentsMap.get(s.assignment_id) || null,
    profiles: profilesMap.get(s.user_id) || null,
  }));
}