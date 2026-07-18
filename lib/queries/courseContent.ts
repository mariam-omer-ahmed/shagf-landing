import { supabase } from "@/lib/supabase";

export async function getCourseModules(packageId: string) {
  const { data, error } = await supabase
    .from("course_modules")
    .select(`
      *,
      course_lessons (
        *,
        course_assignments (*)
      )
    `)
    .eq("package_id", packageId)
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (error) throw error;

  return data || [];
}