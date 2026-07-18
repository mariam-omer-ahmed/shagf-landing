"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/queries/dashboard";
import { getHotLeads } from "@/lib/queries/hotLeads";
import { getLeadTemperature } from "@/lib/queries/leadScoring";
import Link from "next/link";
import {
  Users,
  ClipboardList,
  BookOpen,
  CreditCard,
  TrendingUp,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";


export default function AdminDashboard() {


const [stats,setStats] = useState<any>({
    leads:0,
    resources:0,
    users:0,
    todayLeads:0,
    pendingEnrollments:0,
    paidEnrollments:0,
    conversionRate:0,
    stages:{},
    packages:{}
});

const [hotLeads,setHotLeads] = useState<any[]>([]);

  useEffect(()=>{

    loadStats();

  },[]);




async function loadStats(){

  try{

    const data = await getDashboardStats();

    const hot = await getHotLeads();

    setStats(data);

    setHotLeads(hot);

  }
  catch(error){

    console.log(error);

  }

}





  return (

    <main
      dir="rtl"
      className="
      mx-auto
      max-w-7xl
      px-8
      py-10
      "
    >


      <div>

        <h1
          className="
          text-4xl
          font-black
          text-black
          "
        >
          لوحة تحكم شغف
        </h1>


        <p
          className="
          mt-3
          text-black
          "
        >
          إدارة العملاء والمصادر والبيانات
        </p>


      </div>





      {/* KEY METRIC — معدل التحويل */}

      <div
        className="
        mt-10
        rounded-3xl
        bg-gradient-to-l
        from-[#E96B8A]
        to-[#d95d7d]
        p-8
        text-white
        "
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <TrendingUp size={32} />
            <div>
              <p className="text-sm font-bold text-white/80">
                معدل التحويل (من كويز لاشتراك مدفوع)
              </p>
              <p className="mt-1 text-5xl font-black">
                {stats.conversionRate}%
              </p>
            </div>
          </div>

          <div className="text-sm font-bold text-white/90">
            {stats.paidEnrollments} مشترك مدفوع من أصل {stats.leads} كويز
          </div>
        </div>
      </div>


      {/* STATS */}


      <div
        className="
        mt-6
        grid
        gap-6
        md:grid-cols-5
        "
      >


        <Card
          icon={<Users/>}
          title="المستخدمين"
          value={stats.users}
        />



        <Card
          icon={<ClipboardList/>}
          title="طلبات التقييم"
          value={stats.leads}
        />

         <Card
          icon={<ClipboardList/>}
          title="عملاء اليوم"
          value={stats.todayLeads}
         />

        <Card
          icon={<BookOpen/>}
          title="المصادر"
          value={stats.resources}
        />

        <Card
          icon={<CreditCard/>}
          title="طلبات دفع بالانتظار"
          value={stats.pendingEnrollments}
        />


      </div>






      {/* NAVIGATION */}


      <section
        className="
        mt-10
        grid
        gap-6
        md:grid-cols-3
        "
      >



        <Link

          href="/admin/leads"

          className="
          group
          rounded-3xl
          bg-white
          p-8
          shadow-sm
          transition
          hover:-translate-y-1
          "

        >


          <div
            className="
            flex
            items-center
            justify-between
            "
          >


            <div>

              <h2
                className="
                text-2xl
                font-black
                text-black
                "
              >
                إدارة العملاء
              </h2>


              <p
                className="
                mt-3
                text-black
                "
              >
                عرض كل الأشخاص المسجلين في نظام شغف
              </p>


            </div>



            <ArrowLeft
              className="
              text-[#E96B8A]
              transition
              group-hover:-translate-x-2
              "
            />


          </div>


        </Link>



        <Link

          href="/admin/enrollments"

          className="
          group
          rounded-3xl
          bg-white
          p-8
          shadow-sm
          transition
          hover:-translate-y-1
          "

        >


          <div
            className="
            flex
            items-center
            justify-between
            "
          >


            <div>

              <h2
                className="
                text-2xl
                font-black
                text-black
                "
              >
                طلبات الدفع
              </h2>


              <p
                className="
                mt-3
                text-black
                "
              >
                متابعة وتفعيل طلبات الانضمام للباقات
              </p>


            </div>



            <ArrowLeft
              className="
              text-[#E96B8A]
              transition
              group-hover:-translate-x-2
              "
            />


          </div>


        </Link>



        <Link

          href="/admin/resources"

          className="
          group
          rounded-3xl
          bg-white
          p-8
          shadow-sm
          transition
          hover:-translate-y-1
          "

        >


          <div
            className="
            flex
            items-center
            justify-between
            "
          >


            <div>


              <h2
                className="
                text-2xl
                font-black
                text-black
                "
              >
                إدارة المصادر
              </h2>


              <p
                className="
                mt-3
                text-black
                "
              >
                إضافة وتعديل الملفات التعليمية
              </p>


            </div>



            <ArrowLeft
              className="
              text-[#E96B8A]
              transition
              group-hover:-translate-x-2
              "
            />


          </div>


        </Link>



      </section>

<section
className="
mt-10
grid
gap-6
md:grid-cols-2
"
>


<div
className="
bg-white
rounded-3xl
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

رحلة العملاء

</h2>


<div
className="
mt-5
space-y-3
"
>

{
Object.entries(stats.stages)
.map(
([key,value]:any)=>(

<div
key={key}
className="
flex
justify-between
font-bold
"
>

<span>
{key}
</span>


<span>
{value}
</span>


</div>

)
)

}


</div>


</div>





<div
className="
bg-white
rounded-3xl
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

الباقات المطلوبة

</h2>



<div
className="
mt-5
space-y-3
"
>


{
Object.entries(stats.packages)
.map(
([key,value]:any)=>(


<div
key={key}
className="
flex
justify-between
font-bold
"
>

<span>
{key}
</span>


<span>
{value}
</span>


</div>


)
)

}



</div>


</div>


</section>



   <section
className="
mt-10
bg-white
rounded-3xl
p-8
shadow-sm
"
>

<h2
className="
text-2xl
font-black
mb-6
"
>
🔥 فرص تحتاج متابعة
</h2>

{
hotLeads.length === 0 ? (

<p className="text-gray-500">
لا توجد بيانات حالياً
</p>

) : (

<div className="space-y-4">

{
hotLeads.map((lead)=>{

const temperature = getLeadTemperature(lead.lead_score || 0);
const whatsappNumber = lead.whatsapp || lead.phone;

return (

<div
key={lead.id}
className="
flex
items-center
justify-between
border-b
pb-4
flex-wrap
gap-3
"
>

<div className="flex items-center gap-3">

<span
className="rounded-full px-3 py-1 text-xs font-black"
style={{ color: temperature.color, backgroundColor: temperature.bg }}
>
{temperature.label}
</span>

<div>

<p className="font-bold text-black">
{lead.full_name}
</p>

<p className="text-sm text-gray-500">
{lead.selected_package || "بدون باقة"}
</p>

</div>

</div>

<div
className="
flex
items-center
gap-3
"
>

<span
className="
rounded-xl
bg-[#FFF4F8]
px-4
py-2
font-black
text-[#E96B8A]
"
>

{lead.lead_score || 0}

</span>

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
    py-2
    font-bold
    text-white
    "
  >
    <MessageCircle size={16} />
    واتساب
  </a>
)}

<Link
href={`/admin/leads/${lead.id}`}
className="
rounded-xl
bg-[#E96B8A]
px-4
py-2
font-bold
text-white
"
>

عرض

</Link>

</div>

</div>

);

})
}

</div>

)

}

</section>


    </main>

  );

}





function Card({
  icon,
  title,
  value
}:{
  icon:React.ReactNode;
  title:string;
  value:number;
}){


  return (

    <div
      className="
      rounded-3xl
      bg-white
      p-8
      shadow-sm
      "
    >


      <div
        className="
        flex
        items-center
        gap-3
        text-[#E96B8A]
        "
      >

        {icon}

        <p
          className="
          font-bold
          text-black
          "
        >
          {title}
        </p>


      </div>



      <h3
        className="
        mt-5
        text-5xl
        font-black
        text-black
        "
      >

        {value}

      </h3>


    </div>

  )

}