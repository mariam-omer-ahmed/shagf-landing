"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

import {
  CheckCircle2,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Loader2,
} from "lucide-react";

const PACKAGES: Record<
  string,
  {
    title: string;
    price: string;
    desc: string;
  }
> = {
  bousola: {
    title: "باقة البوصلة",
    price: "15 دولار",
    desc: "تحديد الاتجاه الصحيح قبل الدخول في أي مسار خاطئ.",
  },

  intilaqah: {
    title: "باقة الانطلاقة",
    price: "59 دولار",
    desc: "تحويل المهارة إلى فرصة حقيقية.",
  },

  tamkeen: {
    title: "باقة التمكين",
    price: "149 دولار",
    desc: "برنامج متكامل لبناء مسار مهني قوي.",
  },
};

export default function ApplyPage() {
  return (
    <Suspense fallback={null}>
      <ApplyContent />
    </Suspense>
  );
}

function ApplyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const packageParam = searchParams.get("package");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [profile, setProfile] = useState<any>(null);
  const [lead, setLead] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

 async function loadData() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    const userId = session.user.id;

    const { data: profileData, error: profileError } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

    if (profileError) {
      console.error("PROFILE ERROR:", profileError);
    }

    const { data: leadData, error: leadError } =
      await supabase
        .from("shaghaf_leads")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

    if (leadError) {
      console.error("LEAD ERROR:", leadError);
    }

    const {
      data: existingEnrollment,
      error: enrollmentCheckError,
    } = await supabase
      .from("enrollments")
      .select("id,status")
      .eq("user_id", userId)
      .in("status", ["pending", "active"])
      .limit(1)
      .maybeSingle();

    if (enrollmentCheckError) {
      console.error(
        "ENROLLMENT CHECK ERROR:",
        enrollmentCheckError
      );
    }

    if (existingEnrollment) {
      router.push("/application-pending");
      return;
    }

    setProfile(profileData);
    setLead(leadData);
  } catch (error) {
    console.error("LOAD DATA ERROR:", error);
  } finally {
    setLoading(false);
  }
}
  async function handleSubmit() {
  try {
    setSubmitting(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    const userId = session.user.id;

    const packageName =
      lead?.selected_package ||
      packageParam ||
      "intilaqah";

    console.log("=== APPLY DEBUG ===");
    console.log("USER:", userId);
    console.log("LEAD:", lead);
    console.log("PACKAGE:", packageName);

    const insertPayload = {
      user_id: userId,
      lead_id: lead?.id || null,
      package_name: packageName,
      status: "pending",
      payment_status: "unpaid",
    };

    console.log("INSERT:", insertPayload);

    const { data, error: enrollmentError } =
      await supabase
        .from("enrollments")
        .insert(insertPayload)
        .select();

    if (enrollmentError) {
      console.error(
        "ENROLLMENT ERROR:",
        enrollmentError
      );

      alert(`
Message: ${enrollmentError.message}

Code: ${enrollmentError.code}

Details: ${enrollmentError.details}

Hint: ${enrollmentError.hint}
      `);

      throw enrollmentError;
    }

    console.log("ENROLLMENT CREATED:", data);

    if (lead?.id) {
      const { error: leadUpdateError } =
        await supabase
          .from("shaghaf_leads")
          .update({
            enrollment_status: "pending",
            converted_at:
              new Date().toISOString(),
          })
          .eq("id", lead.id);

      if (leadUpdateError) {
        console.error(
          "LEAD UPDATE ERROR:",
          leadUpdateError
        );
      }
    }

    router.push("/application-pending");
  } catch (error) {
    console.error("SUBMIT ERROR:", error);

    alert(
      "حدث خطأ أثناء إرسال الطلب. افتحي Console وشوفي الخطأ الكامل."
    );
  } finally {
    setSubmitting(false);
  }
}
  const packageId =
    lead?.selected_package ||
    packageParam ||
    "intilaqah";

  const pkg =
    PACKAGES[packageId] ??
    PACKAGES["intilaqah"];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF8FB] via-white to-[#FFF8FB] px-4 py-16">

      <div className="mx-auto max-w-3xl">

        <div className="mb-6 flex items-center gap-2 text-[#E96B8A]">

          <CheckCircle2 size={18} />

          <span className="text-sm font-bold">
            تم تحديد الباقة الأنسب لك
          </span>

        </div>

        <div className="rounded-[36px] border border-pink-100 bg-white p-10 shadow-xl">

          <h1 className="text-4xl font-black text-gray-900">
            أنت على بعد خطوة واحدة من البدء
          </h1>

          <p className="mt-4 leading-8 text-gray-600">
            قمنا بتحليل إجاباتك وتحديد الباقة الأنسب
            لتحقيق هدفك بأسرع طريق ممكن.
          </p>

          <div className="mt-8 rounded-3xl border border-pink-100 bg-pink-50 p-8">

            <h2 className="text-3xl font-black text-gray-900">
              {pkg.title}
            </h2>

            <div className="mt-3 text-xl font-bold text-[#E96B8A]">
              {pkg.price}
            </div>

            <p className="mt-4 leading-8 text-gray-700">
              {pkg.desc}
            </p>

          </div>

          <div className="mt-10">

            <h3 className="mb-5 text-xl font-black text-gray-900">
              بيانات الحساب
            </h3>

            <div className="space-y-4">

              <InfoRow
                icon={<User size={18} />}
                label="الاسم"
                value={profile?.full_name || "-"}
              />

              <InfoRow
                icon={<Phone size={18} />}
                label="رقم الواتساب"
                value={profile?.whatsapp || "-"}
              />

              <InfoRow
                icon={<MapPin size={18} />}
                label="الموقع"
                value={`${profile?.country || "-"} - ${
                  profile?.city || "-"
                }`}
              />

            </div>

          </div>

          <div className="mt-10 rounded-3xl bg-gray-50 p-6">

            <h3 className="font-black text-gray-900">
              ماذا يحدث بعد الضغط على تأكيد الانضمام؟
            </h3>

            <div className="mt-5 space-y-3 text-gray-700">

              <p>✓ تسجيل طلب الانضمام.</p>

              <p>✓ مراجعة الطلب بواسطة فريق شغف.</p>

              <p>✓ تفعيل اشتراكك.</p>

              <p>✓ فتح المحتوى التدريبي الخاص بالباقة.</p>

            </div>

          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-10 flex w-full items-center justify-center gap-3 rounded-full bg-[#E96B8A] py-5 font-bold text-white transition"
          >

            {submitting ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                جاري إرسال الطلب...
              </>
            ) : (
              <>
                تأكيد الانضمام للباقة
                <ArrowLeft size={18} />
              </>
            )}

          </button>

        </div>

      </div>

    </main>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5">

      <div className="text-[#E96B8A]">
        {icon}
      </div>

      <div>
        <div className="text-sm text-gray-500">
          {label}
        </div>

        <div className="font-bold text-gray-900">
          {value}
        </div>
      </div>

    </div>
  );
}