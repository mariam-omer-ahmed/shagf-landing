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
            نظام شغف لبناء الجاهزية المهنية
          </span>
        </motion.div>

        {/* HERO */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black leading-[1.6] text-[#0F172A] md:text-6xl"
        >
          توقف عن التعلم العشوائي…
          <br />
          <span className="text-[#E96B8A]">
            وابدأ طريق واضح لأول فرصة حقيقية
          </span>
        </motion.h1>

        <p className="mx-auto mt-8 max-w-3xl text-xl leading-[2] text-gray-700 font-medium">
          نظام شغف لا يبيع كورسات. بل يبنيك من الصفر إلى جاهزية سوق العمل خطوة بخطوة.
        </p>

        {/* ===== WHO IS IT FOR ===== */}
        <div className="mt-16 text-right bg-white p-10 rounded-[34px] border border-pink-200 shadow-[0_25px_70px_rgba(233,107,138,.12)]">
          <h2 className="text-2xl font-black text-[#0F172A]">لمن هذا النظام؟</h2>

          <div className="mt-6 space-y-4 text-gray-800 leading-[2]">
            <p>✔ خريج هندسة / طب / إدارة أو أي تخصص أخر ..يريد دخول سوق العمل بطريقة صحيحة</p>
            <p>✔ شخص يريد دخل و عائد مادي من مهارات  السوشيال ميديا / التسويق / صناعة المحتوى</p>
            <p>✔ شخص لديه مهارات لكن لا يعرف كيف يحولها لوظيفة أو دخل</p>
            <p>✔ شخص ضائع بين كورسات كثيرة بدون نتائج</p>
          </div>
        </div>

        {/* ===== PROBLEM ===== */}
        <div className="mt-16 text-right">
          <h2 className="text-3xl font-black text-[#0F172A]">المشكلة الحقيقية</h2>

          <p className="mt-4 text-lg text-gray-800 leading-[2] font-medium">
            أنت لا تفتقد المهارات…  
            أنت تفتقد النظام الذي يربط المهارات بهدف واحد واضح.
            <br /><br />
            لذلك تتعلم عشوائيًا:
            جرافيك → تسويق → AI → محتوى  
            لكن بدون أن تقترب من أول وظيفة أو عميل.
          </p>
        </div>

        {/* ===== WHAT YOU LEARN ===== */}
        <div className="mt-20 text-right">
          <h2 className="text-3xl font-black text-center text-[#0F172A]">
            ماذا ستتعلم داخل نظام شغف؟
          </h2>

          <div className="mt-10 space-y-6">
            <Step title="اتجاه مهني واضح" desc="نعرفك هل تكمل تخصصك أو تغير أو تدمج مهاراتك." />
            <Step title="مهارات سوق العمل" desc="CV + LinkedIn + مقابلات + تقديم احترافي." />
            <Step title="مهارات السوشيال ميديا" desc="كيف تبني حضور قوي وتعرض نفسك أو خدماتك." />
            <Step title="التسويق الشخصي" desc="كيف تحصل على وظائف أو عملاء بدون انتظار." />
            <Step title="تنفيذ حقيقي" desc="تحويل كل شيء لخطوات عملية قابلة للتطبيق." />
          </div>
        </div>

        {/* ===== SYSTEM ===== */}
        <div className="mt-24 text-right">
          <h2 className="text-3xl font-black text-center text-[#0F172A]">
            كيف يعمل نظام شغف®؟
          </h2>

          <div className="mt-10 space-y-6">
            <Step title="1. البوصلة" desc="تحديد اتجاهك المهني الصحيح." />
            <Step title="2. الخطة" desc="خطة 30 يوم واضحة ماذا تفعل بالضبط." />
            <Step title="3. بناء الجاهزية" desc="CV + LinkedIn + Portfolio." />
            <Step title="4. المهارات حسب حالتك" desc="هندسة / تسويق / محتوى / سوشيال." />
            <Step title="5. دخول السوق" desc="وظيفة أو عميل أو فرصة حقيقية." />
          </div>
        </div>

        {/* ===== PACKAGES ===== */}
        <div className="mt-24">
          <h2 className="text-3xl font-black text-center text-[#0F172A]">
            الباقات
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-6 text-right">

            <PackageCard
              title="البوصلة"
              price="29 ريال"
              desc="لمن يشعر بالضياع"
              features={[
                "تحليل وضعك الحالي",
                "اختيار المسار المناسب",
                "تحديد ماذا تتعلم",
                "خطة 30 يوم"
              ]}
              result="وضوح كامل لأول مرة"
            />

            <PackageCard
              title="الانطلاقة"
              price="149 ريال"
              highlight
              desc="بناء جاهزيتك المهنية"
              features={[
                "كل ما في البوصلة",
                "مهارات سوق العمل",
                "CV + LinkedIn",
                "بناء Portfolio",
                "خطة تنفيذ"
              ]}
              result="جاهز للتقديم على وظائف أو عملاء"
            />

            <PackageCard
              title="التمكين الكامل"
              price="299 ريال"
              desc="نتائج + متابعة"
              features={[
                "كل ما في الانطلاقة",
                "تدريب مقابلات",
                "تسويق شخصي",
                "مراجعة أسبوعية",
                "دخول السوق فعليًا"
              ]}
              result="أول وظيفة / عميل / فرصة"
            />

          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 rounded-[40px] bg-white border border-pink-200 p-12 text-center shadow-[0_25px_70px_rgba(233,107,138,.15)]">

          <h3 className="text-2xl font-black text-[#0F172A]">
            قرارك اليوم يحدد سنة كاملة قادمة
          </h3>

          <p className="mt-4 text-gray-700 leading-[2] font-medium">
            إما تستمر في التجربة العشوائية… أو تبدأ نظام واضح يبنيك خطوة خطوة.
          </p>

          <Link
            href="/pricing"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#E96B8A] px-10 py-5 text-white font-bold shadow-lg hover:bg-[#d95d7d]"
          >
            ابدأ نظام شغف الآن
            <ArrowRight size={20} />
          </Link>

        </div>

      </div>
    </section>
  );
}

/* ===== COMPONENTS ===== */

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
          ? "border-[#E96B8A] shadow-[0_25px_70px_rgba(233,107,138,.25)] scale-[1.02]"
          : "border-pink-200"
      }`}
    >
      <div className="text-xl font-black text-[#0F172A]">{title}</div>
      <div className="text-3xl text-[#E96B8A] font-black mt-2">{price}</div>
      <p className="text-gray-700 mt-2 font-medium">{desc}</p>

      <div className="mt-6 space-y-2 text-sm text-gray-800">
        {features.map((f: string, i: number) => (
          <div key={i} className="flex gap-2">
            <CheckCircle size={16} className="text-[#E96B8A]" />
            <span>{f}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm font-bold text-[#E96B8A]">
        النتيجة: {result}
      </div>
    </div>
  );
}