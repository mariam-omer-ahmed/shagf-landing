"use client";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
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

export default function ApplyPage() {
  const searchParams = useSearchParams();

  const packageId = searchParams.get("package") || "intilaqah";
  const pkg = packages[packageId];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    country: "",
    goal: "",
    attend: "no",
  });

  const WHATSAPP_NUMBER = "00249963370737";

  const handleSubmit = async () => {
  const message = `
🔥 طلب تسجيل جديد - نظام شغف

📦 الباقة: ${pkg.title} (${pkg.price})

👤 الاسم: ${form.name}
📞 الهاتف: ${form.phone}
🌍 الدولة: ${form.country}
🎯 الهدف: ${form.goal}
🏛️ حضور: ${form.attend}

📍 جلسات حضورية محتملة:
الرياض 🇸🇦 | القاهرة (الدقي) 🇪🇬 | الخرطوم 🇸🇩
`;

  // 1️⃣ حفظ في قاعدة البيانات (Supabase)
  const { error } = await supabase.from("applications").insert([
    {
      name: form.name,
      phone: form.phone,
      country: form.country,
      goal: form.goal,
      attend: form.attend,
      package_id: packageId,
      package_title: pkg.title,
      price: pkg.price,
    },
  ]);

  if (error) {
    console.log("Supabase Error:", error.message);
  }

  // 2️⃣ فتح واتساب
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;

  window.open(url, "_blank");
};

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF8FB] via-white to-[#FFF8FB] px-4 py-16 text-right">

      <div className="mx-auto max-w-2xl">

        {/* TOP BADGE */}
        <div className="flex items-center gap-2 text-[#E96B8A] mb-6">
          <CheckCircle2 size={18} />
          <span className="text-sm font-semibold">
            تم تحليل وضعك واختيار المسار الأنسب
          </span>
        </div>

        {/* MAIN CARD */}
        <div className="rounded-[36px] border border-pink-100 bg-white shadow-[0_40px_120px_rgba(0,0,0,0.08)] p-10">

          {/* TITLE */}
          <h1 className="text-4xl font-black text-gray-900 leading-[1.3]">
            أنت الآن خطوة واحدة فقط
            <br />
            من بداية التحول الحقيقي
          </h1>

          <p className="mt-4 text-gray-600 leading-7">
            لا تحتاج قرار كبير… فقط إكمال بياناتك للبدء في المسار المناسب لك.
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

            <Input icon={<User size={18} />} placeholder="الاسم الكامل"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <Input icon={<Phone size={18} />} placeholder="رقم الهاتف"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <Input icon={<MapPin size={18} />} placeholder="الدولة"
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />

            <Textarea icon={<Target size={18} />} placeholder="ما الهدف الذي تريد تحقيقه؟"
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
            />

            <select
              className="w-full rounded-2xl border border-gray-200 px-4 py-4 text-gray-900 focus:border-[#E96B8A] outline-none"
              onChange={(e) =>
                setForm({ ...form, attend: e.target.value })
              }
            >
              <option value="no">لا أرغب بالحضور</option>
              <option value="yes">نعم أرغب بالحضور إن توفر</option>
            </select>
          </div>

         {/* INFO */}
<div className="mt-10 rounded-3xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm">

  {/* header */}
  <div className="flex items-center gap-2 mb-4">
    <div className="h-2 w-2 rounded-full bg-[#E96B8A]" />
    <div className="font-black text-gray-900">
      طبيعة البرنامج
    </div>
  </div>

  {/* body */}
  <p className="text-gray-700 leading-8">
    البرنامج يتم تقديمه بشكل أساسي <span className="font-semibold text-gray-900">عن بُعد (Online)</span> لضمان المرونة والوصول من أي مكان.  
    <br />
    <br />
    وفي بعض المراحل المتقدمة، قد تتوفر <span className="font-semibold text-gray-900">جلسات حضورية اختيارية</span> للراغبين في التجربة العملية المباشرة.
  </p>

  {/* locations */}
  <div className="mt-6 flex flex-wrap gap-3">

    <span className="px-4 py-2 rounded-full bg-white border border-gray-100 text-sm text-gray-700">
السعودية، الرياض    </span>

    <span className="px-4 py-2 rounded-full bg-white border border-gray-100 text-sm text-gray-700">
القاهرة، الدقي    </span>

    <span className="px-4 py-2 rounded-full bg-white border border-gray-100 text-sm text-gray-700">
       السودان،الخرطوم
    </span>

  </div>

  {/* footer note */}
  <p className="mt-5 text-xs text-gray-500 leading-6">
    يتم تحديد إمكانية الحضور حسب الباقة والمرحلة بعد مراجعة الطلب.
  </p>

</div>
          {/* CTA */}
          <button
            onClick={handleSubmit}
            className="mt-10 w-full rounded-full bg-[#E96B8A] py-4 font-bold text-white shadow-[0_20px_60px_rgba(233,107,138,0.35)] hover:scale-[1.02] transition flex items-center justify-center gap-2"
          >
            إرسال الطلب عبر واتساب
            <ArrowLeft size={18} />
          </button>

        </div>
      </div>
    </main>
  );
}

/* UI COMPONENTS */
function Input({ icon, ...props }: any) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-4 focus-within:border-[#E96B8A] bg-white">
      <span className="text-gray-500">{icon}</span>
      <input
        {...props}
        className="w-full outline-none text-gray-900"
      />
    </div>
  );
}

function Textarea({ icon, ...props }: any) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gray-200 px-4 py-4 focus-within:border-[#E96B8A] bg-white">
      <span className="text-gray-500 mt-1">{icon}</span>
      <textarea
        {...props}
        className="w-full outline-none text-gray-900 min-h-[90px]"
      />
    </div>
  );
}