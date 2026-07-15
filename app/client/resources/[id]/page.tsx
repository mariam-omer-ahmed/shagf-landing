"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
} from "lucide-react";

type Resource = {
  id: string;
  title: string;
  description: string;
  file_url: string;
  thumbnail: string;
  is_active: boolean;
  created_at: string;
};

export default function ResourceViewerPage() {
  const params = useParams();
  const router = useRouter();

  const [resource, setResource] =
    useState<Resource | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (params.id) {
      loadResource();
    }
  }, [params.id]);

  async function loadResource() {
    const { data, error } =
      await supabase
        .from("free_resources")
        .select("*")
        .eq("id", params.id)
        .single();

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setResource(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        text-xl
        font-black
        text-black
      "
      >
        جاري تحميل المصدر...
      </div>
    );
  }

  if (!resource) {
    return (
      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        text-xl
        font-black
        text-black
      "
      >
        المصدر غير موجود
      </div>
    );
  }

  return (
    <main
      dir="rtl"
      className="
      min-h-screen
      bg-[#F8F9FC]
      pb-20
      "
    >
      <div
        className="
        mx-auto
        max-w-7xl
        px-6
        py-10
        "
      >
        {/* BACK BUTTON */}

        <button
          onClick={() => router.back()}
          className="
          mb-8
          flex
          items-center
          gap-2
          rounded-2xl
          border
          border-gray-200
          bg-white
          px-5
          py-3
          font-bold
          text-black
          shadow-sm
          transition
          hover:shadow-md
          "
        >
          <ArrowRight size={18} />
          العودة للمكتبة
        </button>

        {/* HEADER */}

        <div
          className="
          rounded-[36px]
          bg-white
          p-8
          shadow-sm
          "
        >
          <div
            className="
            flex
            flex-wrap
            items-center
            gap-3
            "
          >
            <div
              className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-[#FFF1F6]
              "
            >
              <BookOpen
                className="
                text-[#E96B8A]
                "
              />
            </div>

            <div>
              <p
                className="
                text-sm
                font-bold
                text-[#E96B8A]
                "
              >
                مكتبة شغف التعليمية
              </p>

              <h1
                className="
                mt-1
                text-4xl
                md:text-5xl
                font-black
                text-black
                leading-tight
                "
              >
                {resource.title}
              </h1>
            </div>
          </div>

          <div
            className="
            mt-5
            flex
            items-center
            gap-2
            text-gray-500
            "
          >
            <CalendarDays size={18} />

            <span className="font-medium">
              {new Date(
                resource.created_at
              ).toLocaleDateString("ar-SA")}
            </span>
          </div>

          {resource.description && (
            <p
              className="
              mt-8
              max-w-4xl
              text-xl
              leading-[2.2]
              font-medium
              text-gray-700
              "
            >
              {resource.description}
            </p>
          )}
        </div>

        {/* COVER */}

        <div
          className="
          mt-8
          overflow-hidden
          rounded-[36px]
          bg-white
          shadow-sm
          "
        >
          {resource.thumbnail ? (
            <img
              src={resource.thumbnail}
              alt={resource.title}
              className="
              h-[500px]
              w-full
              object-cover
              "
            />
          ) : (
            <div
              className="
              flex
              h-[320px]
              items-center
              justify-center
              bg-[#FFF6F9]
              "
            >
              <BookOpen
                size={100}
                className="
                text-[#E96B8A]
                "
              />
            </div>
          )}
        </div>

        {/* PDF VIEWER */}

        <div
          className="
          mt-8
          overflow-hidden
          rounded-[36px]
          bg-white
          shadow-sm
          "
        >
          <div
            className="
            border-b
            border-gray-100
            px-8
            py-6
            "
          >
            <h2
              className="
              text-3xl
              font-black
              text-black
              "
            >
              قراءة المصدر
            </h2>

            <p
              className="
              mt-2
              text-gray-500
              "
            >
              يمكنك تصفح الملف مباشرة دون تحميله
            </p>
          </div>

          <iframe
            src={`${resource.file_url}#toolbar=0&navpanes=0`}
            title={resource.title}
            className="
            h-[1300px]
            w-full
            border-0
            "
          />
        </div>
      </div>
    </main>
  );
}