"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

import Logo from "./logo";

import {
  ArrowLeft,
  LogOut,
  Shield,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasAssessment, setHasAssessment] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    checkUser();

    const { data } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user || null;

        setUser(currentUser);

        if (!currentUser) {
          setEmail("");
          setIsAdmin(false);
          setHasAssessment(false);
        } else {
          await checkUser();
        }
      }
    );

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    if (!user) return;

    setEmail(user.email || "");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role === "admin") {
      setIsAdmin(true);
      return;
    }

    const { data: lead } = await supabase
      .from("shaghaf_leads")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    setHasAssessment(!!lead);
  }

  async function logout() {
    await supabase.auth.signOut();

    setUser(null);
    setEmail("");
    setIsAdmin(false);
    setHasAssessment(false);
  }

  const guestNav = [
    {
      title: "الرئيسية",
      href: "/",
    },
    {
      title: "كيف يعمل النظام",
      href: "/result",
    },
    {
      title: "قصص النجاح",
      href: "/#testimonials",
    },
  ];

  const memberNav = [
    {
      title: "الرئيسية",
      href: "/",
    },
    {
      title: "كيف يعمل النظام؟",
      href: "/result",
    },
    {
      title: "قصص النجاح",
      href: "/#testimonials",
    },
    {
      title: "لماذا شغف؟",
      href: "/#features",
    },
  ];

  const navItems = user && !isAdmin ? memberNav : guestNav;

  return (
    <>
      {user && hasAssessment && !isAdmin && (
        <div className="fixed top-0 inset-x-0 z-[60] bg-[#E96B8A] text-white">
          <div className="mx-auto max-w-7xl px-5 py-2 text-center text-sm font-bold">
            <span className="inline-flex items-center gap-2">
              <Sparkles size={15} />
              مرحباً بك في نظام شغف — تم تحديد مسارك المهني بنجاح
            </span>
          </div>
        </div>
      )}

      <header
        className={`
        fixed
        inset-x-0
        z-50
        px-5
        ${user && hasAssessment && !isAdmin ? "top-10" : "top-5"}
      `}
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="
            flex
            h-[92px]
            items-center
            justify-between
            rounded-[32px]
            border
            border-pink-100
            bg-white/85
            px-7
            backdrop-blur-2xl
            shadow-[0_20px_60px_rgba(233,107,138,.12)]
            "
          >
            <Logo />

            <nav
              className="
              hidden
              lg:flex
              items-center
              gap-2
              rounded-full
              border
              border-pink-100
              bg-[#FFF8FB]
              p-2
              "
            >
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="
                  rounded-full
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-gray-600
                  transition
                  hover:bg-white
                  hover:text-[#E96B8A]
                  "
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div
                    className="
                    hidden
                    md:flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-pink-100
                    bg-[#FFF8FB]
                    px-4
                    py-3
                    "
                  >
                    <div
                      className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      bg-[#E96B8A]
                      font-black
                      text-white
                      "
                    >
                      {email?.charAt(0)?.toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-black text-black">
                        {isAdmin ? "مدير النظام" : "عضو شغف"}
                      </p>

                      <p className="max-w-[180px] truncate text-xs text-gray-500">
                        {email}
                      </p>
                    </div>
                  </div>

                  {isAdmin ? (
                    <Link
                      href="/admin"
                      className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-2xl
                      bg-black
                      px-6
                      py-3
                      font-bold
                      text-white
                      "
                    >
                      <Shield size={18} />
                      لوحة الإدارة
                    </Link>
                  ) : (
                    <Link
                      href="/client"
                      className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-2xl
                      bg-[#E96B8A]
                      px-6
                      py-3
                      font-bold
                      text-white
                      shadow-[0_15px_35px_rgba(233,107,138,.30)]
                      "
                    >
                      مساري المهني
                      <ArrowLeft size={18} />
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="
                    rounded-2xl
                    border
                    border-gray-200
                    p-3
                    text-gray-500
                    transition
                    hover:text-red-500
                    "
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="
                    hidden
                    md:block
                    rounded-xl
                    px-5
                    py-3
                    font-semibold
                    text-gray-700
                    "
                  >
                    تسجيل الدخول
                  </Link>

                  <Link
                    href="/result"
                    className="
                    rounded-2xl
                    bg-[#E96B8A]
                    px-7
                    py-3.5
                    font-bold
                    text-white
                    shadow-[0_15px_40px_rgba(233,107,138,.35)]
                    "
                  >
                    ابدأ رحلتك المهنية
                  </Link>
                </>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="
                lg:hidden
                rounded-xl
                p-2
                "
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </motion.div>

          {mobileOpen && (
            <div
              className="
              mt-3
              rounded-3xl
              border
              border-pink-100
              bg-white
              p-5
              shadow-xl
              lg:hidden
              "
            >
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="
                    rounded-xl
                    px-4
                    py-3
                    font-bold
                    text-gray-700
                    hover:bg-[#FFF4F8]
                    "
                  >
                    {item.title}
                  </Link>
                ))}
              </div>

              {/* أزرار الدخول / الحساب — كانت موجودة فقط بنسخة الديسكتوب (hidden md:block) */}
              <div className="mt-4 border-t border-pink-100 pt-4">
                {!user ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="
                      rounded-xl
                      border
                      border-pink-100
                      px-4
                      py-3
                      text-center
                      font-bold
                      text-gray-700
                      "
                    >
                      تسجيل الدخول
                    </Link>
                    <Link
                      href="/result"
                      onClick={() => setMobileOpen(false)}
                      className="
                      rounded-xl
                      bg-[#E96B8A]
                      px-4
                      py-3
                      text-center
                      font-bold
                      text-white
                      "
                    >
                      ابدأ رحلتك المهنية
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={isAdmin ? "/admin" : "/client"}
                    onClick={() => setMobileOpen(false)}
                    className="
                    block
                    rounded-xl
                    bg-[#E96B8A]
                    px-4
                    py-3
                    text-center
                    font-bold
                    text-white
                    "
                  >
                    {isAdmin ? "لوحة الإدارة" : "مساري المهني"}
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}