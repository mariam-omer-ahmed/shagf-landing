"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { User, UserRound, Sparkles, ArrowRight } from "lucide-react";

import t1 from "@/public/images/testimonial-01.jpg";
import t2 from "@/public/images/P8.jpg";
import t3 from "@/public/images/P7.jpg";
import t4 from "@/public/images/P9.jpg";

type T = {
  name: string;
  gender: "male" | "female";
  before: string;
  after: string;
  story: string;
  resultDetail: string;
  img: any;
};

const data: T[] = [
  {
    name: "سامر",
    gender: "male",
    before: "يتعلم كورسات بدون هدف",
    after: "وظيفة بعقد كامل",
    resultDetail: "تحول من متعلم مشتت إلى موظف في شركة",
    story:
      "كان يمر على كورسات كثيرة بدون خطة واضحة، كل مرة يبدأ شيء جديد بدون ما يكمله. بعد النظام حدد مسار واحد فقط وبدأ يطبق يوميًا بدل ما يتعلم فقط. خلال فترة قصيرة قدر يدخل مقابلة، وبعدها حصل على وظيفة بعقد كامل.",
    img: t1,
  },
  {
    name: "فاطمة",
    gender: "female",
    before: "تتعلم تسويق بدون دخل",
    after: "أول عميلة بعقد شهري",
    resultDetail: "تحولت من متعلمة إلى مقدمة خدمة مدفوعة",
    story:
      "كانت تتعلم التسويق بشكل عشوائي بدون ما تعرف كيف تحول المهارة لفلوس. بعد النظام فهمت كيف تبني عرض خدمة واضح وتظهر نفسها بشكل احترافي. أول ما بدأت التطبيق، حصلت على أول عميلة بعقد شهري مستمر.",
    img: t2,
  },
  {
    name: "ملاك",
    gender: "female",
    before: "تشتت بين مهارات كثيرة",
    after: "4 عملاء فريلانس",
    resultDetail: "بدأت تحقق دخل من مهاراتها",
    story:
      "كانت تتعلم كل شيء: تصميم، تسويق، محتوى… لكن بدون تركيز. بعد النظام اختارت مسار واحد فقط وبدأت تبني عليه. خلال فترة قصيرة قدرت تجيب أول عميل، وبعدها توسعت إلى 4 عملاء مستقلين.",
    img: t3,
  },
  {
    name: "حنان",
    gender: "female",
    before: "لا تعرف من أين تبدأ",
    after: "عقد مع شركة",
    resultDetail: "انتقلت من ضياع إلى قبول وظيفي",
    story:
      "كانت تشعر أنها ضائعة تمامًا ولا تعرف ماذا تفعل أولاً. بعد النظام صار عندها خطة واضحة: ماذا تتعلم، ماذا تتجاهل، وكيف تقدم نفسها. جهزت ملفها المهني وتم قبولها في شركة بعقد رسمي.",
    img: t4,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials"
     className="bg-[#FFF8FB] py-24">
      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2 border border-pink-200 rounded-full text-sm text-[#E96B8A]">
            <Sparkles size={14} />
            نتائج حقيقية من نظام شغف
          </div>

          <h2 className="text-4xl md:text-5xl font-black mt-6 text-gray-900">
            من التشتت إلى أول نتيجة حقيقية
          </h2>

          <p className="text-gray-600 mt-3 text-lg">
            وظائف • عملاء • عقود فعلية
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">

          {data.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition"
            >

              {/* IMAGE (NO CROPPING PROBLEMS) */}
              <div className="relative w-full h-[240px] bg-gray-100">
                <Image
                  src={t.img}
                  alt={t.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">

                {/* BEFORE / AFTER (HORMOZI STYLE) */}
                <div className="flex flex-col gap-2">

                  <div className="text-xs text-gray-400">
                    قبل: {t.before}
                  </div>

                  <div className="text-sm font-bold text-gray-900">
                    بعد: <span className="text-[#E96B8A]">{t.after}</span>
                  </div>

                  <div className="text-xs text-[#E96B8A] font-medium">
                    {t.resultDetail}
                  </div>

                </div>

                {/* STORY */}
                <p className="text-sm text-gray-700 mt-4 leading-relaxed">
                  {t.story}
                </p>

                {/* NAME */}
                <div className="flex items-center gap-3 mt-6">

                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center border border-pink-100">
                    {t.gender === "male" ? (
                      <User className="w-4 h-4 text-[#E96B8A]" />
                    ) : (
                      <UserRound className="w-4 h-4 text-[#E96B8A]" />
                    )}
                  </div>

                  <div className="text-sm font-semibold text-gray-900">
                    {t.name}
                  </div>

                </div>

              </div>
            </motion.div>
          ))}

        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            نفس النظام الذي غيّر نتائج هؤلاء الأشخاص
          </p>

          <a
            href="/result"
            className="inline-flex items-center gap-2 bg-[#E96B8A] text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-[#d85d7d] transition"
          >
ابدأ في الحصول على فرص عمل أنت ايضاً            <ArrowRight size={18} />
          </a>
        </div>

      </div>
    </section>
  );
}