import { supabase } from "@/lib/supabase";


export async function getLeadStats(){


const {
data,
error
}=await supabase
.from("shaghaf_leads")
.select(`
id,
lead_stage,
selected_package,
created_at
`);


if(error){

console.error(
"STATS ERROR",
error
);

throw error;

}



const total = data.length;



const today = new Date()
.toISOString()
.split("T")[0];


const todayLeads =
data.filter(
(item)=>
item.created_at.startsWith(today)
).length;



const stages = data.reduce(
(acc:any,item)=>{

const stage =
item.lead_stage || "new";


acc[stage] =
(acc[stage] || 0)+1;


return acc;

},
{}
);



const packages = data.reduce(
(acc:any,item)=>{

const pkg =
item.selected_package || "غير محدد";


acc[pkg] =
(acc[pkg] || 0)+1;


return acc;

},
{}
);



return {

total,

todayLeads,

stages,

packages

};


}