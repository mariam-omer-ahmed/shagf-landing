"use client";

import Link from "next/link";
import Logo from "./logo";
import { motion } from "framer-motion";
import {
  ArrowRight,
  LogOut,
  Shield,
} from "lucide-react";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const navItems = [
  {
    title: "الرئيسية",
    href: "/",
  },
  {
    title: "كيف يعمل النظام؟",
    href: "/result",
  },
  {
    title: "لماذا شغف؟",
    href: "/#features",
  },
  {
    title: "آراء المتدربين",
    href: "/#testimonials",
  },
];


export default function Header() {

  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasAssessment, setHasAssessment] = useState(false);



  useEffect(() => {

    checkUser();


    const {
      data
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {

        const currentUser =
          session?.user || null;


        setUser(currentUser);

        setEmail(
          currentUser?.email || ""
        );


        if (!currentUser) {

          setIsAdmin(false);
          setHasAssessment(false);

        } else {

          checkUser();

        }

      }
    );


    return () => {

      data.subscription.unsubscribe();

    };


  }, []);





  async function checkUser() {


    const {
      data:{
        user
      }
    } =
    await supabase.auth.getUser();



    setUser(user);

    setEmail(
      user?.email || ""
    );


    if(!user){

      return;

    }



    // ADMIN CHECK

    const {
      data: profile
    } =
    await supabase
      .from("profiles")
      .select("role")
      .eq(
        "id",
        user.id
      )
      .maybeSingle();



    if(profile?.role === "admin"){

      setIsAdmin(true);

      return;

    }



    // CHECK ASSESSMENT

    const {
      data: lead
    } =
    await supabase
      .from("shaghaf_leads")
      .select("id")
      .eq(
        "user_id",
        user.id
      )
      .maybeSingle();



    setHasAssessment(
      !!lead
    );

  }





  async function logout(){

    await supabase.auth.signOut();

    setUser(null);
    setEmail("");
    setIsAdmin(false);
    setHasAssessment(false);

  }




  const username =
    email
      ?.split("@")[0]
      ?.charAt(0)
      ?.toUpperCase();



  return (

<header className="fixed inset-x-0 top-0 z-50 py-5">

<div className="mx-auto max-w-7xl px-5">


<motion.div

initial={{
opacity:0,
y:-25
}}

animate={{
opacity:1,
y:0
}}

transition={{
duration:.45
}}

className="
flex h-20 items-center justify-between
rounded-[28px]
border border-pink-100
bg-white/80
backdrop-blur-2xl
px-8
shadow-[0_20px_70px_rgba(233,107,138,.14)]
"

>


<Logo />





<nav className="hidden lg:flex items-center gap-2">


{
navItems.map((item)=>(

<Link

key={item.title}

href={item.href}

className="
rounded-full
px-5
py-3
text-[15px]
font-semibold
text-gray-600
transition-all
hover:bg-[#FFF4F8]
hover:text-[#E96B8A]
"

>

{item.title}

</Link>

))
}


</nav>






<div className="flex items-center gap-3">





{
user && (

<div
className="
hidden md:flex
items-center gap-3
rounded-full
bg-[#FFF8FB]
border border-pink-100
px-4 py-2
"
>


<div
className="
h-10 w-10
rounded-full
bg-[#E96B8A]
text-white
flex items-center justify-center
font-black
"
>

{username}

</div>



<div className="text-right">


<p className="
text-sm
font-bold
text-gray-800
max-w-[130px]
truncate
">

{email}

</p>


<p className="
text-xs
text-gray-500
">

{
isAdmin
?
"مدير النظام"
:
"متدرب"
}

</p>


</div>


</div>

)

}





{
isAdmin ? (

<Link

href="/admin"

className="
flex items-center gap-2
rounded-full
bg-[#FFF4F8]
px-6 py-3
font-bold
text-[#E96B8A]
"

>

<Shield size={17}/>

لوحة التحكم

</Link>


)

:

user ? (

hasAssessment ? (


<Link

href="/client"

className="
rounded-full
bg-[#FFF4F8]
px-6 py-3
font-bold
text-[#E96B8A]
"

>

مساري التعليمي

</Link>


)

:

(

<Link

href="/shagaf-quiz"

className="
rounded-full
bg-[#E96B8A]
px-6 py-3
font-bold
text-white
"

>

ابدأ تقييم المسار

</Link>

)


)

:

(

<Link

href="/login"

className="
rounded-full
px-6 py-3
font-semibold
text-gray-700
hover:bg-[#FFF4F8]
"

>

تسجيل الدخول

</Link>

)

}





{
user && (

<button

onClick={logout}

className="
flex items-center gap-2
rounded-full
px-4 py-3
text-sm
font-semibold
text-gray-500
hover:text-red-500
transition
"

>

<LogOut size={17}/>

خروج

</button>


)

}






{
!user && (

<Link

href="/result"

className="
inline-flex
items-center
gap-2
rounded-full
bg-[#E96B8A]
px-7
py-3.5
font-bold
text-white
shadow-[0_15px_40px_rgba(233,107,138,.35)]
hover:-translate-y-1
transition
"

>

ابدأ الآن

<ArrowRight size={18}/>

</Link>

)

}





</div>




</motion.div>


</div>


</header>

  );

}