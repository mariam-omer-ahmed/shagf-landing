"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Sparkles,
  TrendingUp,
  UserCheck,
} from "lucide-react";

const transformations = [
  {
    icon: UserCheck,
    before: "لا يعرف من أين يبدأ",
    after: "يمتلك خطة واضحة للتطور",
  },
  {
    icon: BriefcaseBusiness,
    before: "بدون خبرة عملية",
    after: "يمتلك Portfolio ومشاريع احترافية",
  },
  {
    icon: TrendingUp,
    before: "يرسل CV بدون نتائج",
    after: "يتقدم بثقة ويجذب أصحاب العمل",
  },
  {
    icon: BadgeCheck,
    before: "يخاف من المقابلات",
    after: "يجتاز المقابلات بثقة واستعداد",
  },
];

export default function Transformation() {
  return (
    <section className="relative overflow-hidden bg-[#FFF8FB] py-24">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-16 h-96 w-96 rounded-full bg-pink-200/30 blur-3xl" />
        <div className="absolute right-0 bottom-10 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-5 py-2 text-sm font-bold text-[#E96B8A]">
            <Sparkles className="h-4 w-4" />
            رحلة التحول
          </div>

          <h2 className="mt-6 text-4xl font-black leading-tight text-gray-900 md:text-5xl">
            تخيل نفسك بعد عدة أشهر...
            <span className="block text-[#E96B8A]">
              كيف ستكون النتيجة؟
            </span>
          </h2>

          <p className="mt-8 text-lg leading-8 text-gray-600">
            هدفنا ليس فقط تعليمك مهارة، بل إحداث تحول حقيقي في مستواك المهني
            حتى تصبح مستعدًا للمنافسة في سوق العمل بثقة.
          </p>
        </motion.div>

        {/* Before / After */}
        <div className="mt-20 space-y-8">
          {transformations.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.before}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.1,
                }}
                className="grid gap-6 lg:grid-cols-[1fr_auto_1fr]"
              >
                {/* Before */}
                <div className="rounded-3xl border border-red-100 bg-white p-8 shadow-sm">
                  <span className="text-sm font-bold text-red-500">
                    قبل البرنامج
                  </span>

                  <h3 className="mt-5 text-2xl font-black text-gray-900">
                    {item.before}
                  </h3>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E96B8A] text-white shadow-lg">
                    <ArrowRight className="h-7 w-7" />
                  </div>
                </div>

                {/* After */}
                <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-pink-100">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50">
                    <Icon className="h-8 w-8 text-[#E96B8A]" />
                  </div>

                  <span className="mt-5 inline-block text-sm font-bold text-[#E96B8A]">
                    بعد البرنامج
                  </span>

                  <h3 className="mt-3 text-2xl font-black text-gray-900">
                    {item.after}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
                {/* Final Vision */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24 overflow-hidden rounded-[36px] bg-gradient-to-br from-[#E96B8A] via-[#E46B89] to-[#D85C7C] p-10 text-white lg:p-14"
        >
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-bold backdrop-blur">
              <Sparkles className="h-4 w-4" />
              النتيجة النهائية
            </span>

            <h3 className="mt-6 text-3xl font-black leading-tight md:text-5xl">
              عندما تنتهي من البرنامج...
              <span className="mt-2 block">
                ستكون شخصًا مختلفًا مهنيًا.
              </span>
            </h3>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-pink-50">
              لن تخرج بمجرد شهادة، بل بمجموعة من المهارات العملية، والمشاريع
              الاحترافية، وخطة واضحة للتقديم على الوظائف، وثقة أكبر في التعامل
              مع المقابلات وسوق العمل.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              "مهارات مطلوبة في سوق العمل.",
              "Portfolio احترافي يعرض أعمالك.",
              "CV جاهز وفق المعايير الحديثة.",
              "ثقة حقيقية في التقديم والمقابلات.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl bg-white/10 p-6 backdrop-blur transition-all duration-300 hover:bg-white/15"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                  <BadgeCheck className="h-7 w-7" />
                </div>

                <p className="mt-6 text-lg font-semibold leading-8">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Closing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-24 max-w-4xl text-center"
        >
          <h3 className="text-3xl font-black text-gray-900 md:text-5xl">
            مستقبلك المهني يبدأ...
            <span className="mt-2 block text-[#E96B8A]">
              بالقرار الذي تتخذه اليوم.
            </span>
          </h3>

          <p className="mt-8 text-lg leading-8 text-gray-600">
            كل خطوة تبدأ الآن تقربك من وظيفة أفضل، ودخل أعلى، وثقة أكبر في
            قدراتك. لا تنتظر حتى تصبح الفرصة مثالية، بل ابدأ ببناء نفسك من
            اليوم.
          </p>

          <div className="mx-auto mt-8 h-1 w-24 rounded-full bg-[#E96B8A]" />
        </motion.div>
      </div>
    </section>
  );
}