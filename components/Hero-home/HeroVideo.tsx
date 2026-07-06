"use client";

import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import FloatingCards from "./FloatingCards";

export default function HeroVideo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="relative mt-24"
    >
      <div className="relative mx-auto max-w-[820px]">

        {/* Floating Cards */}
        <FloatingCards />

        {/* Video */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-[38px] border border-pink-200 bg-black shadow-[0_45px_120px_rgba(0,0,0,.22)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-pink-300/20 via-transparent to-fuchsia-300/20" />

          <iframe
            className="aspect-video w-full"
            src="https://www.youtube.com/embed/5dZGWT72VNM"
            title="SHAGF'S System System"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>

        {/* Caption */}
        <div className="mt-8 flex items-center justify-center gap-3 text-center">
          <PlayCircle className="h-5 w-5 text-[#E96B8A]" />

          <span className="text-lg font-medium text-gray-700">
            شاهد كيف ينتقل المتدرب من الحيرة إلى خطة واضحة خلال دقائق.
          </span>
        </div>

      </div>
    </motion.div>
  );
}