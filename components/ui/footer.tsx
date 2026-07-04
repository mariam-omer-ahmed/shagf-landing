"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, Compass } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

import Logo from "./logo";
import FooterIllustration from "@/public/images/footer-illustration.svg";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const container = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden bg-white"
      style={{
        fontFamily:
          "'Cairo', 'IBM Plex Sans Arabic', 'Tajawal', sans-serif",
      }}
    >
      {/* Background */}
      <div className="pointer-events-none absolute -top-52 left-1/2 h-[560px] w-[760px] -translate-x-1/2 rounded-full bg-[#E96B8A]/15 blur-[150px]" />

      <div className="pointer-events-none absolute bottom-0 right-[-100px] h-[420px] w-[420px] rounded-full bg-rose-200/40 blur-[130px]" />

      <div className="pointer-events-none absolute bottom-0 left-[-100px] h-[380px] w-[380px] rounded-full bg-pink-100/60 blur-[120px]" />

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 opacity-[0.05]"
        aria-hidden="true"
      >
        <Image
          src={FooterIllustration}
          alt="Footer Illustration"
          width={1076}
          height={378}
          className="max-w-none"
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="mb-24 text-center"
        >
          <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-5 py-2 text-sm font-bold text-[#E96B8A] shadow-[0_10px_30px_rgba(233,107,138,.12)]">
            <Compass className="h-4 w-4" />
            نظام شغف®
          </span>

          <h2 className="mx-auto max-w-3xl text-4xl font-black leading-[1.3] text-gray-900 md:text-5xl">
            لا تختر مهارة عشوائية...
            <span className="mt-2 block bg-gradient-to-l from-[#E96B8A] via-[#d85a7c] to-[#E96B8A] bg-clip-text text-transparent">
              اعرف اتجاهك أولًا، ثم تعلّم ما تحتاجه فعلًا
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            المهارة ليست نقطة البداية...
            بل مجرد أداة داخل نظام شغف.

            يساعدك النظام على معرفة الطريق المناسب لك أولًا،
            ثم اختيار المهارات التي تحتاجها فعلًا،
            حتى تتوقف عن التخبط وتبدأ رحلة واضحة نحو أول فرصة حقيقية.
          </p>

          <motion.a
            href="#compass"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 22px 50px rgba(233,107,138,.35)",
            }}
            whileTap={{ scale: .98 }}
            className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-l from-[#E96B8A] to-[#d85a7c] px-9 py-4 text-lg font-bold text-white shadow-[0_15px_40px_rgba(233,107,138,.3)]"
          >
            ابدأ بالبوصلة
            <ArrowUpRight className="h-5 w-5" />
          </motion.a>

          <p className="mt-3 text-xs text-gray-400">
            أول خطوة داخل نظام شغف — معرفة الاتجاه قبل اختيار أي مهارة.
          </p>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-10 border-t border-pink-100 pt-16 text-sm md:grid-cols-5"
        >

                    {/* نظام شغف */}
          <motion.div variants={fadeUp}>
            <h3 className="mb-4 font-bold text-gray-900">نظام شغف</h3>

            <ul className="space-y-3 text-gray-500">

              <li>
                <a
                  href="#system"
                  className="transition-colors hover:text-[#E96B8A]"
                >
                  كيف يعمل النظام
                </a>
              </li>

              <li>
                <a
                  href="#journey"
                  className="transition-colors hover:text-[#E96B8A]"
                >
                  مراحل الجاهزية المهنية
                </a>
              </li>

              <li>
                <a
                  href="#courses"
                  className="transition-colors hover:text-[#E96B8A]"
                >
                  لماذا لا تكفي الكورسات وحدها
                </a>
              </li>

            </ul>
          </motion.div>

          {/* البوصلة */}
          <motion.div variants={fadeUp}>
            <h3 className="mb-4 font-bold text-gray-900">
              البوصلة
            </h3>

            <ul className="space-y-3 text-gray-500">

              <li>
                <a
                  href="#compass"
                  className="transition-colors hover:text-[#E96B8A]"
                >
                  ما هي البوصلة
                </a>
              </li>

              <li>
                <a
                  href="#direction"
                  className="transition-colors hover:text-[#E96B8A]"
                >
                  كيف تحدد اتجاهك
                </a>
              </li>

              <li>
                <a
                  href="#contact"
                  className="transition-colors hover:text-[#E96B8A]"
                >
                  احجز جلسة التشخيص
                </a>
              </li>

            </ul>
          </motion.div>

          {/* النتائج */}
          <motion.div variants={fadeUp}>
            <h3 className="mb-4 font-bold text-gray-900">
              النتائج
            </h3>

            <ul className="space-y-3 text-gray-500">

              <li>
                <a
                  href="#results"
                  className="transition-colors hover:text-[#E96B8A]"
                >
                  قصص نجاح حقيقية
                </a>
              </li>

              <li>
                <a
                  href="#success"
                  className="transition-colors hover:text-[#E96B8A]"
                >
                  من الضياع إلى أول وظيفة
                </a>
              </li>

              <li>
                <a
                  href="#success"
                  className="transition-colors hover:text-[#E96B8A]"
                >
                  من التخبط إلى أول عميل
                </a>
              </li>

            </ul>
          </motion.div>

          {/* التواصل */}
          <motion.div variants={fadeUp}>
            <h3 className="mb-4 font-bold text-gray-900">
              تواصل مباشر
            </h3>

            <ul className="space-y-3 text-gray-500">

              <li>
                <a
                  href="https://wa.me/249963370737"
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  className="transition-colors hover:text-[#E96B8A]"
                >
                  +249 96 337 0737
                </a>
              </li>

              <li>
                <a
                  href="mailto:info@shaghaf.com"
                  className="transition-colors hover:text-[#E96B8A]"
                >
                  الدعم الفني
                </a>
              </li>

            </ul>
          </motion.div>

          {/* تابعنا */}
          <motion.div variants={fadeUp}>
            <h3 className="mb-4 font-bold text-gray-900">
              تابعنا
            </h3>

            <div className="flex flex-wrap gap-3">

              <motion.a
                href="https://www.instagram.com/shagf_space?igsh=MTFobjlybGticmRqOQ=="
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, scale: 1.08 }}
                whileTap={{ scale: .95 }}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-pink-100 bg-pink-50 text-[#E96B8A] transition-colors hover:border-[#E96B8A] hover:bg-[#E96B8A] hover:text-white"
              >
                <FaInstagram className="h-5 w-5" />
              </motion.a>

              <motion.a
                href="https://www.facebook.com/share/1DBJBZtgDV/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, scale: 1.08 }}
                whileTap={{ scale: .95 }}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-pink-100 bg-pink-50 text-[#E96B8A] transition-colors hover:border-[#E96B8A] hover:bg-[#E96B8A] hover:text-white"
              >
                <FaFacebookF className="h-5 w-5" />
              </motion.a>
                            <motion.a
                href="https://www.tiktok.com/@shagf387?_r=1&_t=ZS-97kGb1NguWe"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-pink-100 bg-pink-50 text-[#E96B8A] transition-colors hover:border-[#E96B8A] hover:bg-[#E96B8A] hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M16.6 5.82c-1.02-.9-1.6-2.19-1.6-3.62h-3.14v13.4c0 1.55-1.26 2.8-2.8 2.8s-2.8-1.25-2.8-2.8 1.26-2.8 2.8-2.8c.3 0 .58.05.85.13V9.66a5.98 5.98 0 0 0-.85-.06c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6V9.01a8.16 8.16 0 0 0 4.4 1.28V7.15c-.95 0-1.86-.3-2.6-.8-.15-.1-.3-.21-.44-.33-.31-.26-.58-.55-.82-.87Z" />
                </svg>
              </motion.a>

              <motion.a
                href="https://wa.me/249963370737"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-pink-100 bg-pink-50 text-[#E96B8A] transition-colors hover:border-[#E96B8A] hover:bg-[#E96B8A] hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M17.5 14.4c-.3-.15-1.7-.85-1.95-.94-.26-.1-.45-.15-.64.15-.2.3-.74.94-.9 1.13-.17.2-.33.22-.62.08-.3-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.34.44-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.64-1.55-.88-2.12-.23-.56-.47-.48-.64-.49-.17 0-.36-.01-.55-.01-.2 0-.51.07-.78.37-.26.3-1.02 1-1.02 2.42 0 1.43 1.05 2.82 1.19 3.01.15.2 2.06 3.15 5 4.42.7.3 1.24.48 1.67.61.7.22 1.34.19 1.84.12.56-.08 1.7-.7 1.95-1.37.24-.68.24-1.26.17-1.38-.07-.12-.26-.2-.55-.34Z" />
                  <path d="M12.02 2C6.5 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.08-1.33A9.96 9.96 0 0 0 12.02 22C17.53 22 22 17.52 22 12S17.53 2 12.02 2Zm0 18.1c-1.68 0-3.24-.48-4.56-1.32l-.33-.2-3.02.79.8-2.94-.21-.34A8.07 8.07 0 0 1 3.9 12c0-4.48 3.65-8.1 8.12-8.1 4.47 0 8.1 3.62 8.1 8.1 0 4.48-3.63 8.1-8.1 8.1Z" />
                </svg>
              </motion.a>

            </div>
          </motion.div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-pink-100 pt-8 md:flex-row"
        >
          <Logo />

          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} نظام شغف — جميع الحقوق محفوظة.
          </p>
        </motion.div>

      </div>
    </footer>
  );
}