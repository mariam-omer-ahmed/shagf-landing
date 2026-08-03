"use client";

import { Fragment, useEffect, useState } from "react";
import {
  getEnrollments,
  getPackagesList,
  setEnrollmentPackage,
  setRoadmapStage,
} from "@/lib/queries/enrollments";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  Search,
  User,
  Package,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";

type Lead = {
  id: string;
  created_at?: string;
  full_name?: string;
  whatsapp?: string;
  phone?: string;
  email?: string;
  country?: string;
  city?: string;
  age_range?: string;
  goal?: string;
  current_status?: string;
  skills?: string;
  interviews_count?: number;
  source?: string;
  source_channel?: string;
  selected_package?: string;
  readiness?: string;
  lead_stage?: string;
  lead_score?: number;
  urgency_score?: number;
  start_timeframe?: string;
  budget_range?: string;
  main_obstacle?: string;
  enrollment_status?: string;
  converted_at?: string;
  last_activity_at?: string;
};

type Enrollment = {
  id: string;
  user_id: string;
  lead_id: string | null;
  package_id: string | null;
  packages: { id: string; title: string } | null;
  status: string;
  payment_status: string;
  created_at: string;
  roadmap_stage: number;
  lead: Lead | null;
};

const ROADMAP_STEPS = [
  "تحديد المسار",
  "بناء المهارة",
  "المشروع العملي",
  "بناء الملف المهني",
  "الحصول على الفرصة",
];

type PackageOption = { id: string; title: string };

function formatDate(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("ar-SA");
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [savingPackageId, setSavingPackageId] = useState<string | null>(null);
  const [savingStageId, setSavingStageId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadEnrollments();
  }, []);

  async function loadEnrollments() {
    console.log("START LOADING ENROLLMENTS");

    try {
      const [data, packagesData] = await Promise.all([
        getEnrollments(),
        getPackagesList(),
      ]);

      console.log("ENROLLMENTS DATA:", data);

      setEnrollments(data as Enrollment[]);
      setPackages(packagesData);
    } catch (error) {
      console.log("LOAD ENROLLMENTS ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  async function activateEnrollment(id: string) {
    setUpdatingId(id);

    const { error } = await supabase
      .from("enrollments")
      .update({
        status: "active",
        payment_status: "paid",
      })
      .eq("id", id);

    if (error) {
      console.log("ACTIVATE ENROLLMENT ERROR:", error);
      alert("صار خطأ أثناء التفعيل، افتحي Console وشوفي التفاصيل.");
      setUpdatingId(null);
      return;
    }

    setEnrollments((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: "active", payment_status: "paid" }
          : e
      )
    );

    setUpdatingId(null);
  }

  async function handlePackageChange(enrollmentId: string, packageId: string) {
    if (!packageId) return;

    setSavingPackageId(enrollmentId);
    try {
      await setEnrollmentPackage(enrollmentId, packageId);

      const selectedPackage = packages.find((p) => p.id === packageId) || null;

      setEnrollments((prev) =>
        prev.map((e) =>
          e.id === enrollmentId
            ? { ...e, package_id: packageId, packages: selectedPackage }
            : e
        )
      );
    } catch (error) {
      console.log("SET ENROLLMENT PACKAGE ERROR:", error);
      alert("تعذّر حفظ الباقة، افتحي Console وشوفي التفاصيل.");
    } finally {
      setSavingPackageId(null);
    }
  }

  async function handleStageChange(userId: string, enrollmentId: string, stage: number) {
    setSavingStageId(enrollmentId);
    try {
      await setRoadmapStage(userId, stage);
      setEnrollments((prev) =>
        prev.map((e) =>
          e.id === enrollmentId ? { ...e, roadmap_stage: stage } : e
        )
      );
    } catch (error) {
      console.log("SET ROADMAP STAGE ERROR:", error);
      alert("تعذّر تحديث المرحلة، افتحي Console وشوفي التفاصيل.");
    } finally {
      setSavingStageId(null);
    }
  }

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const text = `
      ${enrollment.lead?.full_name || ""}
      ${enrollment.lead?.email || ""}
      ${enrollment.lead?.phone || ""}
      ${enrollment.lead?.whatsapp || ""}
      ${enrollment.lead?.goal || ""}
      ${enrollment.packages?.title || ""}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center font-bold text-black">
        جاري تحميل طلبات الدفع...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-8 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black">طلبات الدفع</h1>

          <p className="mt-2 text-black">
            الأشخاص اللي اختارو باقة وضغطو "تأكيد الانضمام" — اضغطي على أي
            صف لعرض كل بيانات الكويز اللي أدخلها الشخص
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3">
          <Search size={20} />

          <input
            placeholder="بحث بالاسم، الإيميل، الجوال، الهدف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-black outline-none"
          />
        </div>
      </div>

      <div className="mt-10 overflow-x-auto rounded-3xl bg-white shadow-sm">
        <table className="w-full text-right">
          <thead className="bg-[#FFF4F8]">
            <tr>
              <th className="p-5"></th>
              <th className="p-5">العميل</th>
              <th className="p-5">الباقة</th>
              <th className="p-5">حالة الطلب</th>
              <th className="p-5">حالة الدفع</th>
              <th className="p-5">المرحلة الحالية</th>
              <th className="p-5">التاريخ</th>
              <th className="p-5">إجراء</th>
            </tr>
          </thead>

          <tbody>
            {filteredEnrollments.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">
                  لا توجد طلبات دفع حالياً
                </td>
              </tr>
            ) : (
              filteredEnrollments.map((enrollment) => {
                const isOpen = expandedId === enrollment.id;
                const lead = enrollment.lead;

                return (
                  <Fragment key={enrollment.id}>
                    <tr
                      onClick={() =>
                        setExpandedId(isOpen ? null : enrollment.id)
                      }
                      className="cursor-pointer border-t hover:bg-[#FFFBFC]"
                    >
                      <td className="p-5 text-gray-400">
                        {isOpen ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </td>

                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <User className="text-[#E96B8A]" />

                          <div>
                            <p className="font-bold">
                              {lead?.full_name || "غير معروف"}
                            </p>

                            <p className="text-sm">{lead?.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-5" onClick={(e) => e.stopPropagation()}>
                        {enrollment.packages?.title ? (
                          <div className="flex items-center gap-2">
                            <Package size={18} className="text-[#E96B8A]" />
                            {enrollment.packages.title}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertTriangle size={16} className="shrink-0 text-red-500" />
                            <select
                              defaultValue=""
                              disabled={savingPackageId === enrollment.id}
                              onChange={(e) =>
                                handlePackageChange(enrollment.id, e.target.value)
                              }
                              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-600 outline-none disabled:opacity-60"
                            >
                              <option value="" disabled>
                                {savingPackageId === enrollment.id
                                  ? "جارٍ الحفظ..."
                                  : "بدون باقة — اختاري واحدة"}
                              </option>
                              {packages.map((pkg) => (
                                <option key={pkg.id} value={pkg.id}>
                                  {pkg.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </td>

                      <td className="p-5">
                        <span
                          className={`rounded-xl px-3 py-1.5 text-sm font-bold ${
                            enrollment.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-[#FFF4F8] text-[#E96B8A]"
                          }`}
                        >
                          {enrollment.status === "active"
                            ? "مفعّل"
                            : "بانتظار المراجعة"}
                        </span>
                      </td>

                      <td className="p-5">
                        <span
                          className={`rounded-xl px-3 py-1.5 text-sm font-bold ${
                            enrollment.payment_status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {enrollment.payment_status === "paid"
                            ? "مدفوع"
                            : "غير مدفوع"}
                        </span>
                      </td>

                      <td className="p-5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs font-bold text-gray-500">
                            {ROADMAP_STEPS[enrollment.roadmap_stage - 1] ||
                              "غير محدد"}
                          </span>
                          <div className="flex gap-1">
                            {ROADMAP_STEPS.map((step, idx) => {
                              const stageNumber = idx + 1;
                              const isActive =
                                stageNumber === enrollment.roadmap_stage;
                              const isSaving = savingStageId === enrollment.id;

                              return (
                                <button
                                  key={stageNumber}
                                  disabled={isSaving}
                                  title={step}
                                  onClick={() =>
                                    handleStageChange(
                                      enrollment.user_id,
                                      enrollment.id,
                                      stageNumber
                                    )
                                  }
                                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black transition disabled:opacity-50 ${
                                    isActive
                                      ? "bg-[#E96B8A] text-white"
                                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                  }`}
                                >
                                  {stageNumber}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </td>

                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          {formatDate(enrollment.created_at)}
                        </div>
                      </td>

                      <td className="p-5">
                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {enrollment.lead_id && (
                            <Link
                              href={`/admin/leads/${enrollment.lead_id}`}
                              className="rounded-xl border bg-white px-4 py-3 font-bold text-gray-700"
                            >
                              فتح الملف
                            </Link>
                          )}

                          {enrollment.status !== "active" && (
                            <button
                              onClick={() =>
                                activateEnrollment(enrollment.id)
                              }
                              disabled={updatingId === enrollment.id}
                              className="flex items-center gap-2 rounded-xl bg-[#E96B8A] px-4 py-3 font-bold text-white disabled:opacity-60"
                            >
                              <CheckCircle2 size={16} />
                              {updatingId === enrollment.id
                                ? "جاري التفعيل..."
                                : "تفعيل"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {isOpen && (
                      <tr className="border-t bg-[#FFFBFC]">
                        <td colSpan={8} className="p-6">
                          <div className="grid gap-6 lg:grid-cols-3">
                            <DetailGroup title="بيانات التواصل">
                              <DetailRow label="الاسم الكامل" value={lead?.full_name} />
                              <DetailRow label="رقم الجوال" value={lead?.phone} />
                              <DetailRow label="واتساب" value={lead?.whatsapp} />
                              <DetailRow label="الإيميل" value={lead?.email} />
                              <DetailRow label="الدولة" value={lead?.country} />
                              <DetailRow label="المدينة" value={lead?.city} />
                              <DetailRow label="الفئة العمرية" value={lead?.age_range} />
                            </DetailGroup>

                            <DetailGroup title="إجابات الكويز">
                              <DetailRow label="الهدف" value={lead?.goal} />
                              <DetailRow label="الوضع الحالي" value={lead?.current_status} />
                              <DetailRow label="المهارات" value={lead?.skills} />
                              <DetailRow
                                label="عدد المقابلات"
                                value={
                                  lead?.interviews_count !== undefined
                                    ? String(lead?.interviews_count)
                                    : undefined
                                }
                              />
                              <DetailRow label="العائق الرئيسي" value={lead?.main_obstacle} />
                              <DetailRow label="الميزانية المتاحة" value={lead?.budget_range} />
                              <DetailRow label="متى يبدأ" value={lead?.start_timeframe} />
                              <DetailRow label="مصدر الوصول" value={lead?.source} />
                              <DetailRow label="قناة الوصول" value={lead?.source_channel} />
                            </DetailGroup>

                            <DetailGroup title="التقييم والمتابعة">
                              <DetailRow label="درجة الجاهزية" value={lead?.readiness} />
                              <DetailRow
                                label="Lead Score"
                                value={
                                  lead?.lead_score !== undefined
                                    ? String(lead?.lead_score)
                                    : undefined
                                }
                              />
                              <DetailRow
                                label="درجة الإلحاح"
                                value={
                                  lead?.urgency_score !== undefined
                                    ? String(lead?.urgency_score)
                                    : undefined
                                }
                              />
                              <DetailRow label="مرحلة العميل" value={lead?.lead_stage} />
                              <DetailRow label="حالة التحويل" value={lead?.enrollment_status} />
                              <DetailRow label="تاريخ التحويل" value={formatDate(lead?.converted_at)} />
                              <DetailRow label="آخر نشاط" value={formatDate(lead?.last_activity_at)} />
                              <DetailRow label="تاريخ التسجيل بالكويز" value={formatDate(lead?.created_at)} />
                            </DetailGroup>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function DetailGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-5">
      <h3 className="mb-4 font-black text-[#E96B8A]">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-left text-sm font-bold text-gray-900">
        {value || "-"}
      </span>
    </div>
  );
}