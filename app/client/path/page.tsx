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

// حالة الباقة جوه الرحلة التسلسلية
type GroupStatus = "completed" | "current" | "locked";

type JourneyGroup = {
  group: PathPackageGroup;
  status: GroupStatus;
};

const FALLBACK_COLOR = "#7A1F3D";
const FONT_FAMILY = "'Cairo', sans-serif";

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

      // نحدد حالة كل باقة بالترتيب: أول باقة فيها وحدة ناقصة تبقى "الحالية"،
      // اللي قبلها كلها "مكتملة"، واللي بعدها (حتى لو مدفوعة) تبقى "مقفولة"
      // لحد ما تخلّص الطالبة الباقة الحالية
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
            style={{ backgroundImage: `linear-gradient(135deg, #3D1220 0%, ${accent} 130%)` }}
          >
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-black tracking-wide backdrop-blur">
                برنامجكِ التدريبي: {pkg?.title || "مسارك التدريبي"}
              </span>

              {pkg?.tagline && <p className="mt-5 text-sm font-black text-white/70">{pkg.tagline}</p>}

              <h1 className="mt-3 max-w-2xl text-3xl font-black leading-[1.5] sm:text-4xl">
                {pkg?.result || "جميع ما تحتاجينه للوصول إلى هدفك مجمّع في مكان واحد"}
              </h1>

              <p className="mt-4 max-w-xl leading-8 text-white/85">
                {pkg?.description ||
                  "أكملي الوحدات بالترتيب الظاهر أمامك للوصول إلى النتيجة التي بدأتِ من أجلها هذه الرحلة."}
              </p>
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
                  تاريخ التفعيل: {new Date(enrollment.created_at).toLocaleDateString("ar-SA")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ============== النتائج المستهدفة ============== */}
        {pkg?.outcomes && pkg.outcomes.length > 0 && (
          <section className="mt-6 rounded-[28px] border border-[#F3D6E2] bg-white p-8">
            <p className="mb-5 text-sm font-black text-[#8C6F78]">النتائج المستهدفة من هذا البرنامج</p>
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
                  <span className="leading-7 text-[#3D1220]">{outcome}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============== محتوى الباقة الحالية اللي شغالة عليها الطالبة ============== */}
        {currentGroup && currentGroup.group.modules.length > 0 && (
          <section className="mt-6">
            <p className="mb-3 text-sm font-black text-[#8C6F78]">
              محتوى {currentGroup.group.package.title} (باقتك الحالية)
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <ValueStat icon={<Layers size={20} />} label="وحدة تدريبية" value={currentGroup.group.modules.length} accent={accent} />
              <ValueStat icon={<BookOpen size={20} />} label="محاضرة" value={totalLessons} accent={accent} />
              <ValueStat icon={<ClipboardList size={20} />} label="تكليف" value={totalAssignments} accent={accent} />
            </div>
          </section>
        )}

        {/* ============== رحلتك التدريبية: قفل تسلسلي حقيقي ============== */}
        <section className="mt-10">
          <p className="mb-5 text-sm font-black text-[#8C6F78]">رحلتك التدريبية</p>

          <div className="space-y-6">
            {journeyGroups.map(({ group, status }) => {
              const groupAccent = group.package.color || FALLBACK_COLOR;

              // باقة مكتملة بالكامل — عرض مختصر بس
              if (status === "completed") {
                return (
                  <div key={group.package.id} className="flex items-center gap-4 rounded-3xl border border-green-100 bg-green-50/50 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: groupAccent }}>
                      <CheckCircle2 size={22} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-black text-[#3D1220]">{group.package.title}</h2>
                      <p className="text-sm text-green-700">اكتملت كل وحداتها ({group.modules.length} وحدة)</p>
                    </div>
                    <CheckCircle2 size={24} className="text-green-500" />
                  </div>
                );
              }

              // باقة مقفولة — لسه محتاجة تخلّصي اللي قبلها
              if (status === "locked") {
                return (
                  <div key={group.package.id}>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="inline-flex h-3 w-3 rounded-full bg-gray-300" />
                      <h2 className="text-lg font-black text-gray-400">{group.package.title}</h2>
                      <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-500">
                        <Lock size={12} />
                        مقفولة
                      </span>
                    </div>
                    <div className="flex items-center gap-4 rounded-3xl border border-dashed border-gray-200 bg-white/60 p-6">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                        <Lock size={18} />
                      </div>
                      <p className="text-sm text-gray-400">
                        أنهي كل وحدات الباقة اللي قبلها الأول عشان تتفتح
                      </p>
                    </div>
                  </div>
                );
              }

              // الباقة الحالية — الوحدات ظاهرة بالتفصيل مع علامة إنجاز على كل وحدة
              return (
                <div key={group.package.id}>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: groupAccent }} />
                    <h2 className="text-xl font-black text-[#3D1220]">{group.package.title}</h2>
                    <span className="rounded-full px-3 py-1 text-xs font-black text-white" style={{ backgroundColor: groupAccent }}>
                      باقتك الحالية
                    </span>
                  </div>

                  {group.modules.length === 0 ? (
                    <div className="rounded-3xl border border-[#F3D6E2] bg-white p-8 text-center text-sm text-[#8C6F78]">
                      لا تتوفر وحدات ضمن هذه الباقة في الوقت الحالي
                    </div>
                  ) : (
                    <ol className="relative">
                      <div className="absolute right-[27px] top-3 bottom-3 w-[2px] opacity-30" style={{ backgroundColor: groupAccent }} />

                      {group.modules.map((module, index) => {
                        const isDone = completedModuleIds.has(module.id);

                        return (
                          <li key={module.id} className="relative mb-5 pr-[76px] last:mb-0">
                            <div
                              className="absolute right-0 top-0 flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#FDF2F6] font-black text-white shadow-[0_8px_20px_rgba(61,18,32,.25)]"
                              style={{ backgroundColor: isDone ? "#1E7A3B" : "#3D1220" }}
                            >
                              {isDone ? <CheckCircle2 size={22} /> : String(index + 1).padStart(2, "0")}
                            </div>

                            <div
                              className="group rounded-[28px] border-2 border-transparent bg-white p-6 shadow-[0_15px_45px_rgba(122,31,61,.06)] transition-all hover:-translate-y-0.5 sm:p-7"
                              onMouseEnter={(e) => (e.currentTarget.style.borderColor = groupAccent)}
                              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <h3 className="text-xl font-black text-[#3D1220]">{module.title}</h3>
                                {isDone ? (
                                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                                    <CheckCircle2 size={13} />
                                    مكتملة
                                  </span>
                                ) : (
                                  <span className="shrink-0 rounded-full px-3 py-1 text-xs font-black" style={{ backgroundColor: "#FDF2F6", color: groupAccent }}>
                                    وحدة {String(index + 1).padStart(2, "0")}
                                  </span>
                                )}
                              </div>

                              {module.description && <p className="mt-2 leading-7 text-[#6B5560]">{module.description}</p>}

                              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex gap-6 text-sm">
                                  <span className="flex items-center gap-1.5 text-[#8C6F78]">
                                    <BookOpen size={16} style={{ color: groupAccent }} />
                                    {module.course_lessons?.length ?? 0} محاضرة
                                  </span>
                                  <span className="flex items-center gap-1.5 text-[#8C6F78]">
                                    <ClipboardList size={16} style={{ color: groupAccent }} />
                                    {module.course_lessons?.reduce((s, l) => s + (l.course_assignments?.length ?? 0), 0) ?? 0} تكليف
                                  </span>
                                </div>

                                <Link
                                  href={`/client/path/module/${module.id}`}
                                  className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-bold text-white transition hover:-translate-y-0.5"
                                  style={{ backgroundColor: groupAccent }}
                                >
                                  {isDone ? (
                                    <>
                                      مراجعة الوحدة
                                      <ArrowLeft size={16} />
                                    </>
                                  ) : (
                                    <>
                                      <PlayCircle size={16} />
                                      الدخول للوحدة
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
              );
            })}

            {/* باقات لسه مش مدفوعة أصلًا (tier أعلى من اشتراك الطالبة) */}
            {lockedPackages.map((locked) => (
              <div key={locked.id}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="inline-flex h-3 w-3 rounded-full bg-gray-300" />
                  <h2 className="text-lg font-black text-gray-400">{locked.title}</h2>
                  <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-500">
                    <Lock size={12} />
                    تُفتح مع الترقية
                  </span>
                </div>
                <div className="flex items-center gap-4 rounded-3xl border border-dashed border-gray-200 bg-white/60 p-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <p className="text-sm text-gray-400">يُرجى الترقية إلى "{locked.title}" لفتح وحداتها</p>
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
        <h3 className="text-2xl font-black text-[#3D1220]">{value}</h3>
        <p className="text-sm font-bold text-[#8C6F78]">{label}</p>
      </div>
    </div>
  );
}