"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  packageName?: string;
};

const packages = [
  {
    id: "bousola",
    title: "باقة البوصلة",
    price: "9 دولار",
    forWho: "إذا كنت تشعر أنك ضائع ولا تعرف من أين تبدأ…",
    desc: "هذه ليست مرحلة تعلم… هذه مرحلة تحديد اتجاه حياتك قبل أن تضيع وقتك في مسارات خاطئة.",
    outcomes: [
      "تحديد المجال المناسب لك بناءً على وضعك الحالي",
      "معرفة المهارة الأولى التي يجب أن تبدأ بها فورًا",
      "إيقاف تشتتك بين مجالات غير مناسبة",
      "خطة واضحة لأول 30 يوم تبدأ بها مباشرة",
    ],
    result: "وضوح كامل لأول مرة في حياتك المهنية",
  },
  {
    id: "intilaqah",
    title: "باقة الانطلاقة",
    price: "39 دولار",
    forWho: "إذا لديك أساس لكن لا تعرف كيف تحوله لفرصة حقيقية…",
    desc: "المشكلة ليست أنك تتعلم… المشكلة أنك لا تبني مهارة قابلة للبيع أو التوظيف.",
    outcomes: [
      "بناء مهارة عملية قابلة للتوظيف أو العمل الحر",
      "تحسين سيرة ذاتية تجذب الفرص بدل الرفض",
      "تحويل LinkedIn إلى مصدر فرص حقيقي",
      "تنفيذ مشروع عملي يثبت مهارتك في السوق",
      "جاهزية لأول وظيفة أو أول عميل",
    ],
    result: "أول فرصة حقيقية مبنية على مهارة واضحة",
  },
  {
    id: "tamkeen",
    title: "باقة التمكين",
    price: "99 دولار",
    forWho: "إذا بدأت بالفعل لكن تريد الوصول لمستوى احترافي قوي…",
    desc: "هنا لا نتكلم عن التعلم… بل عن بناء قيمة تجعلك مطلوب في السوق.",
    outcomes: [
      "بناء حضور مهني قوي ومؤثر",
      "رفع مستوى الدخل بشكل واضح",
      "الحصول على فرص أعلى جودة واستمرارية",
      "بناء استراتيجية نمو طويلة المدى",
    ],
    result: "تصبح شخص الفرص تبحث عنه بدل أن تبحث أنت عنها",
  },
];

export default function PackagesComparison({ packageName }: Props) {
  const router = useRouter();

  const handleSelect = (id: string) => {
    router.push(`/apply?package=${id}`);
  };

  return (
    <section id="packages" className="mt-28 scroll-mt-20">
      <h2 className="text-center text-4xl font-black text-gray-900">
        جميع الباقات
      </h2>

      <p className="mt-4 text-center text-gray-700">
        اختر الباقة التي تناسب وضعك الحقيقي الآن — وليس طموحك فقط.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {packages.map((pkg) => {
          const recommended = pkg.id === packageName;

          return (
            <div
              key={pkg.id}
              className={`rounded-[30px] border bg-white p-8 transition ${
                recommended
                  ? "border-[#E96B8A] shadow-[0_25px_70px_rgba(233,107,138,.25)] scale-[1.03]"
                  : "border-gray-200"
              }`}
            >
              {recommended && (
                <div className="mb-5 inline-flex rounded-full bg-[#E96B8A] px-4 py-2 text-sm font-bold text-white">
                  ⭐ موصى بها لك
                </div>
              )}

              {/* TITLE */}
              <h3 className="text-2xl font-black text-gray-900">
                {pkg.title}
              </h3>

              {/* PRICE */}
              <div className="mt-2 text-4xl font-black text-gray-900">
                {pkg.price}
              </div>

              {/* WHO IT'S FOR */}
              <p className="mt-5 font-bold leading-8 text-gray-900">
                {pkg.forWho}
              </p>

              {/* DESCRIPTION */}
              <p className="mt-3 leading-8 text-gray-700">
                {pkg.desc}
              </p>

              {/* OUTCOMES */}
              <div className="mt-6 space-y-3">
                {pkg.outcomes.map((item) => (
                  <div key={item} className="flex gap-2">
                    <CheckCircle2 size={18} className="mt-1 text-[#E96B8A]" />
                    <span className="text-gray-900">{item}</span>
                  </div>
                ))}
              </div>

              {/* RESULT */}
              <div className="mt-6 border-t pt-5 font-bold text-gray-900">
                النتيجة: {pkg.result}
              </div>

              {/* BUTTON */}
              <button
                onClick={() => handleSelect(pkg.id)}
                className={`mt-8 w-full rounded-full py-4 font-bold transition ${
                  recommended
                    ? "bg-[#E96B8A] text-white"
                    : "border border-gray-900 text-gray-900"
                }`}
              >
                {recommended
                  ? "ابدأ الآن بهذه الباقة (موصى بها)"
                  : "اختيار هذه الباقة → متابعة الطلب"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}