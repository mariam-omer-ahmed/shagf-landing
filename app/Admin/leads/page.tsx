"use client";

import { useEffect, useState } from "react";
import { getLeads } from "@/lib/queries/leads";
import Link from "next/link";
import {
  Search,
  User,
  Mail,
  Package,
  Target,
} from "lucide-react";


type Lead = {

  id:string;

  full_name:string;

  email:string;

  country:string;

  goal:string;

  selected_package:string;

  readiness:string;

  current_status:string;

  user_id:string;

  created_at:string;

};



export default function LeadsPage(){


const [leads,setLeads]=useState<Lead[]>([]);

const [loading,setLoading]=useState(true);

const [search,setSearch]=useState("");




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
leads.filter((lead)=>{


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



});






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

الأشخاص المسجلين في نظام شغف

</p>


</div>




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
الهدف
</th>


<th className="p-5">
الباقة
</th>


<th className="p-5">
الحالة
</th>


<th className="p-5">
التاريخ
</th>


<th className="p-5">
التفاصيل
</th>



</tr>


</thead>




<tbody>


{
filteredLeads.map((lead)=>(


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


<div>


<p className="
font-bold
">

{lead.current_status || "-"}

</p>


<p className="
text-sm
">

جاهزية: {lead.readiness || "-"}

</p>


</div>


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


</td>




</tr>


))

}



</tbody>


</table>


</div>






</main>

)

}