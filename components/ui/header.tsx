"use client";

import Link from "next/link";
import Logo from "./logo";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const navItems = [
  {
    title: "الرئيسية",
    href: "/",
  },
  {
    title: "كيف يعمل النظام؟",
    href: "/result",
  },
  {
    title: "لماذا شغف؟",
    href: "/features",
  },
  {
    title: "آراء المتدربين",
    href: "/#testimonials",
  },
];

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 py-5">
      <div className="mx-auto max-w-7xl px-5">

        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="
            flex h-20 items-center justify-between
            rounded-[28px]
            border border-pink-100
            bg-white/80
            backdrop-blur-2xl
            px-8
            shadow-[0_20px_70px_rgba(233,107,138,.14)]
          "
        >
          {/* Logo */}
          <Logo />

          {/* ================= NAV ================= */}
          <nav className="hidden lg:flex items-center gap-2">

            {navItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="
                  relative
                  rounded-full
                  px-5
                  py-3
                  text-[15px]
                  font-semibold
                  text-gray-600
                  transition-all
                  duration-300
                  hover:bg-[#FFF4F8]
                  hover:text-[#E96B8A]
                  hover:shadow-sm
                "
              >
                {item.title}
              </Link>
            ))}

          </nav>

          {/* ================= ACTIONS ================= */}
          <div className="flex items-center gap-3">

            <Link
              href="/signin"
              className="
                rounded-full
                px-6
                py-3
                font-semibold
                text-gray-700
                transition-all
                duration-300
                hover:bg-[#FFF4F8]
                hover:text-[#E96B8A]
              "
            >
              تسجيل الدخول
            </Link>

            <Link
              href="/pricing"
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#E96B8A]
                px-7
                py-3.5
                font-bold
                text-white
                shadow-[0_15px_40px_rgba(233,107,138,.35)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#D85D7D]
                hover:shadow-[0_20px_50px_rgba(233,107,138,.45)]
              "
            >
              ابدأ الآن
              <ArrowRight size={18} />
            </Link>

          </div>
        </motion.div>

      </div>
    </header>
  );
}