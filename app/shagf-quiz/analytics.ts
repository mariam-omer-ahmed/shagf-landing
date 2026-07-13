import { getSessionId } from "@/lib/analytics";

type EventPayload = Record<
  string,
  string | number | boolean | undefined
>;

function pushEvent(event: string, payload: EventPayload) {
  if (typeof window === "undefined") return;

  (window as any).dataLayer = (window as any).dataLayer || [];

  (window as any).dataLayer.push({
    event,
    ...payload,
    timestamp: Date.now(),
  });
}

/* ===========================================
   Quiz Started
=========================================== */

export function trackAssessmentStart() {
  pushEvent("quiz_start", {
    session_id: getSessionId(),
  });
}

/* ===========================================
   Question Viewed
=========================================== */

export function trackQuestion(
  step: number,
  stepKey?: string,
  msSinceLastStep?: number
) {
  pushEvent("quiz_question_view", {
    session_id: getSessionId(),
    step,
    step_key: stepKey,
    ms_since_last_step: msSinceLastStep,
  });
}

/* ===========================================
   Answer Selected
=========================================== */

export function trackAnswer(
  field: string,
  value: string
) {
  pushEvent("quiz_answer", {
    session_id: getSessionId(),
    field,
    value,
  });
}

/* ===========================================
   User Left Before Completing
=========================================== */

export function trackDropOff(
  step: number,
  totalSteps: number
) {
  pushEvent("quiz_drop_off", {
    session_id: getSessionId(),
    step,
    total_steps: totalSteps,
    percent_complete: Math.round((step / totalSteps) * 100),
  });
}

/* ===========================================
   Quiz Completed
=========================================== */

export function trackAssessmentCompleted(
  selectedPackage: string
) {
  pushEvent("quiz_completed", {
    session_id: getSessionId(),
    package: selectedPackage,
  });
}