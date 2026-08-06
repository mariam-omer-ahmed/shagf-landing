"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/queries/dashboard";
import { getHotLeads } from "@/lib/queries/hotLeads";
import { getLeadTemperature } from "@/lib/queries/leadScoring";
import { listSubmissionsForReview } from "@/lib/queries/submissions";
import Link from "next/link";
import {
  Users,
  ClipboardList,
  BookOpen,
  CreditCard,
  TrendingUp,
  MessageCircle,
  ArrowLeft,
  Layers,
  FileCheck2,
} from "lucide-react";

const INK = "#0B0608";
const INK_SOFT = "#5B4750";
const ACCENT = "#E96B8A";
const ACCENT_DEEP = "#7A1F3D";
const DARK = "#1A0A10";
const BORDER = "#F3D6E2";
const SURFACE = "#FDF2F6";
const FONT_FAMILY = "'Cairo', sans-serif";

// خطوات رحلة العميلة داخل شغف — من أول ظهورها كطلب تقييم، لحد ما تبقى
// طالبة فعلية بتتابع واجباتها. الترقيم هنا حقيقي: بيعكس تسلسل العملية
// الفعلي في المنصة، مش زخرفة.
const PIPELINE_STEPS = [
  {
    order: "01",
    href: "/admin/leads",
    icon: Users,
    title: "طلبات التقييم",
    body: "تابعي كل من أنهت اختبار المسار المهني، واعرفي أين تقف كل واحدة في رحلتها.",
  },
  {
    order: "02",
    href: "/admin/enrollments",
    icon: CreditCard,
    title: "تفعيل الاشتراكات",
    body: "راجعي طلبات الدفع الواردة، وفعّلي وصول العميلة إلى باقتها خلال دقائق.",
  },
  {
    order: "03",
    href: "/admin/resources",
    icon: BookOpen,
    title: "المصادر التعليمية",
    body: "أضيفي وحدّثي الملفات والمواد المساندة التي تعتمد عليها كل محاضرة.",
  },
  {
    order: "04",
    href: "/admin/modules",
    icon: Layers,
    title: "الوحدات التدريبية",
    body: "ابني مسار كل باقة بنفسك: وحدات ومحاضرات وواجبات بالترتيب الذي تختارينه.",
  },
  {
    order: "05",
    href: "/admin/submissions",
    icon: FileCheck2,
    title: "مراجعة الواجبات",
    body: "صحّحي تسليمات الطالبات، واتركي ملاحظاتك لتوجّه خطوتهن التالية.",
  },
] as const;

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({
    leads: 0,
    resources: 0,
    users: 0,
    todayLeads: 0,
    pendingEnrollments: 0,
    paidEnrollments: 0,
    conversionRate: 0,
    stages: {},
    packages: {},
  });

  const [hotLeads, setHotLeads] = useState<any[]>([]);
  const [pendingSubmissions, setPendingSubmissions] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const data = await getDashboardStats();
      const hot = await getHotLeads();
      const submissions = await listSubmissionsForReview();

      setStats(data);
      setHotLeads(hot);
      setPendingSubmissions(submissions.length);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main dir="rtl" className="min-h-screen px-6 py-12 sm:px-10" style={{ backgroundColor: SURFACE, color: INK, fontFamily: FONT_FAMILY }}>
      <div className="mx-auto max-w-7xl">
        {/* ============== HERO: ترحيب + المؤشر الأهم ============== */}
        <section
          className="relative overflow-hidden rounded-[32px] p-8 text-white sm:p-12"
          style={{ backgroundImage: `linear-gradient(135deg, ${DARK} 0%, ${ACCENT_DEEP} 130%)` }}
        >
          <p className="text-sm font-black text-white/70">أهلًا بكِ من جديد</p>
          <h1 className="mt-2 text-3xl font-black leading-[1.4] sm:text-4xl">
            هذا نبض شغف اليوم — بأرقام حقيقية، لا تقديرات
          </h1>
          <p className="mt-3 max-w-xl font-medium leading-7 text-white/80">
            كل قرار تتخذينه هنا يبني على ما تشاهدينه أمامك الآن. راجعي المؤشرات، وتحركي حيث يوجد الأثر الأكبر.
          </p>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-white/15 pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <TrendingUp size={26} />
              </div>
              <div>
                <p className="text-sm font-bold text-white/70">معدّل التحويل من اختبار المسار إلى اشتراك مدفوع</p>
                <p className="mt-1 text-5xl font-black">{stats.conversionRate}%</p>
              </div>
            </div>

            <p className="text-sm font-bold text-white/85">
              {stats.paidEnrollments} مشتركة مدفوعة من أصل {stats.leads} من أنهين الاختبار
            </p>
          </div>
        </section>

        {/* ============== الإحصاءات السريعة ============== */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard icon={<Users size={18} />} title="مستخدمات المنصة" value={stats.users} />
          <StatCard icon={<ClipboardList size={18} />} title="طلبات التقييم" value={stats.leads} />
          <StatCard icon={<ClipboardList size={18} />} title="طلبات اليوم" value={stats.todayLeads} />
          <StatCard icon={<BookOpen size={18} />} title="المصادر المتاحة" value={stats.resources} />
          <StatCard icon={<CreditCard size={18} />} title="دفعات بانتظار المراجعة" value={stats.pendingEnrollments} />
          <StatCard icon={<FileCheck2 size={18} />} title="واجبات بانتظار المراجعة" value={pendingSubmissions} highlight={pendingSubmissions > 0} />
        </section>

        {/* ============== رحلة العميلة داخل المنصة ============== */}
        <section className="mt-12">
          <p className="mb-1 text-sm font-black" style={{ color: ACCENT_DEEP }}>
            أدواتك، بترتيب رحلة العميلة الفعلي
          </p>
          <h2 className="text-2xl font-black" style={{ color: INK }}>
            من أول تقييم، إلى طالبة تسلّم واجباتها
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PIPELINE_STEPS.map((step) => {
              const Icon = step.icon;
              const isLast = step.order === "05";

              return (
                <Link
                  key={step.href}
                  href={step.href}
                  className={`group relative overflow-hidden rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                    isLast ? "lg:col-span-1" : ""
                  }`}
                  style={{ border: `1px solid ${BORDER}` }}
                >
                  {step.href === "/admin/submissions" && pendingSubmissions > 0 && (
                    <span
                      className="absolute left-5 top-5 flex h-7 min-w-[28px] items-center justify-center rounded-full px-2 text-xs font-black text-white"
                      style={{ backgroundColor: ACCENT_DEEP }}
                    >
                      {pendingSubmissions}
                    </span>
                  )}

                  <div className="flex items-start justify-between">
                    <span className="text-xs font-black" style={{ color: "#E3B8C7" }}>
                      {step.order}
                    </span>
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-2xl transition group-hover:scale-105"
                      style={{ backgroundColor: SURFACE, color: ACCENT_DEEP }}
                    >
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3 className="mt-5 text-xl font-black" style={{ color: INK }}>
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-7" style={{ color: INK_SOFT }}>
                    {step.body}
                  </p>

                  <div className="mt-5 flex items-center gap-1.5 text-sm font-bold" style={{ color: ACCENT_DEEP }}>
                    افتحي الصفحة
                    <ArrowLeft size={16} className="transition group-hover:-translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ============== تحليل رحلة العملاء والباقات ============== */}
        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h2 className="text-xl font-black" style={{ color: INK }}>أين تقف عميلاتك الآن؟</h2>
            <p className="mt-1 text-sm font-medium" style={{ color: INK_SOFT }}>
              توزيع كل من مررن بالمنصة على مراحل رحلتهن
            </p>

            <div className="mt-6 space-y-4">
              {Object.entries(stats.stages).length === 0 && (
                <p className="text-sm font-medium" style={{ color: INK_SOFT }}>لا توجد بيانات كافية بعد</p>
              )}
              {Object.entries(stats.stages).map(([key, value]: any) => {
                const total = Object.values(stats.stages).reduce((s: number, v: any) => s + Number(v), 0) || 1;
                const percent = Math.round((Number(value) / total) * 100);
                return (
                  <div key={key}>
                    <div className="mb-1.5 flex items-center justify-between text-sm font-bold" style={{ color: INK }}>
                      <span>{key}</span>
                      <span>{value}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: SURFACE }}>
                      <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: ACCENT }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h2 className="text-xl font-black" style={{ color: INK }}>أكثر الباقات طلبًا</h2>
            <p className="mt-1 text-sm font-medium" style={{ color: INK_SOFT }}>
              دليلك على أي باقة يستحق أن تراهني عليه في المحتوى القادم
            </p>

            <div className="mt-6 space-y-4">
              {Object.entries(stats.packages).length === 0 && (
                <p className="text-sm font-medium" style={{ color: INK_SOFT }}>لا توجد بيانات كافية بعد</p>
              )}
              {Object.entries(stats.packages).map(([key, value]: any) => {
                const total = Object.values(stats.packages).reduce((s: number, v: any) => s + Number(v), 0) || 1;
                const percent = Math.round((Number(value) / total) * 100);
                return (
                  <div key={key}>
                    <div className="mb-1.5 flex items-center justify-between text-sm font-bold" style={{ color: INK }}>
                      <span>{key}</span>
                      <span>{value}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: SURFACE }}>
                      <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: ACCENT_DEEP }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============== فرص تحتاج متابعة ============== */}
        <section className="mt-10 rounded-3xl bg-white p-8 shadow-sm" style={{ border: `1px solid ${BORDER}` }}>
          <h2 className="text-xl font-black" style={{ color: INK }}>عميلات لا يجب أن تنتظرن ردّك طويلًا</h2>
          <p className="mt-1 text-sm font-medium" style={{ color: INK_SOFT }}>
            الأعلى استعدادًا للاشتراك الآن — تواصلي معهن قبل أن يبرد الاهتمام
          </p>

          <div className="mt-6">
            {hotLeads.length === 0 ? (
              <p className="text-sm font-medium" style={{ color: INK_SOFT }}>لا توجد فرص بارزة حاليًا</p>
            ) : (
              <div className="divide-y" style={{ borderColor: BORDER }}>
                {hotLeads.map((lead) => {
                  const temperature = getLeadTemperature(lead.lead_score || 0);
                  const whatsappNumber = lead.whatsapp || lead.phone;

                  return (
                    <div key={lead.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="rounded-full px-3 py-1 text-xs font-black"
                          style={{ color: temperature.color, backgroundColor: temperature.bg }}
                        >
                          {temperature.label}
                        </span>

                        <div>
                          <p className="font-bold" style={{ color: INK }}>{lead.full_name}</p>
                          <p className="text-sm font-medium" style={{ color: INK_SOFT }}>
                            {lead.selected_package || "بلا باقة محددة"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className="rounded-xl px-4 py-2 font-black"
                          style={{ backgroundColor: SURFACE, color: ACCENT_DEEP }}
                        >
                          {lead.lead_score || 0}
                        </span>

                        {whatsappNumber && (
                          <a
                            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 font-bold text-white transition hover:bg-green-600"
                          >
                            <MessageCircle size={16} />
                            راسليها
                          </a>
                        )}

                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="rounded-xl px-4 py-2 font-bold text-white transition hover:opacity-90"
                          style={{ backgroundColor: ACCENT }}
                        >
                          التفاصيل
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5"
      style={{ border: `1px solid ${highlight ? ACCENT : BORDER}` }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: SURFACE, color: ACCENT_DEEP }}
        >
          {icon}
        </div>
        <p className="text-sm font-bold" style={{ color: INK_SOFT }}>
          {title}
        </p>
      </div>

      <h3 className="mt-4 text-4xl font-black" style={{ color: INK }}>
        {value}
      </h3>
    </div>
  );
}