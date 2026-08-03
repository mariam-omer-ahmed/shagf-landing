import { supabase } from "@/lib/supabase";

export interface PackageContent {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  tagline: string | null;
  for_who: string | null;
  outcomes: string[] | null;
  result: string | null;
  price: number | null;
  currency: string;
  color: string | null;
  icon: string | null;
  thumbnail: string | null;
  is_active: boolean;
}

/**
 * كل الباقات النشطة بكل محتواها التسويقي، مرتبة بالسعر تصاعديًا.
 * ده المصدر الوحيد للحقيقة لأي مكان بيعرض تفاصيل باقة في الموقع —
 * صفحة المقارنة، صفحة المسار التدريبي، أي مكان تاني.
 */
export async function getPackagesContent(): Promise<PackageContent[]> {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true });

  if (error) {
    console.error("getPackagesContent error:", error.message);
    throw error;
  }

  return data || [];
}

export function formatPrice(price: number | null, currency: string) {
  if (price == null) return "";
  const symbol = currency === "USD" ? "$" : currency;
  return `${price} ${symbol}`;
}