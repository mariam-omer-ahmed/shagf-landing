import { supabase } from "@/lib/supabase";

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

export interface CourseAssignment {
  id: string;
  lesson_id: string | null;
  // module_id لسه موجود في الجدول لبيانات قديمة، لكن الواجبات الجديدة
  // كلها بتتضاف بـ lesson_id
  module_id: string | null;
  title: string;
  description: string | null;
  submission_type: string;
  sort_order: number;
  is_active: boolean;
  [key: string]: any;
}

export interface CourseLesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  duration_minutes: number | null;
  sort_order: number;
  is_active: boolean;
  lesson_resources: LessonResource[];
  course_assignments: CourseAssignment[];
  [key: string]: any;
}

// بيانات الباقة اللي بترجع مع كل موديول — عشان الطالب يعرف هو
// حاليًا في أنهي باقة، والأدمن يعرف بيضيف دروس لأنهي باقة.
// tier بتحدد ترتيب الباقة جوه سلسلة الباقات (بوصلة=1، انطلاقة=2، تمكين=3)
export interface ModulePackageInfo {
  id: string;
  title: string;
  color: string | null;
  thumbnail: string | null;
  tier: number;
}

export interface CourseModule {
  id: string;
  package_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  course_lessons: CourseLesson[];
  packages: ModulePackageInfo | null;
  [key: string]: any;
}

export interface PathPackageGroup {
  package: ModulePackageInfo;
  modules: CourseModule[];
}

const MODULE_WITH_LESSONS_SELECT = `
  *,
  packages ( id, title, color, thumbnail, tier ),
  course_lessons (
    *,
    lesson_resources (*),
    course_assignments (*)
  )
`;

/**
 * كل موديولات الباقة، مرتبة حسب sort_order.
 * كل درس جوه الموديول بييجي مرتب بـ sort_order.
 * ترتيب الموارد والتكليفات جوه كل درس بيتم يدويًا تحت، لأن
 * Supabase مش بيدعم .order() لمستوى تاني جوه علاقة متداخلة.
 */
export async function getCourseModules(
  packageId: string
): Promise<CourseModule[]> {
  const { data, error } = await supabase
    .from("course_modules")
    .select(MODULE_WITH_LESSONS_SELECT)
    .eq("package_id", packageId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(
      "getCourseModules error:",
      JSON.stringify(
        { message: error.message, details: error.details, hint: error.hint, code: error.code },
        null,
        2
      )
    );
    throw error;
  }

  return (data || []).map((mod: any) => sortModuleRelations(mod));
}

/**
 * موديول واحد بالـ id (UUID) بتاعه في جدول course_modules.
 * لازم اللي بيستدعي الدالة دي يبعت module.id الحقيقي (UUID)،
 * مش رقم ترتيب ومش slug.
 */
export async function getModule(
  moduleId: string
): Promise<CourseModule | null> {
  if (!moduleId) {
    throw new Error("getModule استُدعيت من غير module id");
  }

  const { data, error } = await supabase
    .from("course_modules")
    .select(MODULE_WITH_LESSONS_SELECT)
    .eq("id", moduleId)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error(
      "getModule error:",
      JSON.stringify(
        { message: error.message, details: error.details, hint: error.hint, code: error.code },
        null,
        2
      ),
      "moduleId:",
      moduleId
    );
    throw error;
  }

  if (!data) return null;

  return sortModuleRelations(data as any);
}

/**
 * مسار الطالب الكامل: كل موديولات كل الباقات من tier=1 لحد الباقة
 * المشترك فيها الطالب، كل باقة في مجموعة لوحدها بالترتيب.
 * مثال: مشترك في "الانطلاقة" (tier=2) → هيرجع [البوصلة (tier 1)، الانطلاقة (tier 2)]
 * لأن الباقات مكمّلة لبعض، مش منفصلة.
 */
export async function getPathForEnrollment(
  enrolledPackageId: string
): Promise<PathPackageGroup[]> {
  const { data: enrolledPkg, error: pkgError } = await supabase
    .from("packages")
    .select("id, tier")
    .eq("id", enrolledPackageId)
    .single();

  if (pkgError || !enrolledPkg) {
    console.error("getPathForEnrollment package error:", pkgError?.message);
    throw pkgError ?? new Error("تعذّر العثور على الباقة المشترك بها");
  }

  const { data: packagesInPath, error: packagesError } = await supabase
    .from("packages")
    .select("id, title, color, thumbnail, tier")
    .lte("tier", enrolledPkg.tier)
    .eq("is_active", true)
    .order("tier", { ascending: true });

  if (packagesError) {
    console.error("getPathForEnrollment packages error:", packagesError.message);
    throw packagesError;
  }

  if (!packagesInPath || packagesInPath.length === 0) {
    return [];
  }

  const groups: PathPackageGroup[] = [];
  for (const pkg of packagesInPath) {
    const modules = await getCourseModules(pkg.id);
    groups.push({ package: pkg as ModulePackageInfo, modules });
  }

  return groups;
}

function sortModuleRelations(mod: any): CourseModule {
  return {
    ...mod,
    course_lessons: (mod.course_lessons || [])
      .slice()
      .sort((a: CourseLesson, b: CourseLesson) => a.sort_order - b.sort_order)
      .map((lesson: CourseLesson) => ({
        ...lesson,
        lesson_resources: (lesson.lesson_resources || [])
          .slice()
          .sort((a: LessonResource, b: LessonResource) => a.sort_order - b.sort_order),
        course_assignments: (lesson.course_assignments || [])
          .slice()
          .sort((a: CourseAssignment, b: CourseAssignment) => a.sort_order - b.sort_order),
      })),
  };
}