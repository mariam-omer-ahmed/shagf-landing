"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  getPathForEnrollment,
  type PathPackageGroup,
  type ModulePackageInfo,
} from "@/lib/queries/courseContent";
import { getCompletedModuleIds } from "@/lib/queries/progress";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Layers,
  Lock,
  PlayCircle,
  Sparkles,
  Target,
  Zap,
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

type GroupStatus = "completed" | "current" | "locked";

type JourneyGroup = {
  group: PathPackageGroup;
  status: GroupStatus;
};

const FALLBACK_COLOR = "#7A1F3D";
const DARK = "#1A0A10";
// أسود صريح للنصوص، مش رمادي باهت — القراءة أوضح والانطباع أقوى
const INK = "#0B0608";
const INK_SOFT = "#3A2A2E";
const FONT_FAMILY = "'Almarai','Tajawal',sans-serif";

export default function ClientPathPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [missingPackage, setMissingPackage] = useState(false);

  const [journeyGroups, setJourneyGroups] = useState<JourneyGroup[]>([]);
  const [lockedPackages, setLockedPackages] = useState<ModulePackageInfo[]>([]);
  const [completedModuleIds, setCompletedModuleIds] = useState<Set<string>>(new Set());

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

      const [groups, completedIds, { data: allPackages }] = await Promise.all([
        getPathForEnrollment(activeEnrollment.package_id),
        getCompletedModuleIds(user.id),
        supabase
          .from("packages")
          .select("id, title, color, thumbnail, tier")
          .eq("is_active", true)
          .order("tier", { ascending: true }),
      ]);

      setCompletedModuleIds(completedIds);

      let foundCurrent = false;
      const withStatus: JourneyGroup[] = groups.map((g) => {
        if (foundCurrent) {
          return { group: g, status: "locked" as GroupStatus };
        }

        const totalModules = g.modules.length;
        const doneModules = g.modules.filter((m) => completedIds.has(m.id)).length;
        const isComplete = totalModules > 0 && doneModules === totalModules;

        if (isComplete) {
          return { group: g, status: "completed" as GroupStatus };
        }

        foundCurrent = true;
        return { group: g, status: "current" as GroupStatus };
      });

      setJourneyGroups(withStatus);

      const enrolledTier = groups.length > 0 ? groups[groups.length - 1].package.tier : 0;
      const beyondEnrollment = ((allPackages ?? []) as ModulePackageInfo[]).filter(
        (p) => p.tier > enrolledTier
      );
      setLockedPackages(beyondEnrollment);
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
          <p className="text-lg font-bold" style={{ color: INK }}>
            الاشتراك مفعّل، إلا أنه لم يُربط بعد بباقة محددة.
          </p>
          <p className="mt-2 font-medium" style={{ color: INK_SOFT }}>
            يُرجى التواصل مع فريق الدعم لإتمام إعداد الاشتراك.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#FDF2F6]"
        style={{ fontFamily: FONT_FAMILY, color: INK_SOFT }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F3D6E2] border-t-[#7A1F3D]" />
          <p className="text-lg font-bold" style={{ color: INK }}>جارٍ تحميل المسار التدريبي...</p>
        </div>
      </div>
    );
  }

  const pkg = enrollment?.packages;
  const accent = pkg?.color || FALLBACK_COLOR;

  const currentGroup = journeyGroups.find((g) => g.status === "current");
  const totalLessons =
    currentGroup?.group.modules.reduce((s, m) => s + (m.course_lessons?.length ?? 0), 0) ?? 0;
  const totalAssignments =
    currentGroup?.group.modules.reduce(
      (s, m) =>
        s + (m.course_lessons?.reduce((ls, l) => ls + (l.course_assignments?.length ?? 0), 0) ?? 0),
      0
    ) ?? 0;

  const investedAmount = enrollment?.amount ?? pkg?.price ?? null;

  const reachableModules = journeyGroups.filter((g) => g.status !== "locked");
  const totalReachableModules = reachableModules.reduce((s, g) => s + g.group.modules.length, 0);
  const doneReachableModules = reachableModules.reduce(
    (s, g) => s + g.group.modules.filter((m) => completedModuleIds.has(m.id)).length,
    0
  );
  const overallProgress =
    totalReachableModules > 0 ? Math.round((doneReachableModules / totalReachableModules) * 100) : 0;

  // أول وحدة لسه ما بدأش فيها الطالب على الإطلاق (مفيش ولا وحدة واحدة مكتملة
  // في الباقة الحالية) — دي اللي بناخد عليها إشارة "ابدأ من هنا"
  const isFirstEverModule = doneReachableModules === 0;
  const nextModuleId =
    currentGroup?.group.modules.find((m) => !completedModuleIds.has(m.id))?.id ?? null;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#FDF2F6] px-6 pb-16 pt-28 sm:pt-32"
      style={{ fontFamily: FONT_FAMILY, color: INK }}
    >
      <div className="mx-auto max-w-5xl">
        {/* ============== HERO ============== */}
        <section className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
          <div
            className="relative overflow-hidden rounded-[36px] p-10 text-white sm:p-14"
            style={{ backgroundImage: `linear-gradient(135deg, ${DARK} 0%, ${accent} 130%)` }}
          >
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-black tracking-wide backdrop-blur">
                <Target size={13} />
                برنامجك: {pkg?.title || "المسار التدريبي"}
              </span>

              <h1 className="mt-5 max-w-2xl text-3xl font-black leading-[1.5] sm:text-4xl">
                {pkg?.result || "خطوة عملية واحدة كل مرة، حتى تصل إلى النتيجة التي دفعت من أجلها."}
              </h1>

              <p className="mt-4 max-w-xl text-lg font-medium leading-8 text-white">
                {pkg?.description ||
                  "لا نظريات، لا حشو. كل وحدة هنا تنقلك خطوة أقرب لهدفك. أنجز الوحدات بالترتيب الظاهر أمامك، وستصل — الالتزام وحده هو الفارق الآن."}
              </p>

              <div className="mt-8">
                <div className="mb-2 flex items-center justify-between text-xs font-black text-white">
                  <span>تقدّمك الفعلي حتى الآن</span>
                  <span>{overallProgress}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>

              {/* رسالة ترحيبية تظهر بس أول مرة، قبل ما الطالب يبدأ أي وحدة */}
              {isFirstEverModule && (
                <div className="mt-6 flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-3 text-sm font-bold backdrop-blur">
                  <Sparkles size={16} />
                  أهلًا بك في رحلتك — ابدأ بالوحدة الأولى بالأسفل، ولا تقفز بينها.
                </div>
              )}
            </div>
          </div>

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
                  <p className="font-black" style={{ color: INK }}>{pkg?.title || "المسار التدريبي"}</p>
                </div>
              )}
            </div>

            <div
              className="flex-1 p-6 text-white"
              style={{ backgroundImage: `linear-gradient(135deg, ${DARK} 0%, ${accent} 130%)` }}
            >
              {investedAmount != null && (
                <div className="inline-flex w-full items-center gap-3 rounded-2xl bg-white/10 px-6 py-4 backdrop-blur">
                  <div>
                    <p className="text-xs font-black text-white">قيمة الاشتراك</p>
                    <p className="text-2xl font-black">
                      {investedAmount} {pkg?.currency === "USD" ? "$" : pkg?.currency || ""}
                    </p>
                  </div>
                  <div className="h-10 w-px bg-white/30" />
                  <p className="max-w-[220px] text-sm font-medium leading-6 text-white">
                    يشمل هذا المبلغ كل محتويات البرنامج، من غير أي رسوم إضافية.
                  </p>
                </div>
              )}

              {enrollment?.created_at && (
                <p className="mt-4 text-xs font-bold text-white">
                  تاريخ التفعيل: {new Date(enrollment.created_at).toLocaleDateString("ar-SA")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ============== النتائج المستهدفة ============== */}
        {pkg?.outcomes && pkg.outcomes.length > 0 && (
          <section className="mt-6 rounded-[28px] border border-[#F3D6E2] bg-white p-8">
            <p className="mb-5 flex items-center gap-2 text-sm font-black" style={{ color: INK }}>
              <Zap size={16} style={{ color: accent }} />
              هذا ما ستحصل عليه بنهاية هذا البرنامج — بلا مبالغة
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {pkg.outcomes.map((outcome) => (
                <div key={outcome} className="flex items-start gap-2.5">
                  <div
                    className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: accent }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="font-medium leading-7" style={{ color: INK }}>{outcome}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============== محتوى الباقة الحالية ============== */}
        {currentGroup && currentGroup.group.modules.length > 0 && (
          <section className="mt-6">
            <p className="mb-3 text-sm font-black" style={{ color: INK }}>
              ما ينتظرك في {currentGroup.group.package.title} — باقتك الحالية
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <ValueStat icon={<Layers size={20} />} label="وحدة تدريبية" value={currentGroup.group.modules.length} accent={accent} />
              <ValueStat icon={<BookOpen size={20} />} label="محاضرة" value={totalLessons} accent={accent} />
              <ValueStat icon={<ClipboardList size={20} />} label="تكليف عملي" value={totalAssignments} accent={accent} />
            </div>
          </section>
        )}

        {/* ============== رحلتك التدريبية: قفل تسلسلي حقيقي ============== */}
        <section className="mt-10">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-black" style={{ color: INK }}>رحلتك خطوة بخطوة</p>
            <p className="text-xs font-bold" style={{ color: INK_SOFT }}>
              أنجز كل باقة بالكامل لتُفتح التي تليها تلقائيًا
            </p>
          </div>

          <div className="space-y-5">
            {journeyGroups.map(({ group, status }) => {
              const groupAccent = group.package.color || FALLBACK_COLOR;

              if (status === "completed") {
                return (
                  <div
                    key={group.package.id}
                    className="flex items-center gap-4 rounded-[28px] border-2 p-6"
                    style={{ borderColor: "#BFE3CC", backgroundColor: "#F3FBF6" }}
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_8px_20px_rgba(30,122,59,.25)]" style={{ backgroundColor: "#1E7A3B" }}>
                      <CheckCircle2 size={26} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black" style={{ color: INK }}>{group.package.title}</h2>
                        <span className="rounded-full bg-[#1E7A3B] px-3 py-0.5 text-xs font-black text-white">
                          مكتملة
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-bold text-[#1E7A3B]">
                        أنجزت {group.modules.length} من {group.modules.length} وحدة — إنجاز حقيقي، استمر بنفس الوتيرة.
                      </p>
                    </div>
                  </div>
                );
              }

              if (status === "locked") {
                return (
                  <div key={group.package.id} className="overflow-hidden rounded-[28px] border-2 border-dashed border-gray-300 bg-white/70">
                    <div className="flex items-center gap-4 p-6">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-100" style={{ color: INK_SOFT }}>
                        <Lock size={22} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-black" style={{ color: INK_SOFT }}>{group.package.title}</h2>
                          <span className="flex items-center gap-1 rounded-full bg-gray-200 px-3 py-0.5 text-xs font-black" style={{ color: INK_SOFT }}>
                            <Lock size={11} />
                            مقفولة مؤقتًا
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium" style={{ color: INK_SOFT }}>
                          تُفتح تلقائيًا فور إنجاز كل وحدات الباقة الحالية — لا حاجة لأي إجراء إضافي منك.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              const currentDone = group.modules.filter((m) => completedModuleIds.has(m.id)).length;

              return (
                <div key={group.package.id} className="overflow-hidden rounded-[28px] border-2" style={{ borderColor: groupAccent }}>
                  <div
                    className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 text-white sm:px-7"
                    style={{ backgroundColor: groupAccent }}
                  >
                    <div className="flex items-center gap-2.5">
                      <Target size={18} />
                      <h2 className="text-lg font-black">{group.package.title}</h2>
                    </div>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur">
                      {currentDone} من {group.modules.length} وحدة مُنجزة
                    </span>
                  </div>

                  <div className="bg-white p-5 sm:p-6">
                    {group.modules.length === 0 ? (
                      <div className="rounded-3xl border border-[#F3D6E2] bg-[#FDF2F6] p-8 text-center text-sm font-medium" style={{ color: INK_SOFT }}>
                        لا تتوفر وحدات ضمن هذه الباقة حاليًا — سيُضاف المحتوى قريبًا.
                      </div>
                    ) : (
                      <ol className="relative">
                        <div className="absolute right-[27px] top-3 bottom-3 w-[2px] opacity-30" style={{ backgroundColor: groupAccent }} />

                        {group.modules.map((module, index) => {
                          const isDone = completedModuleIds.has(module.id);
                          const isNextUp = module.id === nextModuleId;

                          return (
                            <li key={module.id} className="relative mb-4 pr-[76px] last:mb-0">
                              <div
                                className="absolute right-0 top-0 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white font-black text-white shadow-[0_8px_20px_rgba(61,18,32,.2)]"
                                style={{ backgroundColor: isDone ? "#1E7A3B" : DARK }}
                              >
                                {isDone ? <CheckCircle2 size={22} /> : String(index + 1).padStart(2, "0")}
                              </div>

                              {/* نبضة خفيفة حوالين رقم الوحدة التالية — توجيه العين
                                  من غير ما تحتاج قراءة كل حاجة */}
                              {isNextUp && (
                                <span
                                  className="absolute right-0 top-0 h-14 w-14 animate-ping rounded-full opacity-30"
                                  style={{ backgroundColor: groupAccent }}
                                />
                              )}

                              <div
                                className="group rounded-2xl border-2 p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(122,31,61,.08)] sm:p-6"
                                style={{
                                  backgroundColor: "#FDF2F6",
                                  borderColor: isNextUp ? groupAccent : "transparent",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = groupAccent)}
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.borderColor = isNextUp ? groupAccent : "transparent")
                                }
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <h3 className="text-lg font-black" style={{ color: INK }}>{module.title}</h3>
                                  {isDone ? (
                                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                                      <CheckCircle2 size={13} />
                                      مكتملة
                                    </span>
                                  ) : isNextUp ? (
                                    <span
                                      className="flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-black text-white"
                                      style={{ backgroundColor: groupAccent }}
                                    >
                                      <Sparkles size={12} />
                                      ابدأ من هنا
                                    </span>
                                  ) : (
                                    <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black" style={{ color: groupAccent }}>
                                      وحدة {String(index + 1).padStart(2, "0")}
                                    </span>
                                  )}
                                </div>

                                {module.description && <p className="mt-2 font-medium leading-7" style={{ color: INK_SOFT }}>{module.description}</p>}

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                  <div className="flex gap-5 text-sm font-bold">
                                    <span className="flex items-center gap-1.5" style={{ color: INK_SOFT }}>
                                      <BookOpen size={15} style={{ color: groupAccent }} />
                                      {module.course_lessons?.length ?? 0} محاضرة
                                    </span>
                                    <span className="flex items-center gap-1.5" style={{ color: INK_SOFT }}>
                                      <ClipboardList size={15} style={{ color: groupAccent }} />
                                      {module.course_lessons?.reduce((s, l) => s + (l.course_assignments?.length ?? 0), 0) ?? 0} تكليف
                                    </span>
                                  </div>

                                  <Link
                                    href={`/client/path/module/${module.id}`}
                                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
                                    style={{
                                      backgroundColor: groupAccent,
                                      boxShadow: isNextUp ? `0 10px 25px -5px ${groupAccent}80` : undefined,
                                    }}
                                  >
                                    {isDone ? (
                                      <>
                                        مراجعة الوحدة
                                        <ArrowLeft size={15} />
                                      </>
                                    ) : (
                                      <>
                                        <PlayCircle size={15} />
                                        ابدأ الآن
                                      </>
                                    )}
                                  </Link>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ol>
                    )}
                  </div>
                </div>
              );
            })}

            {lockedPackages.map((locked) => (
              <div key={locked.id} className="overflow-hidden rounded-[28px] border-2 border-dashed border-gray-300 bg-white/70">
                <div className="flex items-center gap-4 p-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-100" style={{ color: INK_SOFT }}>
                    <Lock size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black" style={{ color: INK_SOFT }}>{locked.title}</h2>
                      <span className="flex items-center gap-1 rounded-full bg-gray-200 px-3 py-0.5 text-xs font-black" style={{ color: INK_SOFT }}>
                        <Lock size={11} />
                        تُفتح مع الترقية
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium" style={{ color: INK_SOFT }}>
                      رقِّ اشتراكك إلى "{locked.title}" لتفتح محتواها فورًا.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: accent }}>
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-black" style={{ color: "#0B0608" }}>{value}</h3>
        <p className="text-sm font-bold" style={{ color: "#3A2A2E" }}>{label}</p>
      </div>
    </div>
  );
}