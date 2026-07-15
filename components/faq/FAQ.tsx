"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "هل أحتاج إلى خبرة سابقة؟",
    answer:
      "لا. تم تصميم البرامج لتناسب المبتدئين بالكامل، ثم تنتقل بك تدريجيًا حتى المستوى الاحترافي من خلال تطبيقات ومشاريع عملية.",
  },
  {
    question: "هل سأعمل على مشاريع حقيقية؟",
    answer:
      "نعم. جميع البرامج تعتمد على التطبيق العملي، وستنفذ مشاريع تحاكي احتياجات سوق العمل لتبني Portfolio احترافي يمكنك عرضه أثناء التقديم على الوظائف.",
  },
  {
    question: "هل أحصل على شهادة بعد الانتهاء؟",
    answer:
      "نعم، ستحصل على شهادة إتمام بعد إنهاء متطلبات البرنامج، بالإضافة إلى مشاريع عملية تثبت مهاراتك.",
  },
  {
    question: "هل يمكنني الدراسة في الوقت الذي يناسبني؟",
    answer:
      "بالتأكيد. يمكنك مشاهدة الدروس والتطبيق في أي وقت ومن أي مكان، بما يتناسب مع جدولك اليومي.",
  },
  {
    question: "كم تستغرق مدة البرنامج؟",
    answer:
      "تختلف المدة حسب البرنامج وسرعة تعلمك، لكن يمكنك التقدم وفق جدولك الشخصي دون الحاجة للالتزام بأوقات محددة.",
  },
  {
    question: "هل سأحصل على دعم أثناء الدراسة؟",
    answer:
      "نعم، ستجد فريقًا جاهزًا للإجابة على استفساراتك ومساعدتك خلال رحلتك التدريبية حتى تحقق أفضل استفادة.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-20 h-80 w-80 rounded-full bg-pink-100/40 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-rose-100/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-5 py-2 text-sm font-bold text-[#E96B8A]">
            <HelpCircle className="h-4 w-4" />
            الأسئلة الشائعة
          </div>

          <h2 className="mt-6 text-4xl font-black leading-tight text-gray-900 md:text-5xl">
            لديك أسئلة؟
            <span className="block text-[#E96B8A]">
              نحن أجبنا على الأكثر شيوعًا.
            </span>
          </h2>

          <p className="mt-8 text-lg leading-8 text-gray-600">
            إذا لم تجد إجابة لسؤالك، يمكنك التواصل معنا وسيسعد فريقنا بمساعدتك
            واختيار البرنامج الأنسب لك.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="mt-20 space-y-5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.05,
                }}
                className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm"
              >
                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between p-7 text-right transition hover:bg-pink-50"
                >
                  <h3 className="text-lg font-bold text-gray-900">
                    {faq.question}
                  </h3>

                  <ChevronDown
                    className={`h-6 w-6 text-[#E96B8A] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-pink-100 px-7 py-6">
                        <p className="leading-8 text-gray-600">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
                {/* Contact Banner */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24 overflow-hidden rounded-[36px] bg-gradient-to-br from-[#E96B8A] via-[#E46B89] to-[#D85C7C] p-10 text-white lg:p-14"
        >
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex rounded-full bg-white/15 px-5 py-2 text-sm font-bold backdrop-blur">
              ما زلت مترددًا؟
            </span>

            <h3 className="mt-6 text-3xl font-black leading-tight md:text-5xl">
              دعنا نساعدك في اختيار
              <span className="mt-2 block">
                البرنامج المناسب لك.
              </span>
            </h3>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-pink-50">
              إذا لم تكن متأكدًا من البرنامج المناسب لمستواك أو أهدافك،
              تواصل معنا وسيساعدك فريقنا في اختيار المسار التدريبي الذي
              يناسبك دون أي التزام.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-lg font-bold text-[#E96B8A] transition-all duration-300 hover:scale-[1.03]"
              >
                تواصل معنا
              </a>

              <a
                href="/courses"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-white px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-white hover:text-[#E96B8A]"
              >
                تصفح البرامج
              </a>
            </div>
          </div>
        </motion.div>

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-24 max-w-4xl text-center"
        >
          <h3 className="text-3xl font-black text-gray-900 md:text-5xl">
            كل خبير بدأ يومًا ما...
            <span className="mt-2 block text-[#E96B8A]">
              بخطوة واحدة فقط.
            </span>
          </h3>

          <p className="mt-8 text-lg leading-8 text-gray-600">
            لا تدع الأسئلة أو التردد يؤجلان مستقبلك. ابدأ رحلتك التعليمية،
            وطور مهاراتك، وابنِ خبرة عملية تساعدك على المنافسة بثقة في سوق
            العمل.
          </p>

          <div className="mx-auto mt-8 h-1 w-24 rounded-full bg-[#E96B8A]" />
        </motion.div>
      </div>
    </section>
  );
}