"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Briefcase,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

const cards = [
  {
    icon: GraduationCap,
    title: "الكثير يتعلم...",
    text: "لكن معظم المتعلمين لا يعرفون أي المهارات يطلبها سوق العمل فعلًا.",
  },
  {
    icon: Briefcase,
    title: "الوظائف لا تُمنح للأكثر دراسة",
    text: "بل لمن يمتلك المهارات الصحيحة، ويعرف كيف يعرضها بطريقة احترافية.",
  },
  {
    icon: TrendingUp,
    title: "الفرق ليس في الذكاء",
    text: "الفرق الحقيقي أن هناك من يسير بخطة واضحة، وآخر يتعلم بشكل عشوائي.",
  },
];

export default function HeroProof() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-5 py-2 text-sm font-bold text-[#E96B8A]">
            <BadgeCheck size={16} />
            الحقيقة التي يكتشفها الجميع متأخرًا
          </div>

          <h2 className="mt-3 text-4xl font-black leading-tight text-gray-900">
            المشكلة ليست أنك لا تجتهد...
            <br />
            المشكلة أنك قد تجتهد في الاتجاه الخطأ.
          </h2>

          <p className="mt-6 text-lg leading-9 text-gray-600">
            كثيرون يقضون سنوات في التعلم، ثم يكتشفون أن سوق العمل كان يبحث عن
            شيء مختلف تمامًا.
          </p>
        </motion.div>

        {/* Cards */}

        <div className="mt-16 grid gap-7 lg:grid-cols-3">

          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * .15,
                }}
                className="rounded-3xl border border-pink-100 bg-[#FFF9FB] p-8"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100">
                  <Icon className="h-8 w-8 text-[#E96B8A]" />
                </div>

                <h3 className="text-2xl font-black text-gray-900">
                  {card.title}
                </h3>

                <p className="mt-5 leading-8 text-gray-600">
                  {card.text}
                </p>
              </motion.div>
            );
          })}

        </div>

        {/* Bottom Statement */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: .5 }}
          className="mx-auto mt-16 max-w-4xl rounded-[28px] border border-pink-200 bg-gradient-to-r from-pink-50 to-white p-10 text-center"
        >
          <h3 className="text-3xl font-black text-gray-900 leading-relaxed">
            لهذا السبب لا يبدأ
            <span className="text-[#E96B8A]">
              {" "}نظام شغف{" "}
            </span>
            بتعليمك مهارة جديدة...
            <br />
            بل يبدأ بتحديد المهارة التي تستحق أن تتعلمها من الأساس.
          </h3>
        </motion.div>

      </div>
    </section>
  );
}