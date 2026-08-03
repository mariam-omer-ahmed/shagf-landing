import { supabase } from "@/lib/supabase";
import { deleteLessonFile } from "@/lib/storage";

export interface LessonResource {
  id: string;
  lesson_id: string;
  resource_type: "file" | "youtube";
  title: string;
  url: string | null;
  storage_path: string | null;
  sort_order: number;
  created_at: string;
}

export interface AdminLesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  duration_minutes: number | null;
  sort_order: number;
  is_active: boolean;
  lesson_resources: LessonResource[];
  course_assignments: LessonAssignment[];
  [key: string]: any;
}

export interface LessonInput {
  module_id: string;
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number | null;
  sort_order: number;
  is_active: boolean;
}

// بيانات الباقة التابع لها الموديول — عشان الأدمن يشوف واضح
// بيضيف دروس لأنهي باقة قبل ما يبدأ
export interface AdminModulePackageInfo {
  id: string;
  title: string;
  color: string | null;
  thumbnail: string | null;
}

export interface AdminModuleInfo {
  id: string;
  title: string;
  package_id: string;
  packages: AdminModulePackageInfo | null;
}

/**
 * بيانات الوحدة (بما فيها غير النشطة) — لعرض عنوانها وبيانات الباقة
 * التابعة لها في صفحة إدارة الدروس.
 */
export async function getModuleForAdmin(
  moduleId: string
): Promise<AdminModuleInfo> {
  const { data, error } = await supabase
    .from("course_modules")
    .select("id, title, package_id, packages ( id, title, color, thumbnail )")
    .eq("id", moduleId)
    .single();

  if (error) {
    console.error("getModuleForAdmin error:", error.message);
    throw error;
  }

  return data as unknown as AdminModuleInfo;
}

/**
 * كل دروس الوحدة، مرتبة حسب sort_order، مع كل الموارد الإضافية لكل درس.
 */
export async function getLessonsForModule(
  moduleId: string
): Promise<AdminLesson[]> {
  const { data, error } = await supabase
    .from("course_lessons")
    .select(
      `
      *,
      lesson_resources ( * ),
      course_assignments ( * )
    `
    )
    .eq("module_id", moduleId)
    .order("sort_order", { ascending: true })
    .order("sort_order", { ascending: true, referencedTable: "lesson_resources" })
    .order("sort_order", { ascending: true, referencedTable: "course_assignments" });

  if (error) {
    console.error("getLessonsForModule error:", error.message);
    throw error;
  }

  return (data as any) || [];
}

export async function createLesson(input: LessonInput) {
  const { data, error } = await supabase
    .from("course_lessons")
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error("createLesson error:", error.message);
    throw error;
  }

  return data;
}

export async function updateLesson(id: string, input: Partial<LessonInput>) {
  const { data, error } = await supabase
    .from("course_lessons")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateLesson error:", error.message);
    throw error;
  }

  return data;
}

/**
 * حذف درس بالكامل: أول حاجة بنمسح ملفاته المرفوعة من التخزين
 * (عشان مايفضلش ملفات يتيمة)، وبعدين بنمسح الدرس نفسه —
 * وبيتمسح معاه صفوف lesson_resources تلقائيًا (on delete cascade).
 */
export async function deleteLesson(lesson: AdminLesson) {
  const fileResources = lesson.lesson_resources.filter(
    (r) => r.resource_type === "file" && r.storage_path
  );

  for (const resource of fileResources) {
    if (resource.storage_path) {
      await deleteLessonFile(resource.storage_path);
    }
  }

  const { error } = await supabase
    .from("course_lessons")
    .delete()
    .eq("id", lesson.id);

  if (error) {
    console.error("deleteLesson error:", error.message);
    throw error;
  }
}

export async function addYoutubeResource(
  lessonId: string,
  title: string,
  url: string,
  sortOrder: number
) {
  const { data, error } = await supabase
    .from("lesson_resources")
    .insert({
      lesson_id: lessonId,
      resource_type: "youtube",
      title,
      url,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (error) {
    console.error("addYoutubeResource error:", error.message);
    throw error;
  }

  return data;
}

export async function addFileResource(
  lessonId: string,
  title: string,
  storagePath: string,
  sortOrder: number
) {
  const { data, error } = await supabase
    .from("lesson_resources")
    .insert({
      lesson_id: lessonId,
      resource_type: "file",
      title,
      storage_path: storagePath,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (error) {
    console.error("addFileResource error:", error.message);
    throw error;
  }

  return data;
}

export async function deleteResource(resource: LessonResource) {
  if (resource.resource_type === "file" && resource.storage_path) {
    await deleteLessonFile(resource.storage_path);
  }

  const { error } = await supabase
    .from("lesson_resources")
    .delete()
    .eq("id", resource.id);

  if (error) {
    console.error("deleteResource error:", error.message);
    throw error;
  }
}

// ============================================================
// الواجبات العملية — كل واجب مرتبط بدرس معيّن عبر lesson_id
// ============================================================

export interface LessonAssignment {
  id: string;
  lesson_id: string;
  title: string;
  description: string | null;
  submission_type: string;
  sort_order: number;
  is_active: boolean;
}

export interface AssignmentInput {
  lesson_id: string;
  title: string;
  description: string;
  submission_type: string;
  sort_order: number;
  is_active: boolean;
}

export async function createAssignment(input: AssignmentInput) {
  const { data, error } = await supabase
    .from("course_assignments")
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error("createAssignment error:", error.message);
    throw error;
  }

  return data as LessonAssignment;
}

export async function updateAssignment(
  id: string,
  input: Partial<AssignmentInput>
) {
  const { data, error } = await supabase
    .from("course_assignments")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateAssignment error:", error.message);
    throw error;
  }

  return data as LessonAssignment;
}

export async function deleteAssignment(id: string) {
  const { error } = await supabase
    .from("course_assignments")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteAssignment error:", error.message);
    throw error;
  }
}