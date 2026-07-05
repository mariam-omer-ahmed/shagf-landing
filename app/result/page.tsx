"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ResultPage() {
  return (
    <section
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFF8FB] via-white to-[#FFF8FB] py-24"
      style={{
        fontFamily: "'Cairo','IBM Plex Sans Arabic','Tajawal',sans-serif",
      }}
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#E96B8A]/10 blur-[150px]" />
        <div className="absolute -right-44 bottom-0 h-[450px] w-[450px] rounded-full bg-pink-200/20 blur-[150px]" />
        <div className="absolute -left-44 top-1/3 h-[380px] w-[380px] rounded-full bg-[#FFD6E3]/30 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 text-center">

        {/* BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-10 inline-flex items-center gap-2 rounded-full border border-[#F3B6C8] bg-white px-6 py-3 shadow-lg shadow-pink-100"
        >
          <Sparkles size={18} className="text-[#E96B8A]" />
          <span className="text-lg font-bold text-[#151827]">
            نظام شغف لبناء التحول المهني الحقيقي
          </span>
        </motion.div>

        {/* HERO (HIGH TICKET HOOK) */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black leading-[1.6] text-[#0F172A] md:text-6xl"
        >
          أنت لا تحتاج المزيد من التعلم…
          <br />
          <span className="text-[#E96B8A]">
            أنت تحتاج إلى أول خطوة صحيحة في الطريق الصحيح
          </span>
        </motion.h1>

        <p className="mx-auto mt-8 max-w-3xl text-xl leading-[2] text-gray-700 font-medium">
          أغلب الشباب لا يفشلون لأنهم لا يتعلمون…  
          بل لأنهم يتعلمون بدون اتجاه واضح يؤدي إلى وظيفة أو دخل حقيقي.
        </p>

        {/* PROBLEM */}
        <div className="mt-16 text-right bg-white p-10 rounded-[34px] border border-pink-200 shadow-[0_25px_70px_rgba(233,107,138,.12)]">
          <h2 className="text-2xl font-black text-[#0F172A]">
            لماذا أنت عالق الآن؟
          </h2>

          <div className="mt-6 space-y-4 text-gray-800 leading-[2]">
            <p>✔ تتنقل بين مجالات كثيرة بدون قرار نهائي</p>
            <p>✔ تتعلم مهارات لا ترتبط بوظيفة واضحة</p>
            <p>✔ تجمع معلومات أكثر مما تطبق</p>
            <p>✔ لا تعرف أول خطوة تؤدي لنتيجة حقيقية</p>
          </div>
        </div>

        {/* CORE SHIFT */}
        <div className="mt-16 text-right">
          <h2 className="text-3xl font-black text-[#0F172A]">
            المشكلة ليست في التعلم…
          </h2>

          <p className="mt-4 text-lg text-gray-800 leading-[2] font-medium">
            المشكلة أنك لا تمتلك نظام يحدد:
            <br /><br />
            <span className="text-[#E96B8A] font-black">
              أين تبدأ → ماذا تفعل → وكيف تصل لأول فرصة
            </span>
          </p>
        </div>
                {/* WHAT SYSTEM DOES */}
        <div className="mt-20 text-right">
          <h2 className="text-3xl font-black text-center text-[#0F172A]">
            ماذا يفعل نظام شغف فعليًا؟
          </h2>

          <div className="mt-10 space-y-6">
            <Step title="تحديد الاتجاه" desc="نحدد لك المجال الصحيح بناءً على وضعك وليس رغبات عشوائية." />
            <Step title="بناء خطة واضحة" desc="نرسم لك أول 30 يوم للوصول إلى بداية حقيقية." />
            <Step title="الدخول للسوق" desc="CV + LinkedIn + طريقة الحصول على أول فرصة." />
            <Step title="بناء جاهزية مهنية" desc="مهارات سوق العمل + عرض نفسك بشكل احترافي." />
            <Step title="التحول المهني" desc="من شخص ضائع → إلى شخص لديه مسار واضح وفرص." />
          </div>
        </div>

        {/* PACKAGES (HIGH TICKET STRUCTURE) */}
        <div className="mt-24">
          <h2 className="text-3xl font-black text-center text-[#0F172A]">
            مستويات التحول داخل النظام
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-6 text-right">

            <PackageCard
              title="البوصلة"
              price="9 دولار"
              desc="من الضياع إلى وضوح الاتجاه"
              features={[
                "تحليل وضعك الحالي",
                "اختيار مسار واحد صحيح",
                "تحديد أول خطوة",
                "خطة 7–30 يوم"
              ]}
              result="وضوح كامل لأول مرة"
            />

            <PackageCard
              title="الانطلاقة"
              price="39 دولار"
              highlight
              desc="من المعرفة إلى أول فرصة"
              features={[
                "كل ما في البوصلة",
                "CV احترافي",
                "LinkedIn قوي",
                "Portfolio بسيط",
                "طريقة الحصول على أول وظيفة أو عميل"
              ]}
              result="أول فرصة حقيقية"
            />

            <PackageCard
              title="التمكين"
              price="99 دولار"
              desc="من فرصة إلى سيطرة على الفرص"
              features={[
                "كل ما في الانطلاقة",
                "تسويق شخصي",
                "بناء حضور مهني",
                "استراتيجية فرص مستمرة",
                "توجيه حسب تخصصك الحقيقي"
              ]}
              result="فرص مستمرة بدل انتظار"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 rounded-[40px] bg-white border border-pink-200 p-12 text-center shadow-[0_25px_70px_rgba(233,107,138,.15)]">

          <h3 className="text-2xl font-black text-[#0F172A]">
            القرار ليس “هل ستتعلم”…
          </h3>

        <p className="mt-4 text-gray-700 leading-[2] font-medium">
  القرار الحقيقي هو: هل ستستمر في الضياع… أم تبدأ نظام واضح يقودك لفرصة؟
</p>

<Link
  href="/shagf-quiz"
  className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#E96B8A] px-10 py-5 text-white font-bold shadow-lg hover:bg-[#d95d7d]"
>
  ادخل الفلتر الذكي لمعرفة مسارك
  <ArrowRight size={20} />
</Link>

        </div>
      </div>
    </section>
  );
}

/* COMPONENTS */

function Step({ title, desc }: any) {
  return (
    <div className="flex gap-4 items-start">
      <CheckCircle className="text-[#E96B8A] mt-1" />
      <div>
        <div className="font-black text-[#0F172A]">{title}</div>
        <div className="text-gray-700">{desc}</div>
      </div>
    </div>
  );
}

function PackageCard({ title, price, desc, features, result, highlight }: any) {
  return (
    <div
      className={`p-8 rounded-[28px] border bg-white transition ${
        highlight
          ? "border-[#E96B8A] shadow-[0_25px_70px_rgba(233,107,138,.25)] scale-[1.03]"
          : "border-pink-200"
      }`}
    >
      <div className="text-xl font-black">{title}</div>
      <div className="text-3xl text-[#E96B8A] font-black mt-2">{price}</div>
      <p className="text-gray-700 mt-2">{desc}</p>

      <div className="mt-6 space-y-2 text-sm text-gray-800">
        {features.map((f: string, i: number) => (
          <div key={i} className="flex gap-2">
            <CheckCircle size={16} className="text-[#E96B8A]" />
            <span>{f}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 font-bold text-[#E96B8A]">
        النتيجة: {result}
      </div>
    </div>
  );
}