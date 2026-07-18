"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { getCourseModules } from "@/lib/queries/courseContent";

type Module = any;

export default function ClientPathPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [modules, setModules] =
    useState<Module[]>([]);

  const [packageName, setPackageName] =
    useState("");

  const [enrollment, setEnrollment] =
    useState<any>(null);

  useEffect(() => {
    loadPath();
  }, []);

  async function loadPath() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      // جلب الاشتراك الفعال والمدفوع فقط
      const {
        data: activeEnrollment,
        error: enrollmentError,
      } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .eq("payment_status", "paid")
        .single();

      if (
        enrollmentError ||
        !activeEnrollment
      ) {
        router.replace("/client/packages");
        return;
      }

      setEnrollment(activeEnrollment);

      setPackageName(
        activeEnrollment.package_id
      );

      const content =
        await getCourseModules(
          activeEnrollment.package_id
        );

      setModules(content || []);
    } catch (error) {
      console.error(
        "Client Path Error:",
        error
      );

      router.replace("/client");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div
        className="
        flex
        min-h-screen
        items-center
        justify-center
        text-lg
        font-bold
        "
      >
        جاري تحميل مسارك التدريبي...
      </div>
    );
  }

  return (
    <main
      dir="rtl"
      className="
      min-h-screen
      bg-[#F8F9FC]
      p-8
      "
    >
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div
          className="
          rounded-[32px]
          bg-white
          p-8
          shadow-sm
          "
        >
          <h1 className="text-4xl font-black">
            مسارك التدريبي
          </h1>

          <p className="mt-3 text-gray-500">
            الباقة الحالية:
            {" "}
            {packageName}
          </p>

          {enrollment?.created_at && (
            <p className="mt-2 text-sm text-gray-400">
              تاريخ التفعيل:
              {" "}
              {new Date(
                enrollment.created_at
              ).toLocaleDateString("ar-SA")}
            </p>
          )}
        </div>

        {/* MODULES */}

        <div className="mt-10 space-y-8">

          {modules.length === 0 && (
            <div
              className="
              rounded-3xl
              bg-white
              p-10
              text-center
              shadow-sm
              "
            >
              لا يوجد محتوى متاح لهذه الباقة حالياً.
            </div>
          )}

          {modules.map((module) => (
            <div
              key={module.id}
              className="
              rounded-3xl
              bg-white
              p-8
              shadow-sm
              "
            >
              <h2 className="text-2xl font-black">
                {module.title}
              </h2>

              <p className="mt-3 text-gray-600">
                {module.description}
              </p>

              <div className="mt-8 space-y-4">

                {module.course_lessons?.map(
                  (lesson: any) => (
                    <div
                      key={lesson.id}
                      className="
                      rounded-2xl
                      border
                      border-gray-200
                      p-5
                      "
                    >
                      <h3 className="font-bold">
                        {lesson.title}
                      </h3>

                      {lesson.description && (
                        <p className="mt-2 text-gray-500">
                          {lesson.description}
                        </p>
                      )}

                      {lesson.video_url && (
                        <a
                          href={lesson.video_url}
                          target="_blank"
                          rel="noreferrer"
                          className="
                          mt-4
                          inline-block
                          font-bold
                          text-[#E96B8A]
                          "
                        >
                          مشاهدة الدرس
                        </a>
                      )}

                      {lesson.course_assignments
                        ?.length > 0 && (
                        <div className="mt-6">

                          <h4
                            className="
                            font-black
                            text-gray-900
                            "
                          >
                            الواجبات
                          </h4>

                          <ul className="mt-3 space-y-2">

                            {lesson.course_assignments.map(
                              (
                                assignment: any
                              ) => (
                                <li
                                  key={
                                    assignment.id
                                  }
                                  className="
                                  rounded-xl
                                  bg-gray-50
                                  p-3
                                  "
                                >
                                  •{" "}
                                  {
                                    assignment.title
                                  }
                                </li>
                              )
                            )}

                          </ul>
                        </div>
                      )}
                    </div>
                  )
                )}

              </div>
            </div>
          ))}

        </div>
      </div>
    </main>
  );
}