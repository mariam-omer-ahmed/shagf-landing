"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  CheckCircle2,
  MessageCircle,
  Clock3,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

const packages: Record<
  string,
  {
    title: string;
    price: string;
  }
> = {
  bousola: {
    title: "باقة البوصلة",
    price: "15 دولار",
  },

  intilaqah: {
    title: "باقة الانطلاقة",
    price: "59 دولار",
  },

  tamkeen: {
    title: "باقة التمكين",
    price: "149 دولار",
  },
};

const WHATSAPP_NUMBER = "249963370737";

export default function ConfirmPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmContent />
    </Suspense>
  );
}

function ConfirmContent() {
  const searchParams = useSearchParams();

  const packageId =
    searchParams.get("package") ?? "intilaqah";

  const pkg =
    packages[packageId] ??
    packages.intilaqah;

  const name =
    searchParams.get("name") ??
    "عزيزي العميل";

  const whatsappMessage = `
مرحبًا،

أنا ${name}

أرغب في تأكيد انضمامي إلى ${pkg.title}

السعر: ${pkg.price}

وأريد معرفة الخطوة التالية.
`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#FFF8FB] via-white to-[#FFF8FB]"
    >
      <section className="py-20 px-6">

        <div className="mx-auto max-w-4xl">

          <div className="text-center">

            <div className="inline-flex items-center gap-3 rounded-full bg-green-50 px-6 py-3 text-green-700 font-bold">

              <CheckCircle2 size={20} />

              تم حجز مكانك مبدئيًا

            </div>

            <h1 className="mt-8 text-5xl font-black leading-tight text-gray-900">

              أحسنت.

              <br />

              لقد أنهيت أصعب خطوة.

            </h1>

            <p className="mt-8 text-xl leading-10 text-gray-600">

              أغلب الناس يصلون لهذه المرحلة...

              ثم يغلقون الصفحة...

              ويعودون لنفس الدائرة مرة أخرى.

              <br /><br />

              أما أنت فقد اتخذت خطوة فعلية نحو تغيير وضعك الحالي.

            </p>

          </div>

          <div className="mt-16 rounded-[34px] border border-pink-100 bg-white p-10 shadow-xl">

            <h2 className="text-3xl font-black text-[#E96B8A]">

              تفاصيل طلبك

            </h2>

            <div className="mt-10 space-y-5">

              <Info
                title="الباقة المختارة"
                value={pkg.title}
              />

              <Info
                title="قيمة الاستثمار"
                value={pkg.price}
              />

              <Info
                title="الحالة"
                value="بانتظار تأكيد التواصل"
              />

            </div>

          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <Card
              icon={<Clock3 size={28} />}
              title="خلال 24 ساعة"
              text="سيتم التواصل معك لمراجعة حالتك وتأكيد المسار المناسب."
            />

            <Card
              icon={<ShieldCheck size={28} />}
              title="مراجعة فردية"
              text="لن يتم إدخالك للنظام قبل التأكد أنه مناسب لوضعك."
            />

            <Card
              icon={<CheckCircle2 size={28} />}
              title="خطة واضحة"
              text="ستعرف بالضبط ما الذي يجب فعله بعد ذلك."
            />

          </div>

          <div className="mt-16 rounded-[34px] bg-[#111827] p-12 text-center text-white">

            <h3 className="text-3xl font-black">

              الخطوة الأخيرة

            </h3>

            <p className="mt-6 text-xl leading-10 text-gray-300">

              اضغط الزر أدناه الآن.

              <br />

              وأرسل رسالة التأكيد لفريق شغف.

            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-4 rounded-full bg-[#25D366] px-12 py-6 text-xl font-black text-white shadow-[0_25px_70px_rgba(37,211,102,.35)]"
            >
              <MessageCircle size={28} />

              تأكيد الطلب عبر واتساب

            </a>

          </div>

          <div className="mt-12 text-center text-gray-500">

            إذا أغلقت الصفحة الآن...

            سيبقى طلبك غير مكتمل.

          </div>

        </div>

      </section>
    </main>
  );
}

function Info({
  title,
  value,
}:{
  title:string;
  value:string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#FFF8FB] p-5">

      <span className="font-bold text-gray-600">
        {title}
      </span>

      <span className="font-black text-gray-900">
        {value}
      </span>

    </div>
  );
}

function Card({
  icon,
  title,
  text,
}:{
  icon: React.ReactNode;
  title:string;
  text:string;
}) {
  return (
    <div className="rounded-3xl bg-white border border-pink-100 p-8 text-center">

      <div className="flex justify-center text-[#E96B8A]">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-black">
        {title}
      </h3>

      <p className="mt-4 leading-8 text-gray-600">
        {text}
      </p>

    </div>
  );
}