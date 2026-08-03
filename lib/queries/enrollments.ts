import { supabase } from "@/lib/supabase";

export async function getEnrollments() {

  console.log("QUERY START");

  const {
    data: enrollments,
    error
  } = await supabase
    .from("enrollments")
    // الإصلاح هنا: package_name مش عمود حقيقي في enrollments.
    // العمود الحقيقي هو package_id، وبنجيب اسم الباقة عن طريق join
    // مباشر مع جدول packages.
    .select("*, packages(id, title)")
    .order(
      "created_at",
      {
        ascending: false
      }
    );

  console.log(
    "SUPABASE RESULT",
    {
      enrollments,
      error
    }
  );

  if (error) {
    throw error;
  }

  if (!enrollments || enrollments.length === 0) {
    return [];
  }

  const leadIds = enrollments
    .map((e) => e.lead_id)
    .filter(Boolean);

  // كل الأعمدة الموجودة فعليًا بجدول shaghaf_leads
  const { data: leads, error: leadsError } = await supabase
    .from("shaghaf_leads")
    .select(`
      id,
      created_at,
      full_name,
      whatsapp,
      phone,
      email,
      country,
      city,
      age_range,
      goal,
      current_status,
      skills,
      interviews_count,
      source,
      source_channel,
      selected_package,
      readiness,
      lead_stage,
      lead_score,
      urgency_score,
      start_timeframe,
      budget_range,
      main_obstacle,
      enrollment_status,
      converted_at,
      last_activity_at,
      session_id,
      user_id
    `)
    .in("id", leadIds);

  if (leadsError) {
    console.log("LEADS FOR ENROLLMENTS ERROR:", leadsError);
  }

  const leadsMap = new Map(
    (leads || []).map((lead) => [lead.id, lead])
  );

  // جلب مرحلة كل طالب من profiles عشان الأدمن يقدر يشوفها ويعدّلها
  const userIds = enrollments.map((e) => e.user_id).filter(Boolean);

  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select("id, roadmap_stage")
    .in("id", userIds);

  if (profilesError) {
    console.log("PROFILES FOR ENROLLMENTS ERROR:", profilesError);
  }

  const profilesMap: Map<string, any> = new Map(
    (profilesData || []).map((p: any) => [p.id, p])
  );

  return enrollments.map((enrollment) => ({
    ...enrollment,
    lead: leadsMap.get(enrollment.lead_id) || null,
    roadmap_stage: profilesMap.get(enrollment.user_id)?.roadmap_stage ?? 1,
  }));

}

/**
 * تحديث مرحلة الطالب في خارطة الطريق (1 إلى 5) — بيتحكم فيها الأدمن
 * يدويًا حسب تقدم الطالب الفعلي في المحاضرات والواجبات.
 */
export async function setRoadmapStage(userId: string, stage: number) {
  const { error } = await supabase
    .from("profiles")
    .update({ roadmap_stage: stage })
    .eq("id", userId);

  if (error) {
    console.error("setRoadmapStage error:", error.message);
    throw error;
  }
}

/**
 * كل الباقات المتاحة، لاستخدامها في قائمة اختيار/تصحيح الباقة
 * لأي اشتراك من لوحة الأدمن.
 */
export async function getPackagesList() {
  const { data, error } = await supabase
    .from("packages")
    .select("id, title")
    .eq("is_active", true)
    .order("title", { ascending: true });

  if (error) {
    console.error("getPackagesList error:", error.message);
    throw error;
  }

  return data || [];
}

/**
 * تحديد/تصحيح الباقة المرتبطة باشتراك معيّن — بتتنادى من لوحة الأدمن
 * لما تكون package_id فاضية أو غلط.
 */
export async function setEnrollmentPackage(
  enrollmentId: string,
  packageId: string
) {
  const { error } = await supabase
    .from("enrollments")
    .update({ package_id: packageId })
    .eq("id", enrollmentId);

  if (error) {
    console.error("setEnrollmentPackage error:", error.message);
    throw error;
  }
}