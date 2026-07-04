"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
    import Link from "next/link";

const MotionLink = motion.create(Link);
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HeroHome() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-[#FFF8FB] via-[#FFF3F7] to-[#FFF8FB]"
      style={{
        fontFamily: "Cairo, IBM Plex Sans Arabic, Tajawal, sans-serif",
      }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-[-200px] top-[-200px] h-[700px] w-[700px] rounded-full bg-pink-300/25 blur-[160px]"
          animate={{
            x: [0, 40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-200px] top-[100px] h-[600px] w-[600px] rounded-full bg-fuchsia-300/15 blur-[160px]"
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-200px] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-rose-200/25 blur-[160px]"
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-7xl px-6 pt-24 pb-28"
      >
        {/* Badge */}
        <motion.div variants={fadeUp} className="flex justify-center">
          <span className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-6 py-2.5 text-sm font-semibold text-[#E96B8A] border border-pink-200 shadow-[0_8px_30px_rgba(233,107,138,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E96B8A] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#E96B8A]" />
            </span>
            نظام شغف® — من الضياع إلى أول فرصة حقيقية
          </span>
        </motion.div>

        {/* Title */}
        <motion.div variants={fadeUp} className="text-center mt-10">
          <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] text-gray-900">
            أنت لا تحتاج أن تتعلم أكثر
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-l from-[#E96B8A] to-[#c94a70] bg-clip-text text-transparent">
                أنت تحتاج أن تعرف اتجاهك أولًا
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="absolute bottom-1 right-0 left-0 h-4 bg-pink-200/50 -z-0 origin-right"
                style={{ transform: "skewX(-10deg)" }}
              />
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-9">
            المشكلة ليست نقص مهارات… بل غياب نظام يحدد لك ماذا تتعلم، ولماذا، ومتى تتوقف عن التعلم وتبدأ.
            <br /><br />
            <span className="font-semibold text-gray-900">
              نظام شغف يبدأ باتجاه واضح، ثم يقودك خطوة بخطوة حتى أول فرصة حقيقية.
            </span>
          </p>
        </motion.div>

        {/* MAIN GRID */}
        <div className="mt-20 grid lg:grid-cols-12 gap-10 items-center">

          {/* LEFT PROOF */}
          <motion.div variants={fadeUp} className="space-y-6 lg:col-span-2">
            <motion.div
              whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(233,107,138,0.15)" }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl bg-white/70 backdrop-blur-md border border-pink-100 p-5 shadow-sm cursor-default"
            >
              <p className="text-sm text-gray-500">قبل النظام</p>
              <p className="font-semibold text-gray-900 mt-1">
                كورسات + تشتت + بدون اتجاه
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(233,107,138,0.15)" }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl bg-white border border-pink-200 p-5 shadow-md cursor-default relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-pink-200/40 to-transparent rounded-bl-full" />
              <div className="flex items-center gap-1.5 relative">
                <Sparkles className="h-3.5 w-3.5 text-[#E96B8A]" />
                <p className="text-sm text-gray-500">بعد أول مرحلة</p>
              </div>
              <p className="font-semibold text-gray-900 mt-1 relative">
                اتجاه واضح، وخطة تعرف بها ماذا تفعل غدًا
              </p>
            </motion.div>
          </motion.div>

          {/* VIDEO */}
          <motion.div variants={fadeUp} className="lg:col-span-7 relative group">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-300/40 to-fuchsia-300/30 blur-3xl rounded-[50px]"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative rounded-[44px] overflow-hidden border border-pink-200 shadow-[0_40px_120px_rgba(0,0,0,0.25)] bg-black transition-transform duration-500 group-hover:scale-[1.01]">
              <iframe
                className="w-full aspect-video"
                src="https://www.youtube.com/embed/2DEZIZC1B4s"
                title="Shaghaf System"
                allowFullScreen
              />
            </div>

            <motion.div
              variants={fadeUp}
              className="mt-5 flex justify-center items-center gap-2 text-sm text-gray-600"
            >
              <PlayCircle className="h-4 w-4 text-[#E96B8A]" />
              شاهد كيف يتحول الضياع → إلى اتجاه واضح خلال نظام واحد
            </motion.div>
          </motion.div>

          {/* RIGHT CTA */}
          <motion.div variants={fadeUp} className="space-y-6 lg:col-span-3">
            <div className="rounded-2xl bg-white border border-pink-200 p-6 shadow-md relative overflow-hidden">
              <div className="absolute -top-6 -left-6 h-20 w-20 bg-pink-100/60 rounded-full blur-2xl" />
              <p className="text-lg font-bold text-gray-900 relative">
                لا تبدأ بمهارة
              </p>
              <p className="text-gray-600 mt-2 relative">
                ابدأ باتجاه. هذا ما يفعله نظام شغف من أول خطوة.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-center text-xs font-semibold text-[#E96B8A]">
                الخطوة الأولى داخل نظام شغف
              </p>
              <MotionLink
  href="/bousola"
  whileHover={{
    scale: 1.04,
    boxShadow: "0 20px 40px rgba(233,107,138,0.35)",
  }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.2 }}
  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#E96B8A] to-[#d85a7c] px-6 py-4 text-white font-bold text-lg shadow-lg"
>
  ابدأ بالبوصلة

  <motion.span
    animate={{ x: [0, -4, 0] }}
    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
  >
    <ArrowRight className="h-5 w-5" />
  </motion.span>
</MotionLink>
            </div>

       
<MotionLink
  href="/result"
  whileHover={{
    scale: 1.02,
    backgroundColor: "rgba(253,242,248,1)",
  }}
  whileTap={{ scale: 0.98 }}
  className="flex items-center justify-center rounded-2xl border border-[#E96B8A] px-6 py-4 font-semibold text-[#E96B8A] transition-colors"
>
  كيف يعمل النظام؟
</MotionLink>

          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}