"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Target,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function Transformation() {
  return (
    <section className="bg-white py-24" dir="rtl">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >

          <span className="inline-flex rounded-full bg-[#F7E9EE] px-5 py-2 text-sm font-bold text-[#6E1E3A]">
            تخيل نفسك بعد عدة أشهر...
          </span>

          <h2 className="mt-6 text-4xl font-black text-gray-900 leading-tight">
            ماذا لو أصبحت تعرف بالضبط
            <br />
            ما الذي يجب أن تفعله كل أسبوع؟
          </h2>

          <p className="mt-8 text-xl leading-9 text-gray-600">
            لا لأنك أصبحت أذكى...
            <br />
            بل لأنك أخيرًا توقفت عن الجري في الاتجاه الخطأ.
          </p>

        </motion.div>

        {/* BEFORE / AFTER */}

        <div className="mt-20 grid gap-10 lg:grid-cols-2">

          {/* قبل */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#E7CFD6] bg-[#FBF3F1] p-10"
          >

            <h3 className="text-2xl font-black text-[#8A3B2A]">
              قبل نظام شغف
            </h3>

            <div className="mt-8 space-y-6 text-gray-700">

              <Item text="تبدأ دورة جديدة كل شهر دون خطة واضحة." />

              <Item text="تشعر أن الجميع يتقدم بينما أنت ثابت في مكانك." />

              <Item text="ترسل سيرتك الذاتية دون أن تعرف سبب عدم الرد." />

              <Item text="تبدل بين المجالات لأنك لا تعرف أيها يناسبك." />

              <Item text="كل قرار يحتاج ساعات من التفكير والتردد." />

              <Item text="كل يوم ينتهي وأنت تشعر أنك لم تقترب من هدفك." />

            </div>

          </motion.div>

          {/* بعد */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#6E1E3A]/15 bg-[#FDF6F8] p-10 shadow-[0_20px_60px_rgba(110,30,58,.08)]"
          >

            <h3 className="text-2xl font-black text-[#6E1E3A]">
              بعد تطبيق النظام
            </h3>

            <div className="mt-8 space-y-6">

              <Benefit
                icon={<Target size={20} />}
                title="اتجاه واضح"
                desc="تعرف بالضبط ماذا تتعلم وما الذي يجب تجاهله."
              />

              <Benefit
                icon={<Briefcase size={20} />}
                title="تحرك نحو سوق العمل"
                desc="كل خطوة تقوم بها مرتبطة بزيادة فرص حصولك على وظيفة."
              />

              <Benefit
                icon={<TrendingUp size={20} />}
                title="تقدم يمكن قياسه"
                desc="لم تعد تجمع معلومات... بل تحقق نتائج أسبوعًا بعد أسبوع."
              />

              <Benefit
                icon={<Sparkles size={20} />}
                title="ثقة أكبر"
                desc="لأنك تعرف لماذا تقوم بكل خطوة، وليس لأن أحدًا أخبرك بذلك."
              />

            </div>

          </motion.div>

        </div>

        {/* BIG QUOTE */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-24 max-w-4xl rounded-[34px] bg-gradient-to-l from-[#6E1E3A] to-[#3D1020] p-14 text-center text-white shadow-[0_30px_80px_rgba(74,20,40,.35)]"
        >

          <p className="text-4xl font-black leading-[1.7]">

            النجاح لا يبدأ عندما تحصل على الوظيفة...

            <br /><br />

            بل يبدأ عندما تتوقف عن التخمين،
            وتبدأ تنفيذ خطة واضحة.

          </p>

          <p className="mt-8 text-xl opacity-90">

            وهذا بالضبط ما بُني عليه نظام شغف.

          </p>

        </motion.div>

      </div>
    </section>
  );
}

function Item({ text }: { text: string }) {
  return (
    <div className="flex gap-4">

      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#B5533A]" />

      <p className="text-lg leading-8">
        {text}
      </p>

    </div>
  );
}

function Benefit({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (

    <div className="flex gap-5">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6E1E3A] text-white">

        {icon}

      </div>

      <div>

        <h4 className="font-black text-xl text-gray-900">
          {title}
        </h4>

        <p className="mt-2 text-gray-600 leading-8">
          {desc}
        </p>

      </div>

    </div>

  );
}