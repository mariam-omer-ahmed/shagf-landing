"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  PlayCircle,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const MotionLink = motion.create(Link);

const container: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
    },
  },
};

export default function HeroHome() {
  return (
    <section
      className="relative overflow-hidden bg-[#FFF9FB]"
      style={{
        fontFamily:
          "'Cairo','IBM Plex Sans Arabic','Tajawal',sans-serif",
      }}
    >
      {/* ================= Background ================= */}

      <div className="absolute inset-0 overflow-hidden">

        {/* Aurora 1 */}
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
          }}
          className="absolute -left-44 -top-44 h-[750px] w-[750px] rounded-full bg-pink-300/30 blur-[180px]"
        />

        {/* Aurora 2 */}
        <motion.div
          animate={{
            x: [0, -70, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
          }}
          className="absolute -right-44 top-10 h-[700px] w-[700px] rounded-full bg-fuchsia-300/20 blur-[170px]"
        />

        {/* Aurora 3 */}
        <motion.div
          animate={{
            scale: [1, 1.18, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
          }}
          className="absolute bottom-[-260px] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-rose-200/30 blur-[180px]"
        />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Noise */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle,#000 1px,transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-7xl px-6 pt-24 pb-24"
      >
                {/* Hero Content */}
        <motion.div
          variants={fadeUp}
          className="relative mx-auto max-w-6xl text-center"
        >

          {/* Breaking Belief Badge */}
          <div className="inline-flex items-center gap-3 rounded-full border border-red-200 bg-white/90 px-6 py-3 shadow-[0_15px_40px_rgba(0,0,0,.06)] backdrop-blur-xl">

            <span className="relative flex h-3 w-3">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-900 opacity-70" />

              <span className="relative inline-flex h-3 w-3 rounded-full bg-gray-900" />

            </span>

            <span className="font-bold text--600">
هل هذا انت؟            </span>

          </div>

          {/* Main Heading */}
          <h1 className="mx-auto mt-10 max-w-5xl text-5xl font-black leading-[1.08] text-gray-900 md:text-6xl xl:text-7xl">

            <span className="block">
أنت قد تكون تتعلم بشكل صحيح          </span>
لكن لا تزال بلا وظيفة حتى الآن  
            <span className="mt-4 block text-gray-900 line-through">
         </span>
            <span className="relative mt-8 inline-block">
              <span className="relative z-10 bg-gradient-to-l from-[#E96B8A] via-[#D8587C] to-[#E96B8A] bg-clip-text text-transparent">

                <br />
                وليس السبب أنك لا تملك المهارات
               <br />

بل أنك لا تعرف كيف تتحول هذه المعرفة إلى فرصة عمل حقيقية              </span>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: .9,
                  delay: .4,
                }}
                className="absolute bottom-2 left-0 right-0 -z-10 h-5 origin-right rounded-full bg-pink-200/50"
              />
            </span>

          </h1>

          {/* Description */}
          <p className="mx-auto mt-12 max-w-4xl text-xl leading-10 text-gray-600">
الكورسات وحدها لا تكفي لدخول سوق العمل
            <span className="font-bold text-gray-900">
            </span>
                        <br /><br />

لأن المشكلة ليست نقص المهارات
            <span className="font-bold text-[#E96B8A]">
            </span>

            <br /><br />

            لذلك صممنا <span className="font-extrabold text-gray-900">نظام شغف</span>...

            <span className="font-bold text-[#E96B8A]">
            </span>

ليحوّل ما تتعلمه إلى خطوات واضحة تقودك إلى أول فرصة عمل بشكل أسرع.
          </p>

          {/* Mini Proof */}
          <motion.div
            variants={fadeUp}
            className="mt-12 flex flex-wrap items-center justify-center gap-5"
          >

            <div className="flex items-center gap-2 rounded-full bg-white/80 px-5 py-3 shadow-md backdrop-blur-lg">

              <ShieldCheck className="h-5 w-5 text-[#E96B8A]" />

              <span className="font-semibold text-gray-700">
                لا نبيع كورسات... نزيل التشتت.
              </span>

            </div>

            <div className="flex items-center gap-2 rounded-full bg-white/80 px-5 py-3 shadow-md backdrop-blur-lg">

              <TrendingUp className="h-5 w-5 text-[#E96B8A]" />

              <span className="font-semibold text-gray-700">
                ابدأ بالطريق الصحيح قبل استثمار وقتك.
              </span>

            </div>

          </motion.div>

        </motion.div>
                {/* ================= Showcase ================= */}

        <motion.div
          variants={fadeUp}
          className="relative mt-24"
        >

          {/* Floating Card 1 */}
          <motion.div
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
            className="absolute left-0 top-10 z-20 hidden w-64 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_25px_70px_rgba(0,0,0,.08)] backdrop-blur-xl xl:block"
          >

            <div className="mb-4 inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
              قبل نظام شغف
            </div>

            <div className="space-y-3 text-gray-700">

              <p>❌ تبدأ كورسًا جديدًا كل شهر.</p>

              <p>❌ تغيّر المجال مع كل نصيحة.</p>

              <p>❌ تشعر أنك متأخر عن الجميع.</p>

            </div>

            <div className="mt-5 border-t pt-4">

              <p className="text-lg font-black text-gray-900">
                "هل أنا أضيع عمري؟"
              </p>

            </div>

          </motion.div>

          {/* Floating Card 2 */}
          <motion.div
            animate={{
              y: [0, 14, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
            }}
            className="absolute right-0 top-16 z-20 hidden w-64 rounded-3xl border border-pink-200 bg-white/80 p-6 shadow-[0_25px_70px_rgba(233,107,138,.15)] backdrop-blur-xl xl:block"
          >

            <div className="mb-4 flex items-center gap-2">

              <Sparkles className="h-4 w-4 text-[#E96B8A]" />

              <span className="text-sm font-bold text-[#E96B8A]">
                بعد أول خطوة
              </span>

            </div>

             <div className="space-y-4 text-gray-900">
              <div className="flex gap-2">

                <span>✔</span>

                <span> تتوقف عن الدوران بين المجالات</span>

              </div>

              <div className="flex gap-2">

                <span>✔</span>

                <span> تعرف أين تستثمر وقتك</span>

              </div>

              <div className="flex gap-2">

                <span>✔</span>

                <span>تتحرك بثقة نحو أول فرصة عمل حقيقية</span>

              </div>

            </div>

          </motion.div>

          {/* Video */}
          <div className="mx-auto max-w-5xl">

            <motion.div
              whileHover={{
                scale: 1.01,
              }}
              transition={{
                duration: .3,
              }}
              className="relative overflow-hidden rounded-[38px] border border-pink-200 bg-black shadow-[0_45px_120px_rgba(0,0,0,.22)]"
            >

              {/* Glow */}

              <div className="absolute inset-0 bg-gradient-to-tr from-pink-300/20 via-transparent to-fuchsia-300/20 pointer-events-none" />

              <iframe
                className="aspect-video w-full"
  src="https://www.youtube.com/embed/3lFmhZ5wi2w"
                title="Shaghaf System"
                allowFullScreen
              />
            </motion.div>

            <div className="mt-8 flex items-center justify-center gap-3 text-center text-gray-900">

              <PlayCircle className="h-5 w-5 text-[#E96B8A]" />

              <span className="font-medium">
                شاهد كيف يتحول التشتت إلى خطة واضحة خلال دقائق.
              </span>

            </div>

          </div>

          {/* CTA BOX */}

          <motion.div
            whileHover={{
              y: -4,
            }}
            transition={{
              duration: .25,
            }}
            className="mx-auto mt-14 max-w-2xl overflow-hidden rounded-[34px] border border-pink-200 bg-white shadow-[0_30px_90px_rgba(233,107,138,.15)]"
          >

            <div className="bg-gradient-to-r from-[#E96B8A] to-[#d8587c] p-[1px]">

              <div className="rounded-[33px] bg-white px-10 py-10">

                <div className="inline-flex rounded-full bg-pink-100 px-4 py-1 text-sm font-bold text-[#E96B8A]">

                  الخطوة الأولى داخل نظام شغف

                </div>

                <h3 className="mt-6 text-4xl font-black leading-tight text-gray-900">

لا تضيع سنة أخرى
                  <br />

و أنت تحاول تخمين الطريق
                </h3>

                <p className="mt-6 text-lg leading-9 text-gray-900">

ابدأ أولًا بتحديد الاتجاه المناسب لك
                  <br />

                  ثم تعلّم فقط ما يقربك من أول فرصة حقيقية.

                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">

                  <MotionLink
                    href="/result"
                    whileHover={{
                      scale: 1.03,
                    }}
                    whileTap={{
                      scale: .98,
                    }}
                    className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-gradient-to-l from-[#E96B8A] to-[#d8587c] px-6 py-5 text-lg font-bold text-white shadow-xl"
                  >

كيف أتحصل على أول فرصة عمل                     <ArrowRight className="h-5 w-5" />

                  </MotionLink>

                

                </div>

              </div>

            </div>

          </motion.div>

        </motion.div>
                {/* Scroll Indicator */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: [0.35, 1, 0.35],
            y: [0, 8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="mt-20 flex flex-col items-center"
        >

          <div className="flex h-12 w-7 justify-center rounded-full border-2 border-pink-300">

            <motion.div
              animate={{
                y: [4, 22, 4],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
              }}
              className="mt-2 h-2.5 w-2.5 rounded-full bg-[#E96B8A]"
            />

          </div>

        </motion.div>

      </motion.div>
    </section>
  );
}