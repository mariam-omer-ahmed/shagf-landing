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
    // .order() + .limit(1) قبل .maybeSingle() عشان لو العميل كرر
    // التقييم أكتر من مرة، الاستعلام ما يرجعش خطأ صامت
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

    // لو مفيش تقييم مربوط بالـ user_id، دوّري بالإيميل —
    // غالبًا التقييم اتعمل وهي لسه مش مسجلة دخول، فالصف موجود
    // بس user_id فيه فاضي (NULL)
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
        // اربطي الصف بحسابها فورًا عشان المرة الجاية يتلاقى بالـ user_id مباشرة
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
        className="flex min-h-screen items-center justify-center text-lg font-semibold text-gray-500"
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
      className="min-h-screen bg-[#fafafa] text-gray-900"
      style={{
        fontFamily: "'Cairo','IBM Plex Sans Arabic','Tajawal',sans-serif",
      }}
    >

      {/* استيراد خط Cairo — الأفضل تنقليه لملف layout.tsx عبر next/font/google
          عشان يتحمّل مرة واحدة في كل الموقع بدل ما يتكرر التحميل في كل صفحة */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');
      `}</style>

      {/* HEADER */}

      <header className="border-b bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              لوحة شغف
            </h1>

            <p className="mt-1 font-medium text-gray-500">
              مرحباً {profile?.full_name}
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
          >
            <LogOut size={18} />
            تسجيل الخروج
          </button>

        </div>

      </header>



      <div className="mx-auto max-w-7xl px-6 py-10">


        {/* ================= 1. HERO ================= */}

        <section className="overflow-hidden rounded-[36px] bg-gradient-to-r from-[#E96B8A] to-[#f18ca8] p-10 text-white">

          <div className="flex flex-col gap-6 md:flex-row md:items-center">

            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 text-4xl font-extrabold">
              {profile?.full_name?.charAt(0)}
            </div>

            <div className="flex-1">
              <h2 className="text-4xl font-extrabold">
                أهلاً {profile?.full_name}
              </h2>

              <p className="mt-2 font-medium text-white/80">
                {profile?.email}
              </p>

              {/* FIX: بدل شارة صغيرة باهتة بتقول "مسارك الحالي: X"،
                  بقت توضح إن ده اختيار مبني على نتيجة حقيقية، وبتمهّد
                  مباشرة لقسم الباقة الموصى بها اللي جاي تحت */}
              {hasAssessment && userPackage && (
                <div className="mt-5">
                  <div className="inline-flex rounded-full bg-white px-5 py-2 text-sm font-bold text-[#E96B8A]">
                    الباقة الموصى بها لك: {" "}
                    {PACKAGE_LABELS[userPackage] ?? userPackage}
                  </div>

                  <p className="mt-4 text-lg text-white/90">
                    تم اختيار هذه الباقة بناءً على نتائج تقييمك لأنها
                    الأسرع لتحقيق هدفك الحالي.
                  </p>
                </div>
              )}
            </div>

          </div>

        </section>

        {/* ================= 2. نتيجة التقييم / الدعوة لبدء التقييم ================= */}

        <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">

          {hasAssessment ? (

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>
                <div className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                  ✓ تم تحديد مسارك المهني
                </div>

                <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
                  أكملت التقييم بنجاح
                </h2>

                <p className="mt-3 leading-7 font-normal text-gray-600">
                  قمنا بتحليل إجاباتك وتحديد المسار الأنسب لوضعك الحالي.
                  الخطوة التالية هي الانضمام إلى الباقة الموصى بها والبدء
                  في تنفيذ خطة عملية للوصول إلى النتيجة التي تبحث عنها.
                </p>
              </div>

              <button
                onClick={() =>
                  router.push(`/thank-you?package=${userPackage}`)
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-[#E96B8A] px-6 py-4 font-bold text-white transition hover:bg-[#d95d7d]"
              >
                ابدأ رحلتك الآن
                <ArrowLeft size={18} />
              </button>

            </div>

          ) : (

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>
                <h2 className="text-3xl font-extrabold text-gray-900">
                  لم تحدد مسارك بعد
                </h2>

                <p className="mt-3 leading-7 font-normal text-gray-600">
                  أجب عن مجموعة أسئلة قصيرة وسنحدد لك المجال الأنسب حسب وضعك
                  الحالي.
                </p>
              </div>

              <button
                onClick={() => router.push("/result")}
                className="flex items-center gap-2 rounded-xl bg-[#E96B8A] px-6 py-4 font-bold text-white transition hover:bg-[#d95d7d]"
              >
                <ClipboardCheck size={18} />
                ابدأ التقييم
              </button>

            </div>

          )}

        </section>

        {/* ================= 3. الباقة الموصى بها + زر التقديم ================= */}

        {hasAssessment && userPackage && (
          <section className="mt-8 overflow-hidden rounded-[36px] bg-gradient-to-r from-[#2A1520] via-[#4a2030] to-[#E96B8A] p-10 text-white">

            <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
              الباقة الموصى بها
            </span>

            <h2 className="mt-6 text-4xl font-extrabold">
              {PACKAGE_LABELS[userPackage] ?? "مسارك المخصص"}
            </h2>

            <p className="mt-4 max-w-2xl leading-7 font-normal text-white/80">
              بناءً على إجاباتك قمنا بتحديد أفضل مسار مناسب لوضعك الحالي.
            </p>

            <Link
              href={`/apply?package=${userPackage}`}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-[#2A1520] transition hover:bg-white/90"
            >
              التقديم الآن
              <ArrowLeft size={18} />
            </Link>

          </section>

          
        )}

        {hasAssessment && userPackage && (
  <section className="mt-8 rounded-[36px] border border-pink-100 bg-white p-10 shadow-sm">

    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

      <div>

        <div className="inline-flex rounded-full bg-pink-100 px-4 py-2 text-sm font-bold text-[#E96B8A]">
          نتيجة التقييم الكاملة
        </div>

        <h2 className="mt-5 text-3xl font-extrabold text-gray-900">
          هل تريد مراجعة توصيتك مرة أخرى؟
        </h2>

        <p className="mt-4 max-w-3xl leading-8 text-gray-600">
          يمكنك العودة في أي وقت لمشاهدة نتيجة تقييمك الكاملة،
          ومعرفة سبب ترشيح هذه الباقة لك،
          ومقارنة جميع الباقات،
          والاطلاع على الضمانات،
          والإجابات على الاعتراضات والأسئلة الشائعة قبل اتخاذ قرارك.
        </p>

      </div>

      <Link
        href={`/thank-you?package=${userPackage}`}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E96B8A] px-8 py-4 font-bold text-white transition hover:bg-[#db5d7e]"
      >
        مراجعة نتيجة التقييم
        <ArrowLeft size={18} />
      </Link>

    </div>

  </section>
)}

        {/* ================= 4. خارطة الطريق ================= */}

        <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">

          <h2 className="text-3xl font-extrabold text-gray-900">
            خارطة طريقك
          </h2>
          <p className="mt-2 leading-7 font-normal text-gray-500">
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
                    className={`flex h-12 w-12 items-center justify-center rounded-full font-extrabold ${
                      isDone
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "bg-[#E96B8A] text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isDone ? "✓" : stepNumber}
                  </div>
                  <div>
                    <h3
                      className={`font-bold ${
                        isCurrent ? "text-[#E96B8A]" : "text-gray-900"
                      }`}
                    >
                      {step}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
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

        {/* ================= 5. نظرة سريعة (إحصائيات) + الملف الشخصي =================
            نقلتهم هنا (بعد خارطة الطريق، قبل المصادر) لأنهم معلومات
            مساندة/حالة حساب، مش عناصر إقناع — مالهمش داعي يقفوا قبل
            قرار الشراء زي ما كانوا */}

        <section className="mt-8 grid gap-6 lg:grid-cols-4">

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">التقييم</p>
            <h3
              className={`mt-2 text-4xl font-extrabold ${
                hasAssessment ? "text-green-600" : "text-gray-300"
              }`}
            >
              {hasAssessment ? "✓" : "—"}
            </h3>
            <p className="mt-3 font-semibold text-gray-700">
              {hasAssessment ? "مكتمل" : "لم يكتمل"}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">المسار</p>
            <h3 className="mt-2 text-4xl font-extrabold text-[#E96B8A]">
              {currentStage}
            </h3>
            <p className="mt-3 font-semibold text-gray-700">
              من {totalStages} مراحل
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">الموارد</p>
            <h3 className="mt-2 text-4xl font-extrabold text-gray-900">
              {resources.length}
            </h3>
            <p className="mt-3 font-semibold text-gray-700">متاحة الآن</p>
          </div>

          <Link
            href={hasAssessment ? "/client/path" : "/result"}
            className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">
              الخطوة القادمة
            </p>
            <h3 className="mt-2 text-xl font-extrabold text-[#E96B8A]">
              {hasAssessment ? "مشاهدة الخطة" : "ابدأ التقييم"}
            </h3>
            <p className="mt-3 font-semibold text-gray-700">ابدأ الآن</p>
          </Link>

        </section>

        <section className="mt-8">

          <div className="rounded-3xl bg-white p-8 shadow-sm">

            <div className="mb-8 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#E96B8A] text-4xl font-extrabold text-white">
                {profile?.full_name?.charAt(0)}
              </div>

              <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
                {profile?.full_name}
              </h2>

              <p className="mt-1 font-medium text-gray-500">
                {profile?.email}
              </p>
            </div>

            <div className="mx-auto max-w-md space-y-5 font-medium text-gray-700">

              <div className="flex items-center gap-3">
                <User className="text-gray-400" size={20} />
                <span>{profile?.full_name || "-"}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-gray-400" size={20} />
                <span>{profile?.email || "-"}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-gray-400" size={20} />
                <span>{profile?.whatsapp || "-"}</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-gray-400" size={20} />
                <span>
                  {profile?.country || "-"} - {profile?.city || "-"}
                </span>
              </div>

            </div>

          </div>

        </section>

        {/* ================= 6. المصادر المجانية — آخر شيء في الصفحة ================= */}

        <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-extrabold text-gray-900">
            المصادر المجانية
          </h2>

          <p className="mt-2 font-normal text-gray-500">
            جميع الأدلة والملفات التي يضيفها فريق شغف.
          </p>

          {resources.length === 0 ? (

            <div className="mt-8 rounded-3xl border border-dashed p-10 text-center font-medium text-gray-400">
              لا توجد مصادر مجانية حالياً.
            </div>

          ) : (

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {resources.map((resource) => (

                <div
                  key={resource.id}
                  className="overflow-hidden rounded-3xl border bg-white transition hover:-translate-y-1 hover:shadow-xl"
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

                    <h3 className="mt-4 text-xl font-bold text-gray-900">
                      {resource.title}
                    </h3>

                    <p className="mt-3 leading-7 font-normal text-gray-600">
                      {resource.description}
                    </p>

                    <div className="mt-6 flex gap-3">

                      <Link
                        href={`/client/resources/${resource.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#E96B8A] px-5 py-3 font-bold text-white transition hover:bg-[#db5d7e]"
                      >
                        <BookOpen size={18} />
                        عرض المصدر
                      </Link>

                      <a
                        href={resource.file_url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E96B8A] px-5 py-3 font-bold text-[#E96B8A] transition hover:bg-[#FFF4F8]"
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