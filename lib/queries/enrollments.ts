import { supabase } from "@/lib/supabase";

export async function getEnrollments() {

  console.log("QUERY START");

  const {
    data: enrollments,
    error
  } = await supabase
    .from("enrollments")
    .select("*")
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

  return enrollments.map((enrollment) => ({
    ...enrollment,
    lead: leadsMap.get(enrollment.lead_id) || null,
  }));

}