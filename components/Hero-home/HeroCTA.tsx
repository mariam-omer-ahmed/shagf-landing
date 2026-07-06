"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function HeroCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: .7 }}
      className="mx-auto mt-16 max-w-3xl"
    >
      <div className="overflow-hidden rounded-[34px] border border-pink-200 bg-white shadow-[0_35px_100px_rgba(233,107,138,.15)]">

        {/* Top Border */}

        <div className="h-1 bg-gradient-to-r from-[#E96B8A] via-pink-400 to-[#E96B8A]" />

        <div className="px-10 py-12">

          {/* Badge */}

          <div className="inline-flex rounded-full bg-pink-100 px-4 py-2 text-sm font-bold text-[#E96B8A]">
            قبل أن تغادر هذه الصفحة...
          </div>

          {/* Headline */}

          <h3 className="mt-7 text-4xl font-black leading-tight text-gray-900">

            اسأل نفسك سؤالًا واحدًا فقط...

          </h3>

          <p className="mt-8 text-xl leading-10 text-gray-700">

            إذا بقيت تتعلم بنفس الطريقة التي تتعلم بها اليوم...

            <br />
            <br />

            أين ستكون بعد

            <span className="font-black text-[#E96B8A]">
              {" "}6 أشهر؟
            </span>

            <br />

            وهل ستكون أقرب إلى أول وظيفة...

            <br />

            أم ستكون قد أنهيت دورة جديدة فقط؟

          </p>

          {/* Divider */}

          <div className="my-10 h-px bg-pink-100" />

          {/* Value */}

          <div className="space-y-5">

            <div className="flex items-start gap-3">

              <CheckCircle2 className="mt-1 h-6 w-6 text-[#E96B8A]" />

              <p className="text-lg text-gray-800">

                لن نبيعك دورة جديدة تضيفها إلى قائمة الدورات.

              </p>

            </div>

            <div className="flex items-start gap-3">

              <CheckCircle2 className="mt-1 h-6 w-6 text-[#E96B8A]" />

              <p className="text-lg text-gray-800">

                سنساعدك على معرفة الطريق الذي يستحق أن تبذل فيه وقتك.

              </p>

            </div>

            <div className="flex items-start gap-3">

              <CheckCircle2 className="mt-1 h-6 w-6 text-[#E96B8A]" />

              <p className="text-lg font-bold text-gray-900">

                لأن المشكلة ليست أنك لا تتعلم...
                <br />
                بل أنك تتعلم دون خطة.

              </p>

            </div>

          </div>

          {/* CTA */}

          <Link
            href="/result"
            className="mt-12 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-l from-[#E96B8A] to-[#d8587c] px-8 py-6 text-xl font-black text-white shadow-xl transition hover:scale-[1.02]"
          >
            اكتشف الطريق المناسب لك

            <ArrowRight className="h-6 w-6" />
          </Link>

          <p className="mt-5 text-center text-sm text-gray-500">

            يستغرق أقل من دقيقتين • وستعرف من أين يجب أن تبدأ

          </p>

        </div>
      </div>
    </motion.section>
  );
}