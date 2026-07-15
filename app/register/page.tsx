import RegisterForm from "@/components/auth/Registerform";

export const metadata = {
  title: "إنشاء حساب | شغف",
  description: "إنشاء حساب جديد في منصة شغف",
};

export default function RegisterPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#FFF8FB] via-white to-[#FFF4F8] px-6 pb-16 pt-32 md:pt-40"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black text-gray-900">
            مرحبًا بك في شغف
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-gray-600">
            أنشئ حسابك مجانًا للوصول إلى الكتب المجانية، والمنتجات الرقمية،
            ولوحة التحكم الخاصة بك.
          </p>
        </div>

        <RegisterForm />
      </div>
    </main>
  );
}