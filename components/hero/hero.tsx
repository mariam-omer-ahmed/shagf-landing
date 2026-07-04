"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

const stats = [
  {
    value: "2,500+",
    label: "طالب وطالبة",
  },
  {
    value: "94%",
    label: "نسبة رضا المتدربين",
  },
  {
    value: "120+",
    label: "شركة وظفت خريجينا",
  },
];

const features = [
  "تدريب عملي بمشاريع حقيقية",
  "بناء Portfolio احترافي",
  "إرشاد وظيفي حتى أول فرصة عمل",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FFF8FB]">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-pink-200/30 blur-3xl" />
        <div className="absolute right-0 top-20 h-[420px] w-[420px] rounded-full bg-fuchsia-200/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-rose-100/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-14 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-right"
          >
            <span className="inline-flex items-center rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-[#E96B8A] shadow-sm">
              🚀 ابدأ رحلتك المهنية بثقة
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight text-gray-900 md:text-5xl xl:text-6xl">
              تعلم المهارات التي تحتاجها الشركات...
              <span className="mt-3 block text-[#E96B8A]">
                واحصل على أول وظيفة أسرع.
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-xl text-lg leading-8 text-gray-600 lg:mx-0">
              في Passion Academy لا نقدم كورسات فقط، بل نبني معك
              المهارات، المشاريع، والخبرة العملية التي تجعل سيرتك الذاتية
              قوية وتجذب أصحاب العمل.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E96B8A] px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-[#d85878]"
              >
                ابدأ الآن
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/success-stories"
                className="inline-flex items-center justify-center rounded-xl border-2 border-[#E96B8A] bg-white px-8 py-4 text-lg font-bold text-[#E96B8A] transition hover:bg-pink-50"
              >
                شاهد قصص النجاح
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm"
                >
                  <h3 className="text-3xl font-black text-[#E96B8A]">
                    {item.value}
                  </h3>

                  <p className="mt-2 text-sm text-gray-600">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-4">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center justify-center gap-3 lg:justify-start"
                >
                  <CheckCircle className="h-6 w-6 text-[#E96B8A]" />

                  <span className="text-gray-700">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
                    {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center"
          >
            {/* Decorative Elements */}
            <div className="absolute -top-8 -left-6 h-24 w-24 rounded-full bg-pink-200/40 blur-2xl" />
            <div className="absolute -bottom-10 -right-6 h-32 w-32 rounded-full bg-rose-300/30 blur-3xl" />

            {/* Floating Card 1 */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: [0.42, 0, 0.58, 1],
              }}
              className="absolute left-0 top-8 z-20 hidden rounded-2xl bg-white p-4 shadow-xl lg:block"
            >
              <p className="text-xs text-gray-500">
                معدل التوظيف
              </p>

              <h3 className="mt-1 text-2xl font-black text-[#E96B8A]">
                +92%
              </h3>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{
                repeat: Infinity,
                duration: 3.8,
                ease: [0.42, 0, 0.58, 1],
              }}
              className="absolute bottom-10 right-0 z-20 hidden rounded-2xl bg-white p-4 shadow-xl lg:block"
            >
              <p className="text-xs text-gray-500">
                مشاريع عملية
              </p>

              <h3 className="mt-1 text-2xl font-black text-[#E96B8A]">
                40+
              </h3>
            </motion.div>

            {/* Main Image Container */}
            <div className="relative w-full max-w-xl">
              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-pink-300 via-rose-200 to-pink-100 blur-2xl opacity-40" />

              <div className="relative overflow-hidden rounded-[36px] border border-pink-100 bg-white shadow-2xl">
                <img
                  src="/images/hero.webp"
                  alt="Passion Academy"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#1f1f1f]/30 via-transparent to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Trust Section */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 rounded-3xl border border-pink-100 bg-white/80 p-8 backdrop-blur"
        >
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <h4 className="text-3xl font-black text-[#E96B8A]">
                10+
              </h4>

              <p className="mt-2 text-gray-600">
                سنوات من الخبرة في التدريب
              </p>
            </div>

            <div className="text-center">
              <h4 className="text-3xl font-black text-[#E96B8A]">
                150+
              </h4>

              <p className="mt-2 text-gray-600">
                دفعة تدريبية ناجحة
              </p>
            </div>

            <div className="text-center">
              <h4 className="text-3xl font-black text-[#E96B8A]">
                4.9★
              </h4>

              <p className="mt-2 text-gray-600">
                متوسط تقييم المتدربين
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

