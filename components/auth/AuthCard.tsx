"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  badge: string;
  title: string;
  subtitle: string;
};

const STEPS = [
  "إنشاء الحساب",
  "المصادر المجانية",
  "أول دخل",
];

export default function AuthCard({
  children,
  badge,
  title,
  subtitle,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .5 }}
      className="
      overflow-hidden
      rounded-[34px]
      border
      border-[#EFE6EA]
      bg-white
      shadow-[0_35px_90px_rgba(233,107,138,.12)]
    "
    >
      {/* ================= HEADER ================= */}

      <div className="relative overflow-hidden bg-[#14171F] px-9 pt-8 pb-9">

        {/* Glow */}

        <div className="absolute -right-20 top-0 h-56 w-56 rounded-full bg-[#E96B8A]/10 blur-[90px]" />

        <div className="absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[#FFD8E5]/10 blur-[80px]" />

        {/* Logo */}

        <div className="relative flex items-center gap-3">

          <div
            className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-[#E96B8A]
            text-lg
            font-black
            text-white
          "
          >
            ش
          </div>

          <div>

            <p className="font-black tracking-wide text-white">
              نظام شغف
            </p>

            <p className="text-sm text-white/60">
              Career Transformation System
            </p>

          </div>

        </div>

        {/* Badge */}

        <div className="mt-8 inline-flex rounded-full bg-[#E96B8A]/15 px-5 py-2">

          <span className="text-sm font-bold text-[#FFDCE7]">
            {badge}
          </span>

        </div>

        {/* Title */}

        <h1 className="mt-6 text-4xl font-black leading-[1.5] text-white">

          {title}

        </h1>

        {/* Subtitle */}

        <p className="mt-5 text-lg leading-9 text-white/70">

          {subtitle}

        </p>

      </div>

      {/* ================= BODY ================= */}

      <div className="bg-[#FFF8FB] px-8 py-8">

        {/* Journey */}

        <div className="mb-8 flex items-center justify-between">

          {STEPS.map((step, i) => (
            <div
              key={step}
              className="flex flex-1 items-center"
            >
              <div className="flex flex-col items-center">

                <div
                  className={`
                  h-4
                  w-4
                  rounded-full
                  ${
                    i === 0
                      ? "bg-[#E96B8A]"
                      : "bg-pink-200"
                  }
                `}
                />

                <span className="mt-3 text-xs font-bold text-gray-700">

                  {step}

                </span>

              </div>

              {i !== STEPS.length - 1 && (
                <div className="mx-3 h-[2px] flex-1 bg-pink-100" />
              )}
            </div>
          ))}
        </div>

        {children}

      </div>
    </motion.div>
  );
}