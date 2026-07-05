"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CircleAlert } from "lucide-react";

const painPoints = [
  {
    number: "01",
    image: "/images/f1.jpg",
    title: "كل يوم تقتنع بمجال جديد",
    description:
      "مرة برمجة... مرة تصميم... مرة ذكاء اصطناعي. المشكلة ليست كثرة الخيارات... المشكلة أنك تخاف أن تختار الطريق الخطأ.",
  },
  {
    number: "02",
    image: "/images/f2.jpg",
    title: "تتعلم كثيرًا... لكن حياتك لا تتحرك",
    description:
      "كل دورة تمنحك شعورًا مؤقتًا أنك تقترب، لكن عندما تنتهي منها تعود لنفس السؤال: ماذا أفعل الآن؟",
  },
  {
    number: "03",
    image: "/images/f3.jpg",
    title: "أصبحت تجمع المعلومات بدل اتخاذ القرار",
    description:
      "فيديوهات... مقالات... كورسات... تعرف أكثر من أي وقت، لكنك لا تتحرك أكثر من أي وقت.",
  },
  {
    number: "04",
    image: "/images/f4.jpg",
    title: "تؤجل البداية حتى تصبح جاهزًا",
    description:
      "تنتظر اللحظة التي تشعر فيها بالثقة الكاملة... لكنها لا تأتي أبدًا.",
  },
  {
    number: "05",
    image: "/images/f5.jpg",
    title: "كل نصيحة تزيد حيرتك",
    description:
      "كل شخص يخبرك بطريق مختلف... حتى أصبحت لا تعرف هل المشكلة في السوق أم في قرارك.",
  },
  {
    number: "06",
    image: "/images/f5.jpg",
    title: "تشعر أن حياتك متوقفة",
    description:
      "أسوأ شعور ليس أنك لا تعمل... بل أنك لا تعرف إن كنت تتحرك نحو مستقبلك... أم بعيدًا عنه.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export default function Features() {
  return (
    <section id="features"
      dir="rtl"
      className="relative overflow-hidden bg-gradient-to-b from-[#FFF8FB] via-white to-[#FFF8FB] py-32"
      style={{
        fontFamily:
          "'Cairo','IBM Plex Sans Arabic','Tajawal',sans-serif",
      }}
    >
      {/* Background */}

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-1/2 top-[-260px] h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-[#E96B8A]/10 blur-[180px]" />

        <div className="absolute -left-44 top-1/3 h-[400px] w-[400px] rounded-full bg-pink-200/25 blur-[140px]" />

        <div className="absolute -right-52 bottom-0 h-[500px] w-[500px] rounded-full bg-[#FFD6E3]/20 blur-[170px]" />

      </div>

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .7 }}
          className="mx-auto max-w-5xl text-center"
        >

          <div className="inline-flex items-center gap-3 rounded-full border border-red-200 bg-white px-7 py-3 shadow-xl">

            <CircleAlert className="h-5 w-5 text-red-500" />

            <span className="font-bold text-red-500">
              المشكلة ليست أنك لا تجتهد...
            </span>

          </div>

          <h2 className="mt-10 text-[44px] font-black leading-[1.45] text-[#151827] md:text-6xl">

            ربما المشكلة...

            <br />

            أنك تمضي سنوات

            <span className="text-[#E96B8A]">
              {" "}تستعد للمستقبل...
            </span>

            <br />

            دون أن تبدأه.

          </h2>

          <p className="mx-auto mt-10 max-w-4xl text-[22px] leading-[2.1] text-gray-600">

            أغلب الناس لا يتأخرون لأنهم كسالى...

            <br />

            بل لأنهم يخافون أن يبدأوا في الطريق الخطأ.

            <br /><br />

            فيشاهدون المزيد من الفيديوهات...

            ويشترون المزيد من الكورسات...

            ويجمعون المزيد من المعلومات...

            <br /><br />

            <span className="font-black text-[#151827]">

              بينما حياتهم المهنية...

            </span>

            <span className="font-black text-[#E96B8A]">
              {" "}ما زالت في نفس المكان.
            </span>

          </p>

          <div className="mx-auto mt-14 h-[2px] w-44 rounded-full bg-gradient-to-l from-transparent via-[#E96B8A] to-transparent" />

        </motion.div>
                {/* Pain Cards */}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-120px" }}
          className="mt-24 grid gap-8 md:grid-cols-2 xl:grid-cols-3"
        >
          {painPoints.map((card) => (
            <motion.article
              key={card.number}
              variants={item}
              whileHover={{
                y: -8,
                scale: 1.015,
              }}
              transition={{ duration: 0.25 }}
              className="group relative overflow-hidden rounded-[34px] border border-[#F3D6DF] bg-white shadow-[0_25px_70px_rgba(0,0,0,.05)] transition-all duration-500 hover:border-[#E96B8A]/40 hover:shadow-[0_40px_90px_rgba(233,107,138,.16)]"
            >
              {/* Glow */}

              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#E96B8A]/10 blur-[80px] opacity-0 transition duration-500 group-hover:opacity-100" />

              {/* Image */}

              <div className="relative h-[260px] overflow-hidden">

                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />

                {/* Overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                {/* Number */}

                <div className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-xl font-black text-[#E96B8A] shadow-xl backdrop-blur-xl">

                  {card.number}

                </div>

              </div>

              {/* Content */}

              <div className="relative px-8 pb-9 pt-8">

                <div className="mb-4 inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-500">

                  هذا ما يبقيك عالقًا

                </div>

                <h3 className="text-[31px] font-black leading-[1.45] text-[#151827] transition duration-300 group-hover:text-[#E96B8A]">

                  {card.title}

                </h3>

                <div className="my-5 h-[3px] w-16 rounded-full bg-[#E96B8A] transition-all duration-500 group-hover:w-28" />

                <p className="text-[20px] leading-[2] text-gray-600">

                  {card.description}

                </p>

              </div>

            </motion.article>
          ))}
        </motion.div>
                {/* FALSE BELIEF */}

                {/* Final CTA */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-32 max-w-5xl text-center"
        >

          <div className="mb-6 inline-flex items-center rounded-full border border-[#E96B8A]/20 bg-[#FFF3F7] px-6 py-3 text-sm font-bold text-[#E96B8A]">

  القرار الذي ستتخذه خلال الدقائق القادمة...
  قد يختصر عليك سنوات من الدوران.

</div>

<h2 className="text-4xl font-black leading-[1.6] text-[#151827] md:text-6xl">

  قبل أن تشتري

  <span className="text-[#E96B8A]">

    {" "}أي كورس جديد...

  </span>

  <br />

  تأكد أولًا...

  <br />

  أنك تسير في الاتجاه الصحيح.

</h2>

<p className="mx-auto mt-10 max-w-3xl text-2xl leading-[2] text-gray-600">

  إذا كنت مخطئًا في اختيار الطريق...

</p>

<div className="mx-auto mt-10 max-w-3xl space-y-8">

  <p className="text-center text-[42px] font-black text-[#E96B8A]">

    فلن تنقذك 100 دورة.

  </p>

  <p className="text-center text-[42px] font-black text-[#E96B8A]">

    ولا 100 شهادة.

  </p>

  <p className="text-center text-[42px] font-black text-[#E96B8A]">

    ولا 1000 ساعة تعلم.

  </p>

</div>

<div className="relative mt-16 overflow-hidden rounded-[38px] border border-pink-100 bg-white p-12 shadow-[0_30px_80px_rgba(233,107,138,.12)]">

  <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8FB] via-white to-[#FFF2F6]" />

  <div className="relative">

    <h3 className="text-[34px] font-black leading-[1.8] text-[#151827]">

      المشكلة ليست في كمية التعلم...

      <br />

      <span className="text-[#E96B8A]">

        بل في اتجاه التعلم.

      </span>

    </h3>

    <div className="mx-auto my-10 h-px w-48 bg-gradient-to-l from-transparent via-[#E96B8A]/40 to-transparent" />

    <p className="mx-auto max-w-2xl text-xl leading-[2.1] text-gray-700">

      لهذا السبب...

      نحن لا نبدأ بإعطائك كورسًا.

      <br /><br />

      نبدأ أولًا بتحديد مكانك الحالي،

      ثم نرسم لك أقصر طريق للوصول إلى هدفك.

    </p>

 <motion.a
  href="/shagf-quiz"
  whileHover={{
    scale: 1.04,
    boxShadow: "0 25px 60px rgba(233,107,138,.35)",
  }}
  whileTap={{ scale: 0.98 }}
  className="mt-12 inline-flex items-center gap-3 rounded-full bg-[#E96B8A] px-14 py-6 text-2xl font-black text-white transition hover:bg-[#d95d7d]"
>
  اكتشف إن كنت على الطريق الصحيح

  <ArrowRight size={24} />
</motion.a>

    <p className="mt-8 text-lg font-semibold leading-[2] text-gray-500">

      قد تكون هذه هي الخطوة التي توفر عليك

      <span className="font-black text-[#151827]">

        {" "}سنوات من التجربة والخطأ.

      </span>

    </p>

  </div>

</div>
        </motion.div>

      </div>

    </section>
  );
}