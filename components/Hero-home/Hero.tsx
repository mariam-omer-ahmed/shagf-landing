"use client";
import { useEffect } from "react";

import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroProof from "./HeroProof";
import HeroVideo from "./HeroVideo";
import HeroCTA from "./HeroCTA";
import { trackEvent } from "@/lib/analytics";


export default function Hero() {
   useEffect(() => {
    trackEvent({
      event: "landing_view",
      page: "/",
    });
  }, []);
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