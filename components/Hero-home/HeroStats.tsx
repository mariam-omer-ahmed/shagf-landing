const stats = [
  { value: "2,500+", label: "طالب وطالبة" },
  { value: "94%", label: "نسبة رضا المتدربين" },
  { value: "120+", label: "شركة وظفت خريجينا" },
];

export default function HeroStats() {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-3">
      {stats.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm"
        >
          <h3 className="text-3xl font-black text-[#E96B8A]">
            {item.value}
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}