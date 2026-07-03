"use client";

import { useState } from "react";
import useMasonry from "@/utils/useMasonry";
import Image, { StaticImageData } from "next/image";
import { User, UserRound } from "lucide-react";

/* Images (تبقى كما هي) */
import TestimonialImg01 from "@/public/images/testimonial-01.jpg";
import TestimonialImg02 from "@/public/images/testimonial-04.jpg";
import TestimonialImg03 from "@/public/images/testimonial-03.jpg";
import TestimonialImg04 from "@/public/images/testimonial-04.jpg";

/* Logos */
import ClientImg01 from "@/public/images/client-logo-01.svg";
import ClientImg02 from "@/public/images/client-logo-02.svg";
import ClientImg03 from "@/public/images/client-logo-03.svg";
import ClientImg04 from "@/public/images/client-logo-04.svg";

const testimonials = [
  {
    img: TestimonialImg01,
    clientImg: ClientImg01,
    name: "عبدالله م.",
    gender: "male",
    company: "نظام شغف",
    content: "كنت أتعلم كثير… لكن بدون اتجاه. الآن عندي وضوح كامل لأول مرة.",
    categories: ["web", "ecommerce"],
  },
  {
    img: TestimonialImg02,
    clientImg: ClientImg02,
    name: "سارة أ.",
    gender: "female",
    company: "نظام شغف",
    content: "المشكلة ما كانت مهارات… المشكلة كنت أبدأ من المكان الغلط.",
    categories: ["web"],
  },
  {
    img: TestimonialImg03,
    clientImg: ClientImg03,
    name: "محمد ك.",
    gender: "male",
    company: "نظام شغف",
    content: "خرجت من دائرة الكورسات وبديت أخيرًا أشتغل على خطة واضحة.",
    categories: ["ecommerce"],
  },
  {
    img: TestimonialImg04,
    clientImg: ClientImg04,
    name: "نورة ف.",
    gender: "female",
    company: "نظام شغف",
    content: "أول مرة أحس أن عندي طريق… مو مجرد تعلم عشوائي.",
    categories: ["enterprise"],
  },
];

export default function Testimonials() {
  const masonryContainer = useMasonry();

  const [category, setCategory] = useState<
    "all" | "web" | "ecommerce" | "enterprise"
  >("all");

  const filteredTestimonials =
    category === "all"
      ? testimonials
      : testimonials.filter((t) => t.categories.includes(category));

  const categories = [
    { id: "all", label: "الكل" },
    { id: "web", label: "وضوح الاتجاه" },
    { id: "ecommerce", label: "بداية التنفيذ" },
    { id: "enterprise", label: "جاهزية مهنية" },
  ];

  return (
    <section className="bg-[#FFF8FB]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">

        {/* HEADER */}
        <div className="mx-auto max-w-3xl text-center pb-12">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            نتائج حقيقية من نظام شغف
          </h2>

          <p className="mt-3 text-lg text-[#E96B8A]">
            من الضياع… إلى أول خطوة واضحة
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex justify-center pb-12">
          <div className="flex flex-wrap gap-2 rounded-2xl bg-white/70 border border-pink-100 p-2 backdrop-blur">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id as any)}
                className={`rounded-full px-4 py-1 text-sm transition ${
                  category === cat.id
                    ? "bg-[#E96B8A] text-white"
                    : "text-gray-500 hover:text-[#E96B8A]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* CARDS */}
        <div
          ref={masonryContainer}
          className="mx-auto grid max-w-sm gap-6 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredTestimonials.map((t, index) => (
            <Testimonial key={index} testimonial={t} />
          ))}
        </div>

      </div>
    </section>
  );
}

/* CARD */
function Testimonial({
  testimonial,
}: {
  testimonial: {
    img: StaticImageData;
    clientImg: StaticImageData;
    name: string;
    gender: "male" | "female";
    company: string;
    content: string;
  };
}) {
  return (
    <article className="rounded-2xl bg-white/80 border border-pink-100 p-5 shadow-sm transition hover:scale-[1.01]">

      {/* الصورة الأصلية كما هي (لم نحذفها) */}
      <div className="mb-4 overflow-hidden rounded-xl">
        <Image
          src={testimonial.img}
          alt={testimonial.name}
          className="w-full h-auto object-cover"
        />
      </div>

      <p className="text-gray-600 leading-relaxed">
        “{testimonial.content}”
      </p>

      {/* الاسم + أيقونة الجنس */}
      <div className="mt-4 flex items-center gap-3">

        {/* ICON (ولد / بنت) */}
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50 border border-pink-100">
          {testimonial.gender === "female" ? (
            <UserRound className="w-5 h-5 text-[#E96B8A]" />
          ) : (
            <User className="w-5 h-5 text-[#E96B8A]" />
          )}
        </div>

        <div className="text-sm">
          <div className="text-gray-900 font-medium">
            {testimonial.name}
          </div>
          <div className="text-[#E96B8A] text-xs">
            {testimonial.company}
          </div>
        </div>
      </div>
    </article>
  );
}