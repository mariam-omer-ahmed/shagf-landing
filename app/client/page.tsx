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
  ArrowLeft,
  Sparkles,
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

const ROADMAP_STEPS = [
  "تحديد المسار",
  "بناء المهارة",
  "إنشاء المشروع العملي",
  "بناء الملف المهني",
  "الحصول على الفرصة",
];

const PACKAGE_LABELS: Record<string, string> = {
  bousola: "باقة البوصلة",
  intilaqah: "باقة الانطلاقة",
  tamkeen: "باقة التمكين",
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

  const [userPackage, setUserPackage] =
    useState<string | null>(null);

  const [hasActiveEnrollment, setHasActiveEnrollment] =
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



    // جلب بيانات المستخدم أولًا (محتاجينها للبحث بالإيميل لو احتجنا)
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();



    // التأكد هل عمل التقييم أم لا
    let { data: assessmentData, error: assessmentError } = await supabase
      .from("shaghaf_leads")
      .select(`
        id,
        selected_package
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (assessmentError) {
      console.error("Assessment fetch error:", assessmentError);
    }

    if (!assessmentData && profileData?.email) {
      const { data: orphanLead } = await supabase
        .from("shaghaf_leads")
        .select("id, selected_package")
        .eq("email", profileData.email)
        .is("user_id", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (orphanLead) {
        const { data: claimedLead, error: claimError } = await supabase
          .from("shaghaf_leads")
          .update({ user_id: userId })
          .eq("id", orphanLead.id)
          .select("id, selected_package")
          .maybeSingle();

        if (claimError) {
          console.error("Lead claim error:", claimError);
        }

        assessmentData = claimedLead ?? orphanLead;
      }
    }

    if (assessmentData) {
      setHasAssessment(true);
      setUserPackage(
        assessmentData.selected_package
      );
    }

    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "active")
      .eq("payment_status", "paid")
      .maybeSingle();

    setHasActiveEnrollment(!!enrollment);

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

      <div
        className="flex min-h-screen items-center justify-center bg-[#FFFBF9] text-lg font-semibold text-[#6B5F66]"
        style={{
          fontFamily:
            "'Cairo','IBM Plex Sans Arabic','Tajawal',sans-serif",
        }}
      >
        جاري التحميل...
      </div>

    );

  }

  // المرحلة الحالية في خارطة الطريق — مبنية على البيانات الفعلية، مش رقم ثابت
  const currentStage = hasAssessment ? 2 : 1;
  const totalStages = ROADMAP_STEPS.length;

  return (

    <main
      className="min-h-screen bg-[#FFFBF9] text-[#3A2530]"
      style={{
        fontFamily: "'Cairo','IBM Plex Sans Arabic','Tajawal',sans-serif",
      }}
    >

      {/* استيراد خط Cairo — الأفضل تنقليه لملف layout.tsx عبر next/font/google
          عشان يتحمّل مرة واحدة في كل الموقع بدل ما يتكرر التحميل في كل صفحة */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap');
      `}</style>

      {/* HEADER */}

      <header className="border-b border-pink-100 bg-white/80 backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

          <div>
            <h1 className="text-2xl font-bold text-[#3A2530]">
              لوحة شغف
            </h1>

            <p className="mt-1 font-medium text-[#6B5F66]">
              مرحباً {profile?.full_name}
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-500 transition hover:bg-red-100"
          >
            <LogOut size={18} />
            تسجيل الخروج
          </button>

        </div>

      </header>



      <div className="mx-auto max-w-7xl px-6 py-10">


        {/* ================= 1. HERO ================= */}

        <section className="overflow-hidden rounded-[36px] bg-gradient-to-br from-[#E96B8A] to-[#f18ca8] p-10 text-white">

          <div className="flex flex-col gap-6 md:flex-row md:items-center">

            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 text-4xl font-bold">
              {profile?.full_name?.charAt(0)}
            </div>

            <div className="flex-1">
              <h2 className="text-4xl font-bold">
                أهلاً {profile?.full_name}
              </h2>

              <p className="mt-2 font-medium text-white/85">
                {profile?.email}
              </p>

              {hasAssessment && userPackage && (
                <div className="mt-5">
                  <div className="inline-flex rounded-full bg-white px-5 py-2 text-sm font-bold text-[#E96B8A]">
                    الباقة الموصى بها لك: {" "}
                    {PACKAGE_LABELS[userPackage] ?? userPackage}
                  </div>

                  <p className="mt-4 text-lg leading-8 text-white/90">
                    تم اختيار هذه الباقة بناءً على نتائج تقييمك لأنها
                    الأسرع لتحقيق هدفك الحالي.
                  </p>
                </div>
              )}
            </div>

          </div>

        </section>

        {/* ================= 2. نتيجة التقييم / الدعوة لبدء التقييم ================= */}

        <section className="mt-8 rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(233,107,138,.06)]">

          {hasAssessment ? (

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div>
                <div className="inline-flex rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                  ✓ تم تحديد مسارك المهني
                </div>

                <h2 className="mt-4 text-3xl font-bold text-[#3A2530]">
                  أكملت التقييم بنجاح
                </h2>

                <p className="mt-3 max-w-xl leading-8 text-[#6B5F66]">
                  قمنا بتحليل إجاباتك وتحديد المسار الأنسب لوضعك الحالي.
                  الخطوة التالية هي الانضمام إلى الباقة الموصى بها والبدء
                  في تنفيذ خطة عملية للوصول إلى النتيجة التي تبحث عنها.
                </p>
              </div>

              {/* PRIMARY BUTTON — pink solid, أعلى وزن بصري في الصفحة */}
              <button
                onClick={() =>
                  router.push(`/thank-you?package=${userPackage}`)
                }
                className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#E96B8A] px-7 py-4 text-lg font-bold text-white shadow-[0_15px_35px_rgba(233,107,138,.35)] transition hover:-translate-y-0.5 hover:bg-[#d95d7d]"
              >
                ابدأ رحلتك الآن
                <ArrowLeft size={18} />
              </button>

            </div>

          ) : (

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div>
                <h2 className="text-3xl font-bold text-[#3A2530]">
                  لم تحدد مسارك بعد
                </h2>

                <p className="mt-3 max-w-xl leading-8 text-[#6B5F66]">
                  أجب عن مجموعة أسئلة قصيرة وسنحدد لك المجال الأنسب حسب وضعك
                  الحالي.
                </p>
              </div>

              <button
                onClick={() => router.push("/result")}
                className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#6a3d48] px-7 py-4 text-lg font-bold text-white shadow-[0_15px_35px_rgba(233,107,138,.35)] transition hover:-translate-y-0.5 hover:bg-[#d95d7d]"
              >
                <ClipboardCheck size={18} />
                ابدأ التقييم
              </button>

            </div>

          )}

        </section>

        {/* ================= 3. الباقة الموصى بها + زر التقديم ================= */}

        {hasAssessment && userPackage && (
          <section className="mt-8 overflow-hidden rounded-[36px] bg-gradient-to-br from-[#3A2530] via-[#5a2e42] to-[#E96B8A] p-10 text-white">

            <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
              الباقة الموصى بها
            </span>

            <h2 className="mt-6 text-4xl font-bold">
              {PACKAGE_LABELS[userPackage] ?? "مسارك المخصص"}
            </h2>

            <p className="mt-4 max-w-2xl leading-8 text-white/85">
              بناءً على إجاباتك قمنا بتحديد أفضل مسار مناسب لوضعك الحالي.
            </p>

            {/* PRIMARY BUTTON — أبيض على خلفية غامقة عشان يبان بأعلى تباين */}
            <Link
              href={`/apply?package=${userPackage}`}
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-[#3A2530] shadow-[0_15px_35px_rgba(0,0,0,.15)] transition hover:-translate-y-0.5 hover:bg-white/90"
            >
              الإشتراك الآن
              <ArrowLeft size={18} />
            </Link>
            

          </section>
          
        )}

        {/* ================= 3.1 مراجعة نتيجة التقييم ================= */}

        {hasAssessment && userPackage && (
          <section className="mt-8 rounded-[36px] border border-pink-100 bg-white p-10 shadow-[0_20px_60px_rgba(233,107,138,.06)]">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <div className="inline-flex rounded-full bg-[#FFF3F7] px-4 py-2 text-sm font-bold text-[#E96B8A]">
                  نتيجة التقييم الكاملة
                </div>

                <h2 className="mt-5 text-3xl font-bold text-[#3A2530]">
                  هل تريد مراجعة توصيتك مرة أخرى؟
                </h2>

                <p className="mt-4 max-w-3xl leading-8 text-[#6b5f66]">
                  يمكنك العودة في أي وقت لمشاهدة نتيجة تقييمك الكاملة،
                  ومعرفة سبب ترشيح هذه الباقة لك، ومقارنة جميع الباقات،
                  والاطلاع على الإجابات على الأسئلة الشائعة قبل اتخاذ
                  قرارك.
                </p>

              </div>

              {/* SECONDARY BUTTON — إطار بمبي، أقل وزن من الزر الأساسي فوق */}
              <Link
                href={`/thank-you?package=${userPackage}`}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border-2 border-[#E96B8A] px-7 py-4 font-bold text-[#33181e] transition hover:bg-[#e9769e]"
              >
                مراجعة نتيجة التقييم
                <ArrowLeft size={18} />
              </Link>

            </div>

          </section>
        )}


 <section className="mt-8 overflow-hidden rounded-[36px] border border-pink-100 bg-white p-10 shadow-[0_20px_60px_rgba(233,107,138,.06)]">

          <div className="flex items-center gap-3">
            <Sparkles className="text-[#E96B8A]" />
            <h2 className="text-3xl font-bold text-[#3A2530]">
    تخيل النسخة القادمة منك
            </h2>
          </div>

          
<p className="mt-3 max-w-3xl leading-8 text-[#6B5F66]">
  كل إنجاز كبير يبدأ بخطوة واضحة. ربما لا تعرف اليوم بالضبط أين ستصل،
  لكنك تعرف أنك لا تريد أن تبقى في نفس المكان. مسارك المهني لا يتغير
  بقرار واحد، بل بخطة صحيحة وتنفيذ مستمر. ابدأ من مكانك الحالي،
  ودعنا نساعدك في الوصول إلى النسخة التي تطمح أن تكونها.
</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">

            <div className="group relative overflow-hidden rounded-[28px]">
             <img
  src="/images/a3.png"
  alt=""
  className="h-[420px] w-full object-cover object-top transition duration-500 group-hover:scale-105"
/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#3A2530]/70 via-transparent to-transparent" />
              <p className="absolute bottom-5 right-5 left-5 font-bold text-white">
  مستقبلك لا يُبنى بالصدفة... بل بخطة وتنفيذ
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-[28px]">
             <img
  src="/images/a2.png"
  alt=""
  className="h-[420px] w-full object-cover object-top transition duration-500 group-hover:scale-105"
/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#3A2530]/70 via-transparent to-transparent" />
              <p className="absolute bottom-5 right-5 left-5 font-bold text-white">
                خطة واضحة هي كل ما يفصلك عن تغيير مسارك بالكامل
              </p>
            </div>

          </div>

        </section>

        {/* ================= 4. بوابة التعلم (كانت خلفية سوداء #0F172A — اتشالت) ================= */}
{hasAssessment && userPackage && (

<section className="mt-8 overflow-hidden rounded-[36px] bg-gradient-to-br from-[#3A2530] via-[#4A2D3A] to-[#5E3244] p-10 text-white">

  <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

    <div className="max-w-3xl">

      <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
        الخطوة التالية
      </div>

      <h2 className="mt-5 text-4xl font-black">
        بعد تفعيل اشتراكك...
      </h2>

      <p className="mt-4 text-lg leading-9 text-white/80">
        سيتم فتح مساحتك الخاصة داخل نظام شغف، حيث ستجد
        خطة التنفيذ الكاملة، والمهام المطلوبة، وجميع
        الخطوات العملية المصممة لمساعدتك على الوصول إلى
        هدفك خطوة بخطوة.
      </p>

    </div>

    {hasActiveEnrollment ? (

  <Link
    href="/client/path"
    className="
      inline-flex
      shrink-0
      items-center
      gap-2
      rounded-2xl
      bg-[#E96B8A]
      px-8
      py-4
      text-lg
      font-bold
      text-white
      shadow-[0_15px_35px_rgba(233,107,138,.35)]
      transition
      hover:-translate-y-0.5
      hover:bg-[#d95d7d]
    "
  >
    الدخول إلى الخطة
    <ArrowLeft size={18} />
  </Link>

) : (

  <div
    className="
      rounded-3xl
      border
      border-white/10
      bg-white/10
      p-6
      backdrop-blur
      lg:max-w-sm
    "
  >

    <p className="text-sm font-bold text-pink-200">
      جاهز للخطوة التالية؟
    </p>

    <h3 className="mt-3 text-2xl font-black">
      فعّل مسارك الآن
    </h3>

    <p className="mt-3 leading-7 text-white/75">
      بعد اعتماد اشتراكك سيتم فتح خطة التنفيذ الكاملة
      داخل حسابك وستتمكن من البدء في تنفيذ خطواتك
      العملية مباشرة.
    </p>

    <Link
      href={`/apply?package=${userPackage}`}
      className="
        mt-6
        inline-flex
        items-center
        gap-2
        rounded-2xl
        bg-white
        px-6
        py-4
        font-bold
        text-[#3A2530]
        shadow-[0_15px_35px_rgba(0,0,0,.15)]
        transition
        hover:-translate-y-1
        hover:bg-white/90
      "
    >
      الإشتراك الآن
      <ArrowLeft size={18} />
    </Link>

  </div>

)}

  </div>

</section>

)}

        {/* ================= 5. أشخاص وصلوا قبلك (صور f1 / f2) =================
            ملاحظة: افترضت الامتداد .jpg للصورتين f1 و f2 من فولدر public.
            لو الامتداد مختلف (png/webp) قوليلي أعدّل المسار بسرعة. */}

        <section className="mt-8 overflow-hidden rounded-[36px] border border-pink-100 bg-white p-10 shadow-[0_20px_60px_rgba(233,107,138,.06)]">

          <div className="flex items-center gap-3">
            <Sparkles className="text-[#E96B8A]" />
            <h2 className="text-3xl font-bold text-[#3A2530]">
لم يعد السؤال "ماذا أفعل؟"            </h2>
          </div>

          <p className="mt-3 max-w-2xl leading-8 text-[#6B5F66]">
بعد تحديد اتجاهك المناسب، أصبح التركيز على التنفيذ. كل مرحلة من المراحل التالية صُممت لتقربك من هدفك النهائي بطريقة عملية ومنظمة بعيدًا عن التخبط والعشوائية.          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">

            <div className="group relative overflow-hidden rounded-[28px]">
             <img
  src="/images/a8.png"
  alt=""
  className="h-[420px] w-full object-cover object-top transition duration-500 group-hover:scale-105"
/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#3A2530]/70 via-transparent to-transparent" />
              <p className="absolute bottom-5 right-5 left-5 font-bold text-white">
كل فرصة كبيرة كانت يومًا ما مجرد خطوة أولى              </p>
            </div>

            <div className="group relative overflow-hidden rounded-[28px]">
              <img
  src="/images/a7.png"
  alt=""
  className="h-[420px] w-full object-cover object-top transition duration-500 group-hover:scale-105"
/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#3A2530]/70 via-transparent to-transparent" />
              <p className="absolute bottom-5 right-5 left-5 font-bold text-white">
من المهارة إلى أول دخل تصنعه بنفسك              </p>
            </div>

          </div>

        </section>

        {/* ================= 6. خارطة الطريق ================= */}

        <section className="mt-8 rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(233,107,138,.06)]">

          <h2 className="text-3xl font-bold text-[#3A2530]">
            خارطة طريقك
          </h2>
          <p className="mt-2 leading-7 text-[#6B5F66]">
            هذه هي المراحل التي ستوصلك للنتيجة المطلوبة.
          </p>

          <div className="mt-10 space-y-6">
            {ROADMAP_STEPS.map((step, index) => {
              const stepNumber = index + 1;
              const isDone = stepNumber < currentStage;
              const isCurrent = stepNumber === currentStage;

              return (
                <div key={step} className="flex items-center gap-5">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold ${
                      isDone
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "bg-[#E96B8A] text-white"
                        : "bg-pink-50 text-[#B79AA6]"
                    }`}
                  >
                    {isDone ? "✓" : stepNumber}
                  </div>
                  <div>
                    <h3
                      className={`font-bold ${
                        isCurrent ? "text-[#E96B8A]" : "text-[#3A2530]"
                      }`}
                    >
                      {step}
                    </h3>
                    <p className="text-sm font-medium text-[#B79AA6]">
                      {isDone
                        ? "مكتملة"
                        : isCurrent
                        ? "المرحلة الحالية"
                        : `المرحلة ${stepNumber}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </section>

        {/* ================= 7. نظرة سريعة (إحصائيات) ================= */}

        <section className="mt-8 grid gap-6 lg:grid-cols-4">

          <div className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(233,107,138,.06)]">
            <p className="text-sm font-medium text-[#B79AA6]">التقييم</p>
            <h3
              className={`mt-2 text-4xl font-bold ${
                hasAssessment ? "text-green-600" : "text-pink-100"
              }`}
            >
              {hasAssessment ? "✓" : "—"}
            </h3>
            <p className="mt-3 font-semibold text-[#3A2530]">
              {hasAssessment ? "مكتمل" : "لم يكتمل"}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(233,107,138,.06)]">
            <p className="text-sm font-medium text-[#B79AA6]">المسار</p>
            <h3 className="mt-2 text-4xl font-bold text-[#E96B8A]">
              {currentStage}
            </h3>
            <p className="mt-3 font-semibold text-[#3A2530]">
              من {totalStages} مراحل
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(233,107,138,.06)]">
            <p className="text-sm font-medium text-[#B79AA6]">الموارد</p>
            <h3 className="mt-2 text-4xl font-bold text-[#3A2530]">
              {resources.length}
            </h3>
            <p className="mt-3 font-semibold text-[#3A2530]">متاحة الآن</p>
          </div>

          <Link
            href={hasAssessment ? "/client/path" : "/result"}
            className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(233,107,138,.06)] transition hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(233,107,138,.12)]"
          >
            <p className="text-sm font-medium text-[#B79AA6]">
              الخطوة القادمة
            </p>
            <h3 className="mt-2 text-xl font-bold text-[#E96B8A]">
              {hasAssessment ? "مشاهدة الخطة" : "ابدأ التقييم"}
            </h3>
            <p className="mt-3 font-semibold text-[#3A2530]">ابدأ الآن</p>
          </Link>

        </section>

        {/* ================= 8. الملف الشخصي ================= */}

        <section className="mt-8">

          <div className="rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(233,107,138,.06)]">

            <div className="mb-8 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#E96B8A] text-4xl font-bold text-white">
                {profile?.full_name?.charAt(0)}
              </div>

              <h2 className="mt-4 text-2xl font-bold text-[#3A2530]">
                {profile?.full_name}
              </h2>

              <p className="mt-1 font-medium text-[#6B5F66]">
                {profile?.email}
              </p>
            </div>

            <div className="mx-auto max-w-md space-y-5 font-medium text-[#3A2530]">

              <div className="flex items-center gap-3">
                <User className="text-[#E96B8A]" size={20} />
                <span>{profile?.full_name || "-"}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-[#E96B8A]" size={20} />
                <span>{profile?.email || "-"}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-[#E96B8A]" size={20} />
                <span>{profile?.whatsapp || "-"}</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-[#E96B8A]" size={20} />
                <span>
                  {profile?.country || "-"} - {profile?.city || "-"}
                </span>
              </div>

            </div>

          </div>

        </section>

        {/* ================= 9. المصادر المجانية — آخر شيء في الصفحة ================= */}

        <section className="mt-8 rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(233,107,138,.06)]">

          <h2 className="text-2xl font-bold text-[#3A2530]">
            المصادر المجانية
          </h2>

          <p className="mt-2 text-[#6B5F66]">
            جميع الأدلة والملفات التي يضيفها فريق شغف.
          </p>

          {resources.length === 0 ? (

            <div className="mt-8 rounded-3xl border border-dashed border-pink-200 p-10 text-center font-medium text-[#B79AA6]">
              لا توجد مصادر مجانية حالياً.
            </div>

          ) : (

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {resources.map((resource) => (

                <div
                  key={resource.id}
                  className="overflow-hidden rounded-3xl border border-pink-100 bg-white transition hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(233,107,138,.12)]"
                >

                  {resource.thumbnail && (
                    <img
                      src={resource.thumbnail}
                      alt={resource.title}
                      className="h-48 w-full object-cover"
                    />
                  )}

                  <div className="p-6">

                    <BookOpen size={36} className="text-[#E96B8A]" />

                    <h3 className="mt-4 text-xl font-bold text-[#3A2530]">
                      {resource.title}
                    </h3>

                    <p className="mt-3 leading-7 text-[#6B5F66]">
                      {resource.description}
                    </p>

                    <div className="mt-6 flex gap-3">

                      {/* PRIMARY */}
                      <Link
                        href={`/client/resources/${resource.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#E96B8A] px-5 py-3 font-bold text-white transition hover:bg-[#db5d7e]"
                      >
                        <BookOpen size={18} />
                        عرض المصدر
                      </Link>

                      {/* SECONDARY */}
                      <a
                        href={resource.file_url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#E96B8A] px-5 py-3 font-bold text-[#E96B8A] transition hover:bg-[#FFF3F7]"
                      >
                        <Download size={18} />
                        تحميل
                      </a>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </div>

    </main>

  );
}