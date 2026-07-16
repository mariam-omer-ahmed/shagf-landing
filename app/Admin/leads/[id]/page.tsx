"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import {
  User,
  Mail,
  MapPin,
  Target,
  Package,
  CheckCircle,
  ArrowRight,
  Calendar,
} from "lucide-react";


type Lead = {
  id: string;
  full_name: string;
  email: string;
  country: string;
  goal: string;
  selected_package: string;
  readiness: string;
  current_status: string;
  user_id: string;
  created_at: string;

  lead_stage?: string;
  lead_score?: number;
  phone?: string;
};



export default function LeadDetailsPage() {


  const params = useParams();

  const router = useRouter();


  const [lead, setLead] =
    useState<Lead | null>(null);


  const [loading, setLoading] =
    useState(true);

const [notes, setNotes] = useState<any[]>([]);
const [newNote, setNewNote] = useState("");



 useEffect(() => {

  if(params.id){

    loadLead();
    loadNotes();

  }

}, [params.id]);






  async function loadLead(){


    const {
      data,
      error
    } = await supabase
      .from("shaghaf_leads")
      .select("*")
      .eq(
        "id",
        params.id
      )
      .single();



    if(error){

      console.log(error);

      return;

    }



    setLead(data);

    setLoading(false);


  }


async function loadNotes(){

  const { data } = await supabase
    .from("lead_notes")
    .select("*")
    .eq("lead_id", params.id)
    .order(
      "created_at",
      {
        ascending:false
      }
    );

  setNotes(data || []);

}

async function updateStage(
  stage:string
){

  await supabase
    .from("shaghaf_leads")
    .update({
      lead_stage:stage
    })
    .eq(
      "id",
      params.id
    );

  setLead((prev:any)=>({

    ...prev,

    lead_stage:stage

  }));


  await supabase
    .from("lead_activities")
    .insert({

      lead_id:params.id,

      activity_type:"stage_changed",

      description:`تم تغيير المرحلة إلى ${stage}`

    });

}

async function addNote(){

  if(!newNote.trim()) return;

  const user =
    await supabase.auth.getUser();

  await supabase
    .from("lead_notes")
    .insert({

      lead_id:params.id,

      note:newNote,

      created_by:
      user.data.user?.id

    });

  await supabase
    .from("lead_activities")
    .insert({

      lead_id:params.id,

      activity_type:"note_added",

      description:newNote

    });

  setNewNote("");

  loadNotes();

}






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

        جاري تحميل بيانات العميل...

      </div>

    );

  }







  if(!lead){

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        font-bold
        text-black
      ">

        العميل غير موجود

      </div>

    );

  }








  return (

    <main className="
      mx-auto
      max-w-5xl
      px-8
      py-10
    ">




      <button

        onClick={()=>router.back()}

        className="
          mb-8
          flex
          items-center
          gap-2
          rounded-xl
          bg-white
          px-5
          py-3
          font-bold
          shadow-sm
          text-black
        "

      >

        <ArrowRight size={18}/>

        العودة للعملاء


      </button>







      <section className="
        rounded-[36px]
        bg-gradient-to-r
        from-[#E96B8A]
        to-[#f18ca8]
        p-10
        text-white
      ">



        <h1 className="
          text-4xl
          font-black
        ">

          {lead.full_name}

        </h1>


        <p className="
          mt-3
          text-lg
        ">

          ملف العميل في نظام شغف

        </p>


      </section>









      <section className="
        mt-8
        grid
        gap-6
        md:grid-cols-2
      ">






        <InfoCard
          icon={<User/>}
          title="الاسم"
          value={lead.full_name}
        />



        <InfoCard
          icon={<Mail/>}
          title="البريد الإلكتروني"
          value={lead.email}
        />



        <InfoCard
          icon={<MapPin/>}
          title="الدولة"
          value={lead.country}
        />



        <InfoCard
          icon={<Target/>}
          title="الهدف"
          value={lead.goal}
        />



        <InfoCard
          icon={<Package/>}
          title="الباقة المختارة"
          value={lead.selected_package}
        />



        <InfoCard
          icon={<CheckCircle/>}
          title="درجة الجاهزية"
          value={lead.readiness}
        />




      </section>









      <section className="
        mt-8
        rounded-3xl
        bg-white
        p-8
        shadow-sm
      ">



        <h2 className="
          text-2xl
          font-black
        ">

          حالة العميل

        </h2>




        <div className="
          mt-5
          rounded-2xl
          bg-[#FFF4F8]
          p-5
          font-bold
          text-[#E96B8A]
        ">


          {lead.current_status || "غير محدد"}


        </div>




      </section>


<section
className="
mt-8
rounded-3xl
bg-white
p-8
shadow-sm
"
>

<h2
className="
text-2xl
font-black
"
>

Lead Score

</h2>

<div
className="
mt-5
rounded-2xl
bg-[#FFF4F8]
p-5
font-black
text-4xl
text-[#E96B8A]
"
>

{lead.lead_score || 0}

</div>

</section>


<section
className="
mt-8
rounded-3xl
bg-white
p-8
shadow-sm
"
>

<h2
className="
text-2xl
font-black
"
>

مرحلة العميل

</h2>

<select

value={
lead.lead_stage || "new"
}

onChange={(e)=>
updateStage(
e.target.value
)
}

className="
mt-5
w-full
rounded-xl
border
p-4
font-bold
"
>

<option value="new">
جديد
</option>

<option value="assessment_done">
تم التقييم
</option>

<option value="contacted">
تم التواصل
</option>

<option value="offer_sent">
تم إرسال العرض
</option>

<option value="paid">
مدفوع
</option>

<option value="inactive">
غير نشط
</option>

</select>

</section>








      <section className="
        mt-8
        rounded-3xl
        bg-white
        p-8
        shadow-sm
      ">


        <div className="
          flex
          items-center
          gap-3
          font-bold
        ">


          <Calendar
            className="text-[#E96B8A]"
          />


          تاريخ التسجيل:


          <span>

          {
            new Date(
              lead.created_at
            )
            .toLocaleDateString(
              "ar-SA"
            )
          }

          </span>


        </div>



      </section>



<section
className="
mt-8
rounded-3xl
bg-white
p-8
shadow-sm
"
>

<h2
className="
text-2xl
font-black
"
>

ملاحظات الفريق

</h2>

<div
className="
mt-5
flex
gap-3
"
>

<input

value={newNote}

onChange={(e)=>
setNewNote(
e.target.value
)
}

placeholder="أضف ملاحظة..."

className="
flex-1
rounded-xl
border
p-4
"
/>

<button

onClick={addNote}

className="
rounded-xl
bg-[#E96B8A]
px-6
font-bold
text-white
"
>

حفظ

</button>

</div>

<div
className="
mt-6
space-y-3
"
>

{
notes.map((note)=>(

<div
key={note.id}
className="
rounded-xl
bg-[#FFF4F8]
p-4
"
>

<p className="font-medium">
{note.note}
</p>

<p
className="
mt-2
text-sm
text-gray-500
"
>

{
new Date(
note.created_at
).toLocaleDateString("ar-SA")
}

</p>

</div>

))
}

</div>

</section>



    </main>

  );

}







function InfoCard({
icon,
title,
value
}:{
icon:React.ReactNode;
title:string;
value:string;
}){


return (

<div className="
rounded-3xl
bg-white
p-7
shadow-sm
">


<div className="
flex
items-center
gap-3
text-[#E96B8A]
">

{icon}

<span className="
font-bold
text-black
">

{title}

</span>


</div>



<p className="
mt-5
font-black
text-xl
text-black
">

{value || "-"}

</p>



</div>

)

}