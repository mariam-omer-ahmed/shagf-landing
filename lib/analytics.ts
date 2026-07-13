import { supabase } from "./supabaseClient";

const SESSION_KEY = "shaghaf_session_id";

export function getSessionId() {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId =
      crypto.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

type TrackEventPayload = {
  event: string;
  page?: string;
  package_id?: string;
  metadata?: Record<string, any>;
};

export async function trackEvent({
  event,
  page,
  package_id,
  metadata = {},
}: TrackEventPayload) {
  try {
    await supabase.from("events").insert({
      session_id: getSessionId(),

      event,

      page: page ?? window.location.pathname,

      path: window.location.pathname,

      referrer: document.referrer || null,

      browser: navigator.userAgent,

      package_id: package_id ?? null,

      metadata,
    });
  } catch (err) {
    console.error("Analytics Error:", err);
  }
}