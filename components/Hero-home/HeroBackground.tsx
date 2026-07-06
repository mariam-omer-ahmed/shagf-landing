"use client";

import { motion } from "framer-motion";

export default function HeroBackground() {
  return (
    <>
      {/* ================= Animated Background ================= */}

      <div className="absolute inset-0 overflow-hidden">

        {/* Aurora Left */}
        <motion.div
          animate={{
            x: [0, 90, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-44 -top-44 h-[760px] w-[760px] rounded-full bg-pink-300/30 blur-[180px]"
        />

        {/* Aurora Right */}
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 70, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-44 top-0 h-[720px] w-[720px] rounded-full bg-fuchsia-300/20 blur-[170px]"
        />

        {/* Aurora Bottom */}
        <motion.div
          animate={{
            scale: [1, 1.18, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-260px] left-1/2 h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-rose-200/30 blur-[180px]"
        />

        {/* Small Glow */}
        <motion.div
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-1/4 top-40 h-40 w-40 rounded-full bg-pink-400/20 blur-[90px]"
        />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg,#000 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Noise */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle,#000 1px,transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#FFF9FB] to-transparent" />

      </div>
    </>
  );
}