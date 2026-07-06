"use client";

import { motion } from "framer-motion";
import { ShieldCheck, TrendingUp } from "lucide-react";
import { fadeUp } from "./animations";

export default function HeroContent() {
  return (
    <motion.div
      variants={fadeUp}
      className="relative mx-auto max-w-6xl text-center"
    >
      {/* Badge */}

      <div className="inline-flex items-center gap-3 rounded-full border border-red-200 bg-white/90 px-4 py-1 shadow-xl backdrop-blur-xl">

        <span className="relative flex h-3 w-3">

          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-70" />

          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />

        </span>

        <span className="font-bold text-gray-800">

          توقف دقيقة... فقد تكون تحاول حل المشكلة الخطأ.

        </span>

      </div>

      {/* ================= Headline ================= */}
<h1 className="mx-auto mt-8 max-w-4xl text-2xl font-black leading-snug text-gray-900 md:text-3xl xl:text-4xl">

  <span className="block">
    إذا كنت تعتقد أن
  </span>

  <span className="mt-3 block">
    الحصول على وظيفة يحتاج إلى
  </span>

  <span className="mt-4 block bg-gradient-to-l from-[#E96B8A] via-[#D8587C] to-[#E96B8A] bg-clip-text text-transparent">
    المزيد من الكورسات...
  </span>

  <span className="mt-4 block">
    فأنت على الأغلب
  </span>

  <span className="mt-4 inline-block rounded-2xl bg-[#FFF1F5] px-4 py-2 text-[#E96B8A] text-lg">
    تحاول علاج المشكلة الخطأ.
  </span>

</h1>
      {/* ================= Description ================= */}

      <div className="mx-auto mt-14 max-w-4xl space-y-8 text-xl leading-10 text-gray-700">

        <p>

          أغلب الناس لا يفشلون لأنهم لا يتعلمون...

          <br />

          بل لأنهم يتعلمون كل شيء...

          <strong className="text-gray-900">

            إلا الشيء الذي يقرّبهم من أول فرصة عمل.

          </strong>

        </p>

        <p>

          لذلك تجد شخصًا يملك عشرات الشهادات...

          <br />

          وما زال لا يعرف:

        </p>

      </div>

      {/* Pain List */}

      <motion.div
        variants={fadeUp}
        className="mx-auto mt-12 max-w-3xl rounded-3xl border border-red-100 bg-white p-8 shadow-xl"
      >

        <div className="space-y-6 text-right text-lg font-semibold text-gray-900">

          <div>✖ أي مجال هو الأنسب له.</div>

          <div>✖ أي المهارات يطلبها أصحاب العمل فعلًا.</div>

          <div>✖ ماذا يتعلم أولًا وماذا يؤجل.</div>

          <div>✖ متى يصبح جاهزًا للتقديم على الوظائف.</div>

        </div>

      </motion.div>

      {/* Shift */}

      <motion.div
        variants={fadeUp}
        className="mx-auto mt-16 max-w-4xl"
      >

        <h2 className="text-3xl font-black leading-relaxed text-gray-900">

          المشكلة ليست أنك لا تجتهد...

          <br />

          المشكلة أنك تجتهد

          <span className="text-[#E96B8A]">

            في الاتجاه الخطأ.

          </span>

        </h2>

      </motion.div>

      {/* Value */}

      <motion.div
  variants={fadeUp}
  className="mx-auto mt-16 max-w-4xl rounded-[32px] border border-gray-200 bg-white p-10 shadow-xl"
>
  <p className="text-2xl font-black leading-relaxed text-black">
    لهذا السبب لم نصنع كورسًا جديدًا.
  </p>

  <p className="mt-8 text-xl leading-10 text-black">
    صنعنا نظامًا يساعدك أولًا على معرفة:
  </p>

  <div className="mt-10 space-y-5 text-right text-lg text-black">
    
    <div className="flex gap-3">
      <span className="text-[#E96B8A]">✔</span>
      <span>ما المجال الأنسب لك بناءً على وضعك الحالي.</span>
    </div>

    <div className="flex gap-3">
      <span className="text-[#E96B8A]">✔</span>
      <span>ما المهارات التي تستحق وقتك فعلًا.</span>
    </div>

    <div className="flex gap-3">
      <span className="text-[#E96B8A]">✔</span>
      <span>وما الخطوات التي توصلك إلى أول فرصة عمل دون تشتت.</span>
    </div>

  </div>
</motion.div>
      {/* Proof */}

      <motion.div
        variants={fadeUp}
        className="mt-16 flex flex-wrap justify-center gap-5"
      >

        

      </motion.div>

      {/* Final */}

      <motion.div
        variants={fadeUp}
        className="mt-16"
      >

        <p className="text-3xl font-black leading-loose text-gray-900">

          قبل أن تبدأ أي كورس جديد...

          <br />

          اكتشف أولًا

          <span className="text-[#E96B8A]">

            ما الذي يمنعك من الحصول على وظيفة.

          </span>

        </p>

      </motion.div>

    </motion.div>
  );
}