"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowDown } from "lucide-react";
import Link from "next/link"; 
type Props = {
  packageName?: string;
};

const packageData: Record<
  string,
  { title: string; reason: string }
> = {
  bousola: {
    title: "باقة بوصلة",
    reason:
      "لأنك ما زلت في مرحلة اكتشاف الاتجاه المناسب، وأهم خطوة الآن هي بناء مسار واضح قبل استثمار وقتك وجهدك في تعلم مهارات قد لا تحتاجها.",
  },

  intilaqah: {
    title: "باقة انطلاقة",
    reason:
      "لأن لديك أساسًا جيدًا، لكنك تحتاج إلى ترتيب خطواتك وتحويل ما تعلمته إلى خطة عملية تقودك إلى أول فرصة حقيقية.",
  },

  tamkeen: {
    title: "باقة تمكين",
    reason:
      "لأنك قطعت شوطًا جيدًا في التعلم، وما ينقصك الآن هو التنفيذ الصحيح، والمتابعة، وربط مهاراتك بمتطلبات سوق العمل.",
  },
};

export default function HeroResult({ packageName }: Props) {
  const safeKey = packageName ?? "intilaqah";

  const current =
    packageData[safeKey] ?? packageData.intilaqah;

  return (
    <section className="relative overflow-hidden py-20">
      {/* الخلفية */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8FB] via-white to-[#FFF8FB]" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 rounded-full border border-pink-200 bg-white px-6 py-3 shadow-lg"
        >
          <CheckCircle2 className="text-[#E96B8A]" size={22} />

          <span className="font-bold text-gray-800">
            تم تحليل إجاباتك بنجاح
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-10 text-5xl font-black leading-tight text-gray-900"
        >
          انتهينا من تحليل وضعك الحالي
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-8 max-w-2xl text-xl leading-10 text-gray-600"
        >
          بناءً على إجاباتك...
          <br />
          هذه هي الباقة التي نرى أنها الأنسب لك في هذه المرحلة.
        </motion.p>

        {/* PACKAGE (FULL DETAILS) */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mx-auto mt-12 max-w-xl rounded-3xl bg-white border border-pink-200 p-8 shadow-lg text-right"
        >
          <h2 className="text-3xl font-black text-[#E96B8A]">
            {current.title}
          </h2>

          <p className="mt-6 text-lg leading-9 text-gray-700">
            {current.reason}
          </p>
     <div className="mt-8 flex justify-center">
  <Link
    href="#packages"
    scroll
    className="inline-flex items-center gap-3 rounded-full bg-[#0F172A] px-8 py-4 text-white font-bold transition-all duration-300 hover:bg-black hover:scale-105"
  >
    عرض جميع الباقات والأسعار
  </Link>
</div>
        </motion.div>

        {/* CTA hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mx-auto mt-14 max-w-2xl"
        >
          <p className="text-2xl font-black text-gray-900">
            لكن...
          </p>

          <p className="mt-5 text-xl leading-10 text-gray-700">
            لا تتسرع في اتخاذ القرار.
            <br />
            لأن المشكلة ليست اختيار الباقة...
            <br />
            بل فهم السبب الحقيقي الذي أوصلك إلى هذه المرحلة.
          </p>
        </motion.div>

        {/* Arrow */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="mt-16 flex justify-center"
        >
          <ArrowDown className="text-[#E96B8A]" size={34} />
        </motion.div>

      </div>
    </section>
  );
}