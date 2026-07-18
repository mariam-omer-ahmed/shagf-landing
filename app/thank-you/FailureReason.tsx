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
  لماذا يبقى الكثيرون
  <br />
  في نفس المكان...

  <span className="text-[#E96B8A]">
    رغم أنهم يتعلمون باستمرار؟
  </span>
</h2>

        </motion.div>

        {/* Intro */}

  



        <motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="mt-16 grid gap-6 md:grid-cols-3"
>

  <div className="group overflow-hidden rounded-[28px] bg-white shadow-sm">

    <div className="relative h-80 overflow-hidden">

      <img
        src="/images/x1.jpg"
        alt=""
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-6 right-6 left-6">

        <h3 className="text-2xl font-black text-white leading-relaxed">
          تتعلم باستمرار...
          <br />
          لكنك لا ترى النتيجة التي تنتظرها
        </h3>

      </div>

    </div>

  </div>

  <div className="group overflow-hidden rounded-[28px] bg-white shadow-sm">

    <div className="relative h-80 overflow-hidden">

      <img
        src="/images/x2.jpg"
        alt=""
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-6 right-6 left-6">

        <h3 className="text-2xl font-black text-white leading-relaxed">
          تجمع الشهادات...
          <br />
          لكن الفرص لا تتغير
        </h3>

      </div>

    </div>

  </div>

  <div className="group overflow-hidden rounded-[28px] bg-white shadow-sm">

    <div className="relative h-80 overflow-hidden">

      <img
        src="/images/x4.jpg"
        alt=""
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-6 right-6 left-6">

        <h3 className="text-2xl font-black text-white leading-relaxed">
          المشكلة ليست في قدراتك...
          <br />
          بل في الطريق الذي تسير فيه
        </h3>

      </div>

    </div>

  </div>

</motion.div>

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

         <h3 className="text-3xl font-black text-[#111827]">
  هذه هي الأخطاء التي تمنعك من الفرص
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
{/* Solution */}

<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  className="mt-24 overflow-hidden rounded-[36px] bg-gradient-to-l from-[#5a2834] to-[#431e28] p-12 text-white shadow-2xl"
>

  <div className="mx-auto max-w-5xl">

    <div className="text-center">

      <div className="inline-flex items-center gap-3 rounded-full bg-white/15 px-5 py-3 backdrop-blur">
        <CheckCircle2 size={22} />
        <span className="font-bold">
          نظام شغف
        </span>
      </div>

      <h3 className="mt-8 text-5xl font-black">
        لا نبدأ بالكورسات...
      </h3>

      <p className="mt-6 text-2xl text-white/90">
        نبدأ بتحديد الطريق الصحيح أولاً
      </p>

    </div>

    <div className="relative mx-auto mt-20 max-w-3xl">

      <div className="absolute right-6 top-0 bottom-0 w-[3px] bg-white/20" />

      {[
        {
          number: "01",
          title: "فهم وضعك الحالي",
          text: "نعرف أين تقف الآن وما الذي يمنعك من الوصول للفرصة المناسبة."
        },
        {
          number: "02",
          title: "تحديد المسار المناسب",
          text: "نختار المجال الذي يناسب قدراتك وأهدافك وسوق العمل."
        },
        {
          number: "03",
          title: "اختيار المهارة الصحيحة",
          text: "بدلاً من تعلم كل شيء، نحدد ما يستحق وقتك فعلاً."
        },
        {
          number: "04",
          title: "خطة تنفيذ واضحة",
          text: "نعطيك خطوات مرتبة تعرف من خلالها ماذا تفعل بعد ذلك."
        },
        {
          number: "05",
          title: "الاستعداد للفرصة",
          text: "حتى تصبح جاهزاً للتقديم والعمل بثقة."
        },
      ].map((step) => (

        <motion.div
          key={step.number}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mb-8 mr-16 rounded-[28px] bg-white/10 p-6 backdrop-blur"
        >

          <div className="absolute -right-[52px] top-7 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#E96B8A] font-black">
            ✓
          </div>

          <span className="text-sm font-bold text-white/60">
            {step.number}
          </span>

          <h4 className="mt-2 text-2xl font-black">
            {step.title}
          </h4>

          <p className="mt-3 leading-8 text-white/80">
            {step.text}
          </p>

        </motion.div>

      ))}

    </div>

    <div className="mt-12 flex justify-center">

      <div className="rounded-full bg-white px-8 py-5 text-center font-black text-[#E96B8A]">

        <br />
        نظام شغف يعطيك الخطوة التالية التي تحتاجها الآن.

      </div>

    </div>

  </div>

</motion.div>

      </div>

    </section>
  );
}