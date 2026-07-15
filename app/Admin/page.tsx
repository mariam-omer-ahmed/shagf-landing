"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  Users,
  ClipboardList,
  BookOpen,
  ArrowLeft,
} from "lucide-react";


export default function AdminDashboard() {


  const [stats,setStats] = useState({
    leads:0,
    resources:0,
    users:0
  });



  useEffect(()=>{

    loadStats();

  },[]);




  async function loadStats(){


    const { count: usersCount } =
      await supabase
      .from("profiles")
      .select("id",{
        count:"exact",
        head:true
      });



    const { count: leadsCount } =
      await supabase
      .from("shaghaf_leads")
      .select("id",{
        count:"exact",
        head:true
      });



    const { count: resourcesCount } =
      await supabase
      .from("free_resources")
      .select("id",{
        count:"exact",
        head:true
      });



    setStats({

      users: usersCount || 0,

      leads: leadsCount || 0,

      resources: resourcesCount || 0

    });


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





      {/* STATS */}


      <div
        className="
        mt-10
        grid
        gap-6
        md:grid-cols-3
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
          icon={<BookOpen/>}
          title="المصادر"
          value={stats.resources}
        />


      </div>






      {/* NAVIGATION */}


      <section
        className="
        mt-10
        grid
        gap-6
        md:grid-cols-2
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