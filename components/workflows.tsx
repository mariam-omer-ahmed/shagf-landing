import Image from "next/image";
import WorflowImg01 from "@/public/images/workflow-01.png";
import WorflowImg02 from "@/public/images/workflow-02.png";
import WorflowImg03 from "@/public/images/workflow-03.png";
import Spotlight from "@/components/spotlight";

export default function Workflows() {
  return (
    <section className="bg-[#FFF8FB]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 md:pb-20">

          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-pink-200/60 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-pink-200/60">

              <span className="inline-flex bg-gradient-to-r from-[#E96B8A] to-pink-300 bg-clip-text text-transparent">
                نظام شغف
              </span>

            </div>

            <h2 className="bg-gradient-to-r from-gray-900 via-[#E96B8A] to-gray-900 bg-[length:200%_auto] bg-clip-text pb-4 text-3xl font-semibold text-transparent md:text-4xl">
              رحلتك المهنية تبدأ من هنا
            </h2>

            <p className="text-lg text-gray-600">
              نظام شغف يساعدك تفهم طريقك، تبني مهاراتك، وتدخل سوق العمل بخطوات واضحة بدل الضياع.
            </p>
          </div>

          {/* Spotlight items */}
          <Spotlight className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-3">

            {/* Card 1 */}
            <a
              className="group/card relative h-full overflow-hidden rounded-2xl bg-white p-px shadow-sm before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-[#E96B8A]/30 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 after:pointer-events-none after:absolute after:-left-48 after:-top-48 after:z-30 after:h-64 after:w-64 after:translate-x-[var(--mouse-x)] after:translate-y-[var(--mouse-y)] after:rounded-full after:bg-pink-300/40 after:opacity-0 after:blur-3xl after:transition-opacity after:duration-500 hover:after:opacity-20 group-hover:before:opacity-100"
              href="#0"
            >
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-white border border-pink-100">

                <div className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-pink-100 bg-pink-50 text-[#E96B8A] opacity-0 transition-opacity group-hover/card:opacity-100">
                  →
                </div>

                <Image
                  className="inline-flex"
                  src={WorflowImg01}
                  width={350}
                  height={288}
                  alt="Workflow 01"
                />

                <div className="p-6">
                  <div className="mb-3">
                    <span className="rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-normal text-[#E96B8A] border border-pink-100">
                      البوصلة
                    </span>
                  </div>

                  <p className="text-gray-600">
                    نحدد لك الاتجاه الصحيح بدل ما تضيّع وقتك في مهارات عشوائية.
                  </p>
                </div>

              </div>
            </a>

            {/* Card 2 */}
            <a
              className="group/card relative h-full overflow-hidden rounded-2xl bg-white p-px shadow-sm before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-[#E96B8A]/30 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 after:pointer-events-none after:absolute after:-left-48 after:-top-48 after:z-30 after:h-64 after:w-64 after:translate-x-[var(--mouse-x)] after:translate-y-[var(--mouse-y)] after:rounded-full after:bg-pink-300/40 after:opacity-0 after:blur-3xl after:transition-opacity after:duration-500 hover:after:opacity-20 group-hover:before:opacity-100"
              href="#0"
            >
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-white border border-pink-100">

                <div className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-pink-100 bg-pink-50 text-[#E96B8A] opacity-0 transition-opacity group-hover/card:opacity-100">
                  →
                </div>

                <Image
                  className="inline-flex"
                  src={WorflowImg02}
                  width={350}
                  height={288}
                  alt="Workflow 02"
                />

                <div className="p-6">
                  <div className="mb-3">
                    <span className="rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-normal text-[#E96B8A] border border-pink-100">
                      الانطلاق
                    </span>
                  </div>

                  <p className="text-gray-600">
                    نبني لك المهارات والملف المهني عشان تبدأ أول فرصة حقيقية.
                  </p>
                </div>

              </div>
            </a>

            {/* Card 3 */}
            <a
              className="group/card relative h-full overflow-hidden rounded-2xl bg-white p-px shadow-sm before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-[#E96B8A]/30 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 after:pointer-events-none after:absolute after:-left-48 after:-top-48 after:z-30 after:h-64 after:w-64 after:translate-x-[var(--mouse-x)] after:translate-y-[var(--mouse-y)] after:rounded-full after:bg-pink-300/40 after:opacity-0 after:blur-3xl after:transition-opacity before:duration-500 hover:after:opacity-20 group-hover:before:opacity-100"
              href="#0"
            >
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-white border border-pink-100">

                <div className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-pink-100 bg-pink-50 text-[#E96B8A] opacity-0 transition-opacity group-hover/card:opacity-100">
                  →
                </div>

                <Image
                  className="inline-flex"
                  src={WorflowImg03}
                  width={350}
                  height={288}
                  alt="Workflow 03"
                />

                <div className="p-6">
                  <div className="mb-3">
                    <span className="rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-normal text-[#E96B8A] border border-pink-100">
                      التمكين
                    </span>
                  </div>

                  <p className="text-gray-600">
                    متابعة مستمرة لحد ما تدخل السوق وتبدأ تحقق نتائج فعلية.
                  </p>
                </div>

              </div>
            </a>

          </Spotlight>
        </div>
      </div>
    </section>
  );
}