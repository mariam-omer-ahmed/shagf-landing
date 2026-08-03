"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ArrowRight,
  ClipboardList,
  File as FileIcon,
  Pencil,
  Plus,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import {
  getModuleForAdmin,
  getLessonsForModule,
  createLesson,
  updateLesson,
  deleteLesson,
  addYoutubeResource,
  addFileResource,
  deleteResource,
  createAssignment,
  deleteAssignment,
  type AdminLesson,
  type AdminModuleInfo,
  type LessonInput,
  type LessonResource,
  type LessonAssignment,
} from "@/lib/queries/adminLessons";
import { uploadLessonFile, getLessonFileSignedUrl } from "@/lib/storage";

// لون احتياطي بس لو الباقة مالهاش لون محدد في قاعدة البيانات
const DEFAULT_PACKAGE_COLOR = "#7A1F3D";

// بادئة بنحطها في video_url لما يكون الفيديو مرفوع من الجهاز (مش رابط خارجي)
const UPLOADED_VIDEO_PREFIX = "storage:";

const EMPTY_LESSON: Omit<LessonInput, "module_id"> = {
  title: "",
  description: "",
  video_url: "",
  duration_minutes: null,
  sort_order: 1,
  is_active: true,
};

// مصدر إضافي "في الانتظار" — لسه مش محفوظ في قاعدة البيانات،
// بيتحفظ فعليًا لما تدوسي "إضافة المحاضرة" / "حفظ التعديلات"
type PendingResource =
  | { tempId: string; kind: "file"; title: string; file: File }
  | { tempId: string; kind: "link"; title: string; url: string };

// بيحوّل أي رابط يوتيوب (watch?v=... أو youtu.be/... أو shorts) لصيغة embed
// قابلة للعرض جوه iframe. بيرجع null لو الرابط مش يوتيوب أصلًا.
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

export default function AdminLessonsPage() {
  const params = useParams();
  const router = useRouter();

  const rawModuleId = params?.id;
  const candidateId = Array.isArray(rawModuleId) ? rawModuleId[0] : rawModuleId;
  const moduleId =
    candidateId && candidateId !== "undefined" && candidateId !== "null"
      ? candidateId
      : undefined;

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingStep, setSavingStep] = useState(""); // لعرض حالة الحفظ التفصيلية (فيديو، مصادر، واجب...)
  const [error, setError] = useState("");

  const [moduleInfo, setModuleInfo] = useState<AdminModuleInfo | null>(null);
  const [lessons, setLessons] = useState<AdminLesson[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_LESSON);

  // الفيديو الرئيسي: خياران — رابط يوتيوب (الأسهل والمفضّل)، أو رفع ملف من الجهاز
  const mainVideoInputRef = useRef<HTMLInputElement>(null);
  const [mainVideoFile, setMainVideoFile] = useState<File | null>(null);
  const [videoMode, setVideoMode] = useState<"link" | "upload">("link");
  const [videoLinkInput, setVideoLinkInput] = useState("");

  // مصادر إضافية (ملفات/صور أو روابط فيديو) — تُضاف محليًا وتُحفظ مع المحاضرة
  const resourceFileInputRef = useRef<HTMLInputElement>(null);
  const [pendingResources, setPendingResources] = useState<PendingResource[]>([]);
  const [showLinkFields, setShowLinkFields] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // الواجب العملي — يُضاف محليًا هو الآخر ويُحفظ مع المحاضرة
  const assignmentFileInputRef = useRef<HTMLInputElement>(null);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);

  useEffect(() => {
    if (!moduleId) {
      setCheckingAccess(false);
      setLoading(false);
      setError("لم يتم تحديد الوحدة (رابط غير صالح)");
      return;
    }

    checkAdminAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  async function checkAdminAccess() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      router.replace("/client");
      return;
    }

    setCheckingAccess(false);
    loadData();
  }

  async function loadData() {
    if (!moduleId) return;

    setLoading(true);
    setError("");

    try {
      const [moduleData, lessonsData] = await Promise.all([
        getModuleForAdmin(moduleId),
        getLessonsForModule(moduleId),
      ]);

      setModuleInfo(moduleData);
      setLessons(lessonsData);
    } catch (err) {
      console.error("Load lessons error:", err);
      setError("تعذّر تحميل بيانات الوحدة");
    } finally {
      setLoading(false);
    }
  }

  function resetExtraFields() {
    setMainVideoFile(null);
    setVideoMode("link");
    setVideoLinkInput("");
    setPendingResources([]);
    setShowLinkFields(false);
    setLinkTitle("");
    setLinkUrl("");
    setAssignmentTitle("");
    setAssignmentDescription("");
    setAssignmentFile(null);
    if (mainVideoInputRef.current) mainVideoInputRef.current.value = "";
    if (resourceFileInputRef.current) resourceFileInputRef.current.value = "";
    if (assignmentFileInputRef.current) assignmentFileInputRef.current.value = "";
  }

  function openCreateForm() {
    setEditingId(null);
    setForm({ ...EMPTY_LESSON, sort_order: lessons.length + 1 });
    resetExtraFields();
    setShowForm(true);
  }

  function openEditForm(lesson: AdminLesson) {
    setEditingId(lesson.id);
    setForm({
      title: lesson.title,
      description: lesson.description ?? "",
      video_url: lesson.video_url ?? "",
      duration_minutes: lesson.duration_minutes,
      sort_order: lesson.sort_order,
      is_active: lesson.is_active,
    });
    resetExtraFields();

    if (lesson.video_url?.startsWith(UPLOADED_VIDEO_PREFIX)) {
      setVideoMode("upload");
    } else if (lesson.video_url) {
      setVideoMode("link");
      setVideoLinkInput(lesson.video_url);
    } else {
      setVideoMode("link");
    }

    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_LESSON);
    resetExtraFields();
  }

  function handleMainVideoPicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setMainVideoFile(file ?? null);
  }

  function handleResourceFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingResources((prev) => [
      ...prev,
      { tempId: `${Date.now()}-${file.name}`, kind: "file", title: file.name, file },
    ]);

    if (resourceFileInputRef.current) resourceFileInputRef.current.value = "";
  }

  function handleAddLink() {
    if (!linkTitle.trim() || !linkUrl.trim()) return;

    setPendingResources((prev) => [
      ...prev,
      { tempId: `${Date.now()}-${linkUrl}`, kind: "link", title: linkTitle.trim(), url: linkUrl.trim() },
    ]);

    setLinkTitle("");
    setLinkUrl("");
  }

  function removePendingResource(tempId: string) {
    setPendingResources((prev) => prev.filter((r) => r.tempId !== tempId));
  }

  function handleAssignmentFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setAssignmentFile(file ?? null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!moduleId) {
      setError("لا يمكن الحفظ: لم يتم تحديد الوحدة");
      return;
    }

    if (!form.title.trim()) {
      setError("اكتبي عنوان المحاضرة على الأقل");
      return;
    }

    setSaving(true);
    setError("");

    try {
      let lessonId = editingId;

      const initialVideoUrl =
        videoMode === "link" ? videoLinkInput.trim() : editingId ? form.video_url : "";

      setSavingStep("جارٍ حفظ بيانات المحاضرة...");
      if (editingId) {
        await updateLesson(editingId, { ...form, video_url: initialVideoUrl });
      } else {
        const created = await createLesson({
          ...form,
          module_id: moduleId,
          video_url: initialVideoUrl,
        });
        lessonId = (created as any)?.id ?? null;
      }

      if (!lessonId) {
        throw new Error("تعذّر الحصول على معرّف المحاضرة بعد الحفظ");
      }

      if (videoMode === "upload" && mainVideoFile) {
        setSavingStep("جارٍ رفع فيديو المحاضرة...");
        const path = await uploadLessonFile(moduleId, lessonId, mainVideoFile);
        await updateLesson(lessonId, { video_url: `${UPLOADED_VIDEO_PREFIX}${path}` });
      }

      const existingResourcesCount =
        editingId && lessons.find((l) => l.id === editingId)?.lesson_resources.length
          ? (lessons.find((l) => l.id === editingId)!.lesson_resources.length as number)
          : 0;

      for (let i = 0; i < pendingResources.length; i++) {
        const item = pendingResources[i];
        const sortOrder = existingResourcesCount + i + 1;

        if (item.kind === "file") {
          setSavingStep(`جارٍ رفع الملف: ${item.title}...`);
          const path = await uploadLessonFile(moduleId, lessonId, item.file);
          await addFileResource(lessonId, item.title, path, sortOrder);
        } else {
          setSavingStep(`جارٍ إضافة الرابط: ${item.title}...`);
          await addYoutubeResource(lessonId, item.title, item.url, sortOrder);
        }
      }

      if (assignmentTitle.trim()) {
        setSavingStep("جارٍ إضافة الواجب...");
        await createAssignment({
          lesson_id: lessonId,
          title: assignmentTitle.trim(),
          description: assignmentDescription,
          submission_type: "text",
          sort_order: 1,
          is_active: true,
        });

        if (assignmentFile) {
          setSavingStep("جارٍ رفع ملف الواجب...");
          const path = await uploadLessonFile(moduleId, lessonId, assignmentFile);
          await addFileResource(
            lessonId,
            `مرفق واجب: ${assignmentTitle.trim()}`,
            path,
            existingResourcesCount + pendingResources.length + 1
          );
        }
      }

      closeForm();
      await loadData();
    } catch (err) {
      console.error("Save lesson error:", err);
      setError("تعذّر حفظ المحاضرة، حاولي مرة أخرى");
    } finally {
      setSaving(false);
      setSavingStep("");
    }
  }

  async function handleDeleteLesson(lesson: AdminLesson) {
    const confirmed = window.confirm(
      `هل تريدين حذف المحاضرة "${lesson.title}"؟ سيتم حذف كل ملفاتها المرفوعة أيضًا.`
    );

    if (!confirmed) return;

    try {
      await deleteLesson(lesson);
      await loadData();
    } catch (err) {
      console.error("Delete lesson error:", err);
      setError("تعذّر حذف المحاضرة");
    }
  }

  if (checkingAccess) {
    return (
      <div dir="rtl" className="flex min-h-screen items-center justify-center text-lg font-bold text-black">
        جارٍ التحقق من الصلاحيات...
      </div>
    );
  }

  if (!moduleId) {
    return (
      <div dir="rtl" className="mx-auto max-w-2xl px-8 py-16 text-center">
        <p className="text-lg font-bold text-red-600">{error || "رابط غير صالح"}</p>
        <Link
          href="/admin/modules"
          className="mt-6 inline-flex items-center gap-2 font-bold text-black hover:underline"
        >
          <ArrowRight size={18} />
          العودة إلى الوحدات
        </Link>
      </div>
    );
  }

  const pkg = moduleInfo?.packages;
  const accent = pkg?.color || DEFAULT_PACKAGE_COLOR;
  const existingVideoName =
    editingId && form.video_url?.startsWith(UPLOADED_VIDEO_PREFIX)
      ? "يوجد فيديو مرفوع بالفعل لهذه المحاضرة"
      : null;

  return (
    <main dir="rtl" className="mx-auto max-w-6xl px-8 py-10">
      <Link
        href="/admin/modules"
        className="mb-6 inline-flex items-center gap-2 font-bold transition hover:gap-3"
        style={{ color: accent }}
      >
        <ArrowRight size={18} />
        العودة إلى الوحدات
      </Link>

      {!loading && pkg && (
        <div
          className="mb-6 flex items-center gap-4 rounded-2xl border bg-white p-4"
          style={{ borderColor: "#F3D6E2" }}
        >
          {pkg.thumbnail && (
            <img
              src={pkg.thumbnail}
              alt={pkg.title}
              className="h-12 w-12 shrink-0 rounded-xl object-cover"
            />
          )}
          <div>
            <p className="text-xs font-bold text-gray-400">أنتِ الآن تضيفين محتوى في</p>
            <p className="text-lg font-black" style={{ color: accent }}>
              {pkg.title}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-bold text-gray-400">إدارة محاضرات وحدة</p>
          <h1 className="mt-1 text-4xl font-black text-black">{moduleInfo?.title ?? ""}</h1>
        </div>

        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-2xl px-6 py-3.5 font-bold text-white transition"
          style={{ backgroundColor: accent }}
        >
          <Plus size={18} />
          إضافة محاضرة جديدة
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-bold text-red-600">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-black">
              {editingId ? "تعديل المحاضرة" : "إضافة محاضرة جديدة"}
            </h2>
            <button type="button" onClick={closeForm} className="rounded-full p-2 text-gray-400 hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block font-bold text-black">عنوان المحاضرة</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="مثال: كيف تحدد مسارك المهني"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E96B8A]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-bold text-black">وصف المحاضرة</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E96B8A]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-bold text-black">فيديو المحاضرة الرئيسي</label>

              <div className="mb-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setVideoMode("link")}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition"
                  style={
                    videoMode === "link"
                      ? { backgroundColor: accent, color: "#fff" }
                      : { backgroundColor: "#F3F4F6", color: "#111" }
                  }
                >
                  رابط يوتيوب
                </button>
                <button
                  type="button"
                  onClick={() => setVideoMode("upload")}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition"
                  style={
                    videoMode === "upload"
                      ? { backgroundColor: accent, color: "#fff" }
                      : { backgroundColor: "#F3F4F6", color: "#111" }
                  }
                >
                  رفع من الجهاز
                </button>
              </div>

              {videoMode === "link" ? (
                <input
                  type="url"
                  value={videoLinkInput}
                  onChange={(e) => setVideoLinkInput(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E96B8A]"
                />
              ) : (
                <>
                  {existingVideoName && !mainVideoFile && (
                    <p className="mb-2 text-sm font-bold text-green-700">{existingVideoName}</p>
                  )}
                  <input
                    ref={mainVideoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleMainVideoPicked}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => mainVideoInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-6 font-bold text-black hover:border-[#E96B8A]"
                  >
                    <Upload size={18} style={{ color: accent }} />
                    {mainVideoFile ? `تم اختيار: ${mainVideoFile.name}` : "اختاري ملف فيديو من جهازك"}
                  </button>
                </>
              )}
            </div>

            <div>
              <label className="mb-2 block font-bold text-black">مدة الفيديو (دقائق)</label>
              <input
                type="number"
                min={0}
                value={form.duration_minutes ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    duration_minutes: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E96B8A]"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-black">ترتيب المحاضرة</label>
              <input
                type="number"
                min={1}
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E96B8A]"
              />
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="h-5 w-5 accent-[#E96B8A]"
              />
              <span className="font-bold text-black">نشطة وتظهر للطلاب</span>
            </label>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <h3 className="mb-3 text-lg font-black text-black">مصادر إضافية (اختياري)</h3>
            <p className="mb-4 text-sm text-gray-500">
              ملفات، صور، أو روابط فيديو إضافية — يمكنك إضافة أكثر من مصدر.
            </p>

            {pendingResources.length > 0 && (
              <div className="mb-4 space-y-2">
                {pendingResources.map((item) => (
                  <div
                    key={item.tempId}
                    className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-2.5"
                  >
                    <span className="flex items-center gap-2 font-bold text-black">
                      {item.kind === "file" ? (
                        <FileIcon size={16} style={{ color: accent }} />
                      ) : (
                        <Video size={16} style={{ color: accent }} />
                      )}
                      {item.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePendingResource(item.tempId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <input
                ref={resourceFileInputRef}
                type="file"
                accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
                onChange={handleResourceFilePicked}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => resourceFileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 font-bold text-black hover:bg-gray-50"
              >
                <Upload size={16} />
                إضافة ملف أو صورة
              </button>

              <button
                type="button"
                onClick={() => setShowLinkFields((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 font-bold text-black hover:bg-gray-50"
              >
                <Video size={16} />
                إضافة رابط فيديو
              </button>
            </div>

            {showLinkFields && (
              <div className="mt-4 flex flex-wrap gap-3">
                <input
                  type="text"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="عنوان الرابط"
                  className="min-w-[180px] flex-1 rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#E96B8A]"
                />
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="رابط الفيديو"
                  className="min-w-[220px] flex-1 rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#E96B8A]"
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="rounded-xl px-5 py-2.5 font-bold text-white"
                  style={{ backgroundColor: accent }}
                >
                  إضافة إلى القائمة
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <h3 className="mb-3 text-lg font-black text-black">الواجب العملي (اختياري)</h3>

            <div className="space-y-3">
              <input
                type="text"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                placeholder="عنوان الواجب"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#E96B8A]"
              />
              <textarea
                value={assignmentDescription}
                onChange={(e) => setAssignmentDescription(e.target.value)}
                placeholder="وصف الواجب المطلوب من الطالب تنفيذه"
                rows={2}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#E96B8A]"
              />

              <input
                ref={assignmentFileInputRef}
                type="file"
                onChange={handleAssignmentFilePicked}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => assignmentFileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-3 text-sm font-bold text-black hover:border-[#E96B8A]"
              >
                <Upload size={16} style={{ color: accent }} />
                {assignmentFile ? `تم اختيار: ${assignmentFile.name}` : "إرفاق ملف مع الواجب (اختياري)"}
              </button>
            </div>
          </div>

          {savingStep && (
            <p className="mt-4 text-sm font-bold text-gray-500">{savingStep}</p>
          )}

          <div className="mt-8 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl px-8 py-3.5 font-bold text-white transition disabled:opacity-60"
              style={{ backgroundColor: accent }}
            >
              {saving ? "جارٍ الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة المحاضرة"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-2xl border border-gray-200 px-8 py-3.5 font-bold text-black hover:bg-gray-50"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}

      <div className="mt-10 space-y-5">
        {loading && <p className="font-bold text-black">جارٍ تحميل المحاضرات...</p>}

        {!loading && lessons.length === 0 && (
          <div className="rounded-3xl bg-white p-14 text-center shadow-sm">
            <p className="font-bold text-black">لا توجد محاضرات مضافة بعد</p>
          </div>
        )}

        {!loading &&
          lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              moduleId={moduleId}
              accent={accent}
              onEdit={() => openEditForm(lesson)}
              onDelete={() => handleDeleteLesson(lesson)}
              onResourcesChanged={loadData}
              onError={setError}
            />
          ))}
      </div>
    </main>
  );
}

function LessonCard({
  lesson,
  moduleId,
  accent,
  onEdit,
  onDelete,
  onResourcesChanged,
  onError,
}: {
  lesson: AdminLesson;
  moduleId: string;
  accent: string;
  onEdit: () => void;
  onDelete: () => void;
  onResourcesChanged: () => void;
  onError: (msg: string) => void;
}) {
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [loadingMainVideo, setLoadingMainVideo] = useState(false);
  // الرابط الجاهز لعرض فيديو المحاضرة الرئيسي جوه الكارد — لو مرفوع بيبقى
  // رابط موقّت من الباكت، ولو يوتيوب بيبقى نفس الرابط (هيتحط في iframe)
  const [mainVideoUrl, setMainVideoUrl] = useState<string | null>(null);

  async function handleViewFile(resource: LessonResource) {
    if (!resource.storage_path) return;

    if (signedUrls[resource.id]) {
      window.open(signedUrls[resource.id], "_blank");
      return;
    }

    const url = await getLessonFileSignedUrl(resource.storage_path);
    if (url) {
      setSignedUrls((prev) => ({ ...prev, [resource.id]: url }));
      window.open(url, "_blank");
    } else {
      onError("تعذّر فتح الملف");
    }
  }

  async function handleDeleteResource(resource: LessonResource) {
    const confirmed = window.confirm(`هل تريدين حذف "${resource.title}"؟`);
    if (!confirmed) return;

    try {
      await deleteResource(resource);
      onResourcesChanged();
    } catch (err) {
      console.error("Delete resource error:", err);
      onError("تعذّر حذف المورد");
    }
  }

  async function handleDeleteAssignment(assignment: LessonAssignment) {
    const confirmed = window.confirm(`هل تريدين حذف الواجب "${assignment.title}"؟`);
    if (!confirmed) return;

    try {
      await deleteAssignment(assignment.id);
      onResourcesChanged();
    } catch (err) {
      console.error("Delete assignment error:", err);
      onError("تعذّر حذف الواجب");
    }
  }

  // بديل عن فتح الفيديو في تاب جديد: بنجيب الرابط ونعرضه مضمّن جوه الكارد.
  // الضغط تاني على الزرار (لو الفيديو ظاهر بالفعل) بيقفله.
  async function handleToggleMainVideo() {
    if (!lesson.video_url) return;

    if (mainVideoUrl) {
      setMainVideoUrl(null);
      return;
    }

    if (lesson.video_url.startsWith(UPLOADED_VIDEO_PREFIX)) {
      setLoadingMainVideo(true);
      try {
        const path = lesson.video_url.replace(UPLOADED_VIDEO_PREFIX, "");
        const url = await getLessonFileSignedUrl(path);
        if (url) {
          setMainVideoUrl(url);
        } else {
          onError("تعذّر تحميل الفيديو");
        }
      } finally {
        setLoadingMainVideo(false);
      }
      return;
    }

    // رابط يوتيوب — هيتعرض مباشرة في iframe، مش محتاج رابط موقّت
    setMainVideoUrl(lesson.video_url);
  }

  const youtubeEmbedUrl = mainVideoUrl ? getYoutubeEmbedUrl(mainVideoUrl) : null;
  const isUploadedVideo = lesson.video_url?.startsWith(UPLOADED_VIDEO_PREFIX);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-black"
            style={{ backgroundColor: "#FFF0F5", color: accent }}
          >
            {lesson.sort_order}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-black">{lesson.title}</h3>
              {!lesson.is_active && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                  غير نشطة
                </span>
              )}
            </div>
            {lesson.video_url && (
              <button
                onClick={handleToggleMainVideo}
                disabled={loadingMainVideo}
                className="mt-1 flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#E96B8A] disabled:opacity-60"
              >
                <Video size={14} style={{ color: accent }} />
                {loadingMainVideo
                  ? "جارٍ التحميل..."
                  : mainVideoUrl
                  ? "إخفاء معاينة الفيديو"
                  : "معاينة فيديو المحاضرة"}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 font-bold text-black hover:bg-gray-50"
          >
            <Pencil size={16} />
            تعديل
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 font-bold text-red-500 hover:bg-red-50"
          >
            <Trash2 size={16} />
            حذف
          </button>
        </div>
      </div>

      {/* معاينة الفيديو الرئيسي — مضمّنة جوه الكارد نفسه، مش تاب جديد */}
      {mainVideoUrl && (
        <div className="mt-5 border-t border-gray-100 pt-5">
          {isUploadedVideo ? (
            <div className="overflow-hidden rounded-2xl bg-black" style={{ aspectRatio: "16 / 9" }}>
              <video src={mainVideoUrl} controls controlsList="nodownload" className="h-full w-full">
                متصفحك لا يدعم تشغيل الفيديو
              </video>
            </div>
          ) : youtubeEmbedUrl ? (
            <div className="overflow-hidden rounded-2xl" style={{ aspectRatio: "16 / 9" }}>
              <iframe
                src={youtubeEmbedUrl}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : (
            <p className="text-sm font-bold text-red-500">
              تعذّر تفسير رابط الفيديو ده كيوتيوب — تأكدي إنه رابط يوتيوب صحيح
            </p>
          )}
        </div>
      )}

      {lesson.lesson_resources.length > 0 && (
        <div className="mt-5 border-t border-gray-100 pt-5">
          <p className="mb-3 text-sm font-bold text-gray-500">
            ملفات وفيديوهات إضافية لهذه المحاضرة
          </p>
          <div className="space-y-2">
            {lesson.lesson_resources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-2.5"
              >
                <button
                  onClick={() =>
                    resource.resource_type === "file"
                      ? handleViewFile(resource)
                      : window.open(resource.url ?? "#", "_blank")
                  }
                  className="flex items-center gap-2 font-bold text-black hover:text-[#E96B8A]"
                >
                  {resource.resource_type === "file" ? (
                    <FileIcon size={16} style={{ color: accent }} />
                  ) : (
                    <Video size={16} style={{ color: accent }} />
                  )}
                  {resource.title}
                </button>

                <button
                  onClick={() => handleDeleteResource(resource)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {lesson.course_assignments.length > 0 && (
        <div className="mt-5 border-t border-gray-100 pt-5">
          <p className="mb-3 text-sm font-bold text-gray-500">
            الواجب العملي لهذه المحاضرة
          </p>
          <div className="space-y-2">
            {lesson.course_assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-start justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3"
              >
                <div className="flex items-start gap-2">
                  <ClipboardList size={16} className="mt-0.5 shrink-0" style={{ color: accent }} />
                  <div>
                    <p className="font-bold text-black">{assignment.title}</p>
                    {assignment.description && (
                      <p className="mt-0.5 text-sm text-gray-500">{assignment.description}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteAssignment(assignment)}
                  className="shrink-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}