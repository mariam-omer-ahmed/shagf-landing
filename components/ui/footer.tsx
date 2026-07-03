import Logo from "./logo";
import Image from "next/image";
import FooterIllustration from "@/public/images/footer-illustration.svg";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-white">
      
      {/* Background */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -translate-x-1/2 opacity-30"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={FooterIllustration}
          width={1076}
          height={378}
          alt="Shaghaf illustration"
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">

        {/* Main CTA inside footer */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            لا تنهي الصفحة…
            <span className="block text-[#E96B8A] mt-2">
              قبل أن تبدأ اتجاهك المهني الصحيح
            </span>
          </h2>

          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            أغلب الناس يغادرون وهم ما زالوا في نفس الدائرة.
            شغف يبدأ عندما تتخذ قرارًا واضحًا.
          </p>

          <a
            href="#compass"
            className="inline-flex mt-8 bg-[#E96B8A] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#d85a78] transition"
          >
            ابدأ بالبوصلة الآن
          </a>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">

          {/* System */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">نظام شغف</h3>
            <ul className="space-y-2 text-gray-600">
              <li>كيف يعمل النظام</li>
              <li>مراحل الجاهزية</li>
              <li>لماذا لا تكفي الكورسات</li>
            </ul>
          </div>

          {/* Compass */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">البوصلة</h3>
            <ul className="space-y-2 text-gray-600">
              <li>ما هي البوصلة</li>
              <li>كيف تساعدك</li>
              <li>احجز جلسة</li>
            </ul>
          </div>

          {/* Results */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">النتائج</h3>
            <ul className="space-y-2 text-gray-600">
              <li>قصص نجاح</li>
              <li>أول وظيفة</li>
              <li>أول مشروع</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">تواصل</h3>
            <ul className="space-y-2 text-gray-600">
              <li>إنستغرام</li>
              <li>واتساب</li>
              <li>الدعم</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col md:flex-row justify-between items-center border-t pt-6">
          
          <Logo />

          <p className="text-sm text-gray-500 mt-4 md:mt-0">
            © نظام شغف — بناء الجاهزية المهنية
          </p>

        </div>
      </div>
    </footer>
  );
}