"use client";

import { motion } from "framer-motion";

export default function FutureResults() {
  return (
    <section className="bg-white py-24">

      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl text-center"
        >

          <span className="rounded-full bg-pink-100 px-5 py-2 text-sm font-bold text-[#E96B8A]">
            الهدف الحقيقي
          </span>

          <h2 className="mt-8 text-5xl font-black leading-tight text-gray-900">

            بعد عدة أشهر من الآن...

            <br />

            <span className="text-[#E96B8A]">
              نريد أن تكون هذه اللحظات جزءاً من قصتك أنت
            </span>

          </h2>

          <p className="mt-8 text-xl leading-[2] text-gray-600">

            هدفنا ليس أن تنهي كورساً جديداً أو تجمع شهادة إضافية.

            <br />

            هدفنا أن تصل إلى نتائج حقيقية تستطيع رؤيتها في حياتك.

          </p>

        </motion.div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">

          {/* CARD 1 */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[32px] bg-white shadow-xl"
          >

            <div className="relative">

              <img
                src="/images/z2.png"
                alt="قبول وظيفة"
                className="h-[380px] w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <h3 className="absolute bottom-6 right-6 left-6 text-3xl font-black text-white">
                تم قبولك
              </h3>

            </div>

            <div className="p-8">

              <p className="text-lg leading-9 text-gray-700">

                الهدف ليس تعلم المزيد...

                <br />

                بل الوصول إلى هذه الرسالة.

              </p>

            </div>

          </motion.div>

          {/* CARD 2 */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: .1 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[32px] bg-white shadow-xl"
          >

            <div className="relative">

              <img
                src="/images/z3.png"
                alt="مشروع حقيقي"
                className="h-[380px] w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <h3 className="absolute bottom-6 right-6 left-6 text-3xl font-black text-white">
                مشروع حقيقي
              </h3>

            </div>

            <div className="p-8">

              <p className="text-lg leading-9 text-gray-700">

                لأن أصحاب العمل لا يشترون الشهادات...

                <br />

                بل يشترون النتائج وما تستطيع تنفيذه.

              </p>

            </div>

          </motion.div>

          {/* CARD 3 */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: .2 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[32px] bg-white shadow-xl"
          >

            <div className="relative">

              <img
                src="/images/a8.png"
                alt="أول دخل"
                className="h-[380px] w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <h3 className="absolute bottom-6 right-6 left-6 text-3xl font-black text-white">
                أول دخل
              </h3>

            </div>

            <div className="p-8">

              <p className="text-lg leading-9 text-gray-700">

                كل فرصة كبيرة بدأت يوماً ما بخطوة صغيرة صحيحة.

                <br />

                ونحن نساعدك على اتخاذ تلك الخطوة.

              </p>

            </div>

          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >

          <div className="inline-flex rounded-full bg-[#FFF3F7] px-8 py-5 text-lg font-black text-[#E96B8A]">

            لا نعدك بالطريق الأسهل...

            بل بالطريق الأوضح.

          </div>

        </motion.div>

      </div>

    </section>
  );
}