"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  File as FileIcon,
  FileText,
  PlayCircle,
  Video,
  X,
} from "lucide-react";
import { getModule, type CourseModule } from "@/lib/queries/courseContent";
import { getLessonFileSignedUrl } from "@/lib/storage";
import { getCompletedModuleIds, markModuleComplete, unmarkModuleComplete } from "@/lib/queries/progress";
import { supabase } from "@/lib/supabase";
import AssignmentSubmissionPanel from "./AssignmentSubmissionPanel";

const FONT_FAMILY = "'Almarai','Tajawal',sans-serif";
// أسود صريح للنصوص الأساسية — مش رمادي باهت
const INK = "#0B0608";
const INK_SOFT = "#3A2A2E";
const DEFAULT_ACCENT = "#7A1F3D";

const UPLOADED_VIDEO_PREFIX = "storage:";

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace("www.", "");

    let videoId: string | null = null;

    if (host === "youtu.be") {
      videoId = parsed.pathname.slice(1);
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        videoId = parsed.searchParams.get("v");
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.split("/embed/")[1];
      } else if (parsed.pathname.startsWith("/shorts/")) {
        videoId = parsed.pathname.split("/shorts/")[1];
      }
    }

    if (!videoId) return null;
    videoId = videoId.split("?")[0].split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}

type ActivePlayer =
  | { key: string; kind: "youtube"; embedUrl: string }
  | { key: string; kind: "file"; signedUrl: string };

export default function ModulePage() {
  const params = useParams<{ id: string }>();
  const moduleId = params?.id as string | undefined;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [module, setModule] = useState<CourseModule | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [activePlayer, setActivePlayer] = useState<ActivePlayer | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [togglingComplete, setTogglingComplete] = useState(false);

  useEffect(() => {
    loadModule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  async function loadModule() {
    setLoading(true);
    setError("");

    if (!moduleId) {
      setError("تعذّر فتح هذه الوحدة. عد إلى مسارك التدريبي ثم أعد المحاولة.");
      setLoading(false);
      return;
    }

    try {
      const data = await getModule(moduleId);
      setModule(data);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        const completedIds = await getCompletedModuleIds(user.id);
        setIsCompleted(data ? completedIds.has(data.id) : false);
      }
    } catch (err) {
      console.error("MODULE ERROR", err, "moduleId:", moduleId);
      setError("تعذّر تحميل محتوى الوحدة حاليًا. أعد المحاولة بعد قليل.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleCompletion() {
    if (!userId || !module) return;

    setTogglingComplete(true);
    try {
      if (isCompleted) {
        await unmarkModuleComplete(userId, module.id);
        setIsCompleted(false);
      } else {
        await markModuleComplete(userId, module.id);
        setIsCompleted(true);
      }
    } catch (err) {
      console.error("Toggle completion error:", err);
      alert("تعذّر حفظ تقدمك في هذه الوحدة. أعد المحاولة.");
    } finally {
      setTogglingComplete(false);
    }
  }

  async function playVideoInline(videoUrl: string, key: string) {
    if (activePlayer?.key === key) {
      setActivePlayer(null);
      return;
    }

    if (videoUrl.startsWith(UPLOADED_VIDEO_PREFIX)) {
      setOpeningId(key);
      try {
        const path = videoUrl.replace(UPLOADED_VIDEO_PREFIX, "");
        const url = await getLessonFileSignedUrl(path);
        if (url) {
          setActivePlayer({ key, kind: "file", signedUrl: url });
        } else {
          alert("تعذّر تشغيل هذا الفيديو. أعد المحاولة.");
        }
      } finally {
        setOpeningId(null);
      }
      return;
    }

    const embedUrl = getYoutubeEmbedUrl(videoUrl);
    if (embedUrl) {
      setActivePlayer({ key, kind: "youtube", embedUrl });
    } else {
      window.open(videoUrl, "_blank", "noopener,noreferrer");
    }
  }

  async function openResourceFile(storagePath: string, key: string) {
    setOpeningId(key);
    try {
      const url = await getLessonFileSignedUrl(storagePath);
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        alert("تعذّر فتح هذا الملف.");
      }
    } finally {
      setOpeningId(null);
    }
  }

  const pkg = module?.packages;
  const accent = pkg?.color || DEFAULT_ACCENT;

  const totalLessons = module?.course_lessons?.length ?? 0;
  const totalAssignments =
    module?.course_lessons?.reduce((s, l) => s + (l.course_assignments?.length ?? 0), 0) ?? 0;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#FDF2F6] px-6 py-14"
      style={{ fontFamily: FONT_FAMILY, color: INK }}
    >
      <div className="mx-auto max-w-4xl">
        <Link
          href="/client/path"
          className="mb-8 inline-flex items-center gap-2 text-sm font-black transition hover:gap-3"
          style={{ color: accent }}
        >
          <ArrowRight size={18} />
          العودة إلى المسار التدريبي
        </Link>

        {loading && (
          <div className="flex flex-col items-center gap-4 py-24" style={{ color: INK_SOFT }}>
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F3D6E2]" style={{ borderTopColor: accent }} />
            <p className="font-bold" style={{ color: INK }}>جارٍ تحميل محتوى الوحدة...</p>
          </div>
        )}

        {!loading && (error || !module) && (
          <div className="rounded-3xl border border-[#F3D6E2] bg-white p-14 text-center shadow-[0_20px_60px_rgba(122,31,61,.08)]">
            <p className="text-lg font-bold" style={{ color: INK }}>
              {error || "هذه الوحدة غير متاحة حاليًا."}
            </p>
            <Link
              href="/client/path"
              className="mt-6 inline-flex items-center justify-center rounded-full px-8 py-3 font-black text-white transition"
              style={{ backgroundColor: accent }}
            >
              العودة إلى المسار التدريبي
            </Link>
          </div>
        )}

        {!loading && !error && module && (
          <>
            {/* HERO — يبيع قيمة الوحدة قبل ما الطالب يبدأ فيها */}
            <div
              className="overflow-hidden rounded-[32px] p-10 text-white sm:p-12"
              style={{ backgroundImage: `linear-gradient(135deg, #1A0A10 0%, ${accent} 130%)` }}
            >
              <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-black backdrop-blur">
                {pkg ? `وحدة تدريبية ضمن ${pkg.title}` : "وحدة تدريبية"}
              </span>

              <h1 className="mt-6 text-3xl font-black leading-[1.4] sm:text-4xl">
                {module.title}
              </h1>

              {module.description && (
                <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-white">
                  {module.description}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold">
                <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                  <FileText size={14} />
                  {totalLessons} محاضرة
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                  <ClipboardList size={14} />
                  {totalAssignments} تكليف عملي
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {(!module.course_lessons || module.course_lessons.length === 0) && (
                <div className="rounded-3xl border border-[#F3D6E2] bg-white p-10 text-center font-medium" style={{ color: INK_SOFT }}>
                  لم يُضف أي محتوى تعليمي إلى هذه الوحدة حتى الآن.
                </div>
              )}

              {module.course_lessons?.map((lesson, index) => {
                const mainVideoKey = `main-${lesson.id}`;
                const isMainVideoOpen = activePlayer?.key === mainVideoKey;

                return (
                  <div
                    key={lesson.id}
                    className="rounded-[28px] border border-[#F3D6E2] bg-white p-7 shadow-[0_10px_30px_rgba(122,31,61,.05)]"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-black"
                        style={{ backgroundColor: "#FDF2F6", color: accent }}
                      >
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-black" style={{ color: INK }}>{lesson.title}</h3>
                        {lesson.description && (
                          <p className="mt-1.5 text-sm font-medium leading-7" style={{ color: INK_SOFT }}>
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* فيديو المحاضرة الرئيسي — يتعرض داخل الصفحة نفسها */}
                    {lesson.video_url && (
                      <div className="mt-5 border-t border-[#F8E7EE] pt-5">
                        <button
                          onClick={() => playVideoInline(lesson.video_url as string, mainVideoKey)}
                          disabled={openingId === mainVideoKey}
                          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-right font-bold transition disabled:opacity-60"
                          style={{ backgroundColor: "#FDF2F6", color: INK }}
                        >
                          {isMainVideoOpen ? (
                            <X size={20} className="shrink-0" style={{ color: accent }} />
                          ) : (
                            <PlayCircle size={20} className="shrink-0" style={{ color: accent }} />
                          )}
                          <span className="flex-1 truncate">
                            {isMainVideoOpen ? "إغلاق الفيديو" : "فيديو المحاضرة"}
                          </span>
                          {openingId === mainVideoKey && (
                            <span className="text-xs font-medium" style={{ color: INK_SOFT }}>جارٍ التحميل...</span>
                          )}
                        </button>

                        {isMainVideoOpen && activePlayer && (
                          <div className="mt-3 overflow-hidden rounded-2xl bg-black">
                            {activePlayer.kind === "youtube" ? (
                              <div className="relative aspect-video w-full">
                                <iframe
                                  src={activePlayer.embedUrl}
                                  title={lesson.title}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="absolute inset-0 h-full w-full"
                                />
                              </div>
                            ) : (
                              <video
                                src={activePlayer.signedUrl}
                                controls
                                autoPlay
                                className="max-h-[480px] w-full"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* مصادر إضافية */}
                    {lesson.lesson_resources && lesson.lesson_resources.length > 0 && (
                      <div className="mt-3 space-y-2 border-t border-[#F8E7EE] pt-5">
                        <p className="text-xs font-black" style={{ color: INK_SOFT }}>مصادر إضافية</p>
                        {lesson.lesson_resources.map((resource) => {
                          const key = `res-${resource.id}`;
                          const isOpen = activePlayer?.key === key;
                          const isVideoResource = resource.resource_type === "youtube";

                          return (
                            <div key={resource.id}>
                              <button
                                onClick={() => {
                                  if (isVideoResource && resource.url) {
                                    playVideoInline(resource.url, key);
                                  } else if (resource.storage_path) {
                                    openResourceFile(resource.storage_path, key);
                                  }
                                }}
                                disabled={openingId === key}
                                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-right font-bold transition disabled:opacity-60"
                                style={{ backgroundColor: "#FDF2F6", color: INK }}
                              >
                                {isVideoResource ? (
                                  isOpen ? (
                                    <X size={18} className="shrink-0" style={{ color: accent }} />
                                  ) : (
                                    <Video size={18} className="shrink-0" style={{ color: accent }} />
                                  )
                                ) : (
                                  <FileIcon size={18} className="shrink-0" style={{ color: accent }} />
                                )}
                                <span className="flex-1 truncate">{resource.title}</span>
                                {openingId === key && (
                                  <span className="text-xs font-medium" style={{ color: INK_SOFT }}>جارٍ الفتح...</span>
                                )}
                              </button>

                              {isOpen && activePlayer && activePlayer.key === key && (
                                <div className="mt-3 overflow-hidden rounded-2xl bg-black">
                                  {activePlayer.kind === "youtube" ? (
                                    <div className="relative aspect-video w-full">
                                      <iframe
                                        src={activePlayer.embedUrl}
                                        title={resource.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute inset-0 h-full w-full"
                                      />
                                    </div>
                                  ) : (
                                    <video
                                      src={activePlayer.signedUrl}
                                      controls
                                      autoPlay
                                      className="max-h-[480px] w-full"
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* التكليفات — الواجب وتسليمه تحته مباشرة */}
                    {lesson.course_assignments && lesson.course_assignments.length > 0 && (
                      <div className="mt-5 space-y-4 border-t border-[#F8E7EE] pt-5">
                        <p className="text-xs font-black" style={{ color: INK_SOFT }}>
                          التكليف المطلوب — طبّق قبل الانتقال للمحاضرة التالية
                        </p>
                        {lesson.course_assignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            className="rounded-2xl border border-[#F3D6E2] px-4 py-4"
                          >
                            <div className="flex items-start gap-3">
                              <ClipboardList size={18} className="mt-0.5 shrink-0" style={{ color: accent }} />
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold" style={{ color: INK }}>{assignment.title}</h4>
                                {assignment.description && (
                                  <p className="mt-1 text-sm font-medium leading-6" style={{ color: INK_SOFT }}>
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

                    {!lesson.video_url &&
                      (!lesson.lesson_resources || lesson.lesson_resources.length === 0) &&
                      (!lesson.course_assignments || lesson.course_assignments.length === 0) && (
                        <div className="mt-5 flex items-center gap-2 border-t border-[#F8E7EE] pt-5 text-xs font-bold" style={{ color: INK_SOFT }}>
                          <FileText size={14} />
                          لا يتوفر محتوى إضافي لهذه المحاضرة بعد
                        </div>
                      )}
                  </div>
                );
              })}
            </div>

            {/* زر إنهاء الوحدة — يفتح الباقة التالية في المسار */}
            {userId && (
              <div className="mt-8 flex flex-col items-center gap-3">
                <button
                  onClick={toggleCompletion}
                  disabled={togglingComplete}
                  className={`flex items-center gap-2 rounded-2xl px-8 py-4 font-black transition disabled:opacity-60 ${
                    isCompleted
                      ? "border-2 border-green-300 bg-green-50 text-green-800"
                      : "text-white hover:-translate-y-0.5"
                  }`}
                  style={isCompleted ? {} : { backgroundColor: accent }}
                >
                  <CheckCircle2 size={20} />
                  {togglingComplete
                    ? "جارٍ التحديث..."
                    : isCompleted
                    ? "تم إنجاز هذه الوحدة — إلغاء الإنجاز"
                    : "أنجزت هذه الوحدة — انتقل للتالي"}
                </button>
                {!isCompleted && (
                  <p className="text-xs font-bold" style={{ color: INK_SOFT }}>
                    لا تنتقل قبل تنفيذ التكليف — التطبيق هو ما يصنع الفارق، لا المشاهدة وحدها.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}