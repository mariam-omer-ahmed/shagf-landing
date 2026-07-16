import { supabase } from "@/lib/supabase";


export async function getLeadActivities(
  leadId: string
) {


  const {
    data,
    error
  } = await supabase
    .from("lead_activities")
    .select("*")
    .eq(
      "lead_id",
      leadId
    )
    .order(
      "created_at",
      {
        ascending: false
      }
    );


  if (error) {

    console.error(
      "GET ACTIVITIES ERROR:",
      error
    );

    throw error;

  }


  return data ?? [];

}