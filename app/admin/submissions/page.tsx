"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  listSubmissionsForReview,
  getSubmission,
  uploadSubmissionFile,
  getSubmissionFileUrl,
  addSubmissionComment,
  updateSubmissionStatus,
  type Submission,
} from "@/lib/queries/submissions";
import {
  FileText,
  Send,
  Paperclip,
  Loader2,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

const ACCENT = "#7A1F3D";
const BG = "#FDF2F6";
const BORDER = "#F3D6E2";
const TEXT = "#3D1220";
const TEXT_SOFT = "#8C6F78";
const FONT_FAMILY = "'Almarai','Tajawal',sans-serif";

type SubmissionListItem = {
  id: string;
  status: string;
  updated_at: string;
  course_assignments: { title: string } | null;
  profiles: { full_name: string; email: string } | null;
};

export default function AdminSubmissionsPage() {
  const [items, setItems] = useState<SubmissionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    loadList();
  }, []);

  async function loadList() {
    setLoading(true);
    const data = await listSubmissionsForReview();
    setItems(data as SubmissionListItem[]);
    setLoading(false);
  }

  return (
    <main
      dir="rtl"
      className="mx-auto max-w-6xl px-8 py-10"
      style={{ fontFamily: FONT_FAMILY }}
    >
      <h1 className="text-3xl font-black" style={{ color: TEXT }}>
        مراجعة الواجبات
      </h1>
      <p className="mt-2" style={{ color: TEXT_SOFT }}>
        الواجبات المرسلة من الطالبات وبانتظار المراجعة أو الرد.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-3">
          {loading ? (
            <p style={{ color: TEXT_SOFT }}>جارٍ التحميل...</p>
          ) : items.length === 0 ? (
            <p
              className="rounded-2xl bg-white p-6 text-center shadow-sm"
              style={{ color: TEXT_SOFT }}
            >
              لا توجد واجبات بانتظار المراجعة حاليًا
            </p>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className="w-full rounded-2xl border p-4 text-right transition"
                style={
                  selectedId === item.id
                    ? { borderColor: ACCENT, backgroundColor: BG }
                    : { borderColor: BORDER, backgroundColor: "#fff" }
                }
              >
                <p className="font-bold" style={{ color: TEXT }}>
                  {item.profiles?.full_name ?? "بدون اسم"}
                </p>
                <p className="mt-0.5 text-sm" style={{ color: TEXT_SOFT }}>
                  {item.course_assignments?.title ?? "واجب"}
                </p>
                <p className="mt-1 text-xs" style={{ color: TEXT_SOFT }}>
                  {new Date(item.updated_at).toLocaleDateString("ar-SA")}
                </p>
              </button>
            ))
          )}
        </div>

        <div>
          {selectedId ? (
            <ReviewPanel submissionId={selectedId} onStatusChanged={loadList} />
          ) : (
            <div
              className="flex h-64 items-center justify-center rounded-3xl bg-white shadow-sm"
              style={{ color: TEXT_SOFT }}
            >
              اختاري واجبًا من القائمة عشان تراجعيه
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function ReviewPanel({
  submissionId,
  onStatusChanged,
}: {
  submissionId: string;
  onStatusChanged: () => void;
}) {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId]);

  async function load() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setAdminId(user?.id ?? null);

    const data = await getSubmission(submissionId);
    setSubmission(data);
    setLoading(false);
  }

  async function refresh() {
    const data = await getSubmission(submissionId);
    setSubmission(data);
  }

  async function openFile(storagePath: string) {
    const url = await getSubmissionFileUrl(storagePath);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !adminId) return;

    setUploading(true);
    try {
      await uploadSubmissionFile(submissionId, file, adminId, "admin");
      await refresh();
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function sendMessage() {
    if (!message.trim() || !adminId) return;
    setSending(true);
    try {
      await addSubmissionComment(submissionId, adminId, "admin", message.trim());
      setMessage("");
      await refresh();
    } finally {
      setSending(false);
    }
  }

  async function markStatus(status: "approved" | "needs_revision") {
    setUpdatingStatus(true);
    try {
      await updateSubmissionStatus(submissionId, status);
      await refresh();
      onStatusChanged();
    } finally {
      setUpdatingStatus(false);
    }
  }

  if (loading) {
    return (
      <div
        className="flex h-64 items-center justify-center rounded-3xl bg-white shadow-sm"
        style={{ color: TEXT_SOFT }}
      >
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!submission) return null;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-b pb-4"
        style={{ borderColor: BORDER }}
      >
        <p className="font-black" style={{ color: TEXT }}>
          تفاصيل التسليم
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => markStatus("needs_revision")}
            disabled={updatingStatus}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 disabled:opacity-50"
          >
            <RotateCcw size={14} />
            طلب تعديل
          </button>
          <button
            onClick={() => markStatus("approved")}
            disabled={updatingStatus}
            className="flex items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            <CheckCircle2 size={14} />
            قبول الواجب
          </button>
        </div>
      </div>

      {submission.files.length > 0 && (
        <div className="mt-4 space-y-2">
          {submission.files.map((f) => (
            <button
              key={f.id}
              onClick={() => openFile(f.storage_path)}
              className="flex w-full items-center gap-2.5 rounded-xl border px-4 py-2.5 text-right text-sm font-bold transition"
              style={{ borderColor: BORDER, color: TEXT }}
            >
              <FileText size={16} className="shrink-0" style={{ color: ACCENT }} />
              <span className="flex-1 truncate">{f.file_name}</span>
              <span className="text-xs font-medium" style={{ color: TEXT_SOFT }}>
                {f.uploaded_by_role === "admin" ? "أنتِ رفعتيه" : "ملف الطالبة"}
              </span>
            </button>
          ))}
        </div>
      )}

      <label
        className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed py-2.5 text-sm font-bold transition"
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
            إرفاق ملف (نسخة مصححة مثلًا)
          </>
        )}
        <input type="file" className="hidden" disabled={uploading} onChange={handleFileSelect} />
      </label>

      <div
        className="mt-5 max-h-80 space-y-3 overflow-y-auto border-t pt-4"
        style={{ borderColor: BORDER }}
      >
        {submission.comments.length === 0 ? (
          <p className="text-center text-sm" style={{ color: TEXT_SOFT }}>
            لا توجد رسائل بعد
          </p>
        ) : (
          submission.comments.map((c) => {
            const isAdmin = c.author_role === "admin";
            return (
              <div key={c.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-6"
                  style={
                    isAdmin
                      ? { backgroundColor: ACCENT, color: "#fff" }
                      : { border: `1px solid ${BORDER}`, backgroundColor: BG, color: TEXT }
                  }
                >
                  {!isAdmin && (
                    <p className="mb-1 text-xs font-black" style={{ color: TEXT_SOFT }}>
                      الطالبة
                    </p>
                  )}
                  {c.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="اكتبي ملاحظتك على الواجب..."
          className="flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none"
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