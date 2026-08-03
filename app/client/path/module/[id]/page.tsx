"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  ClipboardList,
  FileText,
  PlayCircle,
} from "lucide-react";
import { getModule, type CourseModule } from "@/lib/queries/courseContent";
import { getLessonFileSignedUrl } from "@/lib/storage";
import AssignmentSubmissionPanel from "./AssignmentSubmissionPanel";

const FONT_FAMILY = "'Almarai','Tajawal',sans-serif";
const BG = "#FDF2F6";
const BORDER = "#F3D6E2";
const BORDER_LIGHT = "#F8E7EE";
const TEXT = "#3D1220";
const TEXT_SOFT = "#8C6F78";
const DEFAULT_PACKAGE_COLOR = "#7A1F3D";

// بادئة بتحدد إن الفيديو مرفوع من الجهاز (مش رابط خارجي) — لازم تطابق
// نفس البادئة المستخدمة في صفحة الأدمن
const UPLOADED_VIDEO_PREFIX = "storage:";

// بيحوّل أي رابط يوتيوب (watch?v=... أو youtu.be/... أو shorts) لصيغة embed
function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    let videoId = "";

    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.replace("/", "");
    } else if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/shorts/")) {
        videoId = parsed.pathname.split("/shorts/")[1];
      } else {
        videoId = parsed.searchParams.get("v") ?? "";
      }
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

export default function ModulePage() {
  const params = useParams<{ id: string }>();
  const moduleId = params?.id as string | undefined;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [module, setModule] = useState<CourseModule | null>(null);
  const [openingVideoId, setOpeningVideoId] = useState<string | null>(null);
  // المحاضرة المفتوحة حاليًا — واحدة بس في المرة الواحدة (أكورديون)
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);

  useEffect(() => {
    loadModule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  async function loadModule() {
    setLoading(true);
    setError("");

    if (!moduleId) {
      setError("رابط الوحدة غير مكتمل، يُرجى العودة إلى مسارك التدريبي واختيار الوحدة من هناك");
      setLoading(false);
      return;
    }

    try {
      const data = await getModule(moduleId);
      setModule(data);
    } catch (err) {
      console.error("MODULE ERROR", err, "moduleId:", moduleId);
      setError("تعذّر الوصول إلى هذه الوحدة في الوقت الحالي");
    } finally {
      setLoading(false);
    }
  }

  // روابط الفيديوهات المرفوعة اللي اتجابت بالفعل (رابط موقّت لكل محاضرة) —
  // بمجرد ما نجيب الرابط، بنعرضه في وسم <video> جوه الصفحة نفسها
  const [uploadedVideoUrls, setUploadedVideoUrls] = useState<Record<string, string>>({});

  async function loadUploadedVideo(storagePath: string, lessonId: string) {
    setOpeningVideoId(lessonId);
    try {
      const url = await getLessonFileSignedUrl(storagePath, 60 * 30); // صالح لمدة نصف ساعة

      if (!url) {
        alert("تعذّر تحميل الفيديو، يُرجى المحاولة مرة أخرى");
        return;
      }

      setUploadedVideoUrls((prev) => ({ ...prev, [lessonId]: url }));
    } finally {
      setOpeningVideoId(null);
    }
  }

  function toggleLesson(lessonId: string) {
    setExpandedLessonId((prev) => {
      const next = prev === lessonId ? null : lessonId;
      // لو بنقفل المحاضرة، نشيل رابط الفيديو الموقّت بتاعها من الذاكرة
      if (prev && prev !== next) {
        setUploadedVideoUrls((urls) => {
          const { [prev]: _removed, ...rest } = urls;
          return rest;
        });
      }
      return next;
    });
  }

  const pkg = module?.packages;
  const accent = pkg?.color || DEFAULT_PACKAGE_COLOR;

  return (
    <main
      dir="rtl"
      className="min-h-screen px-6 py-14"
      style={{ backgroundColor: BG, color: TEXT, fontFamily: FONT_FAMILY }}
    >
      <div className="mx-auto max-w-4xl">
        <Link
          href="/client/path"
          className="mb-8 inline-flex items-center gap-2 text-sm font-black transition hover:gap-3"
          style={{ color: accent }}
        >
          <ArrowRight size={18} />
          العودة إلى مسارك التدريبي
        </Link>

        {loading && (
          <div className="flex flex-col items-center gap-4 py-24" style={{ color: TEXT_SOFT }}>
            <div
              className="h-10 w-10 animate-spin rounded-full border-4"
              style={{ borderColor: BORDER, borderTopColor: accent }}
            />
            جارٍ تحميل الوحدة...
          </div>
        )}

        {!loading && (error || !module) && (
          <div
            className="rounded-3xl border bg-white p-14 text-center shadow-[0_20px_60px_rgba(122,31,61,.08)]"
            style={{ borderColor: BORDER }}
          >
            <p className="text-lg font-bold" style={{ color: TEXT }}>
              {error || "لم يتم العثور على هذه الوحدة"}
            </p>
            <Link
              href="/client/path"
              className="mt-6 inline-flex items-center justify-center rounded-full px-8 py-3 font-black text-white transition"
              style={{ backgroundColor: accent }}
            >
              العودة إلى مسارك التدريبي
            </Link>
          </div>
        )}

        {!loading && !error && module && (
          <>
            <div
              className="overflow-hidden rounded-[32px] p-10 text-white sm:p-12"
              style={{ backgroundImage: `linear-gradient(135deg, ${TEXT} 0%, ${accent} 100%)` }}
            >
              <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-black backdrop-blur">
                {pkg ? `وحدة تدريبية ضمن ${pkg.title}` : "وحدة تدريبية"}
              </span>

              <h1 className="mt-6 text-4xl font-black leading-[1.4]">
                {module.title}
              </h1>

              {module.description && (
                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/85">
                  {module.description}
                </p>
              )}
            </div>

            {/* قائمة المحاضرات — أكورديون: كل محاضرة عنوان قابل للضغط،
                وبيفتح جواها الوصف والفيديو والواجب لما تتضغط */}
            <div className="mt-8 space-y-4">
              {(!module.course_lessons || module.course_lessons.length === 0) && (
                <div
                  className="rounded-3xl border bg-white p-10 text-center"
                  style={{ borderColor: BORDER, color: TEXT_SOFT }}
                >
                  لم تتم إضافة محاضرات إلى هذه الوحدة بعد
                </div>
              )}

              {module.course_lessons?.map((lesson, index) => {
                const isOpen = expandedLessonId === lesson.id;
                const hasExtras =
                  Boolean(lesson.video_url) ||
                  (lesson.lesson_resources && lesson.lesson_resources.length > 0) ||
                  (lesson.course_assignments && lesson.course_assignments.length > 0);

                return (
                  <div
                    key={lesson.id}
                    className="overflow-hidden rounded-[28px] border bg-white shadow-[0_10px_30px_rgba(122,31,61,.05)]"
                    style={{ borderColor: isOpen ? accent : BORDER }}
                  >
                    {/* رأس المحاضرة — الجزء القابل للضغط */}
                    <button
                      type="button"
                      onClick={() => toggleLesson(lesson.id)}
                      className="flex w-full items-center gap-4 p-6 text-right transition"
                    >
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-black"
                        style={{ backgroundColor: BG, color: accent }}
                      >
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-black" style={{ color: TEXT }}>
                          المحاضرة {index + 1}: {lesson.title}
                        </h3>
                        {!isOpen && lesson.description && (
                          <p className="mt-1 truncate text-sm" style={{ color: TEXT_SOFT }}>
                            {lesson.description}
                          </p>
                        )}
                      </div>

                      <ChevronDown
                        size={20}
                        className="shrink-0 transition-transform"
                        style={{
                          color: accent,
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    </button>

                    {/* محتوى المحاضرة — بيظهر بس لو مفتوحة */}
                    {isOpen && (
                      <div className="px-6 pb-6">
                        {lesson.description && (
                          <p
                            className="mb-5 border-t pt-5 leading-7"
                            style={{ borderColor: BORDER_LIGHT, color: "#6B5560" }}
                          >
                            {lesson.description}
                          </p>
                        )}

                        {/* فيديو المحاضرة الرئيسي — يتعرض جوه الصفحة نفسها دايمًا، من غير فتح أي تاب جديد */}
                        {lesson.video_url && (
                          <div className="mb-5 border-t pt-5" style={{ borderColor: BORDER_LIGHT }}>
                            {lesson.video_url.startsWith(UPLOADED_VIDEO_PREFIX) ? (
                              uploadedVideoUrls[lesson.id] ? (
                                <div className="overflow-hidden rounded-2xl bg-black" style={{ aspectRatio: "16 / 9" }}>
                                  <video
                                    src={uploadedVideoUrls[lesson.id]}
                                    controls
                                    controlsList="nodownload"
                                    autoPlay
                                    className="h-full w-full"
                                  >
                                    متصفحك لا يدعم تشغيل الفيديو
                                  </video>
                                </div>
                              ) : (
                                <button
                                  onClick={() =>
                                    loadUploadedVideo(
                                      lesson.video_url!.replace(UPLOADED_VIDEO_PREFIX, ""),
                                      lesson.id
                                    )
                                  }
                                  disabled={openingVideoId === lesson.id}
                                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-right font-bold transition disabled:opacity-60"
                                  style={{ backgroundColor: BG, color: TEXT }}
                                >
                                  <PlayCircle size={20} className="shrink-0" style={{ color: accent }} />
                                  <span className="flex-1">تشغيل فيديو المحاضرة</span>
                                  {openingVideoId === lesson.id && (
                                    <span className="text-xs" style={{ color: TEXT_SOFT }}>
                                      جارٍ التحميل...
                                    </span>
                                  )}
                                </button>
                              )
                            ) : getYoutubeEmbedUrl(lesson.video_url) ? (
                              <div className="overflow-hidden rounded-2xl" style={{ aspectRatio: "16 / 9" }}>
                                <iframe
                                  src={getYoutubeEmbedUrl(lesson.video_url)!}
                                  title={lesson.title}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="h-full w-full"
                                />
                              </div>
                            ) : (
                              <a
                                href={lesson.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-right font-bold transition"
                                style={{ backgroundColor: BG, color: TEXT }}
                              >
                                <PlayCircle size={20} className="shrink-0" style={{ color: accent }} />
                                <span className="flex-1">مشاهدة فيديو المحاضرة</span>
                              </a>
                            )}
                          </div>
                        )}

                        {/* الموارد الإضافية (ملفات / يوتيوب) */}
                        {lesson.lesson_resources && lesson.lesson_resources.length > 0 && (
                          <div className="mb-5 space-y-2 border-t pt-5" style={{ borderColor: BORDER_LIGHT }}>
                            {lesson.lesson_resources.map((resource) => (
                              <a
                                key={resource.id}
                                href={resource.url ?? "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-right font-bold transition"
                                style={{ backgroundColor: BG, color: TEXT }}
                              >
                                <FileText size={18} className="shrink-0" style={{ color: accent }} />
                                <span className="flex-1 truncate">{resource.title}</span>
                              </a>
                            ))}
                          </div>
                        )}

                        {/* التكليفات — كل واحد فيه لوحة تسليم الواجب تحته مباشرة */}
                        {lesson.course_assignments && lesson.course_assignments.length > 0 && (
                          <div className="space-y-4 border-t pt-5" style={{ borderColor: BORDER_LIGHT }}>
                            <p className="text-xs font-black" style={{ color: TEXT_SOFT }}>
                              التكليفات المطلوبة
                            </p>
                            {lesson.course_assignments.map((assignment) => (
                              <div
                                key={assignment.id}
                                className="rounded-2xl border px-4 py-4"
                                style={{ borderColor: BORDER }}
                              >
                                <div className="flex items-start gap-3">
                                  <ClipboardList size={18} className="mt-0.5 shrink-0" style={{ color: accent }} />
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-bold" style={{ color: TEXT }}>
                                      {assignment.title}
                                    </h4>
                                    {assignment.description && (
                                      <p className="mt-1 text-sm leading-6" style={{ color: "#6B5560" }}>
                                        {assignment.description}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <AssignmentSubmissionPanel assignmentId={assignment.id} />
                              </div>
                            ))}
                          </div>
                        )}

                        {!hasExtras && (
                          <div
                            className="flex items-center gap-2 border-t pt-5 text-xs font-bold"
                            style={{ borderColor: BORDER_LIGHT, color: TEXT_SOFT }}
                          >
                            <FileText size={14} />
                            لا يتوفر محتوى إضافي لهذه المحاضرة بعد
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}