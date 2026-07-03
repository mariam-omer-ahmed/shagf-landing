"use client";

import Image from "next/image";

export default function HeroHome() {
  return (
    <section className="relative overflow-hidden bg-[#FFF8FB]">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-pink-200/30 blur-3xl" />
        <div className="absolute right-0 top-20 h-[420px] w-[420px] rounded-full bg-fuchsia-200/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-rose-100/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-14 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">

          {/* TEXT */}
          <div className="text-center lg:text-right">

            <span className="inline-flex items-center rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-[#E96B8A] shadow-sm">
              🚀 ابدأ رحلتك مع شغف
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight text-gray-900 md:text-5xl xl:text-6xl">
              تعلم المهارات التي تحتاجها الشركات...
              <span className="mt-3 block text-[#E96B8A]">
                وابدأ أول خطوة في مستقبلك.
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-xl text-lg leading-8 text-gray-600 lg:mx-0">
              منصة شغف تساعدك تبني مهارات عملية، مشاريع حقيقية،
              وتستعد لسوق العمل بثقة بدل ما تبقى مجرد خريج بدون خبرة.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">

              <a
                href="/courses"
                className="inline-flex items-center justify-center rounded-xl bg-[#E96B8A] px-8 py-4 text-lg font-bold text-white transition hover:scale-105"
              >
                ابدأ الآن
              </a>

              <a
                href="/success-stories"
                className="inline-flex items-center justify-center rounded-xl border-2 border-[#E96B8A] px-8 py-4 text-lg font-bold text-[#E96B8A] hover:bg-pink-50"
              >
                شاهد قصص النجاح
              </a>

            </div>
          </div>

          {/* IMAGE */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-xl">

              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-pink-300 via-rose-200 to-pink-100 blur-2xl opacity-40" />

              <div className="relative overflow-hidden rounded-[36px] border border-pink-100 bg-white shadow-2xl">

                <Image
                  src="/images/hero.webp"
                  alt="Shaghaf Hero"
                  width={900}
                  height={600}
                  className="object-cover"
                />

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}