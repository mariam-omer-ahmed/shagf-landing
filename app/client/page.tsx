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

const FONT_FAMILY = "'Almarai','Tajawal',sans-serif";
const ACCENT = "#7A1F3D"; // نبيتي أساسي
const ACCENT_LIGHT = "#B23A5C"; // نبيتي فاتح للتدرجات
const BG = "#FDF2F6"; // بمبي فاتح جدًا (خلفية الصفحة)
const BORDER = "#F3D6E2"; // بمبي فاتح للحدود
const TEXT = "#3D1220"; // نص أساسي غامق
const TEXT_SOFT = "#8C6F78"; // نص ثانوي

type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string;
  country: string;
  city: string;
  roadmap_stage: number | null;
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [hasAssessment, setHasAssessment] = useState(false);
  const [userPackage, setUserPackage] = useState<string | null>(null);
  const [hasActiveEnrollment, setHasActiveEnrollment] = useState(false);

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadUser() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const userId = session.user.id;

      // بيانات المستخدم أولًا (لازمة للبحث بالإيميل لو احتجنا نربط عميل قديم)
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
      }

      // التأكد هل عمل التقييم أم لا
      let { data: assessmentData, error: assessmentError } = await supabase
        .from("shaghaf_leads")
        .select("id, selected_package")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (assessmentError) {
        console.error("Assessment fetch error:", assessmentError);
      }

      // لو مفيش نتيجة تقييم مربوطة بالحساب، نجرب نربط أي تقييم قديم
      // اتعمل بنفس الإيميل قبل ما يعمل حساب (orphan lead)
      if (!assessmentData && profileData?.email) {
        const { data: orphanLead, error: orphanError } = await supabase
          .from("shaghaf_leads")
          .select("id, selected_package")
          .eq("email", profileData.email)
          .is("user_id", null)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (orphanError) {
          console.error("Orphan lead fetch error:", orphanError);
        }

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
        setUserPackage(assessmentData.selected_package);
      }

      const { data: enrollment, error: enrollmentError } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "active")
        .eq("payment_status", "paid")
        .maybeSingle();

      if (enrollmentError) {
        console.error("Enrollment fetch error:", enrollmentError);
      }

      setHasActiveEnrollment(!!enrollment);

      // جلب المصادر المجانية
      const { data: resourcesData, error: resourcesError } = await supabase
        .from("free_resources")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (resourcesError) {
        console.error("Resources fetch error:", resourcesError);
      }

      setProfile(profileData);
      setResources(resourcesData || []);
    } catch (error) {
      console.error("Client Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center text-lg font-semibold"
        style={{ backgroundColor: BG, color: TEXT_SOFT, fontFamily: FONT_FAMILY }}
      >
        جارٍ التحميل...
      </div>
    );
  }

  // المرحلة الحالية بيتحكم فيها الأدمن يدويًا من لوحة التحكم
  // (حسب تقدم الطالب الفعلي في المحاضرات والواجبات)، مش معادلة ثابتة
  const currentStage = profile?.roadmap_stage ?? 1;
  const totalStages = ROADMAP_STEPS.length;
  const packageLabel = userPackage ? PACKAGE_LABELS[userPackage] ?? userPackage : null;

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: BG, color: TEXT, fontFamily: FONT_FAMILY }}
    >
      {/* HEADER */}
      <header className="border-b bg-white/80 backdrop-blur" style={{ borderColor: BORDER }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: TEXT }}>
              لوحة شغف
            </h1>
            <p className="mt-1 font-medium" style={{ color: TEXT_SOFT }}>
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
        <section
          className="overflow-hidden rounded-[36px] p-10 text-white"
          style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_LIGHT} 100%)` }}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 text-4xl font-bold">
              {profile?.full_name?.charAt(0)}
            </div>

            <div className="flex-1">
              <h2 className="text-4xl font-bold">أهلاً {profile?.full_name}</h2>
              <p className="mt-2 font-medium text-white/85">{profile?.email}</p>

              {hasActiveEnrollment && packageLabel ? (
                <div className="mt-5">
                  <div
                    className="inline-flex rounded-full bg-white px-5 py-2 text-sm font-bold"
                    style={{ color: ACCENT }}
                  >
                    اشتراكك الحالي: {packageLabel}
                  </div>
                  <p className="mt-4 text-lg leading-8 text-white/90">
                    اشتراكك مفعّل، ويمكنك متابعة خطتك التدريبية الآن مباشرة.
                  </p>
                </div>
              ) : (
                hasAssessment &&
                packageLabel && (
                  <div className="mt-5">
                    <div
                      className="inline-flex rounded-full bg-white px-5 py-2 text-sm font-bold"
                      style={{ color: ACCENT }}
                    >
                      الباقة الموصى بها لك: {packageLabel}
                    </div>
                    <p className="mt-4 text-lg leading-8 text-white/90">
                      تم اختيار هذه الباقة بناءً على نتائج تقييمك لأنها الأسرع لتحقيق هدفك الحالي.
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* ================= 2. حالة التقييم / حالة الاشتراك ================= */}
        <section className="mt-8 rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(122,31,61,.06)]">
          {hasActiveEnrollment ? (
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                  ✓ أنت مشترك في {packageLabel}
                </div>

                <h2 className="mt-4 text-3xl font-bold" style={{ color: TEXT }}>
                  اشتراكك مفعّل بالكامل
                </h2>

                <p className="mt-3 max-w-xl leading-8" style={{ color: TEXT_SOFT }}>
                  يمكنك الآن الدخول إلى خطتك التدريبية الكاملة ومتابعة الوحدات والدروس والتكليفات
                  خطوة بخطوة.
                </p>
              </div>

              <Link
                href="/client/path"
                className="flex shrink-0 items-center justify-center gap-2 rounded-2xl px-7 py-4 text-lg font-bold text-white shadow-[0_15px_35px_rgba(122,31,61,.35)] transition hover:-translate-y-0.5"
                style={{ backgroundColor: ACCENT }}
              >
                الدخول إلى خطتك
                <ArrowLeft size={18} />
              </Link>
            </div>
          ) : hasAssessment ? (
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                  ✓ تم تحديد مسارك المهني
                </div>

                <h2 className="mt-4 text-3xl font-bold" style={{ color: TEXT }}>
                  أكملت التقييم بنجاح
                </h2>

                <p className="mt-3 max-w-xl leading-8" style={{ color: TEXT_SOFT }}>
                  قمنا بتحليل إجاباتك وتحديد المسار الأنسب لوضعك الحالي. الخطوة التالية هي
                  الانضمام إلى الباقة الموصى بها والبدء في تنفيذ خطة عملية للوصول إلى النتيجة
                  التي تبحث عنها.
                </p>
              </div>

              <button
                onClick={() => router.push(`/thank-you?package=${userPackage}`)}
                className="flex shrink-0 items-center justify-center gap-2 rounded-2xl px-7 py-4 text-lg font-bold text-white shadow-[0_15px_35px_rgba(122,31,61,.35)] transition hover:-translate-y-0.5"
                style={{ backgroundColor: ACCENT }}
              >
                عرض توصيتك
                <ArrowLeft size={18} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-bold" style={{ color: TEXT }}>
                  لم تحدد مسارك بعد
                </h2>
                <p className="mt-3 max-w-xl leading-8" style={{ color: TEXT_SOFT }}>
                  أجب عن مجموعة أسئلة قصيرة وسنحدد لك المجال الأنسب حسب وضعك الحالي.
                </p>
              </div>

              <button
                onClick={() => router.push("/result")}
                className="flex shrink-0 items-center justify-center gap-2 rounded-2xl px-7 py-4 text-lg font-bold text-white shadow-[0_15px_35px_rgba(122,31,61,.35)] transition hover:-translate-y-0.5"
                style={{ backgroundColor: ACCENT }}
              >
                <ClipboardCheck size={18} />
                ابدأ التقييم
              </button>
            </div>
          )}
        </section>

        {/* ================= 3. الباقة: اشتراك جديد أو اشتراك مفعّل ================= */}
        {hasAssessment && packageLabel && (
          <section
            className="mt-8 overflow-hidden rounded-[36px] p-10 text-white"
            style={{ backgroundImage: `linear-gradient(135deg, ${TEXT} 0%, ${ACCENT} 100%)` }}
          >
            <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
              {hasActiveEnrollment ? "باقتك الحالية" : "الباقة الموصى بها"}
            </span>

            <h2 className="mt-6 text-4xl font-bold">{packageLabel}</h2>

            <p className="mt-4 max-w-2xl leading-8 text-white/85">
              {hasActiveEnrollment
                ? "اشتراكك في هذه الباقة مفعّل، ويمكنك متابعة خطتك التدريبية في أي وقت."
                : "بناءً على إجاباتك قمنا بتحديد أفضل مسار مناسب لوضعك الحالي."}
            </p>

            <Link
              href={hasActiveEnrollment ? "/client/path" : `/apply?package=${userPackage}`}
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold shadow-[0_15px_35px_rgba(0,0,0,.15)] transition hover:-translate-y-0.5 hover:bg-white/90"
              style={{ color: TEXT }}
            >
              {hasActiveEnrollment ? "الدخول إلى خطتك" : "الاشتراك الآن"}
              <ArrowLeft size={18} />
            </Link>
          </section>
        )}

        {/* ================= 3.1 مراجعة نتيجة التقييم — تظهر فقط قبل الاشتراك ================= */}
        {hasAssessment && packageLabel && !hasActiveEnrollment && (
          <section
            className="mt-8 rounded-[36px] border bg-white p-10 shadow-[0_20px_60px_rgba(122,31,61,.06)]"
            style={{ borderColor: BORDER }}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div
                  className="inline-flex rounded-full px-4 py-2 text-sm font-bold"
                  style={{ backgroundColor: BG, color: ACCENT }}
                >
                  نتيجة التقييم الكاملة
                </div>

                <h2 className="mt-5 text-3xl font-bold" style={{ color: TEXT }}>
                  هل تريد مراجعة توصيتك مرة أخرى؟
                </h2>

                <p className="mt-4 max-w-3xl leading-8" style={{ color: TEXT_SOFT }}>
                  يمكنك العودة في أي وقت لمشاهدة نتيجة تقييمك الكاملة، ومعرفة سبب ترشيح هذه
                  الباقة لك، ومقارنة جميع الباقات، والاطلاع على الأسئلة الشائعة قبل اتخاذ قرارك.
                </p>
              </div>

              <Link
                href={`/thank-you?package=${userPackage}`}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border-2 px-7 py-4 font-bold transition hover:text-white"
                style={{ borderColor: ACCENT, color: ACCENT }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = ACCENT)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                مراجعة نتيجة التقييم
                <ArrowLeft size={18} />
              </Link>
            </div>
          </section>
        )}

        {/* ================= تخيل النسخة القادمة منك ================= */}
        <section
          className="mt-8 overflow-hidden rounded-[36px] border bg-white p-10 shadow-[0_20px_60px_rgba(122,31,61,.06)]"
          style={{ borderColor: BORDER }}
        >
          <div className="flex items-center gap-3">
            <Sparkles style={{ color: ACCENT }} />
            <h2 className="text-3xl font-bold" style={{ color: TEXT }}>
              تخيل النسخة القادمة منك
            </h2>
          </div>

          <p className="mt-3 max-w-3xl leading-8" style={{ color: TEXT_SOFT }}>
            كل إنجاز كبير يبدأ بخطوة واضحة. ربما لا تعرف اليوم بالضبط أين ستصل، لكنك تعرف أنك لا
            تريد أن تبقى في نفس المكان. مسارك المهني لا يتغير بقرار واحد، بل بخطة صحيحة وتنفيذ
            مستمر. ابدأ من مكانك الحالي، ودعنا نساعدك في الوصول إلى النسخة التي تطمح أن تكونها.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="group relative overflow-hidden rounded-[28px]">
              <img
                src="/images/a3.png"
                alt=""
                className="h-[420px] w-full object-cover object-top transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <p className="absolute bottom-5 right-5 left-5 font-bold text-white">
                خطة واضحة هي كل ما يفصلك عن تغيير مسارك بالكامل
              </p>
            </div>
          </div>
        </section>

        {/* ================= بوابة التعلم ================= */}
        {hasAssessment && packageLabel && (
          <section
            className="mt-8 overflow-hidden rounded-[36px] p-10 text-white"
            style={{ backgroundImage: `linear-gradient(135deg, ${TEXT} 0%, ${ACCENT_LIGHT} 100%)` }}
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
                  {hasActiveEnrollment ? "خطتك جاهزة" : "الخطوة التالية"}
                </div>

                <h2 className="mt-5 text-4xl font-black">
                  {hasActiveEnrollment ? "مساحتك التدريبية مفتوحة الآن" : "بعد تفعيل اشتراكك..."}
                </h2>

                <p className="mt-4 text-lg leading-9 text-white/80">
                  {hasActiveEnrollment
                    ? "خطة التنفيذ الكاملة، والمهام المطلوبة، وجميع الخطوات العملية بانتظارك — يمكنك الدخول إليها والبدء فورًا."
                    : "سيتم فتح مساحتك الخاصة داخل نظام شغف، حيث ستجد خطة التنفيذ الكاملة، والمهام المطلوبة، وجميع الخطوات العملية المصممة لمساعدتك على الوصول إلى هدفك خطوة بخطوة."}
                </p>
              </div>

              {hasActiveEnrollment ? (
                <Link
                  href="/client/path"
                  className="inline-flex shrink-0 items-center gap-2 rounded-2xl px-8 py-4 text-lg font-bold text-white shadow-[0_15px_35px_rgba(0,0,0,.25)] transition hover:-translate-y-0.5"
                  style={{ backgroundColor: ACCENT }}
                >
                  الدخول إلى الخطة
                  <ArrowLeft size={18} />
                </Link>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur lg:max-w-sm">
                  <p className="text-sm font-bold text-pink-200">جاهز للخطوة التالية؟</p>
                  <h3 className="mt-3 text-2xl font-black">فعّل مسارك الآن</h3>
                  <p className="mt-3 leading-7 text-white/75">
                    بعد اعتماد اشتراكك سيتم فتح خطة التنفيذ الكاملة داخل حسابك وستتمكن من البدء
                    في تنفيذ خطواتك العملية مباشرة.
                  </p>

                  <Link
                    href={`/apply?package=${userPackage}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-4 font-bold shadow-[0_15px_35px_rgba(0,0,0,.15)] transition hover:-translate-y-1 hover:bg-white/90"
                    style={{ color: TEXT }}
                  >
                    الاشتراك الآن
                    <ArrowLeft size={18} />
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ================= أشخاص وصلوا قبلك ================= */}
        <section
          className="mt-8 overflow-hidden rounded-[36px] border bg-white p-10 shadow-[0_20px_60px_rgba(122,31,61,.06)]"
          style={{ borderColor: BORDER }}
        >
          <div className="flex items-center gap-3">
            <Sparkles style={{ color: ACCENT }} />
            <h2 className="text-3xl font-bold" style={{ color: TEXT }}>
              لم يعد السؤال "ماذا أفعل؟"
            </h2>
          </div>

          <p className="mt-3 max-w-2xl leading-8" style={{ color: TEXT_SOFT }}>
            بعد تحديد اتجاهك المناسب، أصبح التركيز على التنفيذ. كل مرحلة من المراحل التالية
            صُممت لتقربك من هدفك النهائي بطريقة عملية ومنظمة بعيدًا عن التخبط والعشوائية.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="group relative overflow-hidden rounded-[28px]">
              <img
                src="/images/a8.png"
                alt=""
                className="h-[420px] w-full object-cover object-top transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <p className="absolute bottom-5 right-5 left-5 font-bold text-white">
                كل فرصة كبيرة كانت يومًا ما مجرد خطوة أولى
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-[28px]">
              <img
                src="/images/a7.png"
                alt=""
                className="h-[420px] w-full object-cover object-top transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <p className="absolute bottom-5 right-5 left-5 font-bold text-white">
                من المهارة إلى أول دخل تصنعه بنفسك
              </p>
            </div>
          </div>
        </section>

        {/* ================= خارطة الطريق ================= */}
        <section className="mt-8 rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(122,31,61,.06)]">
          <h2 className="text-3xl font-bold" style={{ color: TEXT }}>
            خارطة طريقك
          </h2>
          <p className="mt-2 leading-7" style={{ color: TEXT_SOFT }}>
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
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold"
                    style={{
                      backgroundColor: isDone ? "#22c55e" : isCurrent ? ACCENT : BG,
                      color: isDone || isCurrent ? "#fff" : TEXT_SOFT,
                    }}
                  >
                    {isDone ? "✓" : stepNumber}
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ color: isCurrent ? ACCENT : TEXT }}>
                      {step}
                    </h3>
                    <p className="text-sm font-medium" style={{ color: TEXT_SOFT }}>
                      {isDone ? "مكتملة" : isCurrent ? "المرحلة الحالية" : `المرحلة ${stepNumber}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= نظرة سريعة (إحصائيات) ================= */}
        <section className="mt-8 grid gap-6 lg:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(122,31,61,.06)]">
            <p className="text-sm font-medium" style={{ color: TEXT_SOFT }}>
              التقييم
            </p>
            <h3
              className="mt-2 text-4xl font-bold"
              style={{ color: hasAssessment ? "#16a34a" : BORDER }}
            >
              {hasAssessment ? "✓" : "—"}
            </h3>
            <p className="mt-3 font-semibold" style={{ color: TEXT }}>
              {hasAssessment ? "مكتمل" : "لم يكتمل"}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(122,31,61,.06)]">
            <p className="text-sm font-medium" style={{ color: TEXT_SOFT }}>
              المسار
            </p>
            <h3 className="mt-2 text-4xl font-bold" style={{ color: ACCENT }}>
              {currentStage}
            </h3>
            <p className="mt-3 font-semibold" style={{ color: TEXT }}>
              من {totalStages} مراحل
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(122,31,61,.06)]">
            <p className="text-sm font-medium" style={{ color: TEXT_SOFT }}>
              الموارد
            </p>
            <h3 className="mt-2 text-4xl font-bold" style={{ color: TEXT }}>
              {resources.length}
            </h3>
            <p className="mt-3 font-semibold" style={{ color: TEXT }}>
              متاحة الآن
            </p>
          </div>

          <Link
            href={hasActiveEnrollment ? "/client/path" : hasAssessment ? "/thank-you" : "/result"}
            className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(122,31,61,.06)] transition hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(122,31,61,.12)]"
          >
            <p className="text-sm font-medium" style={{ color: TEXT_SOFT }}>
              الخطوة القادمة
            </p>
            <h3 className="mt-2 text-xl font-bold" style={{ color: ACCENT }}>
              {hasActiveEnrollment ? "مشاهدة الخطة" : hasAssessment ? "مراجعة التوصية" : "ابدأ التقييم"}
            </h3>
            <p className="mt-3 font-semibold" style={{ color: TEXT }}>
              ابدأ الآن
            </p>
          </Link>
        </section>

        {/* ================= الملف الشخصي ================= */}
        <section className="mt-8">
          <div className="rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(122,31,61,.06)]">
            <div className="mb-8 text-center">
              <div
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-full text-4xl font-bold text-white"
                style={{ backgroundColor: ACCENT }}
              >
                {profile?.full_name?.charAt(0)}
              </div>

              <h2 className="mt-4 text-2xl font-bold" style={{ color: TEXT }}>
                {profile?.full_name}
              </h2>

              <p className="mt-1 font-medium" style={{ color: TEXT_SOFT }}>
                {profile?.email}
              </p>
            </div>

            <div className="mx-auto max-w-md space-y-5 font-medium" style={{ color: TEXT }}>
              <div className="flex items-center gap-3">
                <User style={{ color: ACCENT }} size={20} />
                <span>{profile?.full_name || "-"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail style={{ color: ACCENT }} size={20} />
                <span>{profile?.email || "-"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone style={{ color: ACCENT }} size={20} />
                <span>{profile?.whatsapp || "-"}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin style={{ color: ACCENT }} size={20} />
                <span>
                  {profile?.country || "-"} - {profile?.city || "-"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= المصادر المجانية ================= */}
        <section className="mt-8 rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(122,31,61,.06)]">
          <h2 className="text-2xl font-bold" style={{ color: TEXT }}>
            المصادر المجانية
          </h2>

          <p className="mt-2" style={{ color: TEXT_SOFT }}>
            جميع الأدلة والملفات التي يضيفها فريق شغف.
          </p>

          {resources.length === 0 ? (
            <div
              className="mt-8 rounded-3xl border border-dashed p-10 text-center font-medium"
              style={{ borderColor: BORDER, color: TEXT_SOFT }}
            >
              لا توجد مصادر مجانية حالياً.
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="overflow-hidden rounded-3xl border bg-white transition hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(122,31,61,.12)]"
                  style={{ borderColor: BORDER }}
                >
                  {resource.thumbnail && (
                    <img
                      src={resource.thumbnail}
                      alt={resource.title}
                      className="h-48 w-full object-cover"
                    />
                  )}

                  <div className="p-6">
                    <BookOpen size={36} style={{ color: ACCENT }} />

                    <h3 className="mt-4 text-xl font-bold" style={{ color: TEXT }}>
                      {resource.title}
                    </h3>

                    <p className="mt-3 leading-7" style={{ color: TEXT_SOFT }}>
                      {resource.description}
                    </p>

                    <div className="mt-6 flex gap-3">
                      <Link
                        href={`/client/resources/${resource.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold text-white transition"
                        style={{ backgroundColor: ACCENT }}
                      >
                        <BookOpen size={18} />
                        عرض المصدر
                      </Link>

                      <a
                        href={resource.file_url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border-2 px-5 py-3 font-bold transition"
                        style={{ borderColor: ACCENT, color: ACCENT }}
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