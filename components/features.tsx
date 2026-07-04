"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const painPoints = [
  {
    number: "01",
    image: "/images/s1.jpg",
    title: "كل أسبوع تبدأ مجالًا جديدًا",
    description:
      "ثم تتوقف لأنك غير متأكد أن هذا هو الطريق الذي سيقودك إلى فرصة حقيقية.",
  },
  {
    number: "02",
    image: "/images/s2.jpg",
    title: "اشتريت أكثر من دورة",
    description:
      "لكن لا تعرف أي واحدة منها ستقربك فعلًا من أول وظيفة أو أول عميل.",
  },
  {
    number: "03",
    image: "/images/s3.jpg",
    title: "تملك مهارات جيدة",
    description:
      "لكن لا تملك Portfolio أو LinkedIn احترافي يعكس قيمتك الحقيقية.",
  },
  {
    number: "04",
    image: "/images/s1.jpg",
    title: "كلما سألت شخصًا",
    description:
      "أعطاك نصيحة مختلفة، حتى أصبحت لا تعرف أي طريق يجب أن تسلكه.",
  },
  {
    number: "05",
    image: "/images/s1.jpg",
    title: "مرت أشهر",
    description:
      "وما زلت تؤجل البداية لأن الصورة الكاملة ما زالت غير واضحة بالنسبة لك.",
  },
  {
    number: "06",
    image: "/images/s1.jpg",
    title: "تشعر أنك متأخر",
    description:
      "وترى الجميع يتقدم بينما أنت ما زلت تبحث عن أول خطوة صحيحة.",
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
    <section
      dir="rtl"
      className="relative overflow-hidden bg-gradient-to-b from-[#FFF8FB] via-white to-[#FFF8FB] py-24"
      style={{
        fontFamily:
          "'Cairo','IBM Plex Sans Arabic','Tajawal',sans-serif",
      }}
    >
      {/* Background */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute left-1/2 top-[-220px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#E96B8A]/10 blur-[150px]" />

        <div className="absolute -right-44 bottom-0 h-[450px] w-[450px] rounded-full bg-pink-200/20 blur-[150px]" />

        <div className="absolute -left-44 top-1/3 h-[380px] w-[380px] rounded-full bg-[#FFD6E3]/30 blur-[140px]" />

      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-20 max-w-5xl text-center"
        >

          {/* Badge */}

          <div className="mb-8 inline-flex flex-row-reverse items-center gap-2 rounded-full border border-[#F3B6C8] bg-white px-6 py-3 shadow-lg shadow-pink-100">

            <Sparkles
              size={18}
              className="text-[#E96B8A]"
            />

            <span className="text-lg font-bold text-[#E96B8A]">
              هل هذا أنت؟
            </span>

          </div>

          {/* Heading */}

          <h2 className="text-[42px] font-black leading-[1.6] text-[#151827] md:text-6xl">

            ربما ليست مشكلتك أنك لا تجتهد...

            <br />

            بل أنك تتحرك

            <span className="text-[#E96B8A]">
              {" "}دون اتجاه واضح.
            </span>

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-[2] text-gray-600">

            قد تكون طالبًا، أو خريجًا، أو صاحب خبرة...

            <br /><br />

            لكن إذا كنت تبذل الكثير من الجهد دون أن تقترب من المكان الذي تستحقه،
            فربما المشكلة ليست في قدراتك.

            <br /><br />

            المشكلة أنك لم تمتلك بعد خارطة طريق واضحة،
            تساعدك على اتخاذ القرار الصحيح في الوقت الصحيح.

          </p>

          {/* Divider */}

          <div className="mx-auto mt-10 flex flex-row-reverse items-center justify-center gap-4">

            <div className="h-[2px] w-20 rounded-full bg-[#E96B8A]" />

            <div className="h-3 w-3 rounded-full bg-[#E96B8A]" />

            <div className="h-[2px] w-20 rounded-full bg-[#E96B8A]" />

          </div>

        </motion.div>

                {/* Cards */}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-120px" }}
          className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
        >
          {painPoints.map((card) => (
            <motion.article
              key={card.number}
              variants={item}
              whileHover={{
                y: -10,
                scale: 1.02,
              }}
              transition={{ duration: 0.25 }}
              className="group overflow-hidden rounded-[34px] border border-[#F5D7E1] bg-white shadow-[0_20px_60px_rgba(0,0,0,.06)] transition-all duration-300 hover:border-[#E96B8A]/40 hover:shadow-[0_35px_80px_rgba(233,107,138,.18)]"
            >

              {/* Image */}

              <div className="relative overflow-hidden p-4 pb-0">

                <div className="relative h-[330px] overflow-hidden rounded-[24px]">

                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />

                  {/* Number */}

                  <div className="absolute left-4 top-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E96B8A] text-xl font-black text-white shadow-lg">

                    {card.number}

                  </div>

                </div>

              </div>

              {/* Content */}

              <div className="px-8 pb-9 pt-8 text-center">

                <h3 className="text-[33px] font-black leading-[1.45] text-[#151827] transition-colors duration-300 group-hover:text-[#E96B8A]">

                  {card.title}

                </h3>

                {/* Accent */}

                <div className="mx-auto my-5 h-1 w-16 rounded-full bg-[#E96B8A] transition-all duration-300 group-hover:w-28" />

                <p className="text-[21px] leading-[2] text-gray-600">

                  {card.description}

                </p>

              </div>

            </motion.article>
          ))}
        </motion.div>

        {/* Transition Box */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="mx-auto mt-24 max-w-5xl"
        >

          <div className="relative overflow-hidden rounded-[34px] border border-[#F3C8D6] bg-gradient-to-br from-[#FFF4F8] via-[#FFF9FB] to-[#FFE8EF] px-8 py-12 shadow-[0_18px_55px_rgba(233,107,138,.08)]">

            <div className="absolute -right-20 top-0 h-52 w-52 rounded-full bg-[#E96B8A]/10 blur-[100px]" />

            <div className="absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-pink-200/20 blur-[100px]" />

            <h3 className="relative text-center text-4xl font-black leading-[1.7] text-[#151827]">

              إذا وجدت نفسك في أكثر من نقطة...

              <br />

              <span className="text-[#E96B8A]">

                فالمشكلة ليست في إجتهادك.

              </span>

            </h3>

            <p className="relative mt-8 text-center text-2xl leading-[2] text-gray-700">

              المشكلة أنك تحتاج إلى

              <span className="font-black text-[#E96B8A]">

                {" "}نظام واضح

              </span>

              <br />

              يرشدك إلى الخطوة الصحيحة التالية...

              <br />

              وليس دورة جديدة كل أسبوع.

            </p>

          </div>

        </motion.div>

                {/* Solution Section */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-28 max-w-6xl"
        >

          <div className="relative overflow-hidden rounded-[42px] bg-gradient-to-br from-[#E96B8A] via-[#DD5D7D] to-[#C84A69] px-8 py-14 text-white shadow-[0_35px_90px_rgba(233,107,138,.35)] md:px-14 md:py-16">

            {/* Background Glow */}

            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-[120px]" />

            <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-white/10 blur-[140px]" />

            {/* Badge */}

            <div className="relative inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold backdrop-blur-md">

              لهذا يبدأ نظام شغف بطريقة مختلفة

            </div>

            {/* Heading */}

            <h2 className="relative mt-8 text-4xl font-black leading-[1.5] md:text-6xl">

              نحن لا نبدأ بإعطائك

              <br />

              دورة تدريبية...

            </h2>

            <h3 className="relative mt-5 text-3xl font-black text-pink-100 md:text-4xl">

              بل نبدأ بفهمك أنت.

            </h3>

            {/* Steps */}

            <div className="relative mt-14 grid gap-7 md:grid-cols-2">

              {/* Card 1 */}

              <div className="rounded-[28px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl transition duration-300 hover:bg-white/15">

                <div className="mb-5 text-5xl font-black text-pink-100">
                  01
                </div>

                <h4 className="mb-4 text-2xl font-black">

                  نفهم وضعك الحالي

                </h4>

                <p className="leading-[2] text-pink-50">

                  نتعرف على تخصصك، وخبراتك، وطموحاتك،
                  ونحدد بدقة أين تقف اليوم،
                  وما الذي يمنعك من الوصول للفرصة التي تستحقها.

                </p>

              </div>

              {/* Card 2 */}

              <div className="rounded-[28px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl transition duration-300 hover:bg-white/15">

                <div className="mb-5 text-5xl font-black text-pink-100">
                  02
                </div>

                <h4 className="mb-4 text-2xl font-black">

                  نبني لك خارطة طريق

                </h4>

                <p className="leading-[2] text-pink-50">

                  لا نقدم خطة عامة للجميع،
                  بل مسارًا واضحًا يناسب مرحلتك الحالية،
                  ويقودك خطوة بخطوة نحو هدفك.

                </p>

              </div>

              {/* Card 3 */}

              <div className="rounded-[28px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl transition duration-300 hover:bg-white/15">

                <div className="mb-5 text-5xl font-black text-pink-100">
                  03
                </div>

                <h4 className="mb-4 text-2xl font-black">

                  نبني حضورك المهني

                </h4>

                <p className="leading-[2] text-pink-50">

                  نحول خبراتك ومهاراتك
                  إلى هوية احترافية قوية،
                  عبر LinkedIn و Portfolio
                  وسيرة ذاتية تعكس قيمتك الحقيقية.

                </p>

              </div>

              {/* Card 4 */}

              <div className="rounded-[28px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl transition duration-300 hover:bg-white/15">

                <div className="mb-5 text-5xl font-black text-pink-100">
                  04
                </div>

                <h4 className="mb-4 text-2xl font-black">

                  ثم نجهزك للفرص

                </h4>

                <p className="leading-[2] text-pink-50">

                  سواء كانت وظيفة،
                  أو عملًا حرًا،
                  أو ترقية،
                  أو مشروعًا خاصًا...
                  ستكون جاهزًا عندما تصل الفرصة.

                </p>

              </div>

            </div>

            {/* Bottom Message */}

            <div className="relative mt-14 rounded-[30px] border border-white/20 bg-white/10 p-8 text-center backdrop-blur-xl">

              <p className="text-2xl font-black leading-[2]">

                لسنا هنا لنخبرك ماذا تتعلم...

                <br />

                نحن هنا لنساعدك على بناء

                <span className="text-yellow-200">

                  {" "}مسارك المهني بالطريقة التي تناسبك.

                </span>

              </p>

            </div>

          </div>

        </motion.div>
                {/* Final CTA */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-28 max-w-5xl text-center"
        >

          <h2 className="text-4xl font-black leading-[1.7] text-[#151827] md:text-5xl">

            مهما كان تخصصك...

            <span className="text-[#E96B8A]">

              {" "}لسنا هنا لنبيعك دورة جديدة.

            </span>

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-[2.1] text-gray-600">

            نحن نساعدك على بناء مسار مهني واضح،
            وتحديد أولوياتك،
            ثم تنفيذ الخطوات الصحيحة حتى تصل إلى
            الوظيفة أو العميل أو الفرصة التي تستحقها.

          </p>

          {/* CTA Card */}

          <div className="relative mt-16 overflow-hidden rounded-[36px] border border-pink-100 bg-white p-10 shadow-[0_25px_70px_rgba(233,107,138,.10)]">

            <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8FB] via-white to-[#FFF1F5]" />

            <div className="relative">

              <h3 className="text-3xl font-black leading-[1.7] text-[#151827]">

                ابدأ ببناء مسارك المهني

                <span className="text-[#E96B8A]">

                  {" "}بشكل صحيح.

                </span>

              </h3>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-[2] text-gray-600">

                الخطوة الأولى ليست أن تتعلم أكثر...

                <br />

                بل أن تعرف

                <span className="font-bold text-[#E96B8A]">

                  {" "}ماذا تتعلم،

                </span>

                ولماذا،

                ومتى.

              </p>

              <motion.a
              href="https://forms.gle/PU3pBLc2oxFNPBtb8"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
               className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#E96B8A] px-10 py-5 text-xl font-bold text-white shadow-[0_20px_50px_rgba(233,107,138,.35)] transition hover:bg-[#d95d7d]"
                  >
                 ابدأ بتشخيص مسارك

               <ArrowRight size={22} />
               </motion.a>

              <p className="mt-8 text-gray-500">

                نساعدك على اتخاذ القرار الصحيح...

                خطوة بخطوة حتى تصل إلى فرصك الحقيقية.

              </p>

            </div>

          </div>

        </motion.div>

      </div>

    </section>

  );
}