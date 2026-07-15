"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  LogOut,
  ClipboardCheck,
  Download,
} from "lucide-react";


type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string;
  country: string;
  city: string;
};

type Resource = {
  id: string;
  title: string;
  description: string;
  file_url: string;
  thumbnail: string;
  is_active: boolean;
};

export default function ClientDashboard() {

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [resources, setResources] =
    useState<Resource[]>([]);

  const [hasAssessment, setHasAssessment] =
    useState(false);



  useEffect(() => {
    loadUser();
  }, []);



  async function loadUser() {

    const {
      data: { session },
    } = await supabase.auth.getSession();



    if (!session) {
      router.push("/login");
      return;
    }



    const userId = session.user.id;



    // جلب بيانات المستخدم
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();



    // التأكد هل عمل التقييم أم لا
    const { data: assessmentData } = await supabase
      .from("shaghaf_leads")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();



    if (assessmentData) {
      setHasAssessment(true);
    }



    // جلب المصادر
    const { data: resourcesData } = await supabase
      .from("free_resources")
      .select("*")
      .eq("is_active", true)
      .order("created_at", {
        ascending: false,
      });



    setProfile(profileData);

    setResources(resourcesData || []);

    setLoading(false);

  }




  async function logout() {

    await supabase.auth.signOut();

    router.push("/login");

  }




  if (loading) {

    return (

      <div className="
        flex
        min-h-screen
        items-center
        justify-center
        text-lg
        font-bold
        text-black
      ">

        جاري التحميل...

      </div>

    );

  }



  return (

    <main className="
      min-h-screen
      bg-[#fafafa]
      text-black
    ">


      {/* HEADER */}

      <header className="
        border-b
        bg-white
      ">

        <div className="
          mx-auto
          flex
          max-w-7xl
          items-center
          justify-between
          px-8
          py-5
        ">


          <div>

            <h1 className="
              text-2xl
              font-black
              text-black
            ">
              لوحة شغف
            </h1>


            <p className="
              mt-1
              text-black
            ">
              مرحباً {profile?.full_name}
            </p>


          </div>



          <button

            onClick={logout}

            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-red-500
              px-5
              py-3
              font-bold
              text-white
            "

          >

            <LogOut size={18}/>

            تسجيل الخروج

          </button>


        </div>


      </header>



      <div className="
        mx-auto
        max-w-7xl
        px-6
        py-10
      ">


        {/* HERO */}

        <section className="
          overflow-hidden
          rounded-[36px]
          bg-gradient-to-r
          from-[#E96B8A]
          to-[#f18ca8]
          p-10
          text-white
        ">


          <h2 className="
            text-4xl
            font-black
          ">

            رحلتك نحو سوق العمل تبدأ من هنا

          </h2>



          <p className="
            mt-5
            max-w-3xl
            text-lg
            leading-8
            text-white
          ">

            ستجد هنا الأدلة والملفات والمصادر التي تساعدك
            على اكتشاف المجال المناسب لك وبناء مهاراتك.

          </p>


        </section>



        {/* STATS */}

        <section className="
          mt-8
          grid
          gap-6
          md:grid-cols-3
        ">


          <div className="
            rounded-3xl
            bg-white
            p-6
            shadow-sm
          ">

            <p className="
              text-sm
              text-black
            ">
              المصادر المتاحة
            </p>


            <h3 className="
              mt-2
              text-4xl
              font-black
              text-black
            ">

              {resources.length}

            </h3>


          </div>



          <div className="
            rounded-3xl
            bg-white
            p-6
            shadow-sm
          ">


            <p className="
              text-sm
              text-black
            ">
              حالة الحساب
            </p>


            <h3 className="
              mt-2
              text-2xl
              font-black
              text-green-600
            ">

              نشط

            </h3>


          </div>



          <div className="
            rounded-3xl
            bg-white
            p-6
            shadow-sm
          ">


            <p className="
              text-sm
              text-black
            ">
              المرحلة الحالية
            </p>


            <h3 className="
              mt-2
              text-2xl
              font-black
              text-black
            ">

              {
                hasAssessment
                ? "تم تحديد المسار"
                : "لم يبدأ تقييم المسار"
              }

            </h3>


          </div>


        </section>
                {/* ACTION */}

        <section className="
          mt-8
          rounded-3xl
          bg-white
          p-8
          shadow-sm
        ">


          <div className="
            flex
            flex-col
            items-center
            justify-between
            gap-5
            md:flex-row
          ">


            <div>

              <h2 className="
                text-2xl
                font-black
                text-black
              ">

                {hasAssessment
                  ? "مسارك المهني جاهز"
                  : "اكتشف المسار المناسب لك"
                }

              </h2>


              <p className="
                mt-2
                text-black
              ">

                {hasAssessment
                  ? "يمكنك متابعة رحلتك التعليمية والوصول للمصادر."
                  : "ابدأ تقييم المسار المهني لتعرف المجال الأنسب لك."
                }

              </p>


            </div>



            {
              hasAssessment ? (

                <button

                  onClick={() => router.push("/client")}

                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[#E96B8A]
                    px-6
                    py-3
                    font-bold
                    text-white
                  "

                >

                  <BookOpen size={18}/>

                  مساري التعليمي

                </button>


              ) : (

                <button

                  onClick={() => router.push("/result")}

                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[#E96B8A]
                    px-6
                    py-3
                    font-bold
                    text-white
                  "

                >

                  <ClipboardCheck size={18}/>

                  ابدأ تقييم المسار المهني

                </button>

              )
            }



          </div>


        </section>





        {/* CONTENT */}

        <section className="
          mt-8
          grid
          gap-8
          lg:grid-cols-3
        ">



          {/* PROFILE */}

          <div className="
            rounded-3xl
            bg-white
            p-8
            shadow-sm
          ">


            <h2 className="
              mb-6
              text-xl
              font-black
              text-black
            ">

              معلومات الحساب

            </h2>



            <div className="
              space-y-5
              text-black
            ">


              <div className="
                flex
                items-center
                gap-3
              ">

                <User/>

                <span>
                  {profile?.full_name || "-"}
                </span>

              </div>



              <div className="
                flex
                items-center
                gap-3
              ">

                <Mail/>

                <span>
                  {profile?.email || "-"}
                </span>

              </div>




              <div className="
                flex
                items-center
                gap-3
              ">


                <Phone/>


                <span>
                  {profile?.whatsapp || "-"}
                </span>


              </div>





              <div className="
                flex
                items-center
                gap-3
              ">


                <MapPin/>


                <span>

                  {profile?.country || "-"} - {profile?.city || "-"}

                </span>


              </div>



            </div>


          </div>





          {/* RESOURCES */}


          <div className="
            rounded-3xl
            bg-white
            p-8
            shadow-sm
            lg:col-span-2
          ">


            <h2 className="
              text-2xl
              font-black
              text-black
            ">

              المصادر المجانية

            </h2>



            <p className="
              mt-2
              text-black
            ">

              جميع الأدلة والملفات التي يضيفها فريق شغف.

            </p>




            {
              resources.length === 0 ? (

                <div className="
                  mt-8
                  rounded-3xl
                  border
                  border-dashed
                  p-10
                  text-center
                  text-black
                ">

                  لا توجد مصادر مجانية حالياً.

                </div>


              ) : (


                <div className="
                  mt-8
                  grid
                  gap-6
                  md:grid-cols-2
                ">


                  {
                    resources.map((resource)=>(


                      <div

                        key={resource.id}

                        className="
                          overflow-hidden
                          rounded-3xl
                          border
                          bg-white
                          transition
                          hover:-translate-y-1
                          hover:shadow-xl
                        "

                      >



                        {
                          resource.thumbnail && (

                            <img

                              src={resource.thumbnail}

                              alt={resource.title}

                              className="
                                h-48
                                w-full
                                object-cover
                              "

                            />

                          )
                        }



                        <div className="
                          p-6
                        ">


                          <BookOpen
                            size={36}
                            className="text-[#E96B8A]"
                          />



                          <h3 className="
                            mt-4
                            text-xl
                            font-black
                            text-black
                          ">

                            {resource.title}

                          </h3>




                          <p className="
                            mt-3
                            leading-7
                            text-black
                          ">

                            {resource.description}

                          </p>

<div
  className="
  mt-6
  flex
  gap-3
  "
>

  <Link
    href={`/client/resources/${resource.id}`}
    className="
      flex-1
      inline-flex
      items-center
      justify-center
      gap-2
      rounded-xl
      bg-[#E96B8A]
      px-5
      py-3
      font-bold
      text-white
      transition
      hover:bg-[#db5d7e]
    "
  >
    <BookOpen size={18} />
    عرض المصدر
  </Link>

  <a
    href={resource.file_url}
    download
    target="_blank"
    rel="noopener noreferrer"
    className="
      inline-flex
      items-center
      justify-center
      gap-2
      rounded-xl
      border
      border-[#E96B8A]
      px-5
      py-3
      font-bold
      text-[#E96B8A]
      transition
      hover:bg-[#FFF4F8]
    "
  >
    <Download size={18} />
    تحميل
  </a>

</div>



                        </div>



                      </div>


                    ))
                  }


                </div>


              )
            }



          </div>


        </section>


      </div>


    </main>

  );
}