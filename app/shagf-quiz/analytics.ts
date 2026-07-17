/**
 * Analytics wrapper for the Shaghaf Quiz.
 *
 * Routes every quiz event through the site-wide `trackEvent()` from
 * lib/analytics.ts, which writes to the shared Supabase `events` table
 * (the same one used across the funnel: Hero -> Quiz -> Result ->
 * Packages -> Application). Event names match the funnel plan exactly
 * so the admin dashboard can query them directly:
 *
 *   assessment_start      - quiz opened
 *   question_answer       - fired once per answered question
 *   assessment_completed  - last step submitted successfully
 *
 * `getSessionId()` persists in localStorage (see lib/analytics.ts), so
 * the same session_id follows the visitor from the landing page through
 * to application_submitted — that's what makes the funnel possible.
 */

import { trackEvent, getSessionId } from "@/lib/analytics";

const PAGE = "/shagf-quiz";

export function trackAssessmentStart() {
  trackEvent({
    event: "assessment_start",
    page: PAGE,
  });
}

/**
 * Fired when a question screen is shown. Kept separate from
 * `question_answer` (the funnel plan tracks answers, not views) but
 * useful for time-on-step and drop-off analysis, so it's sent as
 * metadata on the same event type rather than a new event name — keeps
 * the events table aligned with the agreed taxonomy.
 */
export function trackQuestion(
  step: number,
  stepKey?: string,
  msSinceLastStep?: number
) {
  trackEvent({
    event: "question_view",
    page: PAGE,
    metadata: {
      step,
      step_key: stepKey,
      ms_since_last_step: msSinceLastStep,
    },
  });
}

export function trackAnswer(field: string, value: string) {
  trackEvent({
    event: "question_answer",
    page: PAGE,
    metadata: { field, value },
  });
}

export function trackDropOff(step: number, totalSteps: number) {
  trackEvent({
    event: "assessment_drop_off",
    page: PAGE,
    metadata: {
      step,
      total_steps: totalSteps,
      percent_complete: Math.round((step / totalSteps) * 100),
    },
  });
}

/**
 * `metadata` is new and optional — existing calls like
 * `trackAssessmentCompleted(selectedPackage)` keep working exactly as
 * before. When the quiz has richer scoring data (lead_score,
 * urgency_score, main_obstacle, goal, ...) it can now be passed through
 * without introducing a new event name or breaking the funnel taxonomy.
 */
export function trackAssessmentCompleted(
  selectedPackage: string,
  metadata?: Record<string, unknown>
) {
  trackEvent({
    event: "assessment_completed",
    page: PAGE,
    package_id: selectedPackage,
    metadata,
  });
}

export { getSessionId };