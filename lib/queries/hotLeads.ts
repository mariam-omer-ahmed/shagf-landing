import { supabase } from "@/lib/supabase";


export async function getHotLeads(){


const {
data,
error
}=await supabase
.from("shaghaf_leads")
.select(`
id,
full_name,
email,
selected_package,
lead_stage,
lead_score
`)
.order(
"lead_score",
{
ascending:false
}
)
.limit(10);



if(error){

console.log(error);

return [];

}


return data || [];


}