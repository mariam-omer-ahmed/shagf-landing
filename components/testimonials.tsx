"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { User, UserRound, Sparkles, ArrowRight, TrendingUp } from "lucide-react";

import t1 from "@/public/images/m1.jpg";
import t2 from "@/public/images/m2.jpg";
import t3 from "@/public/images/m3.jpg";
import t4 from "@/public/images/m4.jpg";
import m1 from "@/public/images/m5.jpg";
import m2 from "@/public/images/m6.jpg";
import m3 from "@/public/images/m7.jpg";
import m4 from "@/public/images/m8.jpg";
import m5 from "@/public/images/m9.jpg";
import m6 from "@/public/images/m10.jpg";


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
    name: "سامي",
    gender: "male",
    before: "يتعلم كورسات بدون هدف",
    after: "أول عميل بعقد شهري  ",
    resultDetail: "من متعلم مشتت إلى صاحب دخل من مهارة  ",
    timeframe: "خلال 30 يوم",
    story:
      "كان يمر على كورسات كثيرة بدون خطة واضحة، كل مرة يبدأ شيء جديد بدون ما يكمله. بعد النظام حدد مسار واحد فقط وبدأ يطبق يوميًا بدل ما يتعلم كل اساسيات المجال بشكل عام. ركزنا إنو يطبق عملي و يعمل نماذج لأعماله ..بعد البرنامج مباشرة قدر يلقى أول عميل  وبعدها حصل على وظيفة بعقد كامل.",
    img: t1,
  },
  {
    name: "ملاك",
    gender: "female",
    before: "تتعلم تسويق بدون دخل",
    after: "أول  عميلة بعقد شهري",
    resultDetail: "من متعلمة إلى صاحبة دخل مستمر",
    timeframe: "خلال 40 يوم",
    story:
      "كانت تتعلم التسويق بشكل عشوائي بدون ما تعرف كيف تحول المهارة لفلوس. بعد النظام فهمت كيف تبني عرض خدمة واضح وتظهر نفسها بشكل احترافي. أول ما بدأت التطبيق، حصلت على أول عميلة بعقد شهري مستمر.",
    img: t2,
  },
  {
    name: "ملاك",
    gender: "female",
    before: "تشتت بين مهارات كثيرة",
    after: "4 عملاء فريلانس",
    resultDetail: "من تشتت كامل إلى دخل من 3 مصادر",
    timeframe: "خلال 30 يوم",
    story:
      "كانت تتعلم كل شيء: تصميم، تسويق، محتوى… لكن بدون تركيز. بعد النظام اختارت مسار واحد فقط وبدأت تبني عليه. خلال فترة قصيرة قدرت تجيب أول عميل، وبعدها توسعت إلى 4 عملاء مستقلين.",
    img: t3,
  },
  {
    name: "حنان",
    gender: "female",
    before: "لا تعرف من أين تبدأ",
    after: "عقد مع 2 عملاء أونلاين",
    resultDetail: "من ضياع تام إلى قبول عمل حر ",
    timeframe: "خلال 55 يوم",
    story:
      "كانت تتعلم كل شيء: تصميم، تسويق، محتوى… لكن بدون تركيز. بعد النظام اختارت مسار واحد فقط وبدأت تبني عليه. خلال فترة قصيرة قدرت تجيب أول عميل، وبعدها توسعت إلى 2 عملاء مستقلين.",
    img: t4,
  },
  {
    name: "شهاب",
    gender: "male",
    before: "يتفرج فيديوهات تحفيزية بدون تطبيق",
    after: "أول  عقد عمل وظيفي ",
    resultDetail: "من مشتت فقط  أول عقد عمل فعلي",
    timeframe: "خلال 35 يوم",
    story:
      "كان يقضي وقته في مشاهدة محتوى تحفيزي عن العمل الحر بدون أي خطوة عملية. بعد النظام حدد خدمة واحدة يقدر يبيعها فورًا، وبنى عرضًا بسيطًا وواضحًا.  تواصل مع أول شركة بعد 3 أسابيع من التطبيق الفعلي.",
    img: m1,
  },
  {
    name: "رتاج",
    gender: "female",
    before: "     تجربة مختلفة تماما عن اي منصة تعليمية",
    after: "قبول في برنامج تدريب مدفوع",
    resultDetail: "من تجارب سابقة في منصات تعليمية لم تحقق لها فائدة حقيقية    ",
    timeframe: "خلال 45 يوم",
    story:
      ". بعد النظام ركّزت على مجال واحد وجهّزت ملفها المهني ليتماشى معه تحديدًا.  .",
    img: m2,
  },
  {
    name: "ريان",
    gender: "male",
    before: "معرفة متفرقة في عدة مجالات تقنية",
    after: "عقد مع 2 عملاء أونلاين",
    resultDetail: "من معرفة عامة إلى تخصص واضح يُطلب في السوق",
    timeframe: "خلال 45 يوم",
    story:
      "كانت تعرف قليلا من كل شيء بدون أي تخصص فعلي تقدر تعرضه. بعد النظام اختارت تخصصًا واحدًا وبنت  مشروعًا عمليًا تثبت فيه مهارتها. عرض عليها أحد المتابعين لمشروعه فرصة عمل داخل شركة عن بعد أقل من شهرين.",
    img: m3,
  },
  {
    name: "لمى",
    gender: "female",
   before: "لا تعرف من أين تبدأ",
    after: "عقد مع 2 عملاء أونلاين",
    resultDetail: "من ضياع تام إلى قبول عمل حر ",
    timeframe: "خلال 45 يوم",
    story:
      "كانت تتعلم كل شيء: تصميم، تسويق، محتوى… لكن بدون تركيز. بعد النظام اختارت مسار واحد فقط وبدأت تبني عليه. خلال فترة قصيرة قدرت تجيب أول عميل، وبعدها توسعت إلى 2 عملاء مستقلين.",
    img: t4,
  },
  {
    name: "خالد",
    gender: "male",
    before: "يقدم على وظائف بلا استهداف",
    after: "قبول في وظيفة تقنية",
    resultDetail: "من رفض متكرر إلى قبول رسمي خلال أسابيع",
    timeframe: "خلال 42 يوم",
    story:
      "كان يواجه رفضًا متكررًا لأن سيرته الذاتية كانت عامة جدًا ولا تخاطب أي وظيفة بعينها. بعد النظام أعاد بناء ملفه المهني حول مسار واحد محدد، وبدأ يستهدف شركات معينة بدل التقديم العشوائي. حصل على قبول رسمي بعد عدة مقابلات مركّزة.",
    img: m5,
  },
  {
    name: "رؤى تاج السر",
    gender: "female",
    before: "    ",
    after: "شغف أعطتني المهارات والأدوات التي احتاجها لأبدا مشروعي الخاص   ",
    resultDetail: "من لا خبرة سابقة إلى إطلاق مشروعي الخاص    ",
    timeframe: "خلال 35 يوم",
    story:
      "كانت تملك مهارة تصميم جيدة لكن بدون معرض أعمال منظم يعرضها بشكل احترافي. بعد النظام بنت مشروع بودكاست خاص بها خلال شهر واحد.",
    img: m6,
  },
 
  
  
  
];

const STATS = [
  { value: "10+", label: "وظيفة وعقد فعلي" },
  { value: "30+", label: "عميل فريلانس" },
  { value: "30", label: "يوم متوسط أول نتيجة" },
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
       نتائج فعلية من داخل نظام شغف
          </div>

          <h2 className="text-4xl md:text-5xl font-black mt-6 text-gray-900 leading-[1.3]">
            هذا ما يحصل فعلًا لما تتوقف عن التخبط
            <span className="block text-[#E96B8A] mt-2">وتتبع خطة واحدة واضحة</span>
          </h2>

          <p className="text-gray-600 mt-4 text-lg">
         وظائف حقيقية • عقود موقّعة • عملاء فعليين
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
              {/* IMAGE + RESULT BADGE
                  FIX: object-cover كانت بتقصّ الصور، وبما إن الصور مش
                  بنفس المقاس/النسبة، كل صورة كانت بتتقصّ بشكل مختلف
                  وغير متوقع. object-contain بيعرض الصورة كاملة زي ما
                  هي بدون أي قص، والخلفية الوردية الفاتحة بتملأ أي
                  فراغ حوالين الصورة بشكل موحّد ومقصود بصريًا. */}
              <div className="relative w-full h-[240px] bg-pink-50">
                <Image
                  src={t.img}
                  alt={t.name}
                  fill
                  className="object-contain p-3"
                />

                <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-[#E96B8A] shadow-md">
                  <TrendingUp size={12} />
                  {t.timeframe}
                </div>
              </div>

              <div className="p-6">
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
                    <div className="text-xs text-gray-400">من المشتركين في نظام شغف</div>
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
            كل شخص في هذه القصص بدأ من نفس نقطة البداية، وبنفس الاختبار
            اللي راح تبدأ فيه الآن. النتيجة هتختلف حسب التزامك بتنفيذ
            الخطة، لكن نقطة الانطلاق واحدة للجميع — والخطوة الأولى هي
            اللي بتحدد هل هتوصل ولا لأ.
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
            الاختبار مجاني ويأخذ 3 دقائق فقط
          </p>
        </motion.div>
      </div>
    </section>
  );
}