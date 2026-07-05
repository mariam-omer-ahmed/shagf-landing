"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  MessageCircle,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";

type PackageKey = "bousola" | "intilaqah" | "tamkeen";

type PackageContent = {
  name: string;
  headline: string;
  description: string;
  points: string[];
};

// ------------------------------------------------------------------
// عدّلي النصوص والأرقام هنا لتطابق باقاتك الفعلية
// ------------------------------------------------------------------
const PACKAGES: Record<PackageKey, PackageContent> = {
  bousola: {
    name: "بوصلة",
    headline: "أنت في بداية الطريق، وهذا بالضبط ما تحتاجه الآن",
    description:
      "نتيجتك تشير إلى أنك تحتاج أولًا تحديد الاتجاه الصحيح قبل أي خطوة أخرى. باقة بوصلة صُممت خصيصًا لهذه المرحلة.",
    points: [
      "تشخيص واضح لنقطة انطلاقك الحالية",
      "تحديد المسار الأنسب لك بدون تخمين",
      "خطة أولى تعرف منها بالضبط من أين تبدأ",
    ],
  },
  intilaqah: {
    name: "الانطلاقة",
    headline: "عندك أساس جيد، والآن وقت التحرك بثقة",
    description:
      "نتيجتك تشير إلى أنك تجاوزت مرحلة الحيرة الأولى، وتحتاج نظامًا يرتب خطواتك ويسرّع وصولك للنتيجة.",
    points: [
      "خطة تنفيذية مبنية على وضعك الحالي بالضبط",
      "متابعة تحفظ لك الاستمرارية بدل التوقف",
      "أدوات عملية تقربك من فرصتك التالية",
    ],
  },
  tamkeen: {
    name: "التمكين",
    headline: "أنت جاهز لمرحلة أعمق من التطبيق",
    description:
      "نتيجتك تشير إلى خبرة ووضوح جيدين. المرحلة القادمة بالنسبة لك ليست معرفة الاتجاه، بل تسريع الوصول للنتيجة بأعلى كفاءة.",
    points: [
      "مسار متقدم مبني على خبرتك الحالية",
      "دعم مباشر يختصر عليك وقت التجربة والخطأ",
      "استراتيجية واضحة للوصول لهدفك النهائي",
    ],
  },
};

// ------------------------------------------------------------------
// الاعتراضات: كل واحد يُعاد صياغته للسبب الحقيقي خلفه قبل الرد عليه
// عدّلي أو أضيفي حسب أكثر اعتراض تسمعينه فعليًا من عملائك
// ------------------------------------------------------------------
const OBJECTIONS: { question: string; reframe: string; answer: string }[] = [
  {
    question: "جربت قبل كذا كورسات وبرامج ولم تنفع، ليش هذي مختلفة؟",
    reframe:
      "المشكلة الحقيقية غالبًا ما كانت في الكورسات نفسها، بل في إنها زادتك معلومات فوق معلومات بدون ترتيب — وهذا يزيد الشك، ما يحله.",
    answer:
      "شغف مو كورس جديد تضيفه لقائمتك. هو النظام اللي يحدد لك أي خطوة تاخذها أولًا، بناءً على وضعك الفعلي، لا نظرية عامة تصلح للجميع.",
  },
  {
    question: "خايف أضيع وقتي وفلوسي لو ما نفعت معايا؟",
    reframe:
      "هذا الخوف طبيعي، وهو نفسه سبب تأجيلك للقرار لفترة طويلة. لكن لاحظ: البديل هو الاستمرار في نفس الحيرة لأشهر إضافية بدون أي التزام — وهذا أيضًا له تكلفة، فقط مخفية.",
    answer:
      "[هنا تحطين ضمانك الفعلي بدقة: مثلًا مدة استرجاع، أو جلسة تقييم مجانية قبل أي التزام مالي. لا تتركي هذا فارغًا، فالوضوح هنا يبني الثقة].",
  },
  {
    question: "مو متأكد إن الباقة اللي طلعت لي تناسبني فعلًا",
    reframe:
      "النتيجة مبنية على إجاباتك، لكنها نقطة بداية للمحادثة، مو حكم نهائي عليك.",
    answer:
      "في المكالمة القصيرة القادمة نراجع وضعك سوا ونتأكد إن الباقة صح قبل أي خطوة، وإذا ما كانت مناسبة نوجهك للأصح بدون أي إلزام.",
  },
  {
    question: "ما عندي وقت الحين، ممكن أبدأ بعدين؟",
    reframe:
      "غالبًا 'بعدين' هذي نفس الجملة اللي قلتها قبل شهور. المشكلة مو الوقت، المشكلة إن كل يوم تأجيل يعني يوم إضافي من نفس الحيرة.",
    answer:
      "الخطوة الأولى معنا لا تحتاج التزام وقت كبير — فقط مكالمة قصيرة توضح لك الصورة، وبعدها تقرر بثقة، لا بتخمين.",
  },
  {
    question: "أقدر أسوي هذا لحالي بدون مساعدة؟",
    reframe:
      "أكيد ممكن نظريًا، وأغلب من عندهم 10 شهادات حاولوا هذا بالضبط. المشكلة مو المعرفة، المشكلة إنك تكون الحكم والمُنفذ في نفس الوقت على قرار يخص مستقبلك.",
    answer:
      "شغف مو بديل عن مجهودك، هو الجهة اللي ترتب لك مجهودك بدل ما يتشتت بين 20 مصدر مختلف.",
  },
];

const WHATSAPP_LINK = "https://wa.me/249963370737"; // عدّلي الرقم الفعلي

function ObjectionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof OBJECTIONS)[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 p-4 text-right"
      >
        <span className="font-bold text-gray-900">{item.question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-[#E96B8A]"
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.reframe}
              </p>
              <p className="text-gray-800 leading-relaxed">{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const packageParam = searchParams.get("package") as PackageKey | null;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const pkg =
    packageParam && PACKAGES[packageParam]
      ? PACKAGES[packageParam]
      : PACKAGES.bousola;

  return (
    <section
      className="min-h-screen bg-gradient-to-b from-[#FFF8FB] to-[#FCEFF4] px-6 py-16"
      dir="rtl"
    >
      <div className="max-w-2xl mx-auto space-y-10">
        {/* ------- النتيجة ------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/80 backdrop-blur rounded-2xl shadow-sm p-8 text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-[#FFF0F4] flex items-center justify-center">
              <CheckCircle2 className="text-[#E96B8A]" size={30} />
            </div>
          </div>

          <p className="text-sm font-bold text-[#E96B8A] mb-2">
            باقتك المقترحة: {pkg.name}
          </p>

          <h1 className="text-2xl font-black text-gray-900 mb-3">
            {pkg.headline}
          </h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {pkg.description}
          </p>

          <ul className="space-y-3 text-right mb-2">
            {pkg.points.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <CheckCircle2
                  size={18}
                  className="text-[#E96B8A] shrink-0 mt-0.5"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ------- الفكرة المحورية ------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center px-4"
        >
          <p className="text-lg font-black text-gray-900 leading-relaxed">
            القرار لا يأتي بعد اليقين...
            <br />
            اليقين يأتي بعد القرار.
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            كل يوم إضافي من التأجيل لا يقربك من اليقين، فقط يؤخر خطوتك الأولى
          </p>
        </motion.div>

        {/* ------- الاعتراضات ------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-lg font-black text-gray-900 mb-4 text-center">
            أسئلة تدور في بالك الآن على الأغلب
          </h2>
          <div className="space-y-3">
            {OBJECTIONS.map((item, i) => (
              <ObjectionItem
                key={i}
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </motion.div>

        {/* ------- ضمان / تقليل المخاطرة ------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white/70 border border-[#E96B8A]/20 rounded-2xl p-5 flex items-start gap-3"
        >
          <ShieldCheck className="text-[#E96B8A] shrink-0 mt-1" size={22} />
          <p className="text-gray-700 text-sm leading-relaxed">
            {/* عدّلي هذا النص ليعكس ضمانك أو سياستك الفعلية بدقة تامة */}
            [نص الضمان الفعلي هنا: مثلًا "مكالمة التقييم الأولى مجانية بدون أي
            التزام"، أو أي سياسة استرجاع تطبّقينها فعلًا]
          </p>
        </motion.div>

        {/* ------- الخطوة التالية ------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center"
        >
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full sm:w-auto justify-center items-center gap-2 bg-[#E96B8A] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#d85a79] transition-colors"
          >
            <MessageCircle size={18} />
            احجز مكالمتك المجانية الآن
          </a>
          <p className="text-xs text-gray-400 mt-3">
            سيتم التواصل معك أيضًا عبر الواتساب خلال وقت قصير
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Suspense مطلوب لأن useSearchParams يحتاج حدود Suspense في App Router
export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYouContent />
    </Suspense>
  );
}