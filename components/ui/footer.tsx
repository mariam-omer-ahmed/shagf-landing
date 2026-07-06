"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

import Logo from "./logo";
import FooterIllustration from "@/public/images/footer-illustration.svg";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

type FooterLink = {
  href: string;
  label: string;
  dir?: "ltr" | "rtl";
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const FOOTER_LINKS: FooterColumn[] = [
  {
    title: "نظام شغف",
    links: [
      { href: "#system", label: "كيف يعمل النظام" },
      { href: "#journey", label: "مراحل الجاهزية المهنية" },
      { href: "#courses", label: "لماذا لا تكفي الكورسات وحدها" },
    ],
  },
  {
    title: "البوصلة",
    links: [
      { href: "#compass", label: "ما هي البوصلة" },
      { href: "#direction", label: "كيف تحدد اتجاهك" },
      { href: "#contact", label: "احجز جلسة التشخيص" },
    ],
  },
  {
    title: "النتائج",
    links: [
      { href: "#results", label: "قصص نجاح حقيقية" },
      { href: "#success", label: "من الضياع إلى أول وظيفة" },
      { href: "#success", label: "من التخبط إلى أول عميل" },
    ],
  },
  {
    title: "تواصل مباشر",
    links: [
      { href: "https://wa.me/249963370737", label: "+249 96 337 0737", dir: "ltr" },
      { href: "mailto:info@shaghaf.com", label: "الدعم الفني" },
    ],
  },
];

type SocialLink = {
  href: string;
  Icon: React.ElementType;
};

const SOCIAL_LINKS: SocialLink[] = [
  { href: "https://www.instagram.com/shagf_space?igsh=MTFobjlybGticmRqOQ==", Icon: FaInstagram },
  { href: "https://www.facebook.com/share/1DBJBZtgDV/?mibextid=wwXIfr", Icon: FaFacebookF },
  { href: "https://www.tiktok.com/@shagf387?_r=1&_t=ZS-97kGb1NguWe", Icon: FaTiktok },
  { href: "https://wa.me/249963370737", Icon: FaWhatsapp },
];

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden bg-white"
      style={{ fontFamily: "'Cairo', 'IBM Plex Sans Arabic', 'Tajawal', sans-serif" }}
    >
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-[#E96B8A]/10 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-0 right-[-100px] h-[420px] w-[420px] rounded-full bg-rose-200/40 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-[-100px] h-[380px] w-[380px] rounded-full bg-pink-100/60 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 opacity-[0.05]" aria-hidden="true">
        <Image src={FooterIllustration} alt="Footer Illustration" width={1076} height={378} className="max-w-none" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-10 pt-4 text-sm md:grid-cols-5"
        >
          {FOOTER_LINKS.map((col) => (
            <motion.div variants={fadeUp} key={col.title}>
              <h3 className="mb-4 font-bold text-gray-900">{col.title}</h3>
              <ul className="space-y-3 text-gray-500">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      dir={link.dir}
                      className="transition-colors hover:text-[#E96B8A]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div variants={fadeUp}>
            <h3 className="mb-4 font-bold text-gray-900">تابعنا</h3>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((social, i) => {
                const Icon = social.Icon;
                return (
                  <motion.a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -4, scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-pink-100 bg-pink-50 text-[#E96B8A] transition-colors hover:border-[#E96B8A] hover:bg-[#E96B8A] hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
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