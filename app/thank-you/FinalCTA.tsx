"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

const WHATSAPP =
  "https://wa.me/249963370737?text=مرحبًا، أنهيت فلتر نظام شغف وأريد معرفة الخطوة المناسبة لي.";

export default function FinalCTA() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#FFF8FB] to-white">

      <div className="mx-auto max-w-5xl">

        {/* القرار */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="rounded-[40px] bg-[#1B1B1B] p-10 md:p-16 text-white overflow-hidden relative"
        >
          {/* Glow */}
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#E96B8A]/20 blur-[140px]" />

          <div className="relative z-10">

            <span className="inline-block rounded-full bg-[#E96B8A]/20 px-5 py-2 text-sm font-bold text-pink-200">
              القرار الأخير
            </span>

            <h2 className="mt-8 text-4xl md:text-6xl font-black leading-tight">

              بعد هذه الصفحة...

              <br />

              لن يبقى أمامك سوى خيارين.

            </h2>

            <div className="mt-12 grid gap-6 md:grid-cols-2">

              {/* الخيار الأول */}
              <div className="rounded-3xl border border-red-400/20 bg-white/5 p-8">

                <h3 className="text-2xl font-black text-red-300">

                  الخيار الأول

                </h3>

                <p className="mt-5 leading-9 text-gray-300">

                  تغلق الصفحة الآن...

                  <br /><br />

                  ثم تعود غدًا للبحث عن دورة جديدة.

                  <br /><br />

                  أو مشاهدة فيديو جديد.

                  <br /><br />

                  أو تغيير المجال مرة أخرى.

                  <br /><br />

                  وبعد ثلاثة أشهر ستكون في نفس المكان...

                  لكن بعمر أكبر،
                  وحماس أقل،
                  وثقة أضعف.

                </p>

              </div>

              {/* الخيار الثاني */}
              <div className="rounded-3xl border border-[#E96B8A]/40 bg-gradient-to-b from-[#E96B8A]/15 to-transparent p-8">

                <h3 className="text-2xl font-black text-pink-300">

                  الخيار الثاني

                </h3>

                <p className="mt-5 leading-9 text-gray-200">

                  تبدأ بخطوة واحدة فقط.

                  <br /><br />

                  تتحدث مع فريق شغف.

                  <br /><br />

                  نفهم وضعك الحقيقي.

                  <br /><br />

                  نخبرك بصراحة إن كان النظام مناسبًا لك أم لا.

                  <br /><br />

                  وإذا كان مناسبًا...

                  تبدأ تنفيذ خطة واضحة بدل التخمين.

                </p>

              </div>

            </div>

            {/* الاقتباس */}
            <div className="mt-14 rounded-3xl bg-white/5 border border-white/10 p-8">

              <p className="text-2xl leading-loose font-bold text-center">

                لا يوجد قرار بلا مخاطرة...

                <br />

                لكن هناك مخاطرة واحدة أثبتت فشلها دائمًا.

              </p>

              <p className="mt-6 text-center text-4xl font-black text-[#E96B8A]">

                وهي أن تبقى كما أنت.

              </p>

            </div>

            {/* CTA */}

            <div className="mt-16 text-center">

              <motion.a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: .98,
                }}
                className="inline-flex items-center gap-4 rounded-full bg-[#E96B8A] px-14 py-6 text-2xl font-black shadow-[0_25px_60px_rgba(233,107,138,.35)]"
              >
                <MessageCircle size={28} />

                أريد أن أعرف إن كان نظام شغف مناسبًا لي

                <ArrowRight size={26} />
              </motion.a>

              <p className="mt-6 text-gray-400 leading-8">

                لن يطلب منك أحد الدفع قبل أن يفهم حالتك بالكامل.

                <br />

                وإذا رأينا أن النظام لن يفيدك فلن ننصحك بالاشتراك.

              </p>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}