"use client";

import { useEffect, useState } from "react";
import { getLeads } from "@/lib/queries/leads";
import { getLeadTemperature } from "@/lib/queries/leadScoring";
import Link from "next/link";
import {
  Search,
  User,
  Package,
  Target,
  MessageCircle,
} from "lucide-react";


type Lead = {

  id:string;

  full_name:string;

  email:string;

  whatsapp?:string;

  phone?:string;

  country:string;

  goal:string;

  selected_package:string;

  readiness:string;

  current_status:string;

  lead_stage?:string;

  lead_score?:number;

  user_id:string;

  created_at:string;

};

const STAGE_LABELS: Record<string, string> = {
  new: "جديد",
  assessment_done: "تم التقييم",
  contacted: "تم التواصل",
  offer_sent: "تم إرسال العرض",
  paid: "مدفوع",
  inactive: "غير نشط",
};



export default function LeadsPage(){


const [leads,setLeads]=useState<Lead[]>([]);

const [loading,setLoading]=useState(true);

const [search,setSearch]=useState("");

const [stageFilter,setStageFilter]=useState("all");




useEffect(()=>{

loadLeads();

},[]);




async function loadLeads(){

console.log("START LOADING LEADS");


try {

const data = await getLeads();


console.log("LEADS DATA:", data);


setLeads(data);


}
catch(error){

console.log(
"LOAD LEADS ERROR:",
error
);


}
finally {

console.log("FINISHED");

setLoading(false);

}

}






const filteredLeads =
leads
.filter((lead)=>{

const stage = lead.lead_stage || "new";

if(stageFilter !== "all" && stage !== stageFilter){
  return false;
}

const text = `

${lead.full_name}

${lead.email}

${lead.country}

${lead.selected_package}

${lead.goal}

`.toLowerCase();



return text.includes(
search.toLowerCase()
);



})
.sort(
  (a,b) => (b.lead_score || 0) - (a.lead_score || 0)
);






if(loading){

return (

<div className="
min-h-screen
flex
items-center
justify-center
font-bold
text-black
">

جاري تحميل العملاء...

</div>

)

}







return (

<main className="
mx-auto
max-w-7xl
px-8
py-10
">



<div className="
flex
justify-between
items-center
flex-wrap
gap-4
">

<div>

<h1 className="
text-4xl
font-black
">

العملاء

</h1>


<p className="
mt-2
text-black
">

الأشخاص المسجلين في نظام شغف — مرتبين حسب الأولوية (الأعلى Lead Score أولًا)

</p>


</div>


<div className="flex items-center gap-3 flex-wrap">

<select

value={stageFilter}

onChange={(e)=>setStageFilter(e.target.value)}

className="
rounded-xl
border
bg-white
px-4
py-3
font-bold
text-black
"

>

<option value="all">كل المراحل</option>

{
Object.entries(STAGE_LABELS).map(([value,label])=>(
  <option key={value} value={value}>{label}</option>
))
}

</select>


<div className="
flex
items-center
gap-3
bg-white
rounded-xl
px-4
py-3
border
">


<Search size={20}/>


<input

placeholder="بحث عن عميل..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

className="
outline-none
text-black
"

/>


</div>

</div>



</div>







<div className="
mt-10
overflow-x-auto
rounded-3xl
bg-white
shadow-sm
">


<table className="
w-full
text-right
">



<thead className="
bg-[#FFF4F8]
">


<tr>


<th className="p-5">
العميل
</th>


<th className="p-5">
الأولوية
</th>


<th className="p-5">
الهدف
</th>


<th className="p-5">
الباقة
</th>


<th className="p-5">
المرحلة
</th>


<th className="p-5">
التاريخ
</th>


<th className="p-5">
تواصل
</th>



</tr>


</thead>




<tbody>


{
filteredLeads.map((lead)=>{

const temperature = getLeadTemperature(lead.lead_score || 0);
const whatsappNumber = lead.whatsapp || lead.phone;

return (


<tr
key={lead.id}
className="
border-t
"
>



<td className="p-5">


<div className="
flex
items-center
gap-3
">


<User
className="text-[#E96B8A]"
/>



<div>


<p className="
font-bold
">

{lead.full_name}

</p>



<p className="
text-sm
">

{lead.email}

</p>


</div>


</div>


</td>


<td className="p-5">

<div className="flex items-center gap-2">

<span
className="rounded-full px-3 py-1 text-xs font-black"
style={{ color: temperature.color, backgroundColor: temperature.bg }}
>
{temperature.label}
</span>

<span className="text-sm font-bold text-gray-500">
{lead.lead_score || 0}
</span>

</div>

</td>





<td className="p-5">


<div className="
flex
gap-2
items-center
">


<Target size={18}/>


{lead.goal || "-"}


</div>


</td>






<td className="p-5">


<div className="
flex
gap-2
items-center
">


<Package size={18}/>


{lead.selected_package || "-"}


</div>


</td>






<td className="p-5">


<span className="
rounded-xl
bg-[#FFF4F8]
px-3
py-1.5
text-sm
font-bold
text-[#E96B8A]
">

{STAGE_LABELS[lead.lead_stage || "new"] || lead.lead_stage}

</span>


</td>






<td className="p-5">


{
new Date(
lead.created_at
)
.toLocaleDateString(
"ar-SA"
)
}



</td>







<td className="p-5">

<div className="flex items-center gap-2">

{whatsappNumber && (
  <a
    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
    target="_blank"
    rel="noopener noreferrer"
    className="
    flex
    items-center
    gap-2
    rounded-xl
    bg-green-500
    px-4
    py-3
    font-bold
    text-white
    "
  >
    <MessageCircle size={16} />
  </a>
)}

<Link

href={`/admin/leads/${lead.id}`}

className="
rounded-xl
bg-[#E96B8A]
px-5
py-3
font-bold
text-white
"

>

عرض


</Link>

</div>


</td>




</tr>


);

})

}



</tbody>


</table>


</div>






</main>

)

}