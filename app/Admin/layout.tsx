"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    checkAdmin();
  }, []);



  async function checkAdmin() {

    const {
      data: {
        session
      },
    } = await supabase.auth.getSession();



    if (!session) {
      router.push("/login");
      return;
    }



    const {
      data: profile
    } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();



    if (profile?.role !== "admin") {

      router.push("/");

      return;

    }


    setLoading(false);

  }



  if (loading) {

    return (
      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        font-bold
        text-black
      ">
        جاري التحقق...
      </div>
    );

  }



  return (

    <div 
      dir="rtl"
      className="
        min-h-screen
        bg-[#fafafa]
        text-black
      "
    >


      <header className="
        bg-white
        border-b
        px-8
        py-5
      ">


        <div className="
          mx-auto
          max-w-7xl
          flex
          justify-between
          items-center
        ">


          <h1 className="
            text-2xl
            font-black
          ">
            لوحة تحكم شغف
          </h1>



          <nav className="
            flex
            gap-3
          ">


            <Link
              href="/admin"
              className="
                rounded-xl
                px-5
                py-3
                bg-[#FFF0F5]
                font-bold
              "
            >
              الرئيسية
            </Link>



            <Link
              href="/admin/leads"
              className="
                rounded-xl
                px-5
                py-3
                bg-[#FFF0F5]
                font-bold
              "
            >
              العملاء
            </Link>



            <Link
              href="/admin/resources"
              className="
                rounded-xl
                px-5
                py-3
                bg-[#FFF0F5]
                font-bold
              "
            >
              المصادر
            </Link>


          </nav>


        </div>


      </header>


      {children}


    </div>

  );

}