import Image from "next/image";
import BlurredShape from "@/public/images/blurred-shape.svg";

export default function Cta() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background shape */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-24 ml-20 -translate-x-1/2 opacity-30"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={BlurredShape}
          width={760}
          height={668}
          alt="background shape"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-16 md:py-24">
          
          {/* Content */}
          <div className="mx-auto max-w-3xl text-center">

            {/* Headline */}
            <h2
              className="text-3xl md:text-5xl font-black text-gray-900 leading-tight"
              data-aos="fade-up"
            >
              توقف عن تجربة كل شيء…
              <span className="block text-[#E96B8A] mt-3">
                وابدأ في طريق واحد واضح.
              </span>
            </h2>

            {/* Sub text */}
            <p
              className="mt-6 text-lg text-gray-600"
              data-aos="fade-up"
              data-aos-delay={200}
            >
              نظام شغف ليس كورس إضافي…
              بل نظام يساعدك تخرج من دائرة الضياع إلى أول فرصة حقيقية.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

              {/* Primary CTA */}
              <a
                className="bg-[#E96B8A] hover:bg-[#d85a78] text-white px-8 py-4 rounded-xl font-bold transition hover:scale-105"
                href="#system"
                data-aos="fade-up"
                data-aos-delay={400}
              >
                ابدأ نظام شغف
              </a>

              {/* Secondary CTA */}
              <a
                className="border border-[#E96B8A] text-[#E96B8A] px-8 py-4 rounded-xl font-bold hover:bg-pink-50 transition"
                href="#compass"
                data-aos="fade-up"
                data-aos-delay={600}
              >
                ابدأ بالبوصلة
              </a>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}