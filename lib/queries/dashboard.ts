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




  return {


    users:
    usersCount || 0,


    leads:
    totalLeads,


    todayLeads,


    resources:
    resourcesCount || 0,


    stages,


    packages


  };


}