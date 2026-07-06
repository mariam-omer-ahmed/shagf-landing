"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const moments = [
  {
    image: "/images/f1.jpg",
    title: "أقضي ساعات أبحث...",
    subtitle: "ولا أقرر.",
  },
  {
    image: "/images/f2.jpg",
    title: "أنهيت دورات كثيرة...",
    subtitle: "وما زلت في نفس المكان.",
  },
  {
    image: "/images/f3.jpg",
    title: "كل يوم أغيّر رأيي...",
    subtitle: "لأن كل طريق يبدو صحيحًا.",
  },
  {
    image: "/images/f4.jpg",
    title: "لم أكن أحتاج معلومات أكثر...",
    subtitle: "كنت أحتاج اتجاهًا واضحًا.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
    },
  },
};

export default function Features() {
  return (
    <section
      id="features"
      dir="rtl"
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#FFF9FB] to-white py-28"
      style={{
        fontFamily:
          "'Cairo','IBM Plex Sans Arabic','Tajawal',sans-serif",
      }}
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-250px] h-[650px] w-[850px] -translate-x-1/2 rounded-full bg-[#E96B8A]/10 blur-[170px]" />
        <div className="absolute -right-44 bottom-0 h-[420px] w-[420px] rounded-full bg-pink-200/20 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex rounded-full border border-[#E96B8A]/20 bg-[#FFF4F8] px-6 py-3 text-sm font-bold text-[#E96B8A]">
            قد ترى نفسك في واحدة من هذه اللحظات...
          </span>

          <h2 className="mt-8 text-[42px] font-black leading-[1.55] text-[#151827] md:text-6xl">
            ليس لأنك لا تريد النجاح...
            <br />
            <span className="text-[#E96B8A]">
              بل لأنك لم تجد الاتجاه بعد.
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-[22px] leading-[2] text-gray-600">
            وربما مررت بواحدة من هذه المواقف...
            <br />
            أو كلها.
          </p>
        </motion.div>

        {/* Moments Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            margin: "-120px",
          }}
          className="mt-20 grid gap-8 md:grid-cols-2"
        >
          {moments.map((moment, index) => (
            <motion.article
              key={index}
              variants={item}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              transition={{ duration: 0.3 }}
              className="group relative overflow-hidden rounded-[34px] shadow-[0_30px_80px_rgba(0,0,0,.08)]"
            >
              {/* Image */}
              <div className="relative h-[360px] overflow-hidden">
                <Image
                  src={moment.image}
                  alt={moment.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10 transition duration-500 group-hover:from-black/90" />

                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E96B8A]/10 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

                {/* Content */}
                <div className="absolute bottom-0 right-0 left-0 p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.08,
                      duration: 0.5,
                    }}
                  >
                    <h3 className="text-[30px] font-black leading-[1.4] text-white">
                      {moment.title}
                    </h3>

                    <div className="my-5 h-[3px] w-20 rounded-full bg-[#E96B8A] transition-all duration-500 group-hover:w-36" />

                    <p className="text-[22px] font-semibold leading-[1.8] text-white/90">
                      {moment.subtitle}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Bridge */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-28 max-w-4xl text-center"
        >
          <h3 className="text-[42px] font-black leading-[1.7] text-[#151827] md:text-5xl">
            لهذا السبب...
            <br />
            <span className="text-[#E96B8A]">
              لا نطلب منك أن تختار تخصصًا الآن.
            </span>
          </h3>

          <p className="mx-auto mt-8 max-w-3xl text-[22px] leading-[2] text-gray-600">
            نطلب منك فقط أن تبدأ بخطوة واحدة.
            <br />
            الاختبار سيساعدك على رؤية الصورة بوضوح...
            قبل أن تستثمر وقتك أو مالك في أي طريق.
          </p>

          <motion.a
            href="/result"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 25px 60px rgba(233,107,138,.30)",
            }}
            whileTap={{ scale: 0.98 }}
            className="mt-12 inline-flex items-center gap-3 rounded-full bg-[#E96B8A] px-12 py-6 text-xl font-black text-white transition hover:bg-[#d95d7d]"
          >
            ابدأ الاختبار الآن
            <ArrowRight size={24} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}