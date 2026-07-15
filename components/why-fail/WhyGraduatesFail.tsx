"use client";

import { motion } from "framer-motion";
import {
  CircleX,
  Clock3,
  BookOpen,
  FileQuestion,
  TrendingDown,
  TriangleAlert,
} from "lucide-react";

const reasons = [
  {
    icon: BookOpen,
    title: "الاعتماد على الدراسة النظرية",
    description:
      "الجامعة تمنحك أساسًا جيدًا، لكنها غالبًا لا توفر الخبرة العملية التي تتوقعها الشركات.",
  },
  {
    icon: FileQuestion,
    title: "غياب المشاريع الحقيقية",
    description:
      "الكثير من الخريجين لا يمتلكون Portfolio أو أعمالًا تثبت قدرتهم على التنفيذ.",
  },
  {
    icon: Clock3,
    title: "تأجيل اكتساب المهارات",
    description:
      "انتظار الوظيفة الأولى لاكتساب الخبرة يجعل المنافسة أصعب مع مرور الوقت.",
  },
  {
    icon: TrendingDown,
    title: "التعلم بدون خطة واضحة",
    description:
      "مشاهدة عشرات الكورسات بدون مسار تدريبي متكامل يؤدي إلى تشتت وعدم تحقيق نتائج.",
  },
];

export default function WhyGraduatesFail() {
  return (
    <section className="relative overflow-hidden bg-[#FFF8FB] py-24">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-20 h-80 w-80 rounded-full bg-pink-200/30 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2 text-sm font-bold text-red-600">
            <TriangleAlert className="h-4 w-4" />
            لماذا يفشل أغلب الخريجين؟
          </div>

          <h2 className="mt-6 text-4xl font-black leading-tight text-gray-900 md:text-5xl">
            ليست المشكلة في الذكاء...
            <span className="block text-[#E96B8A]">
              بل في الطريقة التي يتعلم بها معظم الناس.
            </span>
          </h2>

          <p className="mt-8 text-lg leading-8 text-gray-600">
            آلاف الخريجين يبذلون مجهودًا كبيرًا، لكنهم يكررون نفس الأخطاء،
            لذلك تتأخر نتائجهم رغم امتلاكهم الرغبة في النجاح.
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {reasons.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: .5,
                  delay: index * .12,
                }}
                className="group rounded-3xl border border-pink-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#E96B8A] hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 transition group-hover:bg-[#E96B8A]">
                  <Icon className="h-8 w-8 text-[#E96B8A] transition group-hover:text-white" />
                </div>

                <h3 className="mt-7 text-xl font-extrabold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-4 leading-8 text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
                {/* Comparison Section */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24 grid gap-8 lg:grid-cols-2"
        >
          {/* Wrong Way */}
          <div className="rounded-[32px] border border-red-100 bg-white p-8 shadow-sm">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <CircleX className="h-7 w-7 text-red-500" />
            </div>

            <h3 className="mt-6 text-2xl font-black text-gray-900">
              ما يفعله معظم الخريجين
            </h3>

            <div className="mt-8 space-y-5">
              {[
                "يشاهد كورسات عشوائية بدون خطة.",
                "يركز على جمع الشهادات فقط.",
                "لا ينفذ مشاريع عملية.",
                "يرسل نفس السيرة الذاتية لكل الشركات.",
                "ينتظر الوظيفة حتى يبدأ بالتعلم.",
                "يفقد الحماس بعد أول رفض.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-4">
                  <CircleX className="mt-1 h-5 w-5 shrink-0 text-red-500" />
                  <p className="text-gray-600 leading-7">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Way */}
          <div className="rounded-[32px] bg-gradient-to-br from-[#E96B8A] to-[#D85C7C] p-8 text-white shadow-xl">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <BookOpen className="h-7 w-7" />
            </div>

            <h3 className="mt-6 text-2xl font-black">
              ما يفعله المتدرب الناجح
            </h3>

            <div className="mt-8 space-y-5">
              {[
                "يتبع خطة تدريب واضحة خطوة بخطوة.",
                "يبني Portfolio احترافي.",
                "ينفذ مشاريع تحاكي بيئة العمل.",
                "يتعلم كيف يجتاز المقابلات الوظيفية.",
                "يطور مهاراته باستمرار.",
                "يصبح جاهزًا للتوظيف بثقة.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-4">
                  <div className="mt-2 h-3 w-3 shrink-0 rounded-full bg-white" />
                  <p className="leading-7 text-white/95">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Closing Statement */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-24 max-w-4xl text-center"
        >
          <div className="rounded-[36px] border border-pink-100 bg-white p-10 shadow-lg">
            <h3 className="text-3xl font-black text-gray-900 md:text-4xl">
              النجاح في سوق العمل
              <span className="block mt-2 text-[#E96B8A]">
                ليس حظًا... بل نظام واضح.
              </span>
            </h3>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              عندما تمتلك المهارات المطلوبة، والمشاريع العملية، والسيرة الذاتية
              القوية، وتعرف كيف تقدم نفسك للشركات، فإن فرص حصولك على وظيفة
              ترتفع بشكل كبير.
            </p>

            <div className="mx-auto mt-8 h-1 w-24 rounded-full bg-[#E96B8A]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}