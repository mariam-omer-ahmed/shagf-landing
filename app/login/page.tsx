export const metadata = {
  title: "تسجيل الدخول | شغف",
  description: "تسجيل الدخول إلى مساحة شغف",
};

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#FDF2F6] px-6 pb-16 pt-32 md:pt-40"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black md:text-5xl" style={{ color: "#0B0608" }}>
            أهلًا بعودتك إلى شغف
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-9" style={{ color: "#3A2A2E" }}>
            سجّل دخولك للمتابعة من حيث توقفت في مسارك التدريبي.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}