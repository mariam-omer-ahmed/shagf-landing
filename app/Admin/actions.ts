import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function countDistinctSessions(
  event: string,
  metadataFilter?: { key: string; value: string | number }
): Promise<{ count: number; error: string | null; rawRows: number }> {
  let query = supabaseAdmin
    .from("events")
    .select("session_id")
    .eq("event", event);

  if (metadataFilter) {
    query = query.filter(
      `metadata->>${metadataFilter.key}`,
      "eq",
      String(metadataFilter.value)
    );
  }

  const { data, error } = await query;

  if (error) {
    return { count: 0, error: error.message, rawRows: 0 };
  }

  const rows = data ?? [];
  return {
    count: new Set(rows.map((r) => r.session_id)).size,
    error: null,
    rawRows: rows.length,
  };
}

async function countApplications(): Promise<{
  count: number;
  error: string | null;
}> {
  const { count, error } = await supabaseAdmin
    .from("applications")
    .select("*", { count: "exact", head: true });

  if (error) return { count: 0, error: error.message };
  return { count: count ?? 0, error: null };
}

/* ==============================================================
   DEBUG: returns everything needed to see what's actually
   happening — env var presence, raw row counts per event, and any
   Postgres/Supabase error text. Call this from the admin page and
   render it directly so nothing gets hidden in a server terminal.
============================================================== */

export async function getDebugInfo() {
  const envCheck = {
    url_present: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    service_key_present: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    service_key_length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length ?? 0,
  };

  // Total rows in events table, no filter at all — proves whether
  // ANY events are reaching the table and whether the client can
  // read them.
  const { data: allEvents, error: allEventsError, count: allEventsCount } =
    await supabaseAdmin
      .from("events")
      .select("event", { count: "exact" })
      .limit(20);

  // Distinct event names actually present, so we can see real names
  // vs the ones we're querying for (landing_view, assessment_start,
  // assessment_completed, package_view...).
  const distinctEventNames = allEvents
    ? Array.from(new Set(allEvents.map((e: any) => e.event)))
    : [];

  return {
    envCheck,
    totalEventsRowsSampled: allEvents?.length ?? 0,
    totalEventsCount: allEventsCount ?? null,
    allEventsError: allEventsError?.message ?? null,
    distinctEventNames,
  };
}

export async function getDashboardStats() {
  const [visitors, assessments, packageViews, applications] =
    await Promise.all([
      countDistinctSessions("landing_view"),
      countDistinctSessions("assessment_completed"),
      countDistinctSessions("package_view"),
      countApplications(),
    ]);

  return {
    visitors: visitors.count,
    assessments: assessments.count,
    packageViews: packageViews.count,
    applications: applications.count,
    _debug: { visitors, assessments, packageViews, applications },
  };
}

export async function getFunnelStats() {
  const [landing, started, reachedQ4, completed, packageViews, applyClicked] =
    await Promise.all([
      countDistinctSessions("landing_view"),
      countDistinctSessions("assessment_start"),
      countDistinctSessions("question_view", { key: "step", value: 4 }),
      countDistinctSessions("assessment_completed"),
      countDistinctSessions("package_view"),
      countDistinctSessions("apply_clicked"),
    ]);

  const submitted = await countApplications();

  return [
    { label: "Landing", value: landing.count },
    { label: "بدأوا التقييم", value: started.count },
    { label: "وصلوا السؤال الرابع", value: reachedQ4.count },
    { label: "أنهوا التقييم", value: completed.count },
    { label: "فتحوا الباقات", value: packageViews.count },
    { label: "ضغطوا تسجيل", value: applyClicked.count },
    { label: "أرسلوا الطلب", value: submitted.count },
  ];
}

export async function getRecentApplications(limit = 20) {
  const { data, error } = await supabaseAdmin
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentApplications failed:", error);
    return [];
  }

  return data ?? [];
}