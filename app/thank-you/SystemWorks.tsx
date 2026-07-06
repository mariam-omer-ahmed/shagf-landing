"use client";

import { motion } from "framer-motion";
import {
  Compass,
  SearchCheck,
  Route,
  Rocket,
  CheckCircle2,
} from "lucide-react";

const STEPS = [
  {
    icon: SearchCheck,
    number: "01",
    title: "نفهم وضعك الحقيقي أولًا",
    text: "لا نبدأ بإعطائك محتوى. نبدأ بفهم مستواك الحالي، أهدافك، نقاط قوتك، وما الذي يمنعك من الوصول لفرصة عمل.",
  },
  {
    icon: Compass,
    number: "02",
    title: "نحدد الاتجاه الصحيح",
    text: "نرسم لك المسار الذي يناسبك، ونستبعد عشرات الخيارات التي ستضيع وقتك دون فائدة.",
  },
  {
    icon: Route,
    number: "03",
    title: "نبني خطة تنفيذ واضحة",
    text: "تعرف ماذا تتعلم، وبأي ترتيب، ومتى تنتقل للخطوة التالية، دون عشوائية أو تخمين.",
  },
  {
    icon: Rocket,
    number: "04",
    title: "نتابعك حتى تظهر النتائج",
    text: "لا نتركك بعد أول درس. نتابع تنفيذك، ونصحح المسار إذا احتجت، حتى تقترب من أول فرصة عمل حقيقية.",
  },
];

export default function SystemWorks() {
  return (
    <section className="bg-white py-24">

      <div className="mx-auto max-w-6xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >

          <span className="rounded-full bg-pink-100 px-5 py-2 text-sm font-bold text-[#E96B8A]">

            كيف يعمل نظام شغف؟

          </span>

          <h2 className="mt-8 text-5xl font-black leading-tight text-gray-900">

            لا نضيف معلومات جديدة...

            <br />

            <span className="text-[#E96B8A]">

              بل نزيل الفوضى أولًا.

            </span>

          </h2>

          <p className="mt-8 text-xl leading-[2] text-gray-600">

            أغلب الناس يعرفون ماذا يتعلمون...

            لكنهم لا يعرفون:

            <strong className="text-gray-900">

              ماذا يتجاهلون.

            </strong>

            وهذا هو سبب ضياع السنوات.

          </p>

        </motion.div>

        <div className="mt-20 space-y-8">

          {STEPS.map((step, index) => {
            const Icon = step.icon;

            return (

              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * .12 }}
                viewport={{ once: true }}
                className="rounded-[30px] border border-pink-100 bg-[#FFF9FB] p-8 shadow-sm"
              >

                <div className="grid gap-8 md:grid-cols-[90px_1fr]">

                  <div className="flex flex-col items-center">

                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E96B8A] text-white">

                      <Icon size={34} />

                    </div>

                    <span className="mt-4 text-sm font-black text-[#E96B8A]">

                      {step.number}

                    </span>

                  </div>

                  <div>

                    <h3 className="text-3xl font-black text-gray-900">

                      {step.title}

                    </h3>

                    <p className="mt-5 text-lg leading-[2] text-gray-700">

                      {step.text}

                    </p>

                  </div>

                </div>

              </motion.div>

            );
          })}

        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto mt-20 max-w-4xl rounded-[32px] bg-gradient-to-l from-[#E96B8A] to-[#d95d7d] p-10 text-white"
        >

          <h3 className="text-center text-3xl font-black">

            لهذا السبب تختلف النتائج.

          </h3>

          <div className="mt-10 grid gap-5 md:grid-cols-2">

            {[
              "لا تبدأ بالتعلم قبل معرفة الاتجاه.",
              "لا تشتري كورسات لن تحتاجها.",
              "لا تتوقف بسبب الحيرة.",
              "تتحرك بخطة واضحة.",
              "تعرف ما الذي يجب فعله هذا الأسبوع.",
              "كل خطوة لها هدف واضح.",
            ].map((item) => (

              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-white/10 p-5 backdrop-blur"
              >

                <CheckCircle2 className="mt-1 shrink-0" size={20} />

                <span className="text-lg">

                  {item}

                </span>

              </div>

            ))}

          </div>

        </motion.div>

      </div>

    </section>
  );
}