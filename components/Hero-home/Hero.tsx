"use client";

import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroProof from "./HeroProof";
import HeroVideo from "./HeroVideo";
import HeroCTA from "./HeroCTA";


export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-[#FFF9FB]"
      style={{
        fontFamily:
          "'Cairo','IBM Plex Sans Arabic','Tajawal',sans-serif",
      }}
    >
      <HeroBackground />

      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-24">
        <HeroContent />

        <HeroProof />

        <HeroVideo />
        <HeroCTA />
      </div>
    </section>
  );
}