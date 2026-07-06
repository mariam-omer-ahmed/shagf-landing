"use client";

import { motion } from "framer-motion";
import {
  CircleAlert,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function RealitySection() {
  return (
    <section className="bg-white py-24">

      <div className="mx-auto max-w-5xl px-6">

        {/* Story */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: .2 }}
          className="mx-auto mt-16 max-w-3xl space-y-8 text-xl leading-[2.2] text-gray-700"
        >

          <p>

            ربما أنهيت عدة دورات...

            وربما شاهدت مئات الفيديوهات...

            وربما حفظت معلومات أكثر من أشخاص يعملون بالفعل.

          </p>

          <p>

            ومع ذلك...

            لا تزال لا تعرف:

          </p>

        </motion.div>

        {/* List */}

        <div className="mx-auto mt-12 grid max-w-3xl gap-5">

          {[
            "ما المهارة التي يجب أن تتعلمها أولًا؟",
            "أي مجال يناسبك فعلًا؟",
            "كيف تحول المعرفة إلى وظيفة؟",
            "كيف تنافس آلاف المتقدمين؟",
            "لماذا يحصل غيرك على الفرص بينما لا تحصل أنت؟",
          ].map((item) => (

            <motion.div
              key={item}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-start gap-4 rounded-2xl border border-red-100 bg-red-50 p-5"
            >

              <CircleAlert
                className="mt-1 shrink-0 text-red-500"
                size={22}
              />

              <span className="text-lg font-semibold text-gray-800">
                {item}
              </span>

            </motion.div>

          ))}

        </div>

        {/* Break */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto mt-20 max-w-3xl rounded-3xl bg-[#FFF8FB] p-10 text-center shadow-sm"
        >

          <h3 className="text-3xl font-black text-gray-900">

            لهذا السبب...

          </h3>

          <p className="mt-8 text-xl leading-[2] text-gray-700">

            إضافة دورة جديدة...

            لن تحل المشكلة.

            <br /><br />

            قراءة كتاب جديد...

            لن تحل المشكلة.

            <br /><br />

            مشاهدة عشرات الفيديوهات...

            لن تحل المشكلة.

          </p>

        </motion.div>

        {/* Final */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto mt-20 max-w-4xl rounded-[32px] bg-gradient-to-l from-[#E96B8A] to-[#d95d7d] p-10 text-center text-white shadow-2xl"
        >

          <CheckCircle2
            className="mx-auto"
            size={42}
          />

          <h3 className="mt-6 text-3xl font-black">

            أنت لا تحتاج معلومات أكثر...

          </h3>

          <p className="mt-8 text-xl leading-[2]">

            أنت تحتاج شخصًا يختصر عليك الطريق...

            ويخبرك:

            <br /><br />

            ماذا تتعلم...

            وماذا تتجاهل...

            وما هي الخطوة التالية...

            حتى تصل إلى أول فرصة عمل بأقصر طريق ممكن.

          </p>

          <div className="mt-10 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-lg font-bold text-[#E96B8A]">

            وهذا بالضبط ما صُمم نظام شغف من أجله

            <ArrowRight size={20} />

          </div>

        </motion.div>

      </div>

    </section>
  );
}