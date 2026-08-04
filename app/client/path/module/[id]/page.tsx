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

// نفس البادئة المستخدمة في لوحة الأدمن للتفريق بين فيديو مرفوع من الجهاز
// (محتاج رابط موقّت من التخزين) ورابط خارجي عادي زي يوتيوب (يتعرض بإطار Iframe)
const UPLOADED_VIDEO_PREFIX = "storage:";

/**
 * تحويل أي شكل من روابط يوتيوب (watch?v=, youtu.be/, shorts/, embed/)
 * إلى رابط embed صالح للعرض جوه iframe. لو الرابط مش يوتيوب، بترجع null.
 */
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

// حالة مشغّل الفيديو المفتوح حاليًا (نوع + مصدر)
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
setError("تعذّر فتح هذه الوحدة. يُرجى العودة إلى مسارك التدريبي ثم إعادة المحاولة.");
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
setError("تعذّر تحميل محتوى الوحدة في الوقت الحالي. يُرجى إعادة المحاولة بعد قليل.");
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
alert("تعذّر حفظ تقدمك في هذه الوحدة. يُرجى إعادة المحاولة.");
    } finally {
      setTogglingComplete(false);
    }
  }

  // تشغيل فيديو (رئيسي أو من المصادر الإضافية) داخل الصفحة نفسها —
  // من غير ما نفتح أي تاب جديد أو ننتقل لموقع تاني
  async function playVideoInline(videoUrl: string, key: string) {
    // لو نفس الفيديو مفتوح بالفعل، نقفله (toggle)
    if (activePlayer?.key === key) {
      setActivePlayer(null);
      return;
    }

    if (videoUrl.startsWith(UPLOADED_VIDEO_PREFIX)) {
      // فيديو مرفوع من الجهاز: نجيب رابط موقّت من التخزين ونشغّله بعنصر <video> عادي
      setOpeningId(key);
      try {
        const path = videoUrl.replace(UPLOADED_VIDEO_PREFIX, "");
        const url = await getLessonFileSignedUrl(path);
        if (url) {
          setActivePlayer({ key, kind: "file", signedUrl: url });
        } else {
alert("تعذّر تشغيل المحتوى المرئي. يُرجى إعادة المحاولة.");
        }
      } finally {
        setOpeningId(null);
      }
      return;
    }

    // رابط خارجي — لو يوتيوب نعرضه بإطار مضمّن، غير كده نفتحه في تاب جديد
    // (لأن مواقع تانية غالبًا بترفض تتعرض جوه iframe لموقع تاني)
    const embedUrl = getYoutubeEmbedUrl(videoUrl);
    if (embedUrl) {
      setActivePlayer({ key, kind: "youtube", embedUrl });
    } else {
      window.open(videoUrl, "_blank", "noopener,noreferrer");
    }
  }

  // فتح ملف من ضمن "مصادر إضافية" للمحاضرة (ملف مش فيديو، زي PDF أو صورة)
  async function openResourceFile(storagePath: string, key: string) {
    setOpeningId(key);
    try {
      const url = await getLessonFileSignedUrl(storagePath);
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
alert("تعذّر فتح الملف المطلوب.");
      }
    } finally {
      setOpeningId(null);
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#FDF2F6] px-6 py-14 text-[#3D1220]"
      style={{ fontFamily: FONT_FAMILY }}
    >
      <div className="mx-auto max-w-4xl">
        <Link
          href="/client/path"
          className="mb-8 inline-flex items-center gap-2 text-sm font-black text-[#7A1F3D] transition hover:gap-3"
        >
          <ArrowRight size={18} />
العودة إلى المسار التدريبي        </Link>

        {loading && (
          <div className="flex flex-col items-center gap-4 py-24 text-[#8C6F78]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F3D6E2] border-t-[#7A1F3D]" />
جارٍ تحميل محتوى الوحدة...          </div>
        )}

        {!loading && (error || !module) && (
          <div className="rounded-3xl border border-[#F3D6E2] bg-white p-14 text-center shadow-[0_20px_60px_rgba(122,31,61,.08)]">
            <p className="text-lg font-bold text-[#3D1220]">
              {error || "هذه الوحدة غير متاحة حالياً."}
            </p>
            <Link
              href="/client/path"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#7A1F3D] px-8 py-3 font-black text-white transition hover:bg-[#611731]"
            >
              العودة إلى المسار التدريبي
            </Link>
          </div>
        )}

        {!loading && !error && module && (
          <>
            <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#3D1220] via-[#5E1F3A] to-[#7A1F3D] p-10 text-white sm:p-12">
              <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-black backdrop-blur">
وحدة تعليمية              </span>

              <h1 className="mt-6 text-4xl font-black leading-[1.4]">
                {module.title}
              </h1>

              {module.description && (
                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/85">
                  {module.description}
                </p>
              )}
            </div>

            <div className="mt-8 space-y-6">
              {(!module.course_lessons || module.course_lessons.length === 0) && (
                <div className="rounded-3xl border border-[#F3D6E2] bg-white p-10 text-center text-[#8C6F78]">
لم يُضف أي محتوى تعليمي إلى هذه الوحدة حتى الآن.                </div>
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
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FDF2F6] font-black text-[#7A1F3D]">
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-black text-[#3D1220]">{lesson.title}</h3>
                        {lesson.description && (
                          <p className="mt-1.5 text-sm leading-7 text-[#6B5560]">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* فيديو المحاضرة الرئيسي — بيتعرض جوه الصفحة نفسها */}
                    {lesson.video_url && (
                      <div className="mt-5 border-t border-[#F8E7EE] pt-5">
                        <button
                          onClick={() => playVideoInline(lesson.video_url as string, mainVideoKey)}
                          disabled={openingId === mainVideoKey}
                          className="flex w-full items-center gap-3 rounded-2xl bg-[#FDF2F6] px-4 py-3 text-right font-bold text-[#3D1220] transition hover:bg-[#F8E7EE] disabled:opacity-60"
                        >
                          {isMainVideoOpen ? (
                            <X size={20} className="shrink-0 text-[#7A1F3D]" />
                          ) : (
                            <PlayCircle size={20} className="shrink-0 text-[#7A1F3D]" />
                          )}
                          <span className="flex-1 truncate">
                            {isMainVideoOpen ? "إغلاق الفيديو" : "فيديو المحاضرة"}
                          </span>
                          {openingId === mainVideoKey && (
                            <span className="text-xs text-[#8C6F78]">جارٍ التحميل...</span>
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

                    {/* مصادر إضافية: ملفات أو روابط فيديو تانية */}
                    {lesson.lesson_resources && lesson.lesson_resources.length > 0 && (
                      <div className="mt-3 space-y-2 border-t border-[#F8E7EE] pt-5">
                        <p className="text-xs font-black text-[#8C6F78]">مصادر إضافية</p>
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
                                className="flex w-full items-center gap-3 rounded-2xl bg-[#FDF2F6] px-4 py-3 text-right font-bold text-[#3D1220] transition hover:bg-[#F8E7EE] disabled:opacity-60"
                              >
                                {isVideoResource ? (
                                  isOpen ? (
                                    <X size={18} className="shrink-0 text-[#7A1F3D]" />
                                  ) : (
                                    <Video size={18} className="shrink-0 text-[#7A1F3D]" />
                                  )
                                ) : (
                                  <FileIcon size={18} className="shrink-0 text-[#7A1F3D]" />
                                )}
                                <span className="flex-1 truncate">{resource.title}</span>
                                {openingId === key && (
                                  <span className="text-xs text-[#8C6F78]">جارٍ الفتح...</span>
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

                    {/* التكليفات — كل واحد فيه لوحة تسليم الواجب تحته مباشرة */}
                    {lesson.course_assignments && lesson.course_assignments.length > 0 && (
                      <div className="mt-5 space-y-4 border-t border-[#F8E7EE] pt-5">
                        <p className="text-xs font-black text-[#8C6F78]">
                          التكليفات المطلوبة
                        </p>
                        {lesson.course_assignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            className="rounded-2xl border border-[#F3D6E2] px-4 py-4"
                          >
                            <div className="flex items-start gap-3">
                              <ClipboardList size={18} className="mt-0.5 shrink-0 text-[#7A1F3D]" />
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-[#3D1220]">{assignment.title}</h4>
                                {assignment.description && (
                                  <p className="mt-1 text-sm leading-6 text-[#6B5560]">
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
                        <div className="mt-5 flex items-center gap-2 border-t border-[#F8E7EE] pt-5 text-xs font-bold text-[#8C6F78]">
                          <FileText size={14} />
                          لا يتوفر محتوى إضافي لهذه المحاضرة بعد
                        </div>
                      )}
                  </div>
                );
              })}
            </div>

            {/* زرار إنهاء الوحدة — ده اللي بيفتح الباقة اللي بعدها في المسار */}
            {userId && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={toggleCompletion}
                  disabled={togglingComplete}
                  className={`flex items-center gap-2 rounded-2xl px-8 py-4 font-black transition disabled:opacity-60 ${
                    isCompleted
                      ? "border-2 border-green-200 bg-green-50 text-green-700"
                      : "bg-[#7A1F3D] text-white hover:bg-[#611731]"
                  }`}
                >
                  <CheckCircle2 size={20} />
                  {togglingComplete
                    ? "جارٍ التحديث..."
                    : isCompleted
                    ? "تم إنهاء هذه الوحدة — إلغاء الإنهاء"
                    : "إنهاء هذه الوحدة"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}