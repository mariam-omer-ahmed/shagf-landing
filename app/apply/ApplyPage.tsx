"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ArrowLeft,
  User,
  Phone,
  MapPin,
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
    desc: "بناء حضور احترافي يجعلك مطلوباً في السوق.",
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

  const [loading, setLoading] = useState(false);

  /*
   مؤقتاً
   لاحقاً اجلبها من Supabase
  */
  const profile = {
    name: "اسم المستخدم",
    phone: "+966xxxxxxxxx",
    country: "السعودية",
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      /*
      هنا لاحقاً:

      await supabase
        .from("applications")
        .insert({
          package_id: packageId,
          user_id: user.id,
          status: "pending",
        });
      */

      router.push(`/thank-you?package=${packageId}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF8FB] via-white to-[#FFF8FB] px-4 py-16">

      <div className="mx-auto max-w-2xl">

        <div className="mb-6 flex items-center gap-2 text-[#E96B8A]">

          <CheckCircle2 size={18} />

          <span className="text-sm font-semibold">
            تم تحديد الباقة الأنسب لك
          </span>

        </div>

        <div className="rounded-[36px] border border-pink-100 bg-white p-10 shadow-[0_40px_120px_rgba(0,0,0,0.08)]">

          <h1 className="text-4xl font-black leading-[1.4] text-gray-900">

            أنت على بعد خطوة واحدة من البدء

          </h1>

          <p className="mt-4 text-gray-600 leading-8">

            بناءً على نتائج التحليل، نوصي لك بالباقة التالية.

          </p>

          <div className="mt-8 rounded-3xl border border-pink-100 bg-pink-50 p-6">

            <h2 className="text-2xl font-black text-gray-900">
              {pkg.title}
            </h2>

            <div className="mt-2 text-lg font-bold text-[#E96B8A]">
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
                value={profile.name}
              />

              <InfoRow
                icon={<Phone size={18} />}
                label="رقم الهاتف"
                value={profile.phone}
              />

              <InfoRow
                icon={<MapPin size={18} />}
                label="الدولة"
                value={profile.country}
              />

            </div>

          </div>

          <div className="mt-10 rounded-3xl border border-gray-100 bg-gray-50 p-6">

            <h3 className="font-black text-gray-900">
              ماذا سيحدث بعد التأكيد؟
            </h3>

            <div className="mt-5 space-y-3 text-gray-700">

              <p>✓ تسجيل طلب الانضمام للباقة.</p>

              <p>✓ مراجعة حالتك بواسطة فريق شغف.</p>

              <p>✓ التواصل معك لتحديد الخطوة التالية.</p>

              <p>✓ بدء تنفيذ الخطة المناسبة لك.</p>

            </div>

          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-10 flex w-full items-center justify-center gap-3 rounded-full bg-[#E96B8A] py-5 font-bold text-white shadow-[0_20px_60px_rgba(233,107,138,.35)] transition hover:scale-[1.02]"
          >

            {loading
              ? "جاري تأكيد الطلب..."
              : "تأكيد الانضمام للباقة"}

            <ArrowLeft size={18} />

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