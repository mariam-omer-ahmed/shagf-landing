import { supabase } from "@/lib/supabase";

const LESSON_BUCKET = "lesson-materials";

/**
 * رفع ملف محاضرة إلى bucket "lesson-materials".
 * المسار بيتبني بالشكل: {moduleId}/{lessonId}/{timestamp}-{اسم الملف}
 * وبيرجع الـ path (مش رابط كامل، لأن الـ bucket خاص).
 */
export async function uploadLessonFile(
  moduleId: string,
  lessonId: string,
  file: File
): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${moduleId}/${lessonId}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from(LESSON_BUCKET)
    .upload(path, file);

  if (error) {
    console.error("uploadLessonFile error:", error.message);
    throw error;
  }

  return path;
}

/**
 * توليد رابط مؤقت لعرض/تحميل ملف مخزّن (لأن الـ bucket خاص).
 * الرابط صالح لمدة expiresIn ثانية (افتراضيًا ساعة).
 */
export async function getLessonFileSignedUrl(
  storagePath: string,
  expiresIn = 3600
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(LESSON_BUCKET)
    .createSignedUrl(storagePath, expiresIn);

  if (error) {
    console.error("getLessonFileSignedUrl error:", error.message);
    return null;
  }

  return data?.signedUrl ?? null;
}

/**
 * حذف ملف من الـ bucket (بيتنادى قبل حذف السجل من lesson_resources
 * أو قبل حذف الدرس كله، عشان مايفضلش ملفات يتيمة في التخزين).
 */
export async function deleteLessonFile(storagePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from(LESSON_BUCKET)
    .remove([storagePath]);

  if (error) {
    console.error("deleteLessonFile error:", error.message);
    // مش بنعمل throw هنا عشان مانوقفش عملية حذف الدرس بسبب ملف مش موجود أصلاً
  }
}