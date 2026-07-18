import { supabase } from "@/lib/supabase";


export async function getDashboardStats(){


  const {
    count: usersCount
  } = await supabase
    .from("profiles")
    .select("id",{
      count:"exact",
      head:true
    });



  const {
    data: leads
  } = await supabase
    .from("shaghaf_leads")
    .select(`
      id,
      lead_stage,
      selected_package,
      created_at
    `);



  const {
    count: resourcesCount
  } = await supabase
    .from("free_resources")
    .select("id",{
      count:"exact",
      head:true
    });


  const {
    count: pendingEnrollmentsCount
  } = await supabase
    .from("enrollments")
    .select("id",{
      count:"exact",
      head:true
    })
    .eq("status","pending");


  const {
    count: paidEnrollmentsCount
  } = await supabase
    .from("enrollments")
    .select("id",{
      count:"exact",
      head:true
    })
    .eq("payment_status","paid");



  const totalLeads =
    leads?.length || 0;



  const today =
    new Date()
    .toISOString()
    .split("T")[0];



  const todayLeads =
    leads?.filter(
      lead =>
      lead.created_at.startsWith(today)
    ).length || 0;



  const stages =
    leads?.reduce(
      (acc:any,lead)=>{

        const stage =
        lead.lead_stage || "new";


        acc[stage] =
        (acc[stage] || 0) + 1;


        return acc;

      },
      {}
    ) || {};




  const packages =
    leads?.reduce(
      (acc:any,lead)=>{

        const pkg =
        lead.selected_package || "غير محدد";


        acc[pkg] =
        (acc[pkg] || 0)+1;


        return acc;

      },
      {}
    ) || {};


  // معدل التحويل الفعلي: كم % من كل الناس اللي عملوا الكويز صاروا مشتركين مدفوعين
  const conversionRate =
    totalLeads > 0
      ? Math.round(
          ((paidEnrollmentsCount || 0) / totalLeads) * 1000
        ) / 10
      : 0;




  return {


    users:
    usersCount || 0,


    leads:
    totalLeads,


    todayLeads,


    resources:
    resourcesCount || 0,


    pendingEnrollments:
    pendingEnrollmentsCount || 0,


    paidEnrollments:
    paidEnrollmentsCount || 0,


    conversionRate,


    stages,


    packages


  };


}