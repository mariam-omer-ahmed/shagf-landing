"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle, Target, Sparkles } from "lucide-react";

export default function Bousola() {
  return (
    <section
      id="Bousola"
      className="relative overflow-hidden bg-[#FFF8FB] py-24"
      dir="rtl"
      style={{
        fontFamily:
          "'Cairo','IBM Plex Sans Arabic','Tajawal',sans-serif",
      }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-pink-300/20 blur-[160px]" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-rose-200/20 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 shadow-md border border-pink-100">
            <Target className="h-4 w-4 text-[#E96B8A]" />
            <span className="font-bold text-[#E96B8A]">
              أول خطوة داخل نظام شغف الكامل
            </span>
          </div>

          <h1 className="mt-8 text-5xl font-black leading-[1.5] text-gray-900 md:text-6xl">
            بوصلة سوق العمل
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-[2] text-gray-600">
            توقف عن التجربة العشوائية...
            <br />
            واعرف بالضبط أين تبدأ لتصل إلى وظيفة أسرع.
          </p>
        </motion.div>

        {/* FEATURES */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">

          {[
            "تحديد المسار المناسب لك حسب احتياج السوق الحقيقي",
            "إيقاف التشتت بين المجالات والدورات",
            "خطة واضحة لأول 30 يوم للوصول لفرصة حقيقية",
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-white p-8 shadow-xl border border-pink-100"
            >
              <CheckCircle className="text-[#E96B8A] mb-4" />
              <p className="text-lg font-semibold text-gray-700 leading-[1.8]">
                {item}
              </p>
            </motion.div>
          ))}

        </div>

        {/* PRICE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 rounded-3xl bg-white border border-pink-100 shadow-2xl p-10 text-center"
        >
          <Sparkles className="mx-auto mb-4 text-[#E96B8A]" />

          <h2 className="text-4xl font-black text-gray-900">
            ابدأ بتغيير اتجاهك قبل أن تضيع المزيد من الوقت
          </h2>

          <p className="mt-6 text-3xl font-black text-[#E96B8A]">
            29 ريال فقط
          </p>

          <p className="mt-6 text-gray-600 text-lg leading-[2]">
            ليست دورة تعليمية...
            بل قرار يحدد هل ستستمر في الدوران أو تبدأ طريق واضح نحو وظيفة.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >

          <div className="flex flex-col md:flex-row gap-5 justify-center items-center">

            {/* زر النظام الكامل */}
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-2xl bg-black px-10 py-5 text-lg font-bold text-white shadow-xl hover:scale-[1.03] transition"
            >
              ابدأ النظام الكامل
              <ArrowRight />
            </Link>

            {/* زر البوصلة */}
            <Link
              href="https://forms.gle/5MU8qroNsHptR4536"
              target="_blank"
              className="inline-flex items-center gap-3 rounded-2xl bg-[#E96B8A] px-10 py-5 text-lg font-bold text-white shadow-xl hover:scale-[1.03] transition"
            >
              ابدأ البوصلة الآن
              <ArrowRight />
            </Link>

          </div>

          <p className="mt-6 text-gray-500">
            اختر المسار الذي يناسبك الآن — لكن لا تبقى في نفس المكان.
          </p>

        </motion.div>

      </div>
    </section>
  );
}