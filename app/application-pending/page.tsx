"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

import {
  CheckCircle2,
  ShieldCheck,
  PlayCircle,
  Users,
  Target,
  Loader2,
  MessageCircle,
  BookOpen,
  Sparkles,
  Award,
} from "lucide-react";

const PACKAGE_DETAILS: Record<
  string,
  {
    title: string;
    price: string;
    duration: string;
    result: string;
    reason: string;
  }
> = {
  bousola: {
    title: "باقة البوصلة",
    price: "15 دولار",
    duration: "7 أيام",
    result: "تحديد مسارك المهني المناسب",
    reason:
      "لأنك ما زلت في مرحلة البحث عن الاتجاه الصحيح، وأذكى قرار الآن هو أن تحصل على وضوح كامل قبل أن تستثمر وقتك في مسار قد لا يناسبك.",
  },

  intilaqah: {
    title: "باقة الانطلاقة",
    price: "59 دولار",
    duration: "30 يوم",
    result: "الحصول على أول فرصة حقيقية",
    reason:
      "لأن نتائج تقييمك أظهرت أن لديك أساسًا حقيقيًا، وما تحتاجه الآن ليس مزيدًا من التعلم، بل خطة عملية تحوّل ما تعرفه إلى فرصة وظيفية أو دخل فعلي.",
  },

  tamkeen: {
    title: "باقة التمكين",
    price: "149 دولار",
    duration: "90 يوم",
    result: "بناء مسار مهني احترافي ومستدام",
    reason:
      "لأنك تجاوزت مرحلة البداية بالفعل، وأصبحت جاهزًا لبناء حضور احترافي يجعلك الخيار الأول في مجالك، لا أحد الخيارات المتاحة.",
  },
};

const WHATSAPP_SUPPORT_URL = "https://wa.me/249963370737";

export default function ApplicationPendingPage() {
  const [loading, setLoading] = useState(true);

  const [enrollment, setEnrollment] =
    useState<any>(null);

  const [profile, setProfile] =
    useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const userId = session.user.id;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      // .maybeSingle() بترجع null بهدوء لو مفيش صف enrollment
      // بدل ما ترمي خطأ وتكسر الصفحة
      const { data: enrollmentData } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      setProfile(profileData);
      setEnrollment(enrollmentData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
        <Loader2 className="animate-spin text-[#E96B8A]" size={32} />
      </div>
    );
  }

  const pkg =
    PACKAGE_DETAILS[
      enrollment?.package_name
    ] || PACKAGE_DETAILS.intilaqah;

  const isActive =
    enrollment?.status === "active";

  const TIMELINE_STEPS = [
    { title: "تم استلام طلبك", time: "الآن", done: true },
    { title: "مراجعة البيانات", time: "خلال ساعات قليلة", done: false },
    { title: "اعتماد الاشتراك", time: "أقل من 24 ساعة", done: false },
    { title: "تفعيل المحتوى", time: "فور الاعتماد", done: false },
    { title: "بدء رحلتك التعليمية", time: "بعد التفعيل مباشرة", done: false },
  ];

  const currentStepIndex = isActive ? TIMELINE_STEPS.length - 1 : 0;

  return (
    <main className="min-h-screen bg-[#fafafa] px-4 py-16">

      <div className="mx-auto max-w-6xl">

        {/* HERO */}

        <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#E96B8A] via-[#f07d9a] to-[#ff9db5] p-12 text-white">

          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-[100px]" />
          <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-white/10 blur-[110px]" />

          <div className="relative max-w-3xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur">
              <CheckCircle2 size={18} />
              تم تأكيد طلبك بنجاح
            </div>

            <h1 className="text-5xl font-bold leading-tight">
              {profile?.full_name}،
              <br />
              لقد اتخذت اليوم قرارًا يستحق الاحتفاء به 🚀
            </h1>

            <p className="mt-6 text-xl leading-9 text-white/90">
              انضممت رسميًا إلى <strong>{pkg.title}</strong>. بينما معظم
              الناس يبقون في التردد، أنت بدأت بالفعل. فريق شغف الآن يجهّز
              حسابك بعناية ليكون جاهزًا لك خلال ساعات.
            </p>

          </div>

        </section>

        {/* STATUS + progress stepper */}

        <section className="mt-8 rounded-[32px] bg-white p-8 shadow-[0_25px_70px_rgba(233,107,138,.08)]">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${
                  isActive ? "bg-green-100" : "bg-[#FFE3EC]"
                }`}
              >
                <Sparkles
                  className={isActive ? "text-green-600" : "text-[#E96B8A]"}
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#3A2530]">
                  حالة حسابك
                </h2>
                <p className="mt-2 text-lg text-[#6B5F66]">
                  {isActive
                    ? "تم تفعيل اشتراكك — يمكنك البدء الآن"
                    : "جاري تجهيز حسابك، وسيتم التفعيل خلال 24 ساعة"}
                </p>
              </div>

            </div>

            <a
              href={WHATSAPP_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-[#E96B8A] px-6 py-3 font-bold text-[#E96B8A] transition hover:bg-[#FFF3F7]"
            >
              <MessageCircle size={18} />
              عندك سؤال؟ تواصل معنا
            </a>

          </div>

          {/* Mini progress stepper — لمسة بريميوم بدل قايمة نصية بسيطة */}

          <div className="mt-10 flex items-center">
            {TIMELINE_STEPS.map((step, i) => {
              const reached = i <= currentStepIndex;
              return (
                <div key={step.title} className="flex flex-1 items-center">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      reached
                        ? "bg-[#E96B8A] text-white"
                        : "bg-pink-100 text-[#B79AA6]"
                    }`}
                  >
                    {reached ? <CheckCircle2 size={16} /> : i + 1}
                  </div>
                  {i !== TIMELINE_STEPS.length - 1 && (
                    <div
                      className={`mx-2 h-[3px] flex-1 rounded-full ${
                        i < currentStepIndex ? "bg-[#E96B8A]" : "bg-pink-100"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

        </section>

        {/* PACKAGE — value stacking framing */}

        <section className="mt-8 overflow-hidden rounded-[32px] bg-white p-10 shadow-[0_25px_70px_rgba(233,107,138,.08)]">

          <div className="flex flex-wrap items-center justify-between gap-6">

            <div>
              <div className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E96B8A]">
                <Award size={16} />
                الباقة المختارة
              </div>

              <h2 className="mt-3 text-4xl font-bold text-[#3A2530]">
                {pkg.title}
              </h2>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold text-[#E96B8A]">
                {pkg.price}
              </div>
              <div className="mt-2 text-[#6B5F66]">
                مدة البرنامج: {pkg.duration}
              </div>
            </div>

          </div>

          <div className="mt-10 rounded-3xl bg-gradient-to-br from-[#FFF3F7] to-white p-8">
            <h3 className="text-xl font-bold text-[#3A2530]">
              النتيجة المتوقعة
            </h3>
            <p className="mt-3 text-lg leading-8 text-[#3A2530]">
              {pkg.result}
            </p>
          </div>

        </section>

        {/* WHY — تعزيز قرار الشراء بدل مجرد تبرير */}

        <section className="mt-8 rounded-[32px] bg-white p-10 shadow-[0_25px_70px_rgba(233,107,138,.08)]">

          <div className="flex items-center gap-3">
            <Target className="text-[#E96B8A]" />
            <h2 className="text-3xl font-bold text-[#3A2530]">
              لماذا هذا القرار صحيح لك تحديدًا؟
            </h2>
          </div>

          <p className="mt-6 text-lg leading-9 text-[#6B5F66]">
            {pkg.reason}
          </p>

        </section>

        {/* BENEFITS — بطاقات متدرجة بلمسة بريميوم */}

        <section className="mt-8 rounded-[32px] bg-white p-10 shadow-[0_25px_70px_rgba(233,107,138,.08)]">

          <h2 className="text-3xl font-bold text-[#3A2530]">
            كل ما ستحصلين عليه فور التفعيل
          </h2>

          <p className="mt-3 text-[#6B5F66]">
            ليست مجرد مواد تعليمية، بل نظام كامل مصمم ليأخذك بيدك خطوة
            بخطوة حتى النتيجة.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">

            <Benefit
              icon={<PlayCircle />}
              title="مكتبة الفيديوهات"
              description="دروس عملية تشاهدينها بالسرعة التي تناسبك، دون تعقيد."
            />

            <Benefit
              icon={<Target />}
              title="خطة تنفيذ عملية"
              description="خطوات مرتبة تعرفين منها بالضبط ماذا تفعلين اليوم، لا غدًا."
            />

            <Benefit
              icon={<ShieldCheck />}
              title="قوالب وأدوات جاهزة"
              description="ملفات جاهزة للاستخدام الفوري، بدون البدء من الصفر."
            />

            <Benefit
              icon={<Users />}
              title="مجتمع خاص للمشتركين"
              description="دعم ومتابعة من أشخاص يمرون بنفس الرحلة، لست وحدك فيها."
            />

          </div>

        </section>

        {/* WAITING CONTENT */}

        <section className="mt-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-[#FFF3F7] to-white p-10 shadow-[0_25px_70px_rgba(233,107,138,.08)]">

          <div className="flex items-center gap-3">
            <BookOpen className="text-[#E96B8A]" />
            <h2 className="text-3xl font-bold text-[#3A2530]">
              لا داعي للانتظار — ابدأ من الآن
            </h2>
          </div>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#6B5F66]">
            بينما نجهّز حسابك، مكتبة الكتب والمصادر المجانية متاحة لك
     بالفعل في مساحة شغف. كل دقيقة تستخدمها الآن هي دقيقة تسبق
            بها الخطوة القادمة
          </p>

          <Link
            href="/client"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#E96B8A] px-6 py-3 font-bold text-white transition hover:bg-[#d95d7d]"
          >
            تصفّح المصادر المجانية الآن
          </Link>

        </section>

        {/* TIMELINE — خطوات مفصّلة مع وقت تقديري */}

        <section className="mt-8 rounded-[32px] bg-white p-10 shadow-[0_25px_70px_rgba(233,107,138,.08)]">

          <h2 className="text-3xl font-bold text-[#3A2530]">
            ماذا يحدث الآن، خطوة بخطوة؟
          </h2>

          <div className="mt-10 space-y-6">
            {TIMELINE_STEPS.map((step, i) => (
              <Step
                key={step.title}
                done={i <= currentStepIndex && (i < currentStepIndex || step.done)}
                title={step.title}
                time={step.time}
              />
            ))}
          </div>

        </section>

      </div>

    </main>
  );
}

function Benefit({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-3xl border border-pink-100 bg-gradient-to-br from-white to-[#FFF8FA] p-6 transition hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(233,107,138,.12)]">

      <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFE3EC] text-[#E96B8A]">
        {icon}
      </div>

      <div>
        <div className="font-bold text-[#3A2530]">{title}</div>
        <p className="mt-1 text-sm leading-6 text-[#6B5F66]">{description}</p>
      </div>

    </div>
  );
}

function Step({
  title,
  time,
  done = false,
}: {
  title: string;
  time: string;
  done?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <div className="flex items-center gap-4">
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
            done ? "bg-green-500 text-white" : "bg-pink-100"
          }`}
        >
          {done && <CheckCircle2 size={14} />}
        </div>

        <div className="font-semibold text-[#3A2530]">{title}</div>
      </div>

      <span className="text-sm text-[#B79AA6]">{time}</span>

    </div>
  );
}