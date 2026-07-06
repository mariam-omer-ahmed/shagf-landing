"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { User, UserRound, Sparkles, ArrowRight, Star, TrendingUp } from "lucide-react";

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
  timeframe: string;
  img: any;
};

const data: T[] = [
  {
    name: "شهاب",
    gender: "male",
    before: "يتعلم كورسات بدون هدف",
    after: "وظيفة بعقد كامل",
    resultDetail: "من متعلم مشتت إلى موظف براتب ثابت",
    timeframe: "خلال 21 يوم",
    story:
      "كان يمر على كورسات كثيرة بدون خطة واضحة، كل مرة يبدأ شيء جديد بدون ما يكمله. بعد النظام حدد مسار واحد فقط وبدأ يطبق يوميًا بدل ما يتعلم فقط. خلال فترة قصيرة قدر يدخل مقابلة، وبعدها حصل على وظيفة بعقد كامل.",
    img: t1,
  },
  {
    name: "فاطمة",
    gender: "female",
    before: "تتعلم تسويق بدون دخل",
    after: "أول عميلة بعقد شهري",
    resultDetail: "من متعلمة إلى صاحبة دخل مستمر",
    timeframe: "خلال 12 يوم",
    story:
      "كانت تتعلم التسويق بشكل عشوائي بدون ما تعرف كيف تحول المهارة لفلوس. بعد النظام فهمت كيف تبني عرض خدمة واضح وتظهر نفسها بشكل احترافي. أول ما بدأت التطبيق، حصلت على أول عميلة بعقد شهري مستمر.",
    img: t2,
  },
  {
    name: "ملاك",
    gender: "female",
    before: "تشتت بين مهارات كثيرة",
    after: "4 عملاء فريلانس",
    resultDetail: "من تشتت كامل إلى دخل من 4 مصادر",
    timeframe: "خلال 45 يوم",
    story:
      "كانت تتعلم كل شيء: تصميم، تسويق، محتوى… لكن بدون تركيز. بعد النظام اختارت مسار واحد فقط وبدأت تبني عليه. خلال فترة قصيرة قدرت تجيب أول عميل، وبعدها توسعت إلى 4 عملاء مستقلين.",
    img: t3,
  },
  {
    name: "حنان",
    gender: "female",
    before: "لا تعرف من أين تبدأ",
    after: "عقد مع شركة",
    resultDetail: "من ضياع تام إلى قبول وظيفي رسمي",
    timeframe: "خلال 18 يوم",
    story:
      "كانت تشعر أنها ضائعة تمامًا ولا تعرف ماذا تفعل أولاً. بعد النظام صار عندها خطة واضحة: ماذا تتعلم، ماذا تتجاهل، وكيف تقدم نفسها. جهزت ملفها المهني وتم قبولها في شركة بعقد رسمي.",
    img: t4,
  },
];

const STATS = [
  { value: "120+", label: "وظيفة وعقد فعلي" },
  { value: "80+", label: "عميل فريلانس" },
  { value: "18", label: "يوم متوسط أول نتيجة" },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-[#FFF8FB] py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2 border border-pink-200 rounded-full text-sm font-bold text-[#E96B8A]">
            <Sparkles size={14} />
            نتائج حقيقية موثّقة، مش وعود
          </div>

          <h2 className="text-4xl md:text-5xl font-black mt-6 text-gray-900 leading-[1.3]">
            هذا ما يحصل فعلًا لما تتوقف عن التخبط
            <span className="block text-[#E96B8A] mt-2">وتتبع خطة واحدة واضحة</span>
          </h2>

          <p className="text-gray-600 mt-4 text-lg">
            وظائف حقيقية • عقود موقّعة • عملاء فعليين — لا شيء نظري هنا
          </p>
        </motion.div>

        {/* STATS BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-16 bg-white rounded-3xl border border-pink-100 shadow-sm p-6"
        >
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-black text-[#E96B8A]">{s.value}</div>
              <div className="text-xs md:text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-8">
          {data.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              {/* IMAGE + RESULT BADGE */}
              <div className="relative w-full h-[240px] bg-gray-100">
                <Image src={t.img} alt={t.name} fill className="object-cover" />

                <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-[#E96B8A] shadow-md">
                  <TrendingUp size={12} />
                  {t.timeframe}
                </div>

                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="p-6">
                {/* STARS */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} size={14} className="fill-[#E96B8A] text-[#E96B8A]" />
                  ))}
                </div>

                {/* BEFORE / AFTER — bigger contrast */}
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <span className="text-xs text-gray-400 line-through">{t.before}</span>
                  <ArrowRight size={14} className="text-[#E96B8A] rotate-180 shrink-0" />
                  <span className="text-base font-black text-gray-900">{t.after}</span>
                </div>

                <div className="text-sm text-[#E96B8A] font-bold mb-4">
                  {t.resultDetail}
                </div>

                {/* STORY */}
                <p className="text-sm text-gray-700 leading-relaxed">
                  {t.story}
                </p>

                {/* NAME */}
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-50">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center border border-pink-100">
                    {t.gender === "male" ? (
                      <User className="w-4 h-4 text-[#E96B8A]" />
                    ) : (
                      <UserRound className="w-4 h-4 text-[#E96B8A]" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-400">نتيجة موثّقة داخل نظام شغف</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA — stronger, urgency + risk reversal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-20 bg-white border border-pink-100 rounded-3xl p-10 shadow-sm"
        >
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
            نفس النظام، نفس الخطوات، دورك الآن
          </h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            كل شخص في هذه القصص بدأ بنفس الاختبار اللي راح تبدأ فيه الآن.
            الفرق الوحيد بينك وبينهم هو الخطوة الأولى.
          </p>

          <motion.a
            href="/result"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 bg-[#E96B8A] text-white px-10 py-5 rounded-2xl font-black text-lg shadow-[0_15px_40px_rgba(233,107,138,.35)] hover:bg-[#d85d7d] transition"
          >
            ابدأ في الحصول على فرصتك الآن
            <ArrowRight size={20} />
          </motion.a>

          <p className="text-xs text-gray-400 mt-4">
            الاختبار مجاني ويأخذ 3 دقائق فقط — بدون أي التزام
          </p>
        </motion.div>
      </div>
    </section>
  );
}