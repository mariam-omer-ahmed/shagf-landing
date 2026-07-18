import { supabase } from "@/lib/supabase";

export async function getHotLeads() {

  const {
    data,
    error
  } = await supabase
    .from("shaghaf_leads")
    .select(`
      id,
      full_name,
      whatsapp,
      phone,
      email,
      selected_package,
      lead_stage,
      lead_score,
      urgency_score,
      budget_range,
      start_timeframe
    `)
    // ما فيه فايدة نتابع شخص خلاص دفع أو خلاص غير نشط
    .not("lead_stage", "in", "(paid,inactive)")
    .order(
      "lead_score",
      {
        ascending: false
      }
    )
    .limit(10);

  if (error) {
    console.log(error);
    return [];
  }

  return data || [];

}