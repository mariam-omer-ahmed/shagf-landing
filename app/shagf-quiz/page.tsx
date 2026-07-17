"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Check, Sparkles, ShieldCheck } from "lucide-react";

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
  goal: string;
  main_obstacle: string;
  current_status: string;
  start_timeframe: string;
  interviews_count: string;
  skills: string;
  budget_range: string;
  readiness: string;
  age_range: string;

  full_name: string;
  whatsapp: string;
  email: string;
  country: string;
  city: string;

  source: string;
  source_channel: string;
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
  "goal",
  "main_obstacle",
  "current_status",
  "start_timeframe",
  "interviews_count",
  "skills",
  "budget_range",
  "readiness",
  "age_range",
  "contact",
] as const;

type StepKey = (typeof STEPS)[number];

const TOTAL_STEPS = STEPS.length;

const initialForm: FormData = {
  goal: "",
  main_obstacle: "",
  current_status: "",
  start_timeframe: "",
  interviews_count: "",
  skills: "",
  budget_range: "",
  readiness: "",
  age_range: "",

  full_name: "",
  whatsapp: "",
  email: "",
  country: "",
  city: "",

  source: "landing_page",
  source_channel: "",
};

/* ==============================================================
   Options
============================================================== */
const GOAL_OPTIONS: Option[] = [
  {
    value: "job",
    label: "الحصول على وظيفة خلال الأشهر القادمة",
    hint: "أبحث عن فرصة عمل حقيقية في السوق",
  },
  {
    value: "income",
    label: "زيادة دخلي وتحسين وضعي المهني",
    hint: "أريد مهارة تفتح لي فرصاً أفضل",
  },
  {
    value: "career_change",
    label: "الانتقال إلى مسار مهني جديد",
    hint: "أريد بناء مستقبل مهني مختلف وأكثر استقراراً",
  },
];

const OBSTACLE_OPTIONS: Option[] = [
  {
    value: "start",
    label: "لا أعرف المسار المناسب لي",
  },
  {
    value: "confidence",
    label: "أخشى أن أبذل جهداً دون نتيجة",
  },
  {
    value: "time",
    label: "لا أملك خطة واضحة تناسب وقتي",
  },
  {
    value: "money",
    label: "أحتاج استثماراً مناسباً لميزانيتي",
  },
];

const STATUS_OPTIONS: Option[] = [
  {
    value: "student",
    label: "طالب",
    hint: "أستعد لدخول سوق العمل",
  },
  {
    value: "graduate",
    label: "خريج",
    hint: "أبحث عن أول فرصة مهنية حقيقية",
  },
  {
    value: "employee",
    label: "موظف",
    hint: "أرغب في تطوير مساري وزيادة دخلي",
  },
  {
    value: "lost",
    label: "لم أحدد مساري المهني بعد",
    hint: "أحتاج إلى رؤية أوضح للخطوة القادمة",
  },
];

const START_TIMEFRAME_OPTIONS: Option[] = [
  {
    value: "now",
    label: "أرغب بالبدء فوراً",
    hint: "مستعد لاتخاذ خطوة عملية الآن",
  },
  {
    value: "this_month",
    label: "خلال هذا الشهر",
  },
  {
    value: "soon",
    label: "خلال 1 إلى 3 أشهر",
  },
  {
    value: "unsure",
    label: "لم أحدد موعد البدء بعد",
  },
];

const INTERVIEWS_OPTIONS: Option[] = [
  {
    value: "0",
    label: "لم أتقدم لأي وظيفة حتى الآن",
  },
  {
    value: "1-3",
    label: "تقدمت إلى عدة وظائف ولم أحصل على فرصة",
  },
  {
    value: "4+",
    label: "تقدمت مرات كثيرة دون نتائج مرضية",
  },
];

const BUDGET_OPTIONS: Option[] = [
  {
    value: "under_50",
    label: "أقل من 50 دولاراً",
  },
  {
    value: "50_100",
    label: "50 – 100 دولار",
  },
  {
    value: "100_150",
    label: "150 – 200دولار",
  },
  {
    value: "200_plus",
    label: "أكثر من 200 دولار",
  },
];

const READINESS_OPTIONS: Option[] = [
  {
    value: "ready_now",
    label: "جاهز للبدء واتخاذ القرار",
    hint: "أبحث عن أفضل خطوة مناسبة لي الآن",
  },
  {
    value: "considering",
    label: "أدرس الخيارات المتاحة",
    hint: "أحتاج بعض المعلومات قبل اتخاذ القرار",
  },
  {
    value: "exploring",
    label: "أستكشف الفرص فقط",
    hint: "ما زلت في مرحلة البحث وجمع المعلومات",
  },
];

const AGE_OPTIONS: Option[] = [
  { value: "18-22", label: "18 - 22 سنة" },
  { value: "23-27", label: "23 - 27 سنة" },
  { value: "28-35", label: "28 - 35 سنة" },
  { value: "36+", label: "36 سنة فأكثر" },
];

/* ==============================================================
   Scoring weights
============================================================== */

const GOAL_WEIGHTS: Record<string, number> = { job: 3, income: 4, career_change: 5 };
const STATUS_WEIGHTS: Record<string, number> = { lost: 1, student: 2, graduate: 4, employee: 5 };
const READINESS_WEIGHTS: Record<string, number> = { exploring: 1, considering: 3, ready_now: 6 };
const INTERVIEWS_WEIGHTS: Record<string, number> = { "0": 1, "1-3": 3, "4+": 5 };
const OBSTACLE_WEIGHTS: Record<string, number> = { start: 1, confidence: 2, money: 2, time: 3 };
const START_TIMEFRAME_WEIGHTS: Record<string, number> = { unsure: 1, soon: 2, this_month: 4, now: 6 };
const BUDGET_WEIGHTS: Record<string, number> = { under_20: 1, "50_100": 2, "150_200": 4, "200_plus": 6 };

const LEAD_SCORE_MAX =
  Math.max(...Object.values(GOAL_WEIGHTS)) +
  Math.max(...Object.values(STATUS_WEIGHTS)) +
  Math.max(...Object.values(READINESS_WEIGHTS)) +
  Math.max(...Object.values(INTERVIEWS_WEIGHTS)) +
  Math.max(...Object.values(OBSTACLE_WEIGHTS)) +
  Math.max(...Object.values(START_TIMEFRAME_WEIGHTS)) +
  Math.max(...Object.values(BUDGET_WEIGHTS)) +
  6; // أقصى بونص من طول المهارات

const URGENCY_SCORE_MAX =
  Math.max(...Object.values(READINESS_WEIGHTS)) +
  Math.max(...Object.values(START_TIMEFRAME_WEIGHTS)) +
  Math.max(...Object.values(BUDGET_WEIGHTS));

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
      Scoring Engine (v3)
  =========================== */

  const getSkillsBonus = (): number => {
    const length = form.skills.trim().length;
    let bonus = 0;
    if (length > 20) bonus += 2;
    if (length > 60) bonus += 2;
    if (length > 120) bonus += 2;
    return bonus;
  };

  const calculateLeadScore = (): number => {
    const raw =
      (GOAL_WEIGHTS[form.goal] ?? 0) +
      (STATUS_WEIGHTS[form.current_status] ?? 0) +
      (READINESS_WEIGHTS[form.readiness] ?? 0) +
      (INTERVIEWS_WEIGHTS[form.interviews_count] ?? 0) +
      (OBSTACLE_WEIGHTS[form.main_obstacle] ?? 0) +
      (START_TIMEFRAME_WEIGHTS[form.start_timeframe] ?? 0) +
      (BUDGET_WEIGHTS[form.budget_range] ?? 0) +
      getSkillsBonus();

    return Math.round((raw / LEAD_SCORE_MAX) * 100);
  };

  const calculateUrgencyScore = (): number => {
    const raw =
      (READINESS_WEIGHTS[form.readiness] ?? 0) +
      (START_TIMEFRAME_WEIGHTS[form.start_timeframe] ?? 0) +
      (BUDGET_WEIGHTS[form.budget_range] ?? 0);

    return Math.round((raw / URGENCY_SCORE_MAX) * 100);
  };

  const calculatePackage = (leadScore: number, urgencyScore: number): string => {
    let tier: string;

    if (leadScore <= 40) tier = "bousola";
    else if (leadScore <= 70) tier = "intilaqah";
    else tier = "tamkeen";

    // إلحاح عالٍ (جاهز للدفع والبدء فوراً) يرفع الباقة درجة لو كانت النتيجة حدّية
    if (urgencyScore >= 80) {
      if (tier === "bousola") tier = "intilaqah";
      else if (tier === "intilaqah" && leadScore >= 60) tier = "tamkeen";
    }

    return tier;
  };

  const getTopProblems = (): string[] => {
  const insights: { condition: boolean; label: string; priority: number }[] = [
    {
      condition: form.main_obstacle === "start",
      label: "تحتاج إلى خارطة طريق واضحة تحدد الخطوات الصحيحة للانطلاق.",
      priority: 5,
    },
    {
      condition: form.current_status === "lost",
      label: "تحتاج إلى تحديد المسار المهني الأنسب لقدراتك وأهدافك.",
      priority: 5,
    },
    {
      condition: form.readiness === "exploring",
      label: "ما زلت في مرحلة الاستكشاف وتحتاج إلى رؤية أوضح قبل اتخاذ القرار.",
      priority: 4,
    },
    {
      condition: form.interviews_count === "0",
      label: "لم تبدأ بعد في التقدم للفرص المهنية المناسبة.",
      priority: 4,
    },
    {
      condition: form.main_obstacle === "confidence",
      label: "تحتاج إلى خطة عملية تمنحك وضوحاً وثقة أكبر في النتائج.",
      priority: 4,
    },
    {
      condition: form.skills.trim().length < 20,
      label: "هناك فرصة لتعزيز مهاراتك بما يزيد من فرصك في سوق العمل.",
      priority: 3,
    },
    {
      condition: form.start_timeframe === "unsure",
      label: "تحديد موعد واضح للبدء سيسرّع وصولك إلى النتيجة المطلوبة.",
      priority: 3,
    },
    {
      condition: form.main_obstacle === "time",
      label: "تحتاج إلى مسار مرن يتناسب مع وقتك الحالي.",
      priority: 2,
    },
    {
      condition: form.main_obstacle === "money",
      label: "تحتاج إلى خيار تدريبي يحقق أفضل عائد مقابل الاستثمار.",
      priority: 2,
    },
    {
      condition: form.budget_range === "under_150",
      label: "يمكن البدء بخطوات عملية تناسب ميزانيتك الحالية.",
      priority: 2,
    },
  ];

  const matched = insights
    .filter((item) => item.condition)
    .sort((a, b) => b.priority - a.priority)
    .map((item) => item.label);

  const fallback =
    "وجود خطة واضحة ومتابعة عملية سيزيد من سرعة تحقيق أهدافك المهنية.";

  while (matched.length < 3) {
    if (!matched.includes(fallback)) {
      matched.push(fallback);
    } else {
      break;
    }
  }

  return matched.slice(0, 3);
};
  /* ===========================
      Validation
  =========================== */

  const validateStep = (): boolean => {
    const nextErrors: Record<string, string> = {};

    switch (currentKey) {
      case "goal":
        if (!form.goal) nextErrors.goal = "يرجى اختيار الإجابة الأقرب إلى وضعك الحالي";
        break;

      case "main_obstacle":
        if (!form.main_obstacle) nextErrors.main_obstacle = "يرجى اختيار الإجابة الأقرب إلى وضعك الحالي";
        break;

      case "current_status":
        if (!form.current_status) nextErrors.current_status = "يرجى اختيار الإجابة الأقرب إلى وضعك الحالي";
        break;

      case "start_timeframe":
        if (!form.start_timeframe) nextErrors.start_timeframe = "يرجى اختيار الإجابة الأقرب إلى وضعك الحالي";
        break;

      case "interviews_count":
        if (!form.interviews_count) nextErrors.interviews_count = "يرجى اختيار الإجابة الأقرب إلى وضعك الحالي";
        break;

      case "skills":
        if (!form.skills.trim()) nextErrors.skills = "يرجى كتابة مهاراتك أو خبراتك";
        break;

      case "budget_range":
        if (!form.budget_range) nextErrors.budget_range = "يرجى اختيار الإجابة الأقرب إلى وضعك الحالي";
        break;

      case "readiness":
        if (!form.readiness) nextErrors.readiness = "يرجى اختيار الإجابة الأقرب إلى وضعك الحالي";
        break;

      case "age_range":
        if (!form.age_range) nextErrors.age_range = "يرجى اختيار الإجابة الأقرب إلى وضعك الحالي";
        break;

      case "contact":
        if (!form.full_name.trim()) nextErrors.full_name = "يرجى إدخال الاسم الكامل";

        if (!form.whatsapp.trim()) {
          nextErrors.whatsapp = "يرجى إدخال رقم الواتساب للتواصل";
        } else if (!/^\+?\d{8,15}$/.test(form.whatsapp.replace(/\s/g, ""))) {
          nextErrors.whatsapp = "يرجى إدخال رقم واتساب صحيح";
        }

        if (!form.email.trim()) {
          nextErrors.email = "يرجى إدخال البريد الإلكتروني";
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
          nextErrors.email = "يرجى إدخال بريد إلكتروني صحيح";
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
  =========================== */

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);

    const leadScore = calculateLeadScore();
    const urgencyScore = calculateUrgencyScore();
    const selected_package = calculatePackage(leadScore, urgencyScore);
    const topProblems = getTopProblems();

    const payload = {
      ...form,
      selected_package,
      lead_score: leadScore,
      urgency_score: urgencyScore,
      lead_stage: "assessment_completed",
      last_activity_at: new Date().toISOString(),
      session_id: getSessionId(),
    };

    try {
      const { error } = await supabase.from("shaghaf_leads").insert(payload);

      if (error) throw error;

      completedRef.current = true;
      trackAssessmentCompleted(selected_package, {
        lead_score: leadScore,
        urgency_score: urgencyScore,
        selected_package,
        main_obstacle: form.main_obstacle,
        goal: form.goal,
      });

      localStorage.setItem("selected_package", selected_package);
      localStorage.setItem(
        "shaghaf_diagnosis",
        JSON.stringify({
          readiness_percent: leadScore,
          urgency_score: urgencyScore,
          top_problems: topProblems,
          recommendation: selected_package,
        })
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // FIX: قبل ما نوجّه لصفحة "إنشاء حساب"، لازم نتأكد إن الإيميل
        // ده معندوش حساب من قبل. لو عنده حساب (سجّلت قبل كده وخرجت،
        // أو بتستخدم جهاز/متصفح تاني)، لازم تروح تسجيل دخول مباشرة
        // بدل ما تتوجه لتسجيل حساب هيفشل أصلًا بسبب تكرار الإيميل.
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", form.email)
          .maybeSingle();

        const destination = existingProfile ? "/login" : "/register";

        router.push(
          `${destination}?package=${selected_package}&email=${encodeURIComponent(
            form.email
          )}&name=${encodeURIComponent(form.full_name)}&score=${leadScore}&urgency=${urgencyScore}`
        );
        return;
      }

      router.push(
        `/thank-you?package=${selected_package}&score=${leadScore}&urgency=${urgencyScore}`
      );
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
      case "goal":
        return (
          <div className="space-y-6">
            <StepHeading
              title="ما الذي تريد الوصول إليه؟"
              subtitle="اختر النتيجة التي تسعى إليها، لا الوسيلة."
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

      case "main_obstacle":
        return (
          <div className="space-y-6">
            <StepHeading title="ما أكبر عائق يقف في طريقك؟" />
            <div className="space-y-3">
              {OBSTACLE_OPTIONS.map((item) => (
                <OptionCard
                  key={item.value}
                  selected={form.main_obstacle === item.value}
                  label={item.label}
                  onClick={() => selectAndAdvance("main_obstacle", item.value)}
                />
              ))}
            </div>
            <ErrorText field="main_obstacle" />
          </div>
        );

      case "current_status":
        return (
          <div className="space-y-6">
            <StepHeading
              title="أين تقف اليوم؟"
              subtitle="نريد معرفة نقطة البداية حتى لا نقترح عليك خطة لا تناسبك."
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

      case "start_timeframe":
        return (
          <div className="space-y-6">
            <StepHeading title="متى تودّ أن تبدأ فعلياً؟" />
            <div className="space-y-3">
              {START_TIMEFRAME_OPTIONS.map((item) => (
                <OptionCard
                  key={item.value}
                  selected={form.start_timeframe === item.value}
                  label={item.label}
                  hint={item.hint}
                  onClick={() => selectAndAdvance("start_timeframe", item.value)}
                />
              ))}
            </div>
            <ErrorText field="start_timeframe" />
          </div>
        );

      case "interviews_count":
        return (
          <div className="space-y-6">
            <StepHeading title="كم مرة تقدمت لوظائف حتى الآن؟" />
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

      case "budget_range":
        return (
          <div className="space-y-6">
            <StepHeading
              title="ما الميزانية التي تضعها في اعتبارك للتعلم؟"
              subtitle="هذا يساعدنا على اقتراح مسار يناسب إمكاناتك فعلياً."
            />
            <div className="space-y-3">
              {BUDGET_OPTIONS.map((item) => (
                <OptionCard
                  key={item.value}
                  selected={form.budget_range === item.value}
                  label={item.label}
                  onClick={() => selectAndAdvance("budget_range", item.value)}
                />
              ))}
            </div>
            <ErrorText field="budget_range" />
          </div>
        );

      case "readiness":
        return (
          <div className="space-y-6">
            <StepHeading
              title="إذا حصلت على النتيجة، هل أنت جاهز للبدء؟"
              subtitle="هذا يساعدنا على تحديد حجم الخطة المناسبة لك."
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

      case "contact":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 rounded-2xl bg-[#FFF1F5] px-4 py-3 text-sm font-bold text-[#E96B8A]">
              <Sparkles size={18} />
              نتيجتك جاهزة — أدخل بياناتك لتصلك الآن
            </div>

            <StepHeading
              title="الخطوة الأخيرة"
              subtitle="بناءً على إجاباتك، حددنا المسار الأنسب لك من بين ثلاثة مسارات مختلفة."
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

            {/* CRO: طمأنة الخصوصية مباشرة قبل زر الإرسال — بتقلل التردد
                عند نقطة الاحتكاك الأخيرة، وهي أكثر لحظة يتسرب فيها الزوار */}
            <div className="flex items-start gap-2 rounded-xl bg-gray-50 px-4 py-3 text-xs leading-6 text-gray-500">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#E96B8A]" />
              بياناتك مخصصة فقط لإرسال نتيجتك ومتابعة مسارك، ولن تُشارك مع أي
              جهة خارجية.
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
            تقييم مجاني • دقيقتان فقط
          </div>
          <h1 className="mt-6 text-4xl font-black leading-tight text-gray-900">
            اكتشف الطريق المناسب لأول دخل حقيقي لك
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            أجب عن بضعة أسئلة دقيقة، وسنحدد لك المسار الأنسب لتحقيق هدفك
            بناءً على وضعك الفعلي، لا على التخمين.
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
                  جارٍ التحليل...
                </>
              ) : step === TOTAL_STEPS ? (
                <>
                  احصل على نتيجتك الآن
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
          يستغرق أقل من 3 دقائق • توصية دقيقة مبنية على إجاباتك، لا تخمين عشوائي
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
      {subtitle && <p className="mt-2 text-gray-900">{subtitle}</p>}
    </div>
  );
}