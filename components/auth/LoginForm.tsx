"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Mail,
  Lock,
  ArrowLeft,
  Loader2,
  BookOpen,
  FileText,
  Sparkles,
  BadgeCheck,
  Users,
  TrendingUp,
} from "lucide-react";

import { Tajawal } from "next/font/google";

import { supabase } from "@/lib/supabase";
import PasswordInput from "./PasswordInput";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
});

export default function LoginForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { data, error: signInError } =
  await supabase.auth.signInWithPassword({
    email,
    password,
  });

console.log("DATA:", data);
console.log("ERROR:", signInError);

    const user = data.user;

    if (!user) {
      setLoading(false);
      setError("تعذّر إتمام تسجيل الدخول");
      return;
    }

  const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .single();

console.log("USER ID:", user.id);
console.log("PROFILE:", profile);
console.log("PROFILE ERROR:", profileError);

    if (!profile) {
      router.push("/access-denied");
      return;
    }

    if (profile.role === "admin") {
      router.push("/admin");
      return;
    }

    router.push("/client");
  }

  return (
    <>
      {/* White backdrop that forces the whole viewport to white,
          regardless of any dark background set on body/layout */}
      <div className="fixed inset-0 -z-10 bg-white" />

      <section
        className={`${tajawal.className} relative w-full bg-white px-4 py-10`}
      >
        <div
          className="
          mx-auto
          grid
          w-full
          max-w-5xl
          overflow-hidden
          rounded-[34px]
          border
          border-pink-200
          bg-white
          shadow-[0_35px_100px_rgba(233,107,138,.15)]
          md:grid-cols-2
        "
        >
          {/* ================= LEFT: FORM ================= */}

          <div className="px-8 py-10 sm:px-10">

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#FFF3F7]
                px-5
                py-2
                text-sm
                font-bold
                text-[#E96B8A]
              "
            >
              <Sparkles size={14} />
              مساحة شغف
            </div>

            <h1
              className="
                mt-6
                text-3xl
                font-bold
                leading-tight
                text-[#3A2530]
              "
            >
              تسجيل الدخول إلى الحساب
            </h1>

            



            {/* Error */}

            {error && (
              <div
                className="
                  mt-6
                  rounded-2xl
                  border
                  border-red-100
                  bg-red-50
                  p-4
                  text-center
                  text-sm
                  font-bold
                  text-red-600
                "
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >

              {/* Email */}

              <div>

                <label className="mb-2 block font-bold text-[#3A2530]">
                  البريد الإلكتروني
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="
                      absolute
                      right-5
                      top-1/2
                      -translate-y-1/2
                      text-[#E96B8A]
                    "
                  />

                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-pink-100
                      bg-[#FFFDFE]
                      py-3.5
                      pr-14
                      pl-5
                      text-[#3A2530]
                      outline-none
                      transition
                      focus:border-[#E96B8A]
                      focus:ring-4
                      focus:ring-pink-100
                    "
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="font-bold text-[#3A2530]">
                    كلمة المرور
                  </label>

                  <Link
                    href="/reset-password"
                    className="
                      text-sm
                      font-bold
                      text-[#E96B8A]
                      hover:underline
                    "
                  >
                    نسيت كلمة المرور؟
                  </Link>

                </div>

                <div className="relative">

                  <Lock
                    size={18}
                    className="
                      absolute
                      right-5
                      top-1/2
                      -translate-y-1/2
                      text-[#E96B8A]
                    "
                  />

                  <PasswordInput
                    value={password}
                    onChange={setPassword}
                    placeholder="••••••••"
                  />

                </div>

              </div>

              {/* Login Button */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  bg-[#E96B8A]
                  py-3.5
                  text-lg
                  font-bold
                  text-white
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#DD5D82]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />
                    جارٍ تسجيل الدخول...
                  </>
                ) : (
                  <>
                    الدخول إلى الحساب

                    <ArrowLeft
                      size={20}
                      className="transition-transform group-hover:-translate-x-1"
                    />
                  </>
                )}
              </button>

            </form>

          </div>

          {/* ================= RIGHT: VALUE PANEL ================= */}

          <div
            className="
              relative
              overflow-hidden
              bg-gradient-to-br
              from-[#FFF3F7]
              via-[#FFF8FA]
              to-white
              px-8
              py-10
              sm:px-10
            "
          >

            <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#E96B8A]/10 blur-[90px]" />

            <span
              className="
                inline-flex
                rounded-full
                bg-[#E96B8A]
                px-4
                py-1
                text-xs
                font-bold
                text-white
              "
            >
              ألم تُنشئ حسابًا بعد؟
            </span>


            <p className="relative mt-2 leading-8 text-[#6B5F66]">
              أنشئ حسابًا مجانيًا في مساحة شغف، وستحصل
              فور التسجيل على:
            </p>

            <div className="relative mt-6 space-y-4 text-right">

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFE3EC] text-[#E96B8A]">
                  <BookOpen size={18} />
                </span>
                <span className="pt-1 leading-7 font-medium text-[#3A2530]">
                  مكتبة كتب رقمية مجانية، جاهزة للتحميل
                  والقراءة فورًا
                </span>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFE3EC] text-[#E96B8A]">
                  <FileText size={18} />
                </span>
                <span className="pt-1 leading-7 font-medium text-[#3A2530]">
                  مصادر وملفات تدريبية حصرية، ومنتجات رقمية
                  مجانية تُضاف باستمرار
                </span>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFE3EC] text-[#E96B8A]">
                  <BadgeCheck size={18} />
                </span>
                <span className="pt-1 leading-7 font-medium text-[#3A2530]">
                  حفظ دائم لنتائج اختباراتك، ومتابعة كاملة
                  لتقدّمك داخل جميع البرامج
                </span>
              </div>

            </div>

            <Link
              href="/register"
              className="
                relative
                mt-7
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#E96B8A]
                px-8
                py-3.5
                font-bold
                text-white
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#DD5D82]
              "
            >
              إنشاء حساب مجاني الآن
              <ArrowLeft size={18} />
            </Link>

    

          </div>

        </div>
      </section>
    </>
  );

}