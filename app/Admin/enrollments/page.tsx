"use client";

import { Fragment, useEffect, useState } from "react";
import { getEnrollments } from "@/lib/queries/enrollments";
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
  package_name: string;
  status: string;
  payment_status: string;
  created_at: string;
  lead: Lead | null;
};

const PACKAGE_LABELS: Record<string, string> = {
  bousola: "باقة البوصلة",
  intilaqah: "باقة الانطلاقة",
  tamkeen: "باقة التمكين",
};

function formatDate(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("ar-SA");
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadEnrollments();
  }, []);

  async function loadEnrollments() {
    console.log("START LOADING ENROLLMENTS");

    try {
      const data = await getEnrollments();

      console.log("ENROLLMENTS DATA:", data);

      setEnrollments(data as Enrollment[]);
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

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const text = `
      ${enrollment.lead?.full_name || ""}
      ${enrollment.lead?.email || ""}
      ${enrollment.lead?.phone || ""}
      ${enrollment.lead?.whatsapp || ""}
      ${enrollment.lead?.goal || ""}
      ${enrollment.package_name || ""}
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
              <th className="p-5">التاريخ</th>
              <th className="p-5">إجراء</th>
            </tr>
          </thead>

          <tbody>
            {filteredEnrollments.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
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

                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <Package size={18} />
                          {PACKAGE_LABELS[enrollment.package_name] ||
                            enrollment.package_name}
                        </div>
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
                        <td colSpan={7} className="p-6">
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