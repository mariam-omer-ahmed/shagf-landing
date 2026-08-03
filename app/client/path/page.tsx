"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { getCourseModules, type CourseModule } from "@/lib/queries/courseContent";
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  Layers,
} from "lucide-react";

type PackageDetails = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  tagline: string | null;
  result: string | null;
  outcomes: string[] | null;
  price: number | null;
  currency: string;
  color: string | null;
  icon: string | null;
  thumbnail: string | null;
};

type Enrollment = {
  id: string;
  package_id: string;
  created_at: string;
  amount: number | null;
  packages?: PackageDetails | null;
};

// اللون الافتراضي (نبيتي) في حال لم تُحدَّد الباقة لونًا خاصًا بها من لوحة التحكم
const FALLBACK_COLOR = "#7A1F3D";
const FONT_FAMILY = "'Cairo', sans-serif";

export default function ClientPathPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [missingPackage, setMissingPackage] = useState(false);

  useEffect(() => {
    loadPath();
  }, []);

  async function loadPath() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      // جلب الاشتراك الفعّال والمدفوع فقط، مع كامل تفاصيل الباقة المرتبطة به
      const {
        data: activeEnrollment,
        error: enrollmentError,
      } = await supabase
        .from("enrollments")
        .select(
          "*, packages(id, slug, title, description, tagline, result, outcomes, price, currency, color, icon, thumbnail)"
        )
        .eq("user_id", user.id)
        .eq("status", "active")
        .eq("payment_status", "paid")
        .maybeSingle();

      if (enrollmentError) {
        console.error("Enrollment fetch error:", enrollmentError);
      }

      if (!activeEnrollment) {
        router.replace("/client/packages");
        return;
      }

      if (!activeEnrollment.package_id) {
        console.error("Enrollment has no package_id:", activeEnrollment.id);
        setMissingPackage(true);
        setLoading(false);
        return;
      }

      setEnrollment(activeEnrollment);

      const content = await getCourseModules(activeEnrollment.package_id);
      setModules(content || []);
    } catch (error) {
      console.error("Client Path Error:", error);
      router.replace("/client");
    } finally {
      setLoading(false);
    }
  }

  if (missingPackage) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#FDF2F6] px-6 text-center"
        style={{ fontFamily: FONT_FAMILY }}
      >
        <div className="max-w-md rounded-3xl border border-[#F3D6E2] bg-white p-10 shadow-[0_20px_60px_rgba(122,31,61,.08)]">
          <p className="text-lg font-bold text-[#3D1220]">
            اشتراكك مفعّل، إلا أنه لم يُربط بعد بباقة محددة
          </p>
          <p className="mt-2 text-[#8C6F78]">
            يُرجى التواصل مع فريق الدعم لإتمام إعداد اشتراكك
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#FDF2F6] text-[#8C6F78]"
        style={{ fontFamily: FONT_FAMILY }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F3D6E2] border-t-[#7A1F3D]" />
          <p className="text-lg font-bold">جارٍ تحميل مسارك التدريبي...</p>
        </div>
      </div>
    );
  }

  const pkg = enrollment?.packages;
  const accent = pkg?.color || FALLBACK_COLOR;

  const totalLessons = modules.reduce(
    (sum, m) => sum + (m.course_lessons?.length ?? 0),
    0
  );
  const totalAssignments = modules.reduce(
    (sum, m) =>
      sum +
      (m.course_lessons?.reduce(
        (lessonSum, l) => lessonSum + (l.course_assignments?.length ?? 0),
        0
      ) ?? 0),
    0
  );
  const totalResources = modules.reduce(
    (sum, m) =>
      sum +
      (m.course_lessons?.reduce(
        (lessonSum, l) => lessonSum + (l.lesson_resources?.length ?? 0),
        0
      ) ?? 0),
    0
  );

  const investedAmount = enrollment?.amount ?? pkg?.price ?? null;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#FDF2F6] px-6 pb-14 pt-28 text-[#3D1220] sm:pt-32"
      style={{ fontFamily: FONT_FAMILY }}
    >
      <div className="mx-auto max-w-5xl">

        {/* ============== HERO ============== */}
        <section className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
          <div
            className="relative overflow-hidden rounded-[36px] p-10 text-white sm:p-14"
            style={{
              backgroundImage: `linear-gradient(135deg, #3D1220 0%, ${accent} 130%)`,
            }}
          >
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-black tracking-wide backdrop-blur">
                برنامجكِ التدريبي: {pkg?.title || "مسارك التدريبي"}
              </span>

              {pkg?.tagline && (
                <p className="mt-5 text-sm font-black text-white/70">
                  {pkg.tagline}
                </p>
              )}

              <h1 className="mt-3 max-w-2xl text-3xl font-black leading-[1.5] sm:text-4xl">
                {pkg?.result ||
                  "جميع ما تحتاجينه للوصول إلى هدفك مجمّع في مكان واحد"}
              </h1>

              <p className="mt-4 max-w-xl leading-8 text-white/85">
                {pkg?.description ||
                  "أكملي الوحدات بالترتيب الظاهر أمامك للوصول إلى النتيجة التي بدأتِ من أجلها هذه الرحلة."}
              </p>
            </div>
          </div>

          {/* لوحة الصورة — صورة بارتفاع ثابت من فوق (object-cover يملأ المساحة
              بالكامل)، وتحتها مباشرة شريط غامق فيه قيمة الاشتراك وتاريخ التفعيل،
              كل ده جوه نفس الكارد المدوّر */}
          <div className="flex flex-col overflow-hidden rounded-[36px] shadow-[0_20px_60px_rgba(61,18,32,.18)]">
            <div className="relative h-[280px] shrink-0 sm:h-[340px]">
              {pkg?.thumbnail ? (
                <img
                  src={pkg.thumbnail}
                  alt={pkg?.title || "صورة البرنامج"}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              ) : (
                <div
                  className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center"
                  style={{ backgroundColor: "#F3D6E2" }}
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl text-white"
                    style={{ backgroundColor: accent }}
                  >
                    <Layers size={28} />
                  </div>
                  <p className="font-black text-[#3D1220]">{pkg?.title || "مسارك التدريبي"}</p>
                </div>
              )}
            </div>

            <div
              className="flex-1 p-6 text-white"
              style={{ backgroundImage: `linear-gradient(135deg, #3D1220 0%, ${accent} 130%)` }}
            >
              {investedAmount != null && (
                <div className="inline-flex w-full items-center gap-3 rounded-2xl bg-white/10 px-6 py-4 backdrop-blur">
                  <div>
                    <p className="text-xs font-bold text-white/70">قيمة الاشتراك</p>
                    <p className="text-2xl font-black">
                      {investedAmount} {pkg?.currency === "USD" ? "$" : pkg?.currency || ""}
                    </p>
                  </div>
                  <div className="h-10 w-px bg-white/20" />
                  <p className="max-w-[220px] text-sm leading-6 text-white/80">
                    يشمل هذا المبلغ جميع محتويات البرنامج دون أي رسوم إضافية
                  </p>
                </div>
              )}

              {enrollment?.created_at && (
                <p className="mt-4 text-xs font-bold text-white/60">
                  تاريخ التفعيل:{" "}
                  {new Date(enrollment.created_at).toLocaleDateString("ar-SA")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ============== النتائج المستهدفة لهذه الباقة ============== */}
        {pkg?.outcomes && pkg.outcomes.length > 0 && (
          <section className="mt-6 rounded-[28px] border border-[#F3D6E2] bg-white p-8">
            <p className="mb-5 text-sm font-black text-[#8C6F78]">
              النتائج المستهدفة من هذا البرنامج
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {pkg.outcomes.map((outcome) => (
                <div key={outcome} className="flex items-start gap-2.5">
                  <div
                    className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: accent }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="leading-7 text-[#3D1220]">{outcome}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============== محتوى البرنامج ============== */}
        {modules.length > 0 && (
          <section className="mt-6">
            <p className="mb-3 text-sm font-black text-[#8C6F78]">
              محتوى البرنامج
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <ValueStat
                icon={<Layers size={20} />}
                label="وحدة تدريبية"
                value={modules.length}
                accent={accent}
              />
              <ValueStat
                icon={<BookOpen size={20} />}
                label="محاضرة"
                value={totalLessons}
                accent={accent}
              />
              <ValueStat
                icon={<ClipboardList size={20} />}
                label="تكليف"
                value={totalAssignments}
                accent={accent}
              />
            </div>
            {totalResources > 0 && (
              <p className="mt-3 text-sm font-bold text-[#8C6F78]">
                بالإضافة إلى {totalResources} من الفيديوهات والملفات القابلة للتحميل
              </p>
            )}
          </section>
        )}

        {/* ============== الوحدات ============== */}
        <section className="mt-10">
          {modules.length === 0 && (
            <div className="rounded-3xl border border-[#F3D6E2] bg-white p-14 text-center">
              <p className="text-lg font-bold text-[#3D1220]">
                لا تتوفر وحدات ضمن هذه الباقة في الوقت الحالي
              </p>
              <p className="mt-2 text-[#8C6F78]">
                سيتم إضافة محتوى هذه الباقة قريبًا
              </p>
            </div>
          )}

          {modules.length > 0 && (
            <>
              <p className="mb-5 text-sm font-black text-[#8C6F78]">
                مسارك خطوة بخطوة
              </p>

              <ol className="relative">
                <div
                  className="absolute right-[27px] top-3 bottom-3 w-[2px] opacity-30"
                  style={{ backgroundColor: accent }}
                />

                {modules.map((module: CourseModule, index) => (
                  <li key={module.id} className="relative mb-6 pr-[76px] last:mb-0">
                    <div
                      className="absolute right-0 top-0 flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#FDF2F6] font-black text-white shadow-[0_8px_20px_rgba(61,18,32,.25)]"
                      style={{ backgroundColor: "#3D1220" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div
                      className="group rounded-[28px] border-2 border-transparent bg-white p-7 shadow-[0_15px_45px_rgba(122,31,61,.06)] transition-all hover:-translate-y-0.5 sm:p-8"
                      style={{ borderColor: "transparent" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = accent)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = "transparent")
                      }
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-2xl font-black text-[#3D1220]">
                          {module.title}
                        </h2>
                        <span
                          className="shrink-0 rounded-full px-3 py-1 text-xs font-black"
                          style={{ backgroundColor: "#FDF2F6", color: accent }}
                        >
                          وحدة {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {module.description && (
                        <p className="mt-3 leading-8 text-[#6B5560]">
                          {module.description}
                        </p>
                      )}

                      <div className="mt-7 flex flex-wrap items-center justify-between gap-5">
                        <div className="flex gap-8">
                          <div className="flex items-center gap-2">
                            <BookOpen size={18} style={{ color: accent }} />
                            <div>
                              <p className="text-xs font-bold text-[#8C6F78]">
                                عدد المحاضرات
                              </p>
                              <h3 className="text-xl font-black text-[#3D1220]">
                                {module.course_lessons?.length ?? 0}
                              </h3>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <ClipboardList size={18} style={{ color: accent }} />
                            <div>
                              <p className="text-xs font-bold text-[#8C6F78]">
                                عدد التكليفات
                              </p>
                              <h3 className="text-xl font-black text-[#3D1220]">
                                {
                                  module.course_lessons?.reduce(
                                    (sum, l) =>
                                      sum + (l.course_assignments?.length ?? 0),
                                    0
                                  ) ?? 0
                                }
                              </h3>
                            </div>
                          </div>
                        </div>

                        <Link
                          href={`/client/path/module/${module.id}`}
                          className="inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 font-bold text-white transition hover:-translate-y-0.5"
                          style={{ backgroundColor: accent }}
                        >
                          الانتقال إلى الوحدة
                          <ArrowLeft size={18} />
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function ValueStat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-[#F3D6E2] bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(122,31,61,.08)]">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
        style={{ backgroundColor: accent }}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-black text-[#3D1220]">{value}</h3>
        <p className="text-sm font-bold text-[#8C6F78]">{label}</p>
      </div>
    </div>
  );
}