export function calculateLeadScore(lead: any) {

  let score = 0;

  // اختار باقة
  if (lead.selected_package) {
    score += 15;
  }

  // لديه هدف واضح
  if (lead.goal) {
    score += 10;
  }

  // أكمل الجاهزية
  if (lead.readiness) {
    score += 15;
  }

  // نشاط حديث (خلال آخر 3 أيام تحديدًا، مو أي نشاط قديم)
  if (lead.last_activity_at) {
    const daysSinceActivity =
      (Date.now() - new Date(lead.last_activity_at).getTime()) /
      (1000 * 60 * 60 * 24);

    score += daysSinceActivity <= 3 ? 15 : 5;
  }

  // درجة الإلحاح اللي طلعت من التقييم نفسه (0-100) — أهم إشارة تسويقية
  if (typeof lead.urgency_score === "number") {
    score += (lead.urgency_score / 100) * 25;
  }

  // الميزانية المتاحة — كل ما زادت كل ما زادت جاهزية الدفع الفعلية
  const budgetScores: Record<string, number> = {
    "0_50": 3,
    "50_100": 6,
    "100_300": 9,
    "300+": 10,
  };
  score += budgetScores[lead.budget_range] || 0;

  // متى ينوي يبدأ — "الآن" أهم إشارة على استعداده يدفع اليوم
  const timeframeScores: Record<string, number> = {
    now: 15,
    this_month: 10,
    exploring: 3,
  };
  score += timeframeScores[lead.start_timeframe] || 0;

  // حدد عائقه الرئيسي = واعي بمشكلته ويبحث عن حل
  if (lead.main_obstacle) {
    score += 5;
  }

  return Math.round(Math.min(score, 100));
}

export function getLeadTemperature(score: number) {
  if (score >= 70) {
    return { label: "ساخن 🔥", color: "#DC2626", bg: "#FEE2E2" };
  }

  if (score >= 40) {
    return { label: "دافئ", color: "#D97706", bg: "#FEF3C7" };
  }

  return { label: "بارد", color: "#6B7280", bg: "#F3F4F6" };
}