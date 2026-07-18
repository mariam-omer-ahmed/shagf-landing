"use client";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowDown,
  ShieldCheck,
  Clock,
  Star,
  XCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

type Props = {
  packageName?: string;
  // مرّر هذا الرقم من السيرفر (عدّ فعلي لعدد الصفوف في جدول الـ leads/submissions)
  // مثال: const count = await db.leads.count({ where: { createdAt: { gte: startOfMonth } } })
  // لو ما توفر، القسم بالكامل ما يظهر بدل ما يظهر رقم غير دقيق
  submissionsCount?: number;
};
type DiagnosisData = {
  readiness_percent: number;
  urgency_score: number;
  top_problems: string[];
  recommendation: string;
};

const packageData: Record<
  string,
  {
    title: string;
    reason: string;
    benefits: string[];
    price?: string;
    oldPrice?: string;
  }
> = {
  bousola: {
    title: "باقة بوصلة",
    reason:
      "لأنك ما زلت في مرحلة اكتشاف الاتجاه المناسب، وأهم خطوة الآن هي بناء مسار واضح قبل استثمار وقتك وجهدك في تعلم مهارات قد لا تحتاجها.",
    benefits: [
      "تحديد المسار المناسب لك بناءً على نقاط قوتك الفعلية",
      "خطة تعلم مرتبة بالترتيب الصحيح، بلا تشتت",
      "معايير واضحة تعرف بها متى تكون جاهزًا فعلًا لأول فرصة",
      "متابعة تمنعك من الرجوع لدائرة التردد",
    ],
  },

  intilaqah: {
    title: "باقة انطلاقة",
    reason:
      "لأن لديك أساسًا جيدًا، لكنك تحتاج إلى ترتيب خطواتك وتحويل ما تعلمته إلى خطة عملية تقودك إلى أول فرصة حقيقية.",
    benefits: [
      "تحويل ما تعلمته سابقًا إلى نتائج ملموسة خلال أسابيع",
      "خطة عملية أسبوعية بدل التعلم العشوائي",
      "مراجعة مباشرة لأعمالك لسد الفجوات قبل التقديم",
      "دعم مباشر حتى أول فرصة عمل حقيقية",
    ],
  },

  tamkeen: {
    title: "باقة تمكين",
    reason:
      "لأنك قطعت شوطًا جيدًا في التعلم، وما ينقصك الآن هو التنفيذ الصحيح، والمتابعة، وربط مهاراتك بمتطلبات سوق العمل.",
    benefits: [
      "صقل مهاراتك على معايير سوق العمل الفعلية",
      "استراتيجية تسويق ذاتي تضعك أمام الفرص المناسبة",
      "متابعة أسبوعية تحاسبك وتدفعك للأمام",
      "دعم تفاوضي عند وصولك لمرحلة العروض",
    ],
  },
};

function readinessTone(percent: number) {
  if (percent < 40) {
    return { color: "#E4574C", label: "ضعيفة" };
  }
  if (percent < 70) {
    return { color: "#E9A23B", label: "متوسطة" };
  }
  return { color: "#3FAE6A", label: "جيدة" };
}

export default function HeroResult({ packageName, submissionsCount }: Props) {
  const safeKey = packageName ?? "intilaqah";

  const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("shaghaf_diagnosis");

    if (stored) {
      setDiagnosis(JSON.parse(stored));
    }
  }, []);

  const current = packageData[safeKey] ?? packageData.intilaqah;

  useEffect(() => {
    trackEvent({
      event: "result_view",
      page: "/thank-you",
      package_id: packageName,
    });
  }, [packageName]);

  const readiness = diagnosis ? readinessTone(diagnosis.readiness_percent) : null;

  return (
    <section className="relative overflow-hidden pb-20 pt-28 sm:pt-36">
      {/* الخلفية */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8FB] via-white to-[#FFF8FB]" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        {/* Badge + إثبات اجتماعي */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-pink-200 bg-white px-6 py-3 shadow-lg">
            <CheckCircle2 className="text-[#E96B8A]" size={22} />
            <span className="font-bold text-gray-800">
              تم تحليل إجاباتك بنجاح
            </span>
          </div>

          {/* يظهر فقط إذا مرّرت رقمًا حقيقيًا من قاعدة البيانات عبر submissionsCount */}
          {typeof submissionsCount === "number" && submissionsCount > 0 && (
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-500">
              <div className="flex -space-x-1 rtl:space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-6 w-6 rounded-full border-2 border-white bg-gradient-to-br from-pink-200 to-pink-400"
                  />
                ))}
              </div>
              <span>
                انضمّ +{submissionsCount.toLocaleString("ar")} شخص لهذا التشخيص هذا الشهر
              </span>
            </div>
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-10 text-5xl font-black leading-tight text-gray-900"
        >
          هذا بالضبط ما يمنعك من البدء
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-xl leading-10 text-gray-600"
        >
          قارنّا إجاباتك بمئات الحالات المشابهة، ووصلنا إلى تشخيص دقيق
          لموقعك الحالي — والعائق الحقيقي الذي يوقفك عن التقدّم.
        </motion.p>

        {diagnosis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mt-12 rounded-[32px] border border-pink-100 bg-white p-8 text-right shadow-lg"
          >
            <h3 className="text-2xl font-black text-gray-900">
              تشخيص وضعك الحالي
            </h3>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-[#FFF5F8] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-900">درجة الجاهزية الحالية</p>
                  {readiness && (
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                      style={{ backgroundColor: readiness.color }}
                    >
                      {readiness.label}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-4xl font-black text-[#E96B8A]">
                  {diagnosis.readiness_percent}%
                </p>

                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-pink-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${diagnosis.readiness_percent}%`,
                      backgroundColor: readiness?.color,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-[#FFF5F8] p-5">
                <p className="text-sm text-gray-900">مستوى الرغبة في البدء</p>

                <p className="mt-2 text-4xl font-black text-[#E96B8A]">
                  {diagnosis.urgency_score}%
                </p>

                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-pink-100">
                  <div
                    className="h-full rounded-full bg-[#E96B8A] transition-all"
                    style={{ width: `${diagnosis.urgency_score}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-black text-gray-900">
                أبرز العوائق التي اكتشفناها
              </h4>

              <div className="mt-5 space-y-4">
                {diagnosis.top_problems?.map(
                  (problem: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4"
                    >
                      <CheckCircle2 size={22} className="mt-1 text-[#E96B8A]" />
                      <p className="text-gray-700 leading-8">{problem}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ماذا يعني هذا */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mx-auto mt-12 max-w-3xl rounded-[32px] bg-[#0F172A] p-10 text-right text-white"
        >
          <h3 className="text-2xl font-black">ماذا يعني هذا فعليًا؟</h3>

          <p className="mt-5 text-lg leading-9 text-gray-300">
            نتائجك تؤكد أن المشكلة ليست نقص الحماس ولا نقص الفرص:
          </p>

          <div className="mt-5 space-y-3">
            {[
              "لديك فجوة واضحة بين وضعك الحالي والمهارات المطلوبة للوصول إلى هدفك.",
              "الجهد الذي تبذله حاليًا مبعثر، بلا خطة تربطه بنتيجة محددة.",
              "بدون تصحيح هذه الفجوة، ستستمر بالشعور بأنك تعمل دون أن ترى تقدّمًا فعليًا.",
            ].map((line, i) => (
              <div key={i} className="flex items-start gap-3">
                <Sparkles size={18} className="mt-1 shrink-0 text-[#E96B8A]" />
                <p className="text-gray-300 leading-8">{line}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* مقارنة: مع خطة مقابل بدون خطة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mx-auto mt-12 max-w-3xl"
        >
          <h3 className="text-3xl font-black text-gray-900">
            إذا استمر الوضع كما هو...
          </h3>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-9 text-gray-600">
            الأغلب أنك ستقضي أشهرًا إضافية في تجربة دورات متفرقة، دون خطة
            واضحة تقودك إلى النتيجة التي تريدها فعلًا.
          </p>

          <div className="mt-8 grid gap-4 text-right md:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-2 font-black text-gray-500">
                <XCircle size={20} />
                <span>بدون خطة واضحة</span>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li>تعلّم عشوائي بلا أولويات</li>
                <li>وقت وجهد يُصرف دون نتيجة ملموسة</li>
                <li>تردد مستمر واتخاذ قرار مؤجَّل دائمًا</li>
              </ul>
            </div>

            <div className="rounded-3xl border-2 border-[#E96B8A] bg-[#FFF5F8] p-6">
              <div className="mb-4 flex items-center gap-2 font-black text-[#E96B8A]">
                <CheckCircle2 size={20} />
                <span>مع خطة مبنية على تشخيصك</span>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li>خطوات مرتبة بالأولوية الصحيحة لوضعك تحديدًا</li>
                <li>تقدّم يمكنك قياسه أسبوعيًا</li>
                <li>مسار واضح ينتهي بفرصة حقيقية</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* التوصية / العرض */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mx-auto mt-12 max-w-xl rounded-3xl border-2 border-[#E96B8A] bg-white p-8 text-right shadow-xl"
        >
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#E96B8A]">
            <Sparkles size={16} />
            <span>التوصية المبنية على نتائج تشخيصك</span>
          </div>

          <h2 className="text-4xl font-black text-[#E96B8A]">
            {current.title}
          </h2>

          <p className="mt-5 text-lg leading-9 text-gray-700">
            {current.reason}
          </p>

          <div className="mt-6 space-y-3 border-t border-gray-100 pt-6">
            {current.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#E96B8A]" />
                <span className="text-gray-700">{b}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-6 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={18} className="text-[#E96B8A]" />
              <span>ضمان استرجاع كامل خلال 7 أيام</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={18} className="text-[#E96B8A]" />
              {/* TODO: اربط هذا بعدد مقاعد أو مهلة حقيقية */}
              <span>عدد المقاعد لهذا الفوج محدود</span>
            </div>
          </div>

          <Link
            href="#packages"
            onClick={() =>
              trackEvent({
                event: "packages_section_click",
                page: "/thank-you",
              })
            }
            className="mt-8 flex items-center justify-center rounded-full bg-[#0F172A] px-8 py-4 text-center font-bold text-white transition hover:scale-105"
          >
            ابدأ خطتك الآن
          </Link>

          <p className="mt-3 text-center text-xs text-gray-400">
            بدون التزام طويل الأجل — يمكنك مراجعة تفاصيل الباقة قبل الدفع
          </p>
        </motion.div>

        {/* CTA hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mx-auto mt-14 max-w-2xl"
        >
          <p className="text-2xl font-black text-gray-900">لكن...</p>

          <p className="mt-5 text-xl leading-10 text-gray-700">
            المشكلة ليست اختيار الباقة، بل فهم السبب الحقيقي الذي أوصلك إلى
            هذه المرحلة — وهذا بالضبط ما بنيت عليه الخطة أدناه.
          </p>
        </motion.div>

        {/* Arrow */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="mt-16 flex justify-center"
        >
          <ArrowDown className="text-[#E96B8A]" size={34} />
        </motion.div>
      </div>
    </section>
  );
}