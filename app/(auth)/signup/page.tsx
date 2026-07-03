export const metadata = {
  title: "إنشاء حساب - شغف",
  description: "إنشاء حساب في نظام شغف",
};

import Link from "next/link";

export default function SignUp() {
  return (
    <section className="bg-[#FFF8FB]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">

          {/* Header */}
          <div className="pb-12 text-center">
            <h1 className="bg-gradient-to-r from-gray-900 via-[#E96B8A] to-gray-900 bg-[length:200%_auto] bg-clip-text text-3xl font-semibold text-transparent md:text-4xl">
              إنشاء حساب جديد
            </h1>

            <p className="mt-3 text-gray-600">
              ابدأ رحلتك داخل نظام شغف بخطوة واحدة فقط
            </p>
          </div>

          {/* Form */}
          <form className="mx-auto max-w-[400px]">

            <div className="space-y-5">

              {/* Name */}
              <div>
                <label
                  className="mb-1 block text-sm font-medium text-gray-700"
                  htmlFor="name"
                >
                  الاسم الكامل <span className="text-[#E96B8A]">*</span>
                </label>

                <input
                  id="name"
                  type="text"
                  className="w-full rounded-xl border border-pink-100 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-[#E96B8A] focus:ring-2 focus:ring-pink-100"
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>

              {/* Company */}
              <div>
                <label
                  className="mb-1 block text-sm font-medium text-gray-700"
                  htmlFor="company"
                >
                  اسم الجهة / الشركة <span className="text-[#E96B8A]">*</span>
                </label>

                <input
                  id="company"
                  type="text"
                  className="w-full rounded-xl border border-pink-100 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-[#E96B8A] focus:ring-2 focus:ring-pink-100"
                  placeholder="اسم شركتك أو مشروعك"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label
                  className="mb-1 block text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  البريد الإلكتروني <span className="text-[#E96B8A]">*</span>
                </label>

                <input
                  id="email"
                  type="email"
                  className="w-full rounded-xl border border-pink-100 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-[#E96B8A] focus:ring-2 focus:ring-pink-100"
                  placeholder="example@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  className="mb-1 block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  كلمة المرور <span className="text-[#E96B8A]">*</span>
                </label>

                <input
                  id="password"
                  type="password"
                  className="w-full rounded-xl border border-pink-100 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-[#E96B8A] focus:ring-2 focus:ring-pink-100"
                  placeholder="لا تقل عن 10 أحرف"
                />
              </div>

            </div>

            {/* Buttons */}
            <div className="mt-6 space-y-4">

              <button className="w-full rounded-xl bg-[#E96B8A] px-4 py-3 font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:bg-[#e35f7f]">
                إنشاء الحساب
              </button>

              <div className="flex items-center gap-3 text-center text-sm text-gray-400 before:h-px before:flex-1 before:bg-pink-100 after:h-px after:flex-1 after:bg-pink-100">
                أو
              </div>

              <button className="w-full rounded-xl border border-pink-100 bg-white px-4 py-3 font-medium text-gray-700 shadow-sm hover:bg-pink-50">
                التسجيل باستخدام Google
              </button>

            </div>

          </form>

          {/* Bottom link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            لديك حساب بالفعل؟{" "}
            <Link className="font-medium text-[#E96B8A] hover:underline" href="/signin">
              تسجيل الدخول
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}