import { supabase } from "@/lib/supabase";


export async function getLeads() {


console.log("QUERY START");


const {
data,
error
}=await supabase
.from("shaghaf_leads")
.select("*")
.order(
"created_at",
{
ascending:false
}
);


console.log(
"SUPABASE RESULT",
{
data,
error
}
);



if(error){

throw error;

}


return data ?? [];


}