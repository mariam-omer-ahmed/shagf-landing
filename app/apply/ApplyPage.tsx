"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  MapPin,
  Phone,
  User,
  Target,
  ArrowLeft,
} from "lucide-react";

const packages: Record<
  string,
  { title: string; price: string; desc: string }
> = {
  bousola: {
    title: "باقة البوصلة",
    price: "9 دولار",
    desc: "تحديد الاتجاه الصحيح قبل الدخول في أي مسار خاطئ.",
  },
  intilaqah: {
    title: "باقة الانطلاقة",
    price: "39 دولار",
    desc: "تحويل مهارتك إلى فرصة حقيقية (وظيفة أو دخل حر).",
  },
  tamkeen: {
    title: "باقة التمكين",
    price: "99 دولار",
    desc: "بناء حضور احترافي يجعلك مطلوب في السوق.",
  },
};

const DEFAULT_PACKAGE_ID = "intilaqah";

export default function ApplyPage() {
  return (
    <Suspense fallback={null}>
      <ApplyPageContent />
    </Suspense>
  );
}

function ApplyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedId = searchParams.get("package");

  const packageId =
    requestedId && packages[requestedId]
      ? requestedId
      : DEFAULT_PACKAGE_ID;

  const pkg = packages[packageId];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    country: "",
    goal: "",
    attend: "no",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.country) {
      setError("رجاءً أكمل البيانات الأساسية");
      return;
    }

    setError("");
    setLoading(true);

    router.push(`/confirm?package=${packageId}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF8FB] via-white to-[#FFF8FB] px-4 py-16 text-right">
      <div className="mx-auto max-w-2xl">

        {/* HEADER */}
        <div className="flex items-center gap-2 text-[#E96B8A] mb-6">
          <CheckCircle2 size={18} />
          <span className="text-sm font-semibold">
            تم تحديد المسار الأنسب لك
          </span>
        </div>

        {/* CARD */}
        <div className="rounded-[36px] border border-pink-100 bg-white shadow-[0_40px_120px_rgba(0,0,0,0.08)] p-10">

          {/* TITLE */}
          <h1 className="text-4xl font-black text-gray-900 leading-[1.3]">
            خطوة واحدة فقط تفصلك عن البداية
          </h1>

          <p className="mt-4 text-gray-600 leading-7">
            أكمل بياناتك للانتقال إلى صفحة التأكيد.
          </p>

          {/* PACKAGE */}
          <div className="mt-8 rounded-2xl border border-pink-100 bg-pink-50 p-6">
            <div className="text-2xl font-black text-gray-900">
              {pkg.title}
            </div>
            <div className="text-[#E96B8A] font-bold mt-1">
              {pkg.price}
            </div>
            <div className="text-gray-700 mt-3 leading-7">
              {pkg.desc}
            </div>
          </div>

          {/* FORM */}
          <div className="mt-10 space-y-4">

            <Input
              icon={<User size={18} />}
              placeholder="الاسم الكامل"
              value={form.name}
              onChange={(e: any) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <Input
              icon={<Phone size={18} />}
              placeholder="رقم الهاتف"
              value={form.phone}
              onChange={(e: any) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <Input
              icon={<MapPin size={18} />}
              placeholder="الدولة"
              value={form.country}
              onChange={(e: any) =>
                setForm({ ...form, country: e.target.value })
              }
            />

            <Textarea
              icon={<Target size={18} />}
              placeholder="ما الهدف الذي تريد تحقيقه؟"
              value={form.goal}
              onChange={(e: any) =>
                setForm({ ...form, goal: e.target.value })
              }
            />

            <select
              className="w-full rounded-2xl border border-gray-200 px-4 py-4 text-gray-900"
              value={form.attend}
              onChange={(e) =>
                setForm({ ...form, attend: e.target.value })
              }
            >
              <option value="no">لا أرغب بالحضور</option>
              <option value="yes">نعم أرغب بالحضور</option>
            </select>

            {error && (
              <p className="text-sm font-bold text-red-500">
                {error}
              </p>
            )}
          </div>

          {/* INFO */}
          <div className="mt-10 rounded-3xl border border-gray-100 bg-gray-50 p-6">
            <div className="font-black text-gray-900 mb-3">
              طبيعة البرنامج
            </div>

            <p className="text-gray-700 leading-7">
              البرنامج أونلاين بشكل أساسي، وقد تتوفر جلسات حضورية اختيارية
              في مراحل متقدمة حسب الباقة.
            </p>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-700">
              <span>الرياض 🇸🇦</span>
              <span>القاهرة 🇪🇬</span>
              <span>الخرطوم 🇸🇩</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-10 w-full rounded-full bg-[#E96B8A] py-4 font-bold text-white shadow-[0_20px_60px_rgba(233,107,138,0.35)] hover:scale-[1.02] transition disabled:opacity-60"
          >
            {loading ? "جاري التحويل..." : "متابعة إلى التأكيد"}
            <ArrowLeft size={18} />
          </button>

        </div>
      </div>
    </main>
  );
}

/* COMPONENTS */
function Input({ icon, ...props }: any) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-4 bg-white">
      <span className="text-gray-500">{icon}</span>
      <input {...props} className="w-full outline-none text-gray-900" />
    </div>
  );
}

function Textarea({ icon, ...props }: any) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gray-200 px-4 py-4 bg-white">
      <span className="text-gray-500 mt-1">{icon}</span>
      <textarea
        {...props}
        className="w-full outline-none text-gray-900 min-h-[90px]"
      />
    </div>
  );
}