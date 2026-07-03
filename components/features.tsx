import Image from "next/image";
import BlurredShapeGray from "@/public/images/blurred-shape-gray.svg";
import BlurredShape from "@/public/images/blurred-shape.svg";
import FeaturesImage from "@/public/images/features.png";

export default function Features() {
  return (
    <section className="relative bg-[#FFF8FB]">

      {/* Background shapes */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 -mt-20 -translate-x-1/2 opacity-40"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={BlurredShapeGray}
          width={760}
          height={668}
          alt="Blurred shape"
        />
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-80 -translate-x-[120%] opacity-30"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={BlurredShape}
          width={760}
          height={668}
          alt="Blurred shape"
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t border-pink-100 py-12 md:py-20">

          {/* Header */}
          <div className="mx-auto max-w-3xl pb-4 text-center md:pb-12">

            <div className="inline-flex items-center gap-3 pb-3
              before:h-px before:w-8 before:bg-pink-200/40
              after:h-px after:w-8 after:bg-pink-200/40">

              <span className="bg-gradient-to-r from-[#E96B8A] to-pink-300 bg-clip-text text-transparent">
                نظام شغف
              </span>
            </div>

            <h2 className="animate-[gradient_6s_linear_infinite]
              bg-[linear-gradient(to_right,#E96B8A,#fda4af,#E96B8A)]
              bg-[length:200%_auto] bg-clip-text pb-4
              font-nacelle text-3xl font-semibold text-transparent md:text-4xl">

              من الضياع المهني → إلى أول نتيجة حقيقية في السوق
            </h2>

            <p className="text-lg text-gray-600">
              بدل سنوات من التجربة العشوائية… النظام يحدد لك المسار، ويربط التعلم مباشرة بنتائج عملية ودخل حقيقي.
            </p>
          </div>

          {/* Image */}
          <div className="flex justify-center pb-4 md:pb-12" data-aos="fade-up">
            <Image
              className="max-w-none"
              src={FeaturesImage}
              width={1104}
              height={384}
              alt="Shaghaf System"
            />
          </div>

          {/* Items */}
          <div className="mx-auto grid max-w-sm gap-12 sm:max-w-none sm:grid-cols-2 md:gap-x-14 md:gap-y-16 lg:grid-cols-3">

            {/* ITEM 1 */}
            <article>
              <svg className="mb-3 fill-[#E96B8A]" width={24} height={24} viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="mb-1 font-semibold text-gray-900">
                تشخيص اتجاهك الحقيقي
              </h3>
              <p className="text-gray-600">
                نحدد لك المجال المناسب بناءً على مهاراتك وشخصيتك بدل التخبط بين المسارات.
              </p>
            </article>

            {/* ITEM 2 */}
            <article>
              <svg className="mb-3 fill-[#E96B8A]" width={24} height={24} viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="mb-1 font-semibold text-gray-900">
                خطة تنفيذ أسبوعية واضحة
              </h3>
              <p className="text-gray-600">
                تعرف بالضبط ماذا تفعل كل أسبوع بدون ضياع أو محتوى زائد.
              </p>
            </article>

            {/* ITEM 3 */}
            <article>
              <svg className="mb-3 fill-[#E96B8A]" width={24} height={24} viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="mb-1 font-semibold text-gray-900">
                بناء هوية مهنية قوية
              </h3>
              <p className="text-gray-600">
                نحول مهاراتك إلى بروفايل وملف أعمال يجذب الفرص بدل ما تبحث عنها.
              </p>
            </article>

            {/* ITEM 4 */}
            <article>
              <svg className="mb-3 fill-[#E96B8A]" width={24} height={24} viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="mb-1 font-semibold text-gray-900">
                دخول فعلي للسوق
              </h3>
              <p className="text-gray-600">
                خطوات تطبيق مباشرة للحصول على أول وظيفة أو أول عميل مدفوع.
              </p>
            </article>

            {/* ITEM 5 */}
            <article>
              <svg className="mb-3 fill-[#E96B8A]" width={24} height={24} viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="mb-1 font-semibold text-gray-900">
                نظام متابعة يمنع التوقف
              </h3>
              <p className="text-gray-600">
                دعم مستمر يعيدك للمسار كلما توقفت أو فقدت الاتجاه.
              </p>
            </article>

            {/* ITEM 6 */}
            <article>
              <svg className="mb-3 fill-[#E96B8A]" width={24} height={24} viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="mb-1 font-semibold text-gray-900">
                نتائج ملموسة خلال أسابيع
              </h3>
              <p className="text-gray-600">
                طلابنا بدأوا يحصلون على أول دخل، وظائف، أو عملاء خلال أول شهر من التطبيق.
              </p>
            </article>

          </div>
        </div>
      </div>
    </section>
  );
}