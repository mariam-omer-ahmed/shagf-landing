import {
  getDashboardStats,
  getFunnelStats,
  getRecentApplications,
  getDebugInfo,
} from "./actions";

export default async function AdminPage() {
  const [stats, funnel, applications, debug] = await Promise.all([
    getDashboardStats(),
    getFunnelStats(),
    getRecentApplications(),
    getDebugInfo(),
  ]);

  return (
    <main className="min-h-screen bg-gray-50 p-10 text-gray-900" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-black text-gray-900">
          لوحة تحكم شغف
        </h1>

        {/* DEBUG PANEL — احذف هذا القسم بعد ما نتأكد إن الأرقام صحيحة */}
        <div className="mb-10 rounded-3xl border-2 border-yellow-400 bg-yellow-50 p-6 text-sm text-gray-900">
          <h2 className="mb-4 text-lg font-black text-yellow-800">
            🔧 لوحة تشخيص مؤقتة
          </h2>

          <div className="mb-3">
            <strong>متغيرات البيئة:</strong>{" "}
            URL موجود: {debug.envCheck.url_present ? "✅" : "❌"} |
            {" "}SERVICE_ROLE_KEY موجود: {debug.envCheck.service_key_present ? "✅" : "❌"}
            {" "}(طول القيمة: {debug.envCheck.service_key_length})
          </div>

          <div className="mb-3">
            <strong>إجمالي عدد صفوف جدول events:</strong>{" "}
            {debug.totalEventsCount ?? "غير معروف"}
          </div>

          {debug.allEventsError && (
            <div className="mb-3 font-bold text-red-600">
              خطأ في قراءة events: {debug.allEventsError}
            </div>
          )}

          <div className="mb-3">
            <strong>أسماء الأحداث الموجودة فعليًا (من أول 20 صف):</strong>{" "}
            {debug.distinctEventNames.length > 0
              ? debug.distinctEventNames.join(", ")
              : "لا يوجد — الجدول فاضي أو ما وصلته أي أحداث"}
          </div>

          <div className="mt-4 border-t border-yellow-300 pt-4">
            <strong>تفاصيل كل عداد في الإحصائيات:</strong>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-white p-3 text-xs" dir="ltr">
              {JSON.stringify(stats._debug, null, 2)}
            </pre>
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="mb-10 grid gap-6 md:grid-cols-4">
          <Card title="زوار الموقع" value={stats.visitors} />
          <Card title="أكملوا التقييم" value={stats.assessments} />
          <Card title="فتحوا الباقات" value={stats.packageViews} />
          <Card title="طلبات التسجيل" value={stats.applications} />
        </div>

        {/* الـ Funnel */}
        <div className="mb-10 overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-black text-gray-900">
            رحلة الزائر (Funnel)
          </h2>

          <FunnelChart stages={funnel} />
        </div>

        {/* آخر الطلبات */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-right">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 font-bold text-gray-900">الاسم</th>
                <th className="p-4 font-bold text-gray-900">الهاتف</th>
                <th className="p-4 font-bold text-gray-900">الدولة</th>
                <th className="p-4 font-bold text-gray-900">الباقة</th>
                <th className="p-4 font-bold text-gray-900">التاريخ</th>
              </tr>
            </thead>

            <tbody>
              {applications.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-400">
                    لا توجد طلبات بعد
                  </td>
                </tr>
              )}

              {applications.map((item: any) => (
                <tr key={item.id} className="border-t border-gray-200">
                  <td className="p-4 text-gray-900">{item.name}</td>
                  <td className="p-4 text-gray-900">{item.phone}</td>
                  <td className="p-4 text-gray-900">{item.country}</td>
                  <td className="p-4 text-gray-900">{item.package_title}</td>
                  <td className="p-4 text-gray-900">
                    {new Date(item.created_at).toLocaleDateString("ar")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="text-sm text-gray-600">{title}</div>

      <div className="mt-3 text-4xl font-black text-[#E96B8A]">{value}</div>
    </div>
  );
}

function FunnelChart({
  stages,
}: {
  stages: { label: string; value: number }[];
}) {
  const max = Math.max(...stages.map((s) => s.value), 1);

  return (
    <div className="space-y-4">
      {stages.map((stage, i) => {
        const prev = i > 0 ? stages[i - 1].value : null;
        const dropPct =
          prev && prev > 0
            ? Math.round(((prev - stage.value) / prev) * 100)
            : null;

        const widthPct = Math.max((stage.value / max) * 100, 4);

        return (
          <div key={stage.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-bold text-gray-900">{stage.label}</span>
              <span className="text-gray-700">
                {stage.value}
                {dropPct !== null && dropPct > 0 && (
                  <span className="mr-2 font-bold text-red-500">
                    ↓ {dropPct}%
                  </span>
                )}
              </span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-[#E96B8A]"
                style={{ width: `${widthPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}