"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, User, Lock } from "lucide-react";

import { supabase } from "@/lib/supabase";
import AuthCard from "./AuthCard";
import PasswordInput from "./PasswordInput";

export default function RegisterForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError("");

  if (password !== confirmPassword) {
    setError("كلمتا المرور غير متطابقتين");
    return;
  }

  setLoading(true);

  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (signUpError) {
    setLoading(false);

    if (
      signUpError.message
        .toLowerCase()
        .includes("already registered")
    ) {
      localStorage.setItem("lastEmail", email);

      setError(
        "لديك حساب بالفعل، سيتم تحويلك إلى صفحة تسجيل الدخول..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 2000);

      return;
    }

    setError("حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.");
    return;
  }

  const user = data.user;

  if (user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        role: "customer",
      });

    if (profileError) {
      setLoading(false);
      setError("حدث خطأ أثناء إنشاء الحساب");
      return;
    }

    await supabase
      .from("shaghaf_leads")
      .update({
        user_id: user.id,
      })
      .eq("email", email)
      .is("user_id", null);

    setLoading(false);

    router.push("/client");

    return;
  }

  setLoading(false);
}

  return (
    <AuthCard
      badge="ابدأ رحلتك"
      title="خطوتك الأولى نحو أول دخل"
      subtitle="سجّل الآن مجانًا، وابدأ فورًا في استخدام المصادر التي توصلك لسوق العمل."
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div className="relative">
          <User
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-900"
          />
          <input
            type="text"
            placeholder="الاسم الكامل"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
  className="w-full rounded-2xl border border-gray-200 p-4 pr-11 text-black placeholder:text-gray-500 outline-none transition focus:border-[#E96B8A] focus:ring-2 focus:ring-[#E96B8A]"
          />
        </div>

        <div className="relative">
          <Mail
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-900"
          />
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
  className="w-full rounded-2xl border border-gray-200 p-4 pr-11 text-black placeholder:text-gray-500 outline-none transition focus:border-[#E96B8A] focus:ring-2 focus:ring-[#E96B8A]"
          />
        </div>

        <div className="relative">
          <Lock
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-900"
          />
          <PasswordInput
            value={password}
            onChange={setPassword}
            placeholder="كلمة المرور"
          />
        </div>

        <div className="relative">
          <Lock
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-900"
          />
          <PasswordInput
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="تأكيد كلمة المرور"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-center text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-2xl bg-[#E96B8A] py-4 font-bold text-white transition hover:bg-[#d95b7f] disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                className="ml-2 animate-spin"
              />
              جاري إنشاء حسابك...
            </>
          ) : (
            "ابدأ مجانًا الآن"
          )}
        </button>
      </form>
    </AuthCard>
  );
}