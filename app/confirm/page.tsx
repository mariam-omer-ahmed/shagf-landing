"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  MessageCircle,
  FileText,
  ArrowLeft,
} from "lucide-react";

const packages: Record<string, { title: string; price: string }> = {
  bousola: { title: "باقة البوصلة", price: "9 دولار" },
  intilaqah: { title: "باقة الانطلاقة", price: "39 دولار" },
  tamkeen: { title: "باقة التمكين", price: "99 دولار" },
};

const WHATSAPP_NUMBER = "00249963370737";
const WHATSAPP_DISPLAY = "+249 96 337 0737";
const GOOGLE_FORM_URL = "https://forms.gle/pMMeBLad7aMJSx5z7";

export default function ConfirmPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmPageContent />
    </Suspense>
  );
}

function ConfirmPageContent() {
  const searchParams = useSearchParams();

  const packageId = searchParams.get("package") ?? "intilaqah";
  const pkg = packages[packageId] ?? packages.intilaqah;

  const name = searchParams.get("name") ?? "عزيزي العميل";

  const whatsappMessage = `مرحبًا، أنا ${name}، مهتم بـ ${pkg.title} (${pkg.price}) في نظام شغف.`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#FFF8FB] via-white to-[#FFF8FB] px-4 py-16"
      style={{
        fontFamily: "'Cairo','IBM Plex Sans Arabic','Tajawal',sans-serif",
      }}
    >
      <div className="mx-auto max-w-xl text-center">

        {/* BADGE */}
        <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-5 py-2 text-sm font-bold text-[#E96B8A] shadow-sm">
          <CheckCircle2 size={16} />
          تم استلام بياناتك بنجاح
        </div>

        {/* TITLE */}
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-[1.4]">
          خطوتان أخيرتان فقط
          <br />
          <span className="text-[#E96B8A]">
            لتأكيد تسجيلك في النظام
          </span>
        </h1>

        <p className="mt-4 text-gray-600 leading-7">
          اخترت <span className="font-bold text-gray-900">{pkg.title}</span>{" "}
          ({pkg.price}). أكمل الخطوات التالية لتفعيل طلبك.
        </p>

        {/* STEP 1 */}
        <div className="mt-10 rounded-[28px] border border-pink-100 bg-white p-8 text-right shadow-[0_20px_60px_rgba(0,0,0,0.06)]">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9F9EE] text-green-600 font-black">
              1
            </div>
            <h2 className="text-xl font-black text-gray-900">
              تواصل معنا عبر واتساب
            </h2>
          </div>

          <p className="mt-4 text-gray-600 leading-7">
            تواصل معنا لتأكيد الطلب واستكمال التفاصيل.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 py-4 font-bold text-white shadow-lg transition hover:bg-green-600"
          >
            <MessageCircle size={20} />
            راسلنا على {WHATSAPP_DISPLAY}
          </a>
        </div>

        {/* STEP 2 */}
        <div className="mt-6 rounded-[28px] border border-pink-100 bg-white p-8 text-right shadow-[0_20px_60px_rgba(0,0,0,0.06)]">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF0F4] text-[#E96B8A] font-black">
              2
            </div>
            <h2 className="text-xl font-black text-gray-900">
              نموذج التسجيل الرسمي
            </h2>
          </div>

          <p className="mt-4 text-gray-600 leading-7">
            أكمل النموذج لتثبيت طلبك بشكل رسمي داخل النظام.
          </p>

          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E96B8A] py-4 font-bold text-white shadow-lg transition hover:bg-[#d95d7d]"
          >
            <FileText size={20} />
            افتح نموذج التسجيل
          </a>
        </div>

        {/* BACK */}
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#E96B8A]"
        >
          <ArrowLeft size={16} />
          العودة للرئيسية
        </Link>
      </div>
    </main>
  );
}