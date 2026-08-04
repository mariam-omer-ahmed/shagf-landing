import { supabase } from "@/lib/supabase";

/**
 * كل الدروس اللي الطالبة خلّصتها فعليًا (completed = true).
 * بترجع Set من lesson_id عشان يكون التحقق سريع (has بدل loop).
 */
export async function getCompletedLessonIds(
  studentId: string
): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("student_lesson_progress")
    .select("lesson_id")
    .eq("student_id", studentId)
    .eq("completed", true);

  if (error) {
    console.error("getCompletedLessonIds error:", error.message);
    throw error;
  }

  return new Set((data ?? []).map((row) => row.lesson_id as string));
}

/**
 * دالة داخلية آمنة: بتتحقق الأول هل فيه صف موجود لنفس الطالبة/الدرس،
 * لو موجود بتعمل update، لو مش موجود بتعمل insert. بنستخدمها بدل
 * upsert عشان مش متأكدين إن فيه unique constraint على العمودين دول
 * في الجدول الحقيقي عندك.
 */
async function setLessonProgress(
  studentId: string,
  lessonId: string,
  completed: boolean
) {
  const { data: existing, error: findError } = await supabase
    .from("student_lesson_progress")
    .select("id")
    .eq("student_id", studentId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (findError) {
    console.error("setLessonProgress find error:", findError.message);
    throw findError;
  }

  const completedAt = completed ? new Date().toISOString() : null;

  if (existing) {
    const { error } = await supabase
      .from("student_lesson_progress")
      .update({ completed, completed_at: completedAt })
      .eq("id", existing.id);

    if (error) {
      console.error("setLessonProgress update error:", error.message);
      throw error;
    }
  } else {
    const { error } = await supabase.from("student_lesson_progress").insert({
      student_id: studentId,
      lesson_id: lessonId,
      completed,
      completed_at: completedAt,
    });

    if (error) {
      console.error("setLessonProgress insert error:", error.message);
      throw error;
    }
  }
}

/**
 * تعليم درس معيّن كـ "خلّصته" الطالبة.
 */
export async function markLessonComplete(studentId: string, lessonId: string) {
  await setLessonProgress(studentId, lessonId, true);
}

/**
 * التراجع عن إنهاء درس (لو الطالبة عايزة تفتحه تاني كمراجعة أو غلطت).
 */
export async function unmarkLessonComplete(studentId: string, lessonId: string) {
  await setLessonProgress(studentId, lessonId, false);
}

/**
 * حفظ آخر ثانية شاهدتها الطالبة في فيديو الدرس — عشان لما ترجع تكمل
 * من نفس المكان بدل ما تبدأ من الأول (استئناف المشاهدة).
 */
export async function updateLastWatchedSecond(
  studentId: string,
  lessonId: string,
  second: number
) {
  const { data: existing, error: findError } = await supabase
    .from("student_lesson_progress")
    .select("id")
    .eq("student_id", studentId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (findError) {
    console.error("updateLastWatchedSecond find error:", findError.message);
    return;
  }

  if (existing) {
    await supabase
      .from("student_lesson_progress")
      .update({ last_watched_second: second })
      .eq("id", existing.id);
  } else {
    await supabase.from("student_lesson_progress").insert({
      student_id: studentId,
      lesson_id: lessonId,
      completed: false,
      last_watched_second: second,
    });
  }
}

/**
 * ترجع كل الـ Modules المكتملة للطالبة.
 *
 * تعتبر الوحدة مكتملة إذا كانت جميع دروسها مكتملة.
 */
export async function getCompletedModuleIds(
  studentId: string
): Promise<Set<string>> {
  // كل الدروس المكتملة
  const completedLessons = await getCompletedLessonIds(studentId);

  const { data: modules, error } = await supabase
    .from("course_modules")
    .select(`
      id,
      course_lessons(
        id
      )
    `)
    .eq("is_active", true);

  if (error) {
    console.error("getCompletedModuleIds error:", error.message);
    throw error;
  }

  const completedModules = new Set<string>();

  (modules || []).forEach((module: any) => {
    const lessons = module.course_lessons || [];

    if (lessons.length === 0) return;

    const allCompleted = lessons.every((lesson: any) =>
      completedLessons.has(lesson.id)
    );

    if (allCompleted) {
      completedModules.add(module.id);
    }
  });

  return completedModules;
}

/**
 * اعتبار الوحدة مكتملة:
 * نعلّم كل دروسها كمكتملة.
 */
export async function markModuleComplete(
  studentId: string,
  moduleId: string
) {
  const { data, error } = await supabase
    .from("course_lessons")
    .select("id")
    .eq("module_id", moduleId);

  if (error) {
    console.error("markModuleComplete error:", error.message);
    throw error;
  }

  for (const lesson of data ?? []) {
    await markLessonComplete(studentId, lesson.id);
  }
}

/**
 * إلغاء إنهاء الوحدة:
 * نرجع كل دروسها غير مكتملة.
 */
export async function unmarkModuleComplete(
  studentId: string,
  moduleId: string
) {
  const { data, error } = await supabase
    .from("course_lessons")
    .select("id")
    .eq("module_id", moduleId);

  if (error) {
    console.error("unmarkModuleComplete error:", error.message);
    throw error;
  }

  for (const lesson of data ?? []) {
    await unmarkLessonComplete(studentId, lesson.id);
  }
}