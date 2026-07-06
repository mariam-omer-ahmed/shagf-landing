"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Compass,
  Briefcase,
} from "lucide-react";

export default function FloatingCards() {
  return (
    <>
      {/* LEFT */}

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
className="absolute -left-[340px] top-12 z-20 hidden w-72 rounded-[30px] border border-white/60 bg-white/85 p-6 shadow-[0_30px_80px_rgba(0,0,0,.10)] backdrop-blur-xl 2xl:block"      >
        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100">
            <Compass className="text-[#E96B8A]" />
          </div>

          <div>

            <p className="font-black text-gray-900">
              تم تحليل مسارك
            </p>

            <p className="text-sm text-gray-500">
              بناءً على إجاباتك
            </p>

          </div>

        </div>

        <div className="mt-6 space-y-4">

          <div className="flex items-center gap-3">

            <CheckCircle2
              className="text-green-500"
              size={18}
            />

            <span className="text-gray-700">
              أفضل نقطة بداية تم تحديدها.
            </span>

          </div>

          <div className="flex items-center gap-3">

            <CheckCircle2
              className="text-green-500"
              size={18}
            />

            <span className="text-gray-700">
              المهارات غير الضرورية تم استبعادها.
            </span>

          </div>

          <div className="flex items-center gap-3">

            <CheckCircle2
              className="text-green-500"
              size={18}
            />

            <span className="text-gray-700">
              خطة أول 90 يومًا أصبحت جاهزة.
            </span>

          </div>

        </div>
      </motion.div>

      {/* RIGHT */}

      <motion.div
        animate={{ y: [0, 14, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
className="absolute -right-[340px] top-20 z-20 hidden w-72 rounded-[30px] border border-pink-200 bg-white/90 p-6 shadow-[0_30px_80px_rgba(233,107,138,.18)] backdrop-blur-xl 2xl:block"      >
        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100">
            <TrendingUp className="text-[#E96B8A]" />
          </div>

          <div>

            <p className="font-black text-gray-900">
              تقدمك الحالي
            </p>

            <p className="text-sm text-gray-500">
              بعد بدء النظام
            </p>

          </div>

        </div>

        <div className="mt-7 rounded-2xl bg-[#FFF8FB] p-4">

          <div className="mb-2 flex justify-between">

            <span className="text-sm text-gray-500">
              وضوح المسار
            </span>

            <span className="font-bold text-[#E96B8A]">
              92%
            </span>

          </div>

          <div className="h-2 rounded-full bg-pink-100">

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "92%" }}
              transition={{
                duration: 1.4,
                delay: .4,
              }}
              className="h-full rounded-full bg-gradient-to-r from-[#E96B8A] to-pink-400"
            />

          </div>

        </div>

        <div className="mt-6 flex items-center gap-3">

          <Briefcase
            className="text-[#E96B8A]"
            size={18}
          />

          <span className="text-gray-700">
            أصبحت تعرف ما الذي يقربك من أول وظيفة.
          </span>

        </div>

        <div className="mt-4 flex items-center gap-3">

          <Sparkles
            className="text-[#E96B8A]"
            size={18}
          />

          <span className="font-bold text-gray-900">
            لا مزيد من التعلم العشوائي.
          </span>

        </div>

      </motion.div>
    </>
  );
}