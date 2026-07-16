"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Check, Sparkles } from "lucide-react";

import { supabase } from "@/lib/supabase";
import {
  trackAssessmentStart,
  trackAssessmentCompleted,
  trackQuestion,
  trackAnswer,
  trackDropOff,
  getSessionId,
} from "./analytics";

/* ==============================================================
   Types
============================================================== */

type FormData = {
  // scored inputs
  current_status: string;
  goal: string;
  readiness: string;
  age_range: string;
  interviews_count: string;
  skills: string;

  // contact — collected LAST, right before the result is revealed
  full_name: string;
  whatsapp: string;
  email: string;
  country: string;
  city: string;

  source: string;
};

type Option = {
  value: string;
  label: string;
  hint?: string;
};

/* ==============================================================
   Step map
============================================================== */

const STEPS = [
  "current_status",
  "goal",
  "readiness",
  "age_range",
  "interviews_count",
  "skills",
  "contact",
] as const;

type StepKey = (typeof STEPS)[number];

const TOTAL_STEPS = STEPS.length;

const initialForm: FormData = {
  current_status: "",
  goal: "",
  readiness: "",
  age_range: "",
  interviews_count: "",
  skills: "",

  full_name: "",
  whatsapp: "",
  email: "",
  country: "",
  city: "",

  source: "landing_page",
};

/* ==============================================================
   Options
============================================================== */

const STATUS_OPTIONS: Option[] = [
  { value: "student", label: "طالب", hint: "ما زلت تبني مستقبلك المهني" },
  { value: "graduate", label: "خريج", hint: "تبحث عن أول فرصة حقيقية" },
  { value: "employee", label: "موظف", hint: "تريد تطوير مسارك أو دخلك" },
  { value: "lost", label: "لا أعرف من أين أبدأ", hint: "أشعر بالتشتت بين المسارات" },
];

const GOAL_OPTIONS: Option[] = [
  { value: "job", label: "الحصول على وظيفة", hint: "أريد دخول سوق العمل" },
  { value: "income", label: "زيادة الدخل", hint: "أريد مصدر دخل أفضل" },
  { value: "career_change", label: "تغيير المسار", hint: "أشعر أنني في الطريق الخطأ" },
];

const READINESS_OPTIONS: Option[] = [
  { value: "ready_now", label: "جاهز أبدأ الآن", hint: "أريد خطة عملية أطبقها فورًا" },
  { value: "considering", label: "أفكر بجدية", hint: "أحتاج أعرف أكثر قبل ما أقرر" },
  { value: "exploring", label: "أستكشف فقط", hint: "لسه في مرحلة جمع المعلومات" },
];

const AGE_OPTIONS: Option[] = [
  { value: "18-22", label: "18 - 22" },
  { value: "23-27", label: "23 - 27" },
  { value: "28-35", label: "28 - 35" },
  { value: "36+", label: "36 فأكثر" },
];

const INTERVIEWS_OPTIONS: Option[] = [
  { value: "0", label: "لم أقدم على أي وظيفة" },
  { value: "1-3", label: "قدمت من مرة إلى ثلاث مرات" },
  { value: "4+", label: "قدمت أكثر من أربع مرات" },
];

/* ==============================================================
   Component
============================================================== */

export default function ShagfQuizV2() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<FormData>(initialForm);

  const stepEnteredAtRef = useRef<number>(Date.now());
  const completedRef = useRef(false);
  const furthestStepRef = useRef(1);

  const currentKey: StepKey = STEPS[step - 1];

  /* ===========================
      Session + analytics
      Session id now comes from getSessionId() (lib/analytics.ts),
      persisted in localStorage — the same id follows the visitor
      across the whole funnel (Hero -> Quiz -> Result -> Application),
      instead of a fresh id being generated per page.
  =========================== */

  useEffect(() => {
    trackAssessmentStart();
  }, []);

  useEffect(() => {
    const now = Date.now();
    const msSinceLastStep = now - stepEnteredAtRef.current;
    stepEnteredAtRef.current = now;

    furthestStepRef.current = Math.max(furthestStepRef.current, step);

    trackQuestion(step, currentKey, msSinceLastStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    const reportDropOff = () => {
      if (completedRef.current) return;
      trackDropOff(furthestStepRef.current, TOTAL_STEPS);
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") reportDropOff();
    };

    window.addEventListener("beforeunload", reportDropOff);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("beforeunload", reportDropOff);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  /* ===========================
      Helpers
  =========================== */

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

  const handleSelect = (field: keyof FormData, value: string) => {
    trackAnswer(field, value);

    setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  /* ===========================
      Package Engine (v2)
  =========================== */

  const STATUS_WEIGHTS: Record<string, number> = {
    lost: 1,
    student: 2,
    graduate: 4,
    employee: 5,
  };

  const GOAL_WEIGHTS: Record<string, number> = {
    job: 3,
    income: 4,
    career_change: 5,
  };

  const READINESS_WEIGHTS: Record<string, number> = {
    exploring: 1,
    considering: 3,
    ready_now: 6,
  };

  const INTERVIEWS_WEIGHTS: Record<string, number> = {
    "0": 1,
    "1-3": 3,
    "4+": 5,
  };

  const calculatePackage = (): string => {
    let score = 0;

    score += STATUS_WEIGHTS[form.current_status] ?? 0;
    score += GOAL_WEIGHTS[form.goal] ?? 0;
    score += READINESS_WEIGHTS[form.readiness] ?? 0;
    score += INTERVIEWS_WEIGHTS[form.interviews_count] ?? 0;

    const length = form.skills.trim().length;
    if (length > 20) score += 2;
    if (length > 60) score += 2;
    if (length > 120) score += 2;

    if (score <= 9) return "bousola";
    if (score <= 18) return "intilaqah";
    return "tamkeen";
  };

  /* ===========================
      Validation
  =========================== */

  const validateStep = (): boolean => {
    const nextErrors: Record<string, string> = {};

    switch (currentKey) {
      case "current_status":
        if (!form.current_status) nextErrors.current_status = "اختر إجابة";
        break;

      case "goal":
        if (!form.goal) nextErrors.goal = "اختر إجابة";
        break;

      case "readiness":
        if (!form.readiness) nextErrors.readiness = "اختر إجابة";
        break;

      case "age_range":
        if (!form.age_range) nextErrors.age_range = "اختر إجابة";
        break;

      case "interviews_count":
        if (!form.interviews_count) nextErrors.interviews_count = "اختر إجابة";
        break;

      case "skills":
        if (!form.skills.trim()) nextErrors.skills = "اكتب مهاراتك";
        break;

      case "contact":
        if (!form.full_name.trim()) nextErrors.full_name = "الاسم مطلوب";

        if (!form.whatsapp.trim()) {
          nextErrors.whatsapp = "رقم الواتساب مطلوب";
        } else if (!/^\+?\d{8,15}$/.test(form.whatsapp.replace(/\s/g, ""))) {
          nextErrors.whatsapp = "رقم غير صحيح";
        }

        if (!form.email.trim()) {
          nextErrors.email = "البريد الإلكتروني مطلوب";
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
          nextErrors.email = "البريد غير صحيح";
        }
        break;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  /* ===========================
      Navigation
  =========================== */

  const goNext = () => {
    if (!validateStep()) return;

    setDirection(1);

    if (step < TOTAL_STEPS) {
      setStep((prev) => prev + 1);
      return;
    }

    handleSubmit();
  };

  const goBack = () => {
    setDirection(-1);
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 1));
  };

  /* ===========================
      Submit
      FIX: removed the duplicate completedRef/trackAssessmentCompleted/
      router.push block that used to run unconditionally AFTER the
      try/catch — it was firing even when the insert failed, which is
      why the page looked like it "worked" even on error. Now
      navigation only happens inside the success path.
  =========================== */

  const handleSubmit = async () => {
  if (!validateStep()) return;

  setLoading(true);

  const selected_package = calculatePackage();

  const payload = {
    ...form,
    selected_package,
    session_id: getSessionId(),
  };

  try {
    // حفظ الـ Lead
    const { error } = await supabase
      .from("shaghaf_leads")
      .insert(payload);

    if (error) throw error;

    // Analytics
    completedRef.current = true;
    trackAssessmentCompleted(selected_package);

    // حفظ الباقة مؤقتاً لاستخدامها بعد التسجيل
    localStorage.setItem("selected_package", selected_package);

    // التحقق هل المستخدم مسجل دخول
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // إذا لم يكن لديه حساب
    if (!user) {
      router.push(
        `/register?package=${selected_package}&email=${encodeURIComponent(
          form.email
        )}&name=${encodeURIComponent(form.full_name)}`
      );
      return;
    }

    // إذا كان مسجل دخول بالفعل
    router.push(`/thank-you?package=${selected_package}`);
  } catch (err: any) {
    console.error("Supabase insert failed (raw):", err);
    console.error("Supabase insert failed (json):", JSON.stringify(err));

    alert(
      `حدث خطأ أثناء الإرسال\n\n${err?.message ?? "بدون رسالة"}\nCode: ${
        err?.code ?? "-"
      }\nDetails: ${err?.details ?? "-"}\nHint: ${
        err?.hint ?? "-"
      }\n\nRaw: ${JSON.stringify(err)}`
    );
  } finally {
    setLoading(false);
  }
};
  /* ===========================
      Animations
  =========================== */

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 70 : -70, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -70 : 70, opacity: 0 }),
  };

  const inputClass = (field: string) =>
    `w-full rounded-2xl border bg-white p-4 text-gray-900 outline-none transition
     placeholder:text-gray-400
     focus:border-[#E96B8A]
     focus:ring-2
     focus:ring-[#E96B8A]
     ${errors[field] ? "border-red-400" : "border-gray-200"}`;

  const ErrorText = ({ field }: { field: string }) =>
    errors[field] ? (
      <p className="mt-1 text-sm text-red-500">{errors[field]}</p>
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
      className={`flex w-full items-center justify-between rounded-2xl border p-5 text-right transition
      ${
        selected
          ? "border-[#E96B8A] bg-[#FFF2F6] ring-2 ring-[#E96B8A]"
          : "border-gray-200 bg-white hover:border-pink-300"
      }`}
    >
      <div>
        <div className="font-bold text-gray-900">{label}</div>
        {hint && <div className="mt-1 text-sm text-gray-500">{hint}</div>}
      </div>

      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border
        ${selected ? "border-[#E96B8A] bg-[#E96B8A]" : "border-gray-300"}`}
      >
        {selected && <Check size={14} className="text-white" />}
      </div>
    </button>
  );

  const selectAndAdvance = (field: keyof FormData, value: string) => {
    handleSelect(field, value);
    window.setTimeout(() => {
      setDirection(1);
      setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }, 280);
  };

  /* ===========================
      Step content
  =========================== */

  const renderStep = () => {
    switch (currentKey) {
      case "current_status":
        return (
          <div className="space-y-6">
            <StepHeading
              title="أين تقف اليوم؟"
              subtitle="نريد معرفة نقطة البداية حتى لا نعطيك خطة لا تناسبك."
            />
            <div className="space-y-4">
              {STATUS_OPTIONS.map((item) => (
                <OptionCard
                  key={item.value}
                  selected={form.current_status === item.value}
                  label={item.label}
                  hint={item.hint}
                  onClick={() => selectAndAdvance("current_status", item.value)}
                />
              ))}
            </div>
            <ErrorText field="current_status" />
          </div>
        );

      case "goal":
        return (
          <div className="space-y-6">
            <StepHeading
              title="ما الذي تريد الوصول إليه؟"
              subtitle="اختر النتيجة التي تبحث عنها، وليس الوسيلة."
            />
            <div className="space-y-4">
              {GOAL_OPTIONS.map((item) => (
                <OptionCard
                  key={item.value}
                  selected={form.goal === item.value}
                  label={item.label}
                  hint={item.hint}
                  onClick={() => selectAndAdvance("goal", item.value)}
                />
              ))}
            </div>
            <ErrorText field="goal" />
          </div>
        );

      case "readiness":
        return (
          <div className="space-y-6">
            <StepHeading
              title="متى تريد أن تبدأ فعليًا؟"
              subtitle="هذا يساعدنا نحدد حجم الخطة المناسبة لك."
            />
            <div className="space-y-4">
              {READINESS_OPTIONS.map((item) => (
                <OptionCard
                  key={item.value}
                  selected={form.readiness === item.value}
                  label={item.label}
                  hint={item.hint}
                  onClick={() => selectAndAdvance("readiness", item.value)}
                />
              ))}
            </div>
            <ErrorText field="readiness" />
          </div>
        );

      case "age_range":
        return (
          <div className="space-y-6">
            <StepHeading title="ما فئتك العمرية؟" />
            <div className="grid grid-cols-2 gap-4">
              {AGE_OPTIONS.map((item) => (
                <OptionCard
                  key={item.value}
                  selected={form.age_range === item.value}
                  label={item.label}
                  onClick={() => selectAndAdvance("age_range", item.value)}
                />
              ))}
            </div>
            <ErrorText field="age_range" />
          </div>
        );

      case "interviews_count":
        return (
          <div className="space-y-6">
            <StepHeading title="كم مرة قدمت على وظائف؟" />
            <div className="space-y-3">
              {INTERVIEWS_OPTIONS.map((item) => (
                <OptionCard
                  key={item.value}
                  selected={form.interviews_count === item.value}
                  label={item.label}
                  onClick={() => selectAndAdvance("interviews_count", item.value)}
                />
              ))}
            </div>
            <ErrorText field="interviews_count" />
          </div>
        );

      case "skills":
        return (
          <div className="space-y-6">
            <StepHeading
              title="أخبرنا عن مهاراتك"
              subtitle="اكتب باختصار المهارات أو الخبرات التي تمتلكها حالياً."
            />
            <div>
              <textarea
                name="skills"
                rows={5}
                value={form.skills}
                onChange={handleChange}
                placeholder="مثال: تصميم جرافيك، تواصل مع العملاء، Excel..."
                className={inputClass("skills")}
              />
              <ErrorText field="skills" />
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 rounded-2xl bg-[#FFF1F5] px-4 py-3 text-sm font-bold text-[#E96B8A]">
              <Sparkles size={18} />
              نتيجتك جاهزة — أدخل بياناتك لتصلك الآن
            </div>

            <StepHeading
              title="آخر خطوة"
              subtitle="بناءً على إجاباتك حددنا المسار الأنسب لك من بين 3 مسارات مختلفة."
            />

            <div>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="الاسم الكامل"
                className={inputClass("full_name")}
              />
              <ErrorText field="full_name" />
            </div>

            <div>
              <input
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="رقم الواتساب"
                className={inputClass("whatsapp")}
              />
              <ErrorText field="whatsapp" />
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="البريد الإلكتروني"
                className={inputClass("email")}
              />
              <ErrorText field="email" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="الدولة"
                className={inputClass("country")}
              />
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="المدينة"
                className={inputClass("city")}
              />
            </div>
          </div>
        );
    }
  };

  const isSelectOnlyStep = currentKey !== "skills" && currentKey !== "contact";

  /* ===========================
      Render
  =========================== */

  return (
    <section
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#FFF8FB] via-white to-[#FFF4F8] px-6 py-16"
    >
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF1F5] px-5 py-2 text-sm font-bold text-[#E96B8A]">
            تقييم مجاني
          </div>
          <h1 className="mt-6 text-4xl font-black leading-tight text-gray-900">
            اكتشف الطريق المناسب لك
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            أجب عن عدة أسئلة بسيطة وسنحدد لك المسار الأنسب بناءً على وضعك
            الحالي وليس بالتخمين.
          </p>
        </div>

        <div className="mt-12">
          <div className="mb-3 flex justify-between text-sm font-semibold text-gray-500">
            <span>
              سؤال {step} من {TOTAL_STEPS}
            </span>
            <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-gray-200">
            <motion.div
              initial={false}
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.35 }}
              className="h-full rounded-full bg-[#E96B8A]"
            />
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[30px] bg-white p-8 shadow-[0_30px_80px_rgba(0,0,0,.08)]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentKey}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex gap-4">
          {step > 1 && (
            <button
              type="button"
              onClick={goBack}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#E96B8A] py-4 font-bold text-[#E96B8A] transition hover:bg-[#FFF2F6] disabled:opacity-50"
            >
              <ArrowLeft size={18} />
              السابق
            </button>
          )}

          {(!isSelectOnlyStep || !form[currentKey as keyof FormData]) && (
            <button
              type="button"
              onClick={goNext}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#E96B8A] py-4 font-bold text-white shadow-lg transition hover:bg-[#d85b7d] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  جاري التحليل...
                </>
              ) : step === TOTAL_STEPS ? (
                <>
                  اكتشف نتيجتك
                  <ArrowRight size={18} />
                </>
              ) : (
                <>
                  التالي
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          يستغرق أقل من 3 دقائق • وستحصل على توصية تناسب وضعك الحالي
        </p>
      </div>
    </section>
  );
}

/* ==============================================================
   Small presentational helper
============================================================== */

function StepHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900">{title}</h2>
      {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
    </div>
  );
}