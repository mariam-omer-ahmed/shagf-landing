"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getPackagesContent,
  formatPrice,
  type PackageContent,
} from "@/lib/queries/packages";

type Props = {
  packageName?: string;
};

export default function PackagesComparison({ packageName }: Props) {
  const router = useRouter();

  const [packages, setPackages] = useState<PackageContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  async function loadPackages() {
    try {
      const data = await getPackagesContent();
      setPackages(data);
    } catch (error) {
      console.error("Load packages error:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSelect = (slug: string) => {
    router.push(`/apply?package=${slug}`);
  };

  return (
    <section id="packages" className="mt-28 scroll-mt-20">
      <h2 className="text-center text-4xl font-bold text-[#3A2530]">
        اختر الباقة المناسبة لوضعك الآن
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-center leading-8 text-[#6B5F66]">
        الفرق بين من يصل ومن يبقى مكانه غالبًا ليس الموهبة، بل اختيار
        الخطوة الصحيحة في الوقت الصحيح. اختر وضعك الحقيقي الآن، لا طموحك
        فقط.
      </p>

      {loading && (
        <p className="mt-12 text-center font-bold text-[#6B5F66]">
          جارٍ تحميل الباقات...
        </p>
      )}

      {!loading && (
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {packages.map((pkg) => {
            const recommended = pkg.slug === packageName;

            return (
              <div
                key={pkg.id}
                className={`flex flex-col rounded-[30px] border bg-white p-8 transition ${
                  recommended
                    ? "scale-[1.03] border-[#E96B8A] shadow-[0_25px_70px_rgba(233,107,138,.25)]"
                    : "border-pink-100"
                }`}
              >
                {recommended && (
                  <div className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#E96B8A] px-4 py-2 text-sm font-bold text-white">
                    <Zap size={14} />
                    الأنسب لنتيجة تقييمك
                  </div>
                )}

                {/* TITLE */}
                <h3 className="text-2xl font-bold text-[#3A2530]">
                  {pkg.title}
                </h3>

                {/* PRICE */}
                <div className="mt-2 text-4xl font-bold text-[#3A2530]">
                  {formatPrice(pkg.price, pkg.currency)}
                </div>

                {pkg.tagline && (
                  <p className="mt-2 text-sm font-bold text-[#E96B8A]">
                    {pkg.tagline}
                  </p>
                )}

                {/* WHO IT'S FOR */}
                {pkg.for_who && (
                  <p className="mt-5 font-bold leading-8 text-[#3A2530]">
                    {pkg.for_who}
                  </p>
                )}

                {/* DESCRIPTION */}
                {pkg.description && (
                  <p className="mt-3 leading-8 text-[#6B5F66]">
                    {pkg.description}
                  </p>
                )}

                {/* OUTCOMES */}
                {pkg.outcomes && pkg.outcomes.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {pkg.outcomes.map((item) => (
                      <div key={item} className="flex gap-2">
                        <CheckCircle2
                          size={18}
                          className="mt-1 shrink-0 text-[#E96B8A]"
                        />
                        <span className="leading-7 text-[#3A2530]">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* RESULT */}
                {pkg.result && (
                  <div className="mt-6 border-t border-pink-100 pt-5 font-bold text-[#3A2530]">
                    النتيجة: {pkg.result}
                  </div>
                )}

                {/* BUTTON */}
                <button
                  onClick={() => handleSelect(pkg.slug)}
                  className={`mt-8 w-full rounded-full py-4 font-bold transition ${
                    recommended
                      ? "bg-[#E96B8A] text-white hover:bg-[#d95d7d]"
                      : "border border-[#3A2530] text-[#3A2530] hover:bg-[#FFF3F7]"
                  }`}
                >
                  {recommended
                    ? "ابدأ الآن بهذه الباقة (الأنسب لك)"
                    : "اختر هذه الباقة ← متابعة الطلب"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}