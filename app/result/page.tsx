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
            <br />
            <br />
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
  <Step
    title="كشف الاتجاه الحقيقي"
    desc="نزيل الضباب عن خياراتك ونحدد المجال الذي يناسبك فعليًا بناءً على وضعك الحالي، لا على الرغبات العشوائية."
  />

  <Step
    title="بناء نقطة انطلاق واضحة"
    desc="نحوّل الفوضى إلى خطة عملية لأول 30 يوم، بحيث تعرف بالضبط ماذا تفعل ومتى تبدأ."
  />

  <Step
    title="تحويلك إلى مرشح حقيقي في السوق"
    desc="نُعيد بناء سيرتك الذاتية وحضورك المهني بحيث تصبح مؤهلاً فعليًا للفرص، لا مجرد متعلم."
  />

  <Step
    title="إثبات المهارة عمليًا"
    desc="نساعدك على بناء مخرجات حقيقية (مشاريع/نماذج عمل) تُظهر قدرتك بدل أن تشرحها بالكلام."
  />

  <Step
    title="الدخول في دائرة الفرص"
    desc="تتحول من شخص يبحث عن فرصة إلى شخص يبدأ في تلقي الفرص عبر حضور مهني واضح ومقنع."
  />
</div>
        </div>

       
        {/* CTA */}
        <div className="mt-24 rounded-[40px] bg-white border border-pink-200 p-12 text-center shadow-[0_25px_70px_rgba(233,107,138,.15)]">
          <h3 className="text-2xl font-black text-[#0F172A]">
            القرار ليس "هل ستتعلم"…
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

function PackageCard({
  title,
  price,
  forWho,
  desc,
  outcomes,
  result,
  highlight,
}: {
  title: string;
  price: string;
  forWho: string;
  desc: string;
  outcomes: string[];
  result: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col p-8 rounded-[28px] border bg-white transition ${
        highlight
          ? "border-[#E96B8A] shadow-[0_25px_70px_rgba(233,107,138,.25)] md:scale-[1.03]"
          : "border-pink-200"
      }`}
    >
      {highlight && (
        <span className="mb-4 inline-flex w-fit items-center rounded-full bg-[#E96B8A] px-4 py-1 text-xs font-black text-white">
          الأكثر اختيارًا
        </span>
      )}

      <div className="text-xl font-black text-[#0F172A]">{title}</div>
      <div className="text-3xl text-[#E96B8A] font-black mt-2">{price}</div>

      {/* WHO THIS IS FOR — the identity qualifier */}
      <p className="mt-4 text-[15px] font-bold leading-[1.9] text-[#0F172A]">
        {forWho}
      </p>

      <p className="mt-3 text-sm text-gray-600 leading-[1.9]">{desc}</p>

      <div className="mt-6 h-px w-full bg-pink-100" />

      {/* OUTCOMES, NOT FEATURES */}
      <div className="mt-6 space-y-3 text-sm text-gray-800 flex-1">
        {outcomes.map((o, i) => (
          <div key={i} className="flex gap-2">
            <CheckCircle size={16} className="text-[#E96B8A] mt-0.5 shrink-0" />
            <span className="leading-[1.8]">{o}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-pink-100 font-bold text-[#E96B8A] text-sm leading-[1.8]">
        النتيجة: {result}
      </div>
    </div>
  );
}