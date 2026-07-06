"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const objections = [
  {
    title: "جربت دورات كثيرة من قبل ولم تتغير حياتي.",
    reality:
      "إذا كنت تشعر بهذا، فأنت لست وحدك. أغلب من يصل إلينا لديه شهادات أكثر مما يحتاج، لكن نتائجه لم تتغير.",
    truth:
      "المشكلة لم تكن في عدد الدورات، بل في أنك كنت تتعلم دون خطة تقودك إلى فرصة حقيقية.",
    proof:
      "المعرفة وحدها لا تصنع وظيفة. وإلا لكان كل من يملك عشرات الشهادات يعمل الآن في الوظيفة التي يحلم بها.",
    conclusion:
      "نظام شغف لا يضيف لك دورة جديدة، بل يربط كل ما تعلمته بخطة واضحة حتى يتحول إلى نتيجة.",
  },

  {
    title: "أخاف أن أدفع ثم لا أحقق أي نتيجة.",
    reality:
      "هذا سؤال طبيعي، لأنك لا تريد تكرار تجربة سابقة خسرت فيها وقتًا أو مالًا.",
    truth:
      "لكن اسأل نفسك سؤالًا آخر... كم سنة مضت وأنت تؤجل القرار نفسه؟",
    proof:
      "تكلفة التأجيل غالبًا أكبر من تكلفة أي برنامج. لأن كل شهر يمر يعني فرصًا تضيع ودخلًا يتأخر.",
    conclusion:
      "ولهذا نحن لا نتركك وحدك بعد الاشتراك، بل نتابع تنفيذك خطوة بخطوة.",
  },

  {
    title: "ليس لدي وقت الآن.",
    reality:
      "أغلب عملائنا كانوا يقولون الشيء نفسه.",
    truth:
      "المشكلة ليست الوقت، بل غياب الأولوية.",
    proof:
      "إذا ظللت تؤجل تطوير مستقبلك، فسيظل مستقبلك مؤجلًا أيضًا.",
    conclusion:
      "النظام مبني ليُطبق مع الدراسة أو العمل، وليس بدلًا منهما.",
  },

  {
    title: "ربما أستطيع فعل هذا وحدي.",
    reality:
      "نعم... تستطيع.",
    truth:
      " السؤال ليس: هل تستطيع؟ بل كم سنة إضافية ستحتاج حتى تصل وحدك؟",
    proof:
      "وجود خارطة واضحة واختصار الأخطاء يوفر عليك أشهرًا وربما سنوات من التجربة العشوائية.",
    conclusion:
      "لهذا صممنا النظام ليختصر عليك الطريق، لا ليقوم بالمجهود بدلًا عنك.",
  },

  {
    title: "أخشى أن أبدأ ثم أفشل.",
    reality:
      "كل شخص يريد تغيير حياته يشعر بهذا الخوف.",
    truth:
      " عدم البدء هو الفشل الوحيد المضمون.",
    proof:
      "طالما أنك لم تغيّر شيئًا، فستحصل على النتيجة نفسها التي تحصل عليها اليوم.",
    conclusion:
      "التقدم يأتي من التنفيذ، لا من انتظار الشعور بالثقة.",
  },

  {
    title: "كيف أعرف أن هذه الباقة مناسبة لي؟",
    reality:
      "سؤال مهم، لأن اختيار المسار الخطأ يضيع وقتك.",
    truth:
      "لذلك لا نعتمد على التخمين.",
    proof:
      "ترشيح الباقة تم بناءً على إجاباتك، وبعدها يراجع فريقنا حالتك قبل بدء التنفيذ.",
    conclusion:
      "إذا وجدنا أن هناك باقة أنسب لك سنخبرك بها مباشرة، حتى لو كانت أقل تكلفة.",
  },

  {
    title: "وماذا لو اجتهدت ولم أصل إلى وظيفة أو دخل؟",
    reality:
      "هذا أكثر سؤال نتلقاه.",
    truth:
      "نحن لا نستطيع أن نضمن لك نتيجة دون التزام منك.",
    proof:
      "لكن إذا وجدنا أنك التزمت بجميع المهام، وطبقت المطلوب، واستمررت بجدية، ثم لم تصل إلى النتيجة المتوقعة...",
    conclusion:
      "فسنواصل متابعتك وإرشادك دون أي رسوم إضافية حتى تصبح جاهزًا للمنافسة بشكل أفضل. لأن نجاحك هو نجاح النظام نفسه.",
  },
];

export default function Objections() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section className="bg-white py-24" dir="rtl">
      <div className="mx-auto max-w-5xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-pink-100 px-4 py-2 text-sm font-bold text-[#E96B8A]">
            قبل أن تتخذ قرارك
          </span>

          <h2 className="mt-6 text-4xl font-black text-gray-900">
            ربما هذه هي الأسئلة التي تدور في ذهنك الآن...
          </h2>

          <p className="mt-5 text-lg leading-9 text-gray-600">
            وهذا طبيعي...
            لأن القرار الذي قد يغيّر مستقبلك يستحق أن تُجيب عن كل تساؤلاتك.
          </p>

        </div>

        <div className="mt-16 space-y-5">

          {objections.map((item, index) => (

            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-pink-100 bg-[#FFF8FB]"
            >

              <button
                onClick={() =>
                  setOpen(open === index ? -1 : index)
                }
                className="flex w-full items-center justify-between px-8 py-6 text-right"
              >

                <h3 className="text-xl font-black text-gray-900">
                  {item.title}
                </h3>

                <motion.div
                  animate={{
                    rotate: open === index ? 180 : 0,
                  }}
                >
                  <ChevronDown />
                </motion.div>

              </button>

              <AnimatePresence>

                {open === index && (

                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    className="overflow-hidden"
                  >

                    <div className="space-y-6 px-8 pb-8">

                      <div>
                        <p className="font-bold text-[#E96B8A]">
                          ✔ نفهم لماذا تفكر بهذا الشكل
                        </p>

                        <p className="mt-2 leading-8 text-gray-700">
                          {item.reality}
                        </p>
                      </div>

                      <div>
                        <p className="font-bold text-[#E96B8A]">
                          ✔ لكن الحقيقة هي...
                        </p>

                        <p className="mt-2 leading-8 text-gray-700">
                          {item.truth}
                        </p>
                      </div>

                      <div>
                        <p className="font-bold text-[#E96B8A]">
                          ✔ والدليل
                        </p>

                        <p className="mt-2 leading-8 text-gray-700">
                          {item.proof}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#E96B8A] p-6 text-white">

                        <p className="font-black">
                          إذًا ماذا يعني هذا بالنسبة لك؟
                        </p>

                        <p className="mt-3 leading-8">
                          {item.conclusion}
                        </p>

                      </div>

                    </div>

                  </motion.div>

                )}

              </AnimatePresence>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}