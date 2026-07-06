"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import HeroResult from "./HeroResult";
import PackagesComparison from "./PackagesComparison";
import RealitySection from "./RealitySection";
import FailureReason from "./FailureReason";
import SystemWorks from "./SystemWorks";
import Transformation from "./Transformation";
import Objections from "./Objections";
import Guarantee from "./Guarantee";
import FinalCTA from "./FinalCTA";

function ThankYouContent() {
  const searchParams = useSearchParams();

  const packageName =
    searchParams.get("package") ?? "intilaqah";

  return (
    <main
      dir="rtl"
      className="overflow-x-hidden bg-[#FFF8FB]"
      style={{
        fontFamily:
          "'Cairo','IBM Plex Sans Arabic','Tajawal',sans-serif",
      }}
    >
      {/* 1- نتيجة الفلتر */}
      <HeroResult packageName={packageName} />

      {/* 2- لماذا أنت هنا أصلاً؟ */}
      <RealitySection />

      {/* 3- السبب الحقيقي */}
      <FailureReason />

      {/* 4- كيف يعمل النظام */}
      <SystemWorks />

      {/* 5- التحول */}
      <Transformation />

      {/* 6- الاعتراضات */}
      <Objections />

      {/* 7- عرض الباقات (هنا فقط 🔥) */}
      <PackagesComparison packageName={packageName} />

      {/* 8- الضمان */}
      <Guarantee />

      {/* 9- الدعوة الأخيرة */}
      <FinalCTA />
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FFF8FB]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E96B8A] border-t-transparent" />
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}