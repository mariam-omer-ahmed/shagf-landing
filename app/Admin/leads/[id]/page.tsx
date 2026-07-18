"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { getLeadTemperature } from "@/lib/queries/leadScoring";
import {
  User,
  Mail,
  MapPin,
  Target,
  Package,
  CheckCircle,
  ArrowRight,
  Calendar,
  MessageCircle,
} from "lucide-react";


type Lead = {
  id: string;
  full_name: string;
  email: string;
  whatsapp?: string;
  phone?: string;
  country: string;
  city?: string;
  age_range?: string;
  goal: string;
  selected_package: string;
  readiness: string;
  current_status: string;
  skills?: string;
  interviews_count?: number;
  source?: string;
  source_channel?: string;
  start_timeframe?: string;
  budget_range?: string;
  main_obstacle?: string;
  urgency_score?: number;
  enrollment_status?: string;
  converted_at?: string;
  last_activity_at?: string;
  user_id: string;
  created_at: string;

  lead_stage?: string;
  lead_score?: number;
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


  const temperature = getLeadTemperature(lead.lead_score || 0);
  const whatsappNumber = lead.whatsapp || lead.phone;







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


        <div className="flex items-center justify-between flex-wrap gap-4">

          <div>

            <span
              className="rounded-full px-3 py-1 text-xs font-black"
              style={{ color: temperature.color, backgroundColor: temperature.bg }}
            >
              {temperature.label} — Lead Score {lead.lead_score || 0}
            </span>

            <h1 className="
              mt-4
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

          </div>

          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
              flex
              items-center
              gap-2
              rounded-2xl
              bg-white
              px-6
              py-4
              font-black
              text-green-600
              "
            >
              <MessageCircle size={20} />
              تواصل واتساب
            </a>
          )}

        </div>


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
          title="الدولة / المدينة"
          value={`${lead.country || "-"} ${lead.city ? "- " + lead.city : ""}`}
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


      {/* تفاصيل الكويز الإضافية */}

      <section className="
        mt-8
        rounded-3xl
        bg-white
        p-8
        shadow-sm
      ">

        <h2 className="text-2xl font-black">إجابات الكويز الكاملة</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <DetailRow label="رقم الجوال" value={lead.phone} />
          <DetailRow label="واتساب" value={lead.whatsapp} />
          <DetailRow label="الفئة العمرية" value={lead.age_range} />
          <DetailRow label="المهارات" value={lead.skills} />
          <DetailRow
            label="عدد المقابلات"
            value={
              lead.interviews_count !== undefined
                ? String(lead.interviews_count)
                : undefined
            }
          />
          <DetailRow label="العائق الرئيسي" value={lead.main_obstacle} />
          <DetailRow label="الميزانية المتاحة" value={lead.budget_range} />
          <DetailRow label="متى يبدأ" value={lead.start_timeframe} />
          <DetailRow label="مصدر الوصول" value={lead.source} />
          <DetailRow label="قناة الوصول" value={lead.source_channel} />
          <DetailRow
            label="درجة الإلحاح"
            value={
              lead.urgency_score !== undefined
                ? String(lead.urgency_score)
                : undefined
            }
          />
          <DetailRow label="حالة التحويل" value={lead.enrollment_status} />

        </div>

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

          {lead.last_activity_at && (
            <>
              <span className="mx-2 text-gray-300">|</span>
              آخر نشاط:
              <span>
                {new Date(lead.last_activity_at).toLocaleDateString("ar-SA")}
              </span>
            </>
          )}


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

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-2xl border border-pink-100 bg-[#FFFBFC] p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 font-bold text-gray-900">{value || "-"}</p>
    </div>
  );
}