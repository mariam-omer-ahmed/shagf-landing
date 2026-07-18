"use client";

import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function Guarantee() {
  return (
    <section className="bg-[#FDF6F8] py-24" dir="rtl">
      <div className="mx-auto max-w-5xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="overflow-hidden rounded-[34px] border border-[#6E1E3A]/15 bg-white shadow-[0_25px_80px_rgba(110,30,58,.14)]"
        >

          {/* Header */}
          <div className="bg-gradient-to-l from-[#6E1E3A] to-[#3D1020] px-10 py-10 text-center text-white">

            <ShieldCheck
              className="mx-auto mb-5"
              size={54}
            />

            <h2 className="text-4xl font-black">
              التزامنا تجاهك
            </h2>

            <p className="mt-4 text-lg leading-9 text-white/95">
              نحن لا نَعِد بنتائج سحرية...
              <br />
              لكننا نلتزم بألّا تترك النظام وحدك إذا كنت تؤدي ما عليك بجدية.
            </p>

          </div>

          {/* Body */}
          <div className="space-y-8 px-10 py-12">

            <div className="rounded-3xl bg-[#FBF1F4] p-8">

              <h3 className="text-2xl font-black text-gray-900">
                إذا التزمت...
              </h3>

              <div className="mt-6 space-y-4">

                {[
                  "نفذت جميع المهام المطلوبة.",
                  "حضرت الجلسات والمتابعات.",
                  "طبقت التعديلات التي يوصي بها الفريق.",
                  "لم تتوقف أو تؤجل التنفيذ.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      className="mt-1 text-[#6E1E3A]"
                      size={22}
                    />

                    <p className="leading-8 text-gray-700">
                      {item}
                    </p>

                  </div>
                ))}

              </div>

            </div>

            <div className="rounded-3xl border-2 border-dashed border-[#6E1E3A] p-8">

              <h3 className="text-2xl font-black text-gray-900">
                ثم لم تحقق نتيجة...
              </h3>

              <p className="mt-5 text-lg leading-9 text-gray-700">

                لن نقول لك:
                <span className="font-black">
                  {" "}«انتهى دورنا».
                </span>

                <br /><br />

                "إذا التزمت بجميع المهام ولم تحقق النتيجة التي نسعى إليها معك،
                فسنعمل معك لفترة إضافية دون أي رسوم حتى نتأكد أنك أصبحت مستعدًا للمنافسة."
              </p>

            </div>

            <div className="rounded-3xl bg-gradient-to-l from-[#FBEFF2] to-white p-8">

              <h3 className="text-2xl font-black text-gray-900">
                لكن يوجد شرط واحد فقط...
              </h3>

              <p className="mt-6 text-lg leading-9 text-gray-700">

                هذا الالتزام مخصص فقط لمن يثبت جديته.

                <br /><br />

                أما من يؤجل،
                أو لا ينفذ،
                أو يختفي لأسابيع،
                أو ينتظر النتائج دون عمل...

                <span className="font-black text-[#6E1E3A]">
                  فلن يكون مؤهلًا لهذه المتابعة.
                </span>

              </p>

            </div>

            <div className="rounded-3xl bg-[#2B0E1B] p-8 text-center">

              <p className="text-2xl font-black leading-10 text-white">

                نحن لا نستثمر في الأشخاص المثاليين...

                <br /><br />

                بل نستثمر في الأشخاص الذين يثبتون أنهم جادون.

              </p>

            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}