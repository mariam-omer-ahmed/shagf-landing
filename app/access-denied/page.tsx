export const metadata = {
  title: "غير مصرح | شغف",
  description: "ليس لديك صلاحية للوصول",
};

import PageIllustration from "@/components/page-illustration";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <>
      <PageIllustration />

      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">

          <div className="py-24">

            <div className="mx-auto max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl">

              <ShieldAlert
                size={70}
                className="mx-auto text-red-500"
              />

              <h1 className="mt-6 text-4xl font-black">
                ليس لديك صلاحية
              </h1>

              <p className="mt-4 text-gray-600 leading-8">
                لا يمكنك الوصول إلى هذه الصفحة بالحساب الحالي.
              </p>

              <Link
                href="/login"
                className="mt-8 inline-flex rounded-2xl bg-[#E96B8A] px-8 py-4 font-bold text-white transition hover:bg-[#d85b7d]"
              >
                تسجيل الدخول
              </Link>

            </div>

          </div>

        </div>
      </section>
    </>
  );
}