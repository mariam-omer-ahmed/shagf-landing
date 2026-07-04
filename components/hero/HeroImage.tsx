"use client";

import { motion } from "framer-motion";

export default function HeroImage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      className="relative flex justify-center"
    >
      {/* Decorative Blobs */}
      <div className="absolute -top-8 -left-6 h-24 w-24 rounded-full bg-pink-200/40 blur-2xl" />
      <div className="absolute -bottom-10 -right-6 h-32 w-32 rounded-full bg-rose-300/30 blur-3xl" />

      {/* Floating Card Left */}
      <motion.div
        animate={{ y: [-6, 6, -6] }}
        transition={{ repeat: Infinity, duration: 4, ease: [0.42, 0, 0.58, 1] }}
        className="absolute left-0 top-8 z-20 hidden rounded-2xl bg-white p-4 shadow-xl lg:block"
      >
        <p className="text-xs text-gray-500">معدل التوظيف</p>
        <h3 className="mt-1 text-2xl font-black text-[#E96B8A]">
          +92%
        </h3>
      </motion.div>

      {/* Floating Card Right */}
      <motion.div
        animate={{ y: [5, -5, 5] }}
        transition={{ repeat: Infinity, duration: 3.8, ease: [0.42, 0, 0.58, 1] }}
        className="absolute bottom-10 right-0 z-20 hidden rounded-2xl bg-white p-4 shadow-xl lg:block"
      >
        <p className="text-xs text-gray-500">مشاريع عملية</p>
        <h3 className="mt-1 text-2xl font-black text-[#E96B8A]">
          40+
        </h3>
      </motion.div>

      {/* Image Container */}
      <div className="relative w-full max-w-xl">
        <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-pink-300 via-rose-200 to-pink-100 blur-2xl opacity-40" />

        <div className="relative overflow-hidden rounded-[36px] border border-pink-100 bg-white shadow-2xl">
          <img
            src="/images/hero.webp"
            alt="Passion Academy"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}