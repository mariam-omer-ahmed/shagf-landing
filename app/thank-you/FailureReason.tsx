"use client";

import { motion } from "framer-motion";
import {
  XCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function FailureReason() {
  return (
    <section className="bg-[#FFF8FB] py-24">

      <div className="mx-auto max-w-6xl px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl text-center"
        >

          <span className="rounded-full bg-red-100 px-5 py-2 text-sm font-bold text-red-600">

            السبب الحقيقي

          </span>

          <h2 className="mt-8 text-5xl font-black leading-tight text-gray-900">

            لماذا لا يحصل أغلب الناس
            <br />

            على وظيفة...

            <span className="text-[#E96B8A]">

              رغم أنهم يتعلمون باستمرار؟

            </span>

          </h2>

        </motion.div>

        {/* Intro */}

        <div className="mx-auto mt-16 max-w-3xl space-y-8 text-center text-xl leading-[2.1] text-gray-700">

          <p>

            لأنهم يظنون أن المشكلة هي:

            <strong className="text-gray-900">
              نقص المهارات.
            </strong>

          </p>

          <p>

            فيبدؤون بجمع الشهادات...

            ثم دورة جديدة...

            ثم تخصص جديد...

            ثم منصة جديدة...

          </p>

        </div>

        {/* Wrong */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 rounded-[32px] border border-red-200 bg-white p-10 shadow-sm"
        >

          <div className="flex items-center gap-3">

            <XCircle
              className="text-red-500"
              size={28}
            />

            <h3 className="text-3xl font-black">

              وهذا هو الخطأ.

            </h3>

          </div>

          <div className="mt-10 grid gap-5">

            {[
              "تتعلم مهارة لا يحتاجها السوق الآن.",
              "تتعلم بالترتيب الخطأ.",
              "لا تعرف ماذا تتجاهل.",
              "لا تعرف كيف تربط المهارة بفرصة عمل.",
              "تقيس تقدمك بعدد الكورسات وليس بعدد الفرص.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-4 rounded-2xl bg-red-50 p-5"
              >
                <XCircle
                  className="mt-1 text-red-500 shrink-0"
                  size={20}
                />

                <p className="text-lg text-gray-800">

                  {item}

                </p>

              </div>
            ))}

          </div>

        </motion.div>

        {/* Big Quote */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto mt-20 max-w-4xl text-center"
        >

          <h3 className="text-4xl font-black leading-[1.8] text-gray-900">

            المشكلة ليست أنك
            <span className="text-[#E96B8A]">

- لا تتعلم
            </span>

            <br />

            المشكلة أنك

            <span className="text-[#E96B8A]">

- لا تعرف ماذا تتعلم؟
            </span>

            ومتى؟

            ولماذا؟

          </h3>

        </motion.div>

        {/* Solution */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 rounded-[36px] bg-gradient-to-l from-[#E96B8A] to-[#d95d7d] p-12 text-white shadow-2xl"
        >

          <div className="mx-auto max-w-4xl">

            <div className="flex items-center gap-3">

              <CheckCircle2 size={28} />

              <h3 className="text-3xl font-black">

                لهذا السبب أنشأنا نظام شغف.

              </h3>

            </div>

            <p className="mt-8 text-xl leading-[2]">

              قبل أن تبدأ أي كورس...

              قبل أن تدفع أي مبلغ...

              وقبل أن تضيع أشهراً أخرى...

              نحن نحدد لك:

            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-2">

              {[
                "ما المجال الأنسب لك.",
                "ما المهارة التي تستحق وقتك.",
                "ما الذي يجب تجاهله.",
                "ما الخطوة التالية بالترتيب الصحيح.",
                "كيف تصل لأول فرصة بأقصر طريق.",
                "ومتى تكون جاهزاً للانتقال للمرحلة التالية.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-white/10 p-5 backdrop-blur"
                >
                  <CheckCircle2
                    size={20}
                    className="mt-1 shrink-0"
                  />

                  <span className="text-lg">

                    {item}

                  </span>

                </div>
              ))}

            </div>

            <div className="mt-12 flex justify-center">

              <div className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-5 font-black text-[#E96B8A]">

                لهذا يختلف نظام شغف عن أي كورس تقليدي

                <ArrowRight size={20} />

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}