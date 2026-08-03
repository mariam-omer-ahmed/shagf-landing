import { supabase } from "@/lib/supabase";
import type { CourseModule } from "@/lib/queries/courseContent";

export interface PackageOption {
  id: string;
  title: string;
  color: string | null;
}

export interface ModuleInput {
  package_id: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

/**
 * كل الباقات النشطة، لاستخدامها في قائمة اختيار الباقة عند إضافة/تعديل وحدة.
 * بيرجع لونها كمان عشان نعرض شارة ملوّنة جنب اسم كل باقة في القائمة.
 */
export async function getPackagesForSelect(): Promise<PackageOption[]> {
  const { data, error } = await supabase
    .from("packages")
    .select("id, title, color")
    .eq("is_active", true)
    .order("title", { ascending: true });

  if (error) {
    console.error("getPackagesForSelect error:", error.message);
    throw error;
  }

  return data || [];
}

/**
 * كل الوحدات في كل الباقات (بما فيها غير النشطة)، للوحة تحكم الأدمن.
 * مرتبة حسب اسم الباقة ثم ترتيب الوحدة داخلها.
 */
export async function getAllModulesForAdmin(): Promise<
  (CourseModule & { packages: { title: string; color: string | null } | null })[]
> {
  const { data, error } = await supabase
    .from("course_modules")
    .select(
      `
      *,
      packages ( title, color ),
      course_lessons ( id ),
      course_assignments ( id )
    `
    )
    .order("package_id", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getAllModulesForAdmin error:", error.message);
    throw error;
  }

  return (data as any) || [];
}

export async function createModule(input: ModuleInput) {
  const { data, error } = await supabase
    .from("course_modules")
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error("createModule error:", error.message);
    throw error;
  }

  return data;
}

export async function updateModule(id: string, input: Partial<ModuleInput>) {
  const { data, error } = await supabase
    .from("course_modules")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateModule error:", error.message);
    throw error;
  }

  return data;
}

export async function deleteModule(id: string) {
  const { error } = await supabase.from("course_modules").delete().eq("id", id);

  if (error) {
    console.error("deleteModule error:", error.message);
    throw error;
  }
}