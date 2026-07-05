"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Loader2, Check } from "lucide-react";

type FormData = {
  full_name: string;
  whatsapp: string;
  email: string;

  country: string;
  city: string;

  goal: string;
  current_status: string;

  skills: string;
  interviews_count: string;

  source: string;
};

const TOTAL_STEPS = 4;

const initialForm: FormData = {
  full_name: "",
  whatsapp: "",
  email: "",
  country: "",
  city: "",
  goal: "",
  current_status: "",
  skills: "",
  interviews_count: "",
  source: "landing_page",
};

const STATUS_OPTIONS = [
  { value: "student", label: "طالب", hint: "لسه في مرحلة البناء" },
  { value: "graduate", label: "خريج", hint: "خرجت... والطريق مو واضح بعد" },
  { value: "employee", label: "موظف", hint: "شغّال، بس حاسس إنك تقدر أكثر" },
  { value: "lost", label: "ضائع", hint: "تدور بين خيارات كثيرة" },
];

const GOAL_OPTIONS = [
  { value: "job", label: "وظيفة", hint: "توقف الخوف من المستقبل" },
  { value: "income", label: "دخل", hint: "تحس إن وضعك المالي تحت سيطرتك" },
  { value: "career_change", label: "تغيير مسار", hint: "قبل ما تضيّع وقت إضافي في طريق غلط" },
];

const INTERVIEWS_OPTIONS = [
  { value: "0", label: "لسه ما قدّمت على شي" },
  { value: "1-3", label: "قدّمت 1-3 مرات" },
  { value: "4+", label: "قدّمت 4 مرات أو أكثر" },
];

export default function ShagfQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<FormData>(initialForm);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSelect = (name: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const calculatePackage = () => {
    let score = 0;

    if (form.goal === "job") score += 2;
    if (form.goal === "income") score += 1;

    if (form.current_status === "employee") score += 2;
    if (form.current_status === "student") score += 1;

    if (form.skills.length > 20) score += 1;

    if (form.interviews_count === "1-3") score += 1;
    if (form.interviews_count === "4+") score += 2;

    if (score <= 3) return "bousola";
    if (score <= 6) return "intilaqah";
    return "tamkeen";
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!form.full_name.trim()) newErrors.full_name = "الاسم مطلوب";
      if (!form.whatsapp.trim()) newErrors.whatsapp = "رقم الواتساب مطلوب";
      else if (!/^\+?\d{8,15}$/.test(form.whatsapp.replace(/\s/g, "")))
        newErrors.whatsapp = "تأكد من صيغة الرقم";
      if (!form.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
      else if (!/^\S+@\S+\.\S+$/.test(form.email))
        newErrors.email = "صيغة البريد غير صحيحة";
    }

    if (step === 2) {
      if (!form.current_status) newErrors.current_status = "اختر وضعك الحالي";
    }

    if (step === 3) {
      if (!form.goal) newErrors.goal = "اختر ما تريده فعلًا";
    }

    if (step === 4) {
      if (!form.skills.trim()) newErrors.skills = "أخبرنا عن مهاراتك الحالية";
      if (!form.interviews_count) newErrors.interviews_count = "اختر إجابة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep()) return;
    setDirection(1);
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
    else handleSubmit();
  };

  const goBack = () => {
    setDirection(-1);
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  };

  // ---- نسخة تشخيصية: كل خطوة مطبوعة في الـ Console ----
  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);

    const selected_package = calculatePackage();
    console.log("[shaghaf] سيتم الحفظ بالباقة:", selected_package);

    const { error } = await supabase.from("shaghaf_leads").insert([
      {
        ...form,
        selected_package,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("[shaghaf] فشل الحفظ:", error);
      alert("حدث خطأ في الإرسال، حاول مرة أخرى");
      return;
    }

    console.log("[shaghaf] تم الحفظ بنجاح، جاري التحويل الآن...");

    try {
      router.push(`/thank-you?package=${selected_package}`);
      console.log("[shaghaf] تم استدعاء router.push بدون استثناء");
    } catch (navError) {
      console.error("[shaghaf] فشل التحويل نفسه:", navError);
    }
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  const inputClass = (field: string) =>
    `w-full border p-3 rounded-xl outline-none transition-all bg-white text-gray-900 placeholder-gray-400
     focus:ring-2 focus:ring-[#E96B8A] focus:border-[#E96B8A]
     ${errors[field] ? "border-red-400" : "border-gray-200"}`;

  const ErrorText = ({ field }: { field: string }) =>
    errors[field] ? (
      <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
    ) : null;

  const OptionCard = ({
    selected,
    label,
    hint,
    onClick,
  }: {
    selected: boolean;
    label: string;
    hint?: string;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-right p-4 rounded-xl border transition-all flex items-center justify-between gap-3
        ${
          selected
            ? "border-[#E96B8A] bg-[#FFF0F4] ring-2 ring-[#E96B8A]"
            : "border-gray-200 bg-white hover:border-[#E96B8A]/60"
        }`}
    >
      <div>
        <p className="font-bold text-gray-900">{label}</p>
        {hint && <p className="text-sm text-gray-500 mt-0.5">{hint}</p>}
      </div>
      <div
        className={`w-6 h-6 shrink-0 rounded-full border flex items-center justify-center
          ${selected ? "bg-[#E96B8A] border-[#E96B8A]" : "border-gray-300"}`}
      >
        {selected && <Check size={14} className="text-white" />}
      </div>
    </button>
  );

  return (
    <section
      className="min-h-screen bg-gradient-to-b from-[#FFF8FB] to-[#FCEFF4] px-6 py-16 text-gray-900"
      dir="rtl"
    >
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-black text-center text-gray-900">
          توقف عن العيش في وضع الاستعداد
        </h1>
        <p className="text-center text-gray-600 mt-2">
          3 دقائق تفصلك عن معرفة الخطوة التالية اللي تحتاجها فعلًا — بدون تخمين
        </p>

        <div className="mt-8 mb-2 flex justify-between text-sm text-gray-500">
          <span>الخطوة {step} من {TOTAL_STEPS}</span>
          <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#E96B8A]"
            initial={false}
            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>

        <div className="mt-8 bg-white/70 backdrop-blur rounded-2xl p-6 shadow-sm min-h-[360px] overflow-hidden relative">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="font-black text-lg text-gray-900">خلّينا نتعرف عليك</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    بياناتك تُستخدم فقط لإرسال نتيجتك، ما فيه رسائل عشوائية
                  </p>
                </div>

                <div>
                  <input
                    name="full_name"
                    placeholder="الاسم الكامل"
                    value={form.full_name}
                    onChange={handleChange}
                    className={inputClass("full_name")}
                  />
                  <ErrorText field="full_name" />
                </div>

                <div>
                  <input
                    name="whatsapp"
                    placeholder="رقم الواتساب (مع رمز الدولة)"
                    value={form.whatsapp}
                    onChange={handleChange}
                    className={inputClass("whatsapp")}
                  />
                  <ErrorText field="whatsapp" />
                </div>

                <div>
                  <input
                    name="email"
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass("email")}
                  />
                  <ErrorText field="email" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="country"
                    placeholder="الدولة"
                    value={form.country}
                    onChange={handleChange}
                    className={inputClass("country")}
                  />
                  <input
                    name="city"
                    placeholder="المدينة"
                    value={form.city}
                    onChange={handleChange}
                    className={inputClass("city")}
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="font-black text-lg text-gray-900">وين أنت الآن فعلًا؟</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    ما فيه إجابة خاطئة، فقط نريد نفهم نقطة انطلاقك الحقيقية
                  </p>
                </div>

                <div className="space-y-3">
                  {STATUS_OPTIONS.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      selected={form.current_status === opt.value}
                      label={opt.label}
                      hint={opt.hint}
                      onClick={() => handleSelect("current_status", opt.value)}
                    />
                  ))}
                </div>
                <ErrorText field="current_status" />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="font-black text-lg text-gray-900">ما الذي تريده فعلًا؟</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    ليس الوسيلة... بل الشعور الذي تريد الوصول له
                  </p>
                </div>

                <div className="space-y-3">
                  {GOAL_OPTIONS.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      selected={form.goal === opt.value}
                      label={opt.label}
                      hint={opt.hint}
                      onClick={() => handleSelect("goal", opt.value)}
                    />
                  ))}
                </div>
                <ErrorText field="goal" />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="font-black text-lg text-gray-900">آخر خطوة</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    هذا يساعدنا نحدد بالضبط من أين تبدأ، لا من الصفر إذا ما تحتاج
                  </p>
                </div>

                <div>
                  <textarea
                    name="skills"
                    placeholder="اكتب المهارات أو الخبرات اللي عندك حاليًا، حتى لو بسيطة"
                    value={form.skills}
                    onChange={handleChange}
                    rows={4}
                    className={inputClass("skills")}
                  />
                  <ErrorText field="skills" />
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-700 mb-2">
                    كم مرة قدّمت على وظائف أو فرص حتى الآن؟
                  </p>
                  <div className="space-y-3">
                    {INTERVIEWS_OPTIONS.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        selected={form.interviews_count === opt.value}
                        label={opt.label}
                        onClick={() => handleSelect("interviews_count", opt.value)}
                      />
                    ))}
                  </div>
                  <ErrorText field="interviews_count" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex gap-3">
          {step > 1 && (
            <button
              onClick={goBack}
              disabled={loading}
              className="flex-1 border border-[#E96B8A] text-[#E96B8A] p-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#FFF0F4] transition-colors disabled:opacity-50"
            >
              <ArrowLeft size={18} />
              رجوع
            </button>
          )}

          <button
            onClick={goNext}
            disabled={loading}
            className="flex-1 bg-[#E96B8A] text-white p-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#d85a79] transition-colors disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                جاري تحليل إجاباتك...
              </>
            ) : step === TOTAL_STEPS ? (
              <>
                اكتشف خطوتك التالية
                <ArrowRight size={18} />
              </>
            ) : (
              <>
                التالي
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}