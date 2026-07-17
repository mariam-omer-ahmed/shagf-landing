"use client";

import { CheckCircle2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  packageName?: string;
};

const packages = [
  {
    id: "bousola",
    title: "باقة البوصلة",
    price: "15 دولار",
    tagline: "أقل من ثمن وجبة، مقابل توقف التخبط نهائيًا",
    forWho: "لمن يشعر أنه ضائع بين عشرات المسارات، ولا يعرف من أين يبدأ فعليًا.",
    desc:
      "المشكلة الحقيقية ليست غياب الفرص، بل غياب الاتجاه. كل شهر إضافي تقضيه في التردد هو فرصة تذهب لشخص آخر أكثر وضوحًا. هذه الباقة لا تعلّمك مهارة جديدة، بل تمنحك القرار الصحيح قبل أن تستثمر وقتك في الاتجاه الخاطئ.",
    outcomes: [
      "تحديد المجال الأنسب لك خلال أيام لا شهور، بناءً على وضعك الفعلي لا التخمين",
      "معرفة المهارة الأولى بالتحديد التي تبدأ بها غدًا صباحًا",
      "التخلص من التشتت بين مجالات لا تناسبك، فورًا وبثقة",
      "خطة مكتوبة وواضحة لأول 30 يومًا، جاهزة للتنفيذ من اليوم الأول",
    ],
    result: "وضوح كامل تجاه مسارك المهني، لأول مرة في حياتك",
  },
  {
    id: "intilaqah",
    title: "باقة الانطلاقة",
    price: "59 دولار",
    tagline: "الأكثر اختيارًا لمن يريد نتيجة ملموسة خلال شهر واحد",
    forWho: "لمن يملك أساسًا لكنه عاجز عن تحويله إلى فرصة عمل أو دخل حقيقي.",
    desc:
      "المشكلة ليست أنك لا تتعلم، فأنت على الأرجح تعلّمت الكثير بالفعل. المشكلة أنك تملك معرفة متناثرة لا مهارة قابلة للبيع أو التوظيف. الفرق بين شخص يُرفض وآخر يُقبل غالبًا ليس الموهبة، بل طريقة عرضها.",
    outcomes: [
      "بناء مهارة عملية واحدة قابلة للتوظيف أو العمل الحر فورًا",
      "سيرة ذاتية تُصمَّم لتجذب الفرص لا أن تنتهي في سلة المرفوضين",
      "ملف LinkedIn يتحول من واجهة خاملة إلى مصدر فرص فعلي",
      "مشروع عملي حقيقي يثبت مهارتك أمام أي جهة توظيف أو عميل",
      "جاهزية كاملة لأول وظيفة أو أول عميل يدفع لك",
    ],
    result: "أول فرصة حقيقية مبنية على مهارة واضحة، لا على الحظ",
  },
  {
    id: "tamkeen",
    title: "باقة التمكين",
    price: "149 دولار",
    tagline: "لمن قرر أن يكون في الطليعة، لا أن يلحق بالركب",
    forWho: "لمن بدأ بالفعل، ويريد الانتقال إلى مستوى احترافي يصعب تجاهله في السوق.",
    desc:
      "هنا لا نتحدث عن التعلم، فأنت تجاوزت هذه المرحلة. نتحدث عن بناء قيمة سوقية تجعلك الخيار الأول، لا أحد الخيارات. الفارق بين من يبحث عن فرصة ومن تُعرض عليه الفرص هو مستوى الحضور والقيمة التي يقدمها.",
    outcomes: [
      "بناء حضور مهني قوي ومؤثر يسبقك في أي مكان تتقدم إليه",
      "رفع مستوى دخلك بشكل واضح وقابل للقياس، لا وعود مبهمة",
      "الوصول إلى فرص أعلى جودة واستمرارية، لا مجرد مشاريع متفرقة",
      "استراتيجية نمو مهني طويلة المدى، مصممة لثلاثة أشهر كاملة",
    ],
    result: "تصبح الشخص الذي تبحث عنه الفرص، بدل أن تبحث أنت عنها",
  },
];

export default function PackagesComparison({ packageName }: Props) {
  const router = useRouter();

  const handleSelect = (id: string) => {
    router.push(`/apply?package=${id}`);
  };

  return (
    <section id="packages" className="mt-28 scroll-mt-20">
      <h2 className="text-center text-4xl font-bold text-[#3A2530]">
        اختر الباقة المناسبة لوضعك الآن
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-center leading-8 text-[#6B5F66]">
        الفرق بين من يصل ومن يبقى مكانه غالبًا ليس الموهبة، بل اختيار
        الخطوة الصحيحة في الوقت الصحيح. اختر وضعك الحقيقي الآن، لا طموحك
        فقط.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {packages.map((pkg) => {
          const recommended = pkg.id === packageName;

          return (
            <div
              key={pkg.id}
              className={`flex flex-col rounded-[30px] border bg-white p-8 transition ${
                recommended
                  ? "scale-[1.03] border-[#E96B8A] shadow-[0_25px_70px_rgba(233,107,138,.25)]"
                  : "border-pink-100"
              }`}
            >
              {recommended && (
                <div className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#E96B8A] px-4 py-2 text-sm font-bold text-white">
                  <Zap size={14} />
                  الأنسب لنتيجة تقييمك
                </div>
              )}

              {/* TITLE */}
              <h3 className="text-2xl font-bold text-[#3A2530]">
                {pkg.title}
              </h3>

              {/* PRICE */}
              <div className="mt-2 text-4xl font-bold text-[#3A2530]">
                {pkg.price}
              </div>

              <p className="mt-2 text-sm font-bold text-[#E96B8A]">
                {pkg.tagline}
              </p>

              {/* WHO IT'S FOR */}
              <p className="mt-5 font-bold leading-8 text-[#3A2530]">
                {pkg.forWho}
              </p>

              {/* DESCRIPTION */}
              <p className="mt-3 leading-8 text-[#6B5F66]">
                {pkg.desc}
              </p>

              {/* OUTCOMES */}
              <div className="mt-6 space-y-3">
                {pkg.outcomes.map((item) => (
                  <div key={item} className="flex gap-2">
                    <CheckCircle2
                      size={18}
                      className="mt-1 shrink-0 text-[#E96B8A]"
                    />
                    <span className="leading-7 text-[#3A2530]">{item}</span>
                  </div>
                ))}
              </div>

              {/* RESULT */}
              <div className="mt-6 border-t border-pink-100 pt-5 font-bold text-[#3A2530]">
                النتيجة: {pkg.result}
              </div>

              {/* BUTTON */}
              <button
                onClick={() => handleSelect(pkg.id)}
                className={`mt-8 w-full rounded-full py-4 font-bold transition ${
                  recommended
                    ? "bg-[#E96B8A] text-white hover:bg-[#d95d7d]"
                    : "border border-[#3A2530] text-[#3A2530] hover:bg-[#FFF3F7]"
                }`}
              >
                {recommended
                  ? "ابدأ الآن بهذه الباقة (الأنسب لك)"
                  : "اختر هذه الباقة ← متابعة الطلب"}
              </button>

            </div>
          );
        })}
      </div>
    </section>
  );
}