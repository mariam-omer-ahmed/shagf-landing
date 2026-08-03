"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  getOrCreateSubmission,
  getSubmission,
  uploadSubmissionFile,
  getSubmissionFileUrl,
  addSubmissionComment,
  type Submission,
} from "@/lib/queries/submissions";
import { Paperclip, Send, FileText, Loader2 } from "lucide-react";

const ACCENT = "#7A1F3D";
const BG = "#FDF2F6";
const BORDER = "#F3D6E2";
const BORDER_LIGHT = "#F8E7EE";
const TEXT = "#3D1220";
const TEXT_SOFT = "#8C6F78";
const FONT_FAMILY = "'Almarai','Tajawal',sans-serif";

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  submitted: { label: "بانتظار المراجعة", color: "#8C6D00", bg: "#FFF7DB" },
  in_review: { label: "قيد المراجعة", color: "#8C6D00", bg: "#FFF7DB" },
  needs_revision: { label: "يحتاج تعديل", color: "#B3261E", bg: "#FCE8E6" },
  approved: { label: "مقبول", color: "#1E7A3B", bg: "#E6F6EB" },
};

export default function AssignmentSubmissionPanel({
  assignmentId,
}: {
  assignmentId: string;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentId]);

  async function init() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setUserId(user.id);

    const submissionId = await getOrCreateSubmission(assignmentId, user.id);
    const data = await getSubmission(submissionId);
    setSubmission(data);
    setLoading(false);
  }

  async function refresh() {
    if (!submission) return;
    const data = await getSubmission(submission.id);
    setSubmission(data);
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !submission || !userId) return;

    setUploading(true);
    setUploadError("");
    try {
      await uploadSubmissionFile(submission.id, file, userId, "student");
      await refresh();
    } catch (err: any) {
      // بنعرض رسالة الخطأ الحقيقية من Supabase هنا بدل رسالة عامة،
      // عشان تقدر تعرف السبب الفعلي (صلاحيات، حجم الملف، الـ bucket
      // غير موجود، إلخ) من غير ما تحتاج تفتح Console يدويًا
      const realMessage =
        err?.message || err?.error_description || "خطأ غير معروف";
      console.error("Upload error:", err);
      setUploadError(`تعذّر رفع الملف: ${realMessage}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function openFile(storagePath: string) {
    const url = await getSubmissionFileUrl(storagePath);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    else setUploadError("تعذّر فتح الملف");
  }

  async function sendMessage() {
    if (!message.trim() || !submission || !userId) return;

    setSending(true);
    try {
      await addSubmissionComment(submission.id, userId, "student", message.trim());
      setMessage("");
      await refresh();
    } catch (err) {
      console.error("Comment error:", err);
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div
        className="mt-4 flex items-center gap-2 text-sm"
        style={{ color: TEXT_SOFT, fontFamily: FONT_FAMILY }}
      >
        <Loader2 size={14} className="animate-spin" />
        جارٍ تحميل حالة التسليم...
      </div>
    );
  }

  if (!submission) return null;

  const statusInfo = STATUS_LABELS[submission.status];

  return (
    <div
      className="mt-5 rounded-2xl border p-5"
      style={{ borderColor: BORDER, backgroundColor: BG, fontFamily: FONT_FAMILY }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-black" style={{ color: TEXT_SOFT }}>
          تسليم الواجب
        </p>
        <span
          className="rounded-full px-3 py-1 text-xs font-bold"
          style={{ color: statusInfo.color, backgroundColor: statusInfo.bg }}
        >
          {statusInfo.label}
        </span>
      </div>

      {submission.files.length > 0 && (
        <div className="mt-4 space-y-2">
          {submission.files.map((f) => (
            <button
              key={f.id}
              onClick={() => openFile(f.storage_path)}
              className="flex w-full items-center gap-2.5 rounded-xl border bg-white px-4 py-2.5 text-right text-sm font-bold transition"
              style={{ borderColor: BORDER_LIGHT, color: TEXT }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = ACCENT)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER_LIGHT)}
            >
              <FileText size={16} className="shrink-0" style={{ color: ACCENT }} />
              <span className="flex-1 truncate">{f.file_name}</span>
              <span className="text-xs font-medium" style={{ color: TEXT_SOFT }}>
                {f.uploaded_by_role === "admin" ? "من فريق شغف" : "ملفك"}
              </span>
            </button>
          ))}
        </div>
      )}

      {uploadError && (
        <div
          className="mt-4 rounded-xl border px-4 py-2.5 text-sm font-bold"
          style={{ borderColor: "#F3C6C0", backgroundColor: "#FCE8E6", color: "#B3261E" }}
        >
          {uploadError}
        </div>
      )}

      <label
        className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed py-3 text-sm font-bold transition hover:bg-white"
        style={{ borderColor: BORDER, color: ACCENT }}
      >
        {uploading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            جارٍ الرفع...
          </>
        ) : (
          <>
            <Paperclip size={16} />
            رفع ملف الواجب
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          disabled={uploading}
          onChange={handleFileSelect}
        />
      </label>

      {submission.comments.length > 0 && (
        <div className="mt-5 space-y-3 border-t pt-4" style={{ borderColor: BORDER_LIGHT }}>
          {submission.comments.map((c) => {
            const isStudent = c.author_role === "student";
            return (
              <div
                key={c.id}
                className={`flex ${isStudent ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-6"
                  style={
                    isStudent
                      ? { backgroundColor: ACCENT, color: "#fff" }
                      : { border: `1px solid ${BORDER_LIGHT}`, backgroundColor: "#fff", color: TEXT }
                  }
                >
                  {!isStudent && (
                    <p className="mb-1 text-xs font-black" style={{ color: ACCENT }}>
                      فريق شغف
                    </p>
                  )}
                  {c.message}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="اكتب سؤالك أو ملاحظتك هنا..."
          className="flex-1 rounded-xl border bg-white px-4 py-2.5 text-sm outline-none"
          style={{ borderColor: BORDER, color: TEXT }}
        />
        <button
          onClick={sendMessage}
          disabled={sending || !message.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white disabled:opacity-50"
          style={{ backgroundColor: ACCENT }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}