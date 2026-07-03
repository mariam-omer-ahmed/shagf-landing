export const metadata = {
  title: "استعادة كلمة المرور - شغف",
  description: "استعادة كلمة المرور لحسابك في نظام شغف",
};

import Link from "next/link";

export default function ResetPassword() {
  return (
    <section className="bg-[#FFF8FB]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">

          {/* Section header */}
          <div className="pb-12 text-center">
            <h1 className="bg-gradient-to-r from-gray-900 via-[#E96B8A] to-gray-900 bg-[length:200%_auto] bg-clip-text text-3xl font-semibold text-transparent md:text-4xl">
              استعادة كلمة المرور
            </h1>

            <p className="mt-3 text-gray-600">
              أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
            </p>
          </div>

          {/* Contact form */}
          <form className="mx-auto max-w-[400px]">

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                البريد الإلكتروني
              </label>

              <input
                id="email"
                type="email"
                className="w-full rounded-xl border border-pink-100 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-[#E96B8A] focus:ring-2 focus:ring-pink-100"
                placeholder="example@email.com"
              />
            </div>

            <div className="mt-6">
              <button className="w-full rounded-xl bg-[#E96B8A] px-4 py-3 font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:bg-[#e35f7f]">
                إعادة تعيين كلمة المرور
              </button>
            </div>

            {/* Back link */}
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-[#E96B8A] hover:underline"
              >
                العودة لتسجيل الدخول
              </Link>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
}