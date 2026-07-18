"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Plus,
  Trash2,
  BookOpen,
  Eye,
  EyeOff,
  Image as ImageIcon,
  FileText,
  Pencil,
  X,
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

export default function ResourcesPage() {
  const [pdfFile, setPdfFile] =
    useState<File | null>(null);

  const [thumbnailFile, setThumbnailFile] =
    useState<File | null>(null);

  const [resources, setResources] =
    useState<Resource[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

    const [editingResource, setEditingResource] =
  useState<Resource | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    loadResources();
  }, []);

  async function loadResources() {
    const { data, error } = await supabase
      .from("free_resources")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.log(error);
      return;
    }

    setResources(data || []);
    setLoading(false);
  }

  function startEdit(
  resource: Resource
) {

  setEditingResource(resource);

  setForm({
    title: resource.title,
    description: resource.description,
  });

}

function cancelEdit() {

  setEditingResource(null);

  setPdfFile(null);

  setThumbnailFile(null);

  setForm({
    title: "",
    description: "",
  });

}

async function updateResource() {

  if (!editingResource)
    return;

  setSaving(true);

  try {

    let updateData: any = {

      title: form.title,

      description:
        form.description,

    };

    // تغيير الصورة إن وُجدت

    if (thumbnailFile) {

      const imageName =
        `${Date.now()}-${thumbnailFile.name}`;

      const {
        error:
          imageUploadError,
      } = await supabase.storage
        .from("thumbnails")
        .upload(
          imageName,
          thumbnailFile,
          {
            upsert: true,
          }
        );

      if (
        imageUploadError
      ) {
        alert(
          imageUploadError.message
        );
        setSaving(false);
        return;
      }

      const {
        data: imageData,
      } = supabase.storage
        .from("thumbnails")
        .getPublicUrl(
          imageName
        );

      updateData.thumbnail =
        imageData.publicUrl;
    }

    // تغيير PDF إن وُجد

    if (pdfFile) {

      const pdfName =
        `${Date.now()}-${pdfFile.name}`;

      const {
        error:
          pdfUploadError,
      } = await supabase.storage
        .from("resources")
        .upload(
          pdfName,
          pdfFile,
          {
            upsert: true,
          }
        );

      if (
        pdfUploadError
      ) {
        alert(
          pdfUploadError.message
        );
        setSaving(false);
        return;
      }

      const {
        data: pdfData,
      } = supabase.storage
        .from("resources")
        .getPublicUrl(
          pdfName
        );

      updateData.file_url =
        pdfData.publicUrl;
    }

    const { error } =
      await supabase
        .from(
          "free_resources"
        )
        .update(updateData)
        .eq(
          "id",
          editingResource.id
        );

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    setSuccessMessage(
      "✅ تم تحديث المصدر بنجاح"
    );

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    cancelEdit();

    loadResources();

  } catch (error) {

    console.log(error);

  }

  setSaving(false);

}

  async function addResource() {
    if (!form.title) {
      alert("أدخل عنوان المصدر");
      return;
    }

    if (!pdfFile) {
      alert("اختر ملف PDF");
      return;
    }

    if (!thumbnailFile) {
      alert("اختر صورة للمصدر");
      return;
    }

    setSaving(true);

    try {
      // =====================
      // Upload PDF
      // =====================

      const pdfName =
        `${Date.now()}-${pdfFile.name}`;

      const {
        error: pdfUploadError,
      } = await supabase.storage
        .from("resources")
        .upload(
          pdfName,
          pdfFile,
          {
            upsert: true,
          }
        );

      if (pdfUploadError) {
        console.log(pdfUploadError);
        alert(pdfUploadError.message);
        setSaving(false);
        return;
      }

      const {
        data: pdfData,
      } = supabase.storage
        .from("resources")
        .getPublicUrl(pdfName);

      const pdfUrl =
        pdfData.publicUrl;

      // =====================
      // Upload Thumbnail
      // =====================

      const imageName =
        `${Date.now()}-${thumbnailFile.name}`;

      const {
        error: imageUploadError,
      } = await supabase.storage
        .from("thumbnails")
        .upload(
          imageName,
          thumbnailFile,
          {
            upsert: true,
          }
        );

      if (imageUploadError) {
        console.log(imageUploadError);
        alert(imageUploadError.message);
        setSaving(false);
        return;
      }

      const {
        data: imageData,
      } = supabase.storage
        .from("thumbnails")
        .getPublicUrl(imageName);

      const imageUrl =
        imageData.publicUrl;

      // =====================
      // Save Resource
      // =====================

      const { error } =
        await supabase
          .from("free_resources")
          .insert({
            title: form.title,
            description:
              form.description,
            file_url: pdfUrl,
            thumbnail: imageUrl,
            is_active: true,
          });

      if (error) {
        console.log(error);
        alert(error.message);
        setSaving(false);
        return;
      }

      setSuccessMessage(
        "✅ تم إضافة المصدر بنجاح"
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      setForm({
        title: "",
        description: "",
      });

      setPdfFile(null);
      setThumbnailFile(null);

      loadResources();
    } catch (error) {
      console.log(error);
      alert("حدث خطأ غير متوقع");
    }

    setSaving(false);
  }

  async function toggleActive(
    resource: Resource
  ) {
    await supabase
      .from("free_resources")
      .update({
        is_active:
          !resource.is_active,
      })
      .eq(
        "id",
        resource.id
      );

    loadResources();
  }

  async function deleteResource(
    id: string
  ) {
    const confirmDelete =
      confirm(
        "هل تريد حذف هذا المصدر؟"
      );

    if (!confirmDelete)
      return;

    await supabase
      .from("free_resources")
      .delete()
      .eq("id", id);

    loadResources();
  }

  if (loading) {
    return (
      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        font-bold
        text-black
      "
      >
        جاري تحميل المصادر...
      </div>
    );
  }

  return (
    <main
      className="
      mx-auto
      max-w-7xl
      px-8
      py-10
    "
    >
      <h1
        className="
        text-4xl
        font-black
      "
      >
        المصادر المجانية
      </h1>

      <p
        className="
        mt-2
        text-black
      "
      >
        إدارة مكتبة شغف التعليمية
      </p>

      {/* SUCCESS */}

      {successMessage && (
        <div
          className="
          mt-6
          rounded-2xl
          border
          border-green-200
          bg-green-50
          p-4
          font-bold
          text-green-700
        "
        >
          {successMessage}
        </div>
      )}

      {/* FORM */}

      <section
        className="
        mt-10
        rounded-3xl
        bg-white
        p-8
        shadow-sm
      "
      >
        <h2
          className="
          flex
          items-center
          gap-2
          text-2xl
          font-black
        "
        >
          <Plus
            className="
            text-[#E96B8A]
          "
          />
          إضافة مصدر جديد
        </h2>

        <div
          className="
          mt-6
          grid
          gap-4
          md:grid-cols-2
        "
        >
          <input
            placeholder="عنوان المصدر"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title:
                  e.target.value,
              })
            }
            className="
              rounded-xl
              border
              p-4
              text-black
            "
          />

          <textarea
            placeholder="وصف المصدر"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value,
              })
            }
            className="
              h-32
              rounded-xl
              border
              p-4
              text-black
            "
          />

          <div
            className="
            rounded-xl
            border
            p-4
          "
          >
            <label
              className="
              mb-3
              flex
              items-center
              gap-2
              font-bold
            "
            >
              <FileText
                size={18}
              />
              ملف PDF
            </label>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                if (
                  e.target.files?.[0]
                ) {
                  setPdfFile(
                    e.target.files[0]
                  );
                }
              }}
            />
          </div>

          <div
            className="
            rounded-xl
            border
            p-4
          "
          >
            <label
              className="
              mb-3
              flex
              items-center
              gap-2
              font-bold
            "
            >
              <ImageIcon
                size={18}
              />
              صورة المصدر
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (
                  e.target.files?.[0]
                ) {
                  setThumbnailFile(
                    e.target.files[0]
                  );
                }
              }}
            />
          </div>
        </div>

        <button
          onClick={
            addResource
          }
          disabled={saving}
          className="
            mt-6
            flex
            items-center
            gap-2
            rounded-xl
            bg-[#E96B8A]
            px-6
            py-3
            font-bold
            text-white
          "
        >
          <Plus size={18} />

          {saving
            ? "جاري الحفظ..."
            : "إضافة المصدر"}
        </button>
      </section>

      {/* LIST */}

      <section
        className="
        mt-10
        grid
        gap-6
        md:grid-cols-2
        lg:grid-cols-3
      "
      >
        {resources.map(
          (resource) => (
            <div
              key={
                resource.id
              }
              className="
              overflow-hidden
              rounded-3xl
              bg-white
              shadow-sm
            "
            >
              {resource.thumbnail && (
                <img
                  src={
                    resource.thumbnail
                  }
                  alt={
                    resource.title
                  }
                  className="
                    h-48
                    w-full
                    object-cover
                  "
                />
              )}

              <div
                className="
                p-6
              "
              >
                <BookOpen
                  size={35}
                  className="
                  text-[#E96B8A]
                "
                />

                <h3
                  className="
                  mt-4
                  text-xl
                  font-black
                "
                >
                  {
                    resource.title
                  }
                </h3>

                <p
                  className="
                  mt-3
                  text-black
                  leading-7
                "
                >
                  {
                    resource.description
                  }
                </p>

                <div
                  className="
                  mt-5
                  flex
                  gap-3
                "
                >
                  <button
                    onClick={() =>
                      toggleActive(
                        resource
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-[#FFF4F8]
                      px-4
                      py-2
                      font-bold
                    "
                  >
                    {resource.is_active ? (
                      <>
                        <Eye
                          size={
                            18
                          }
                        />
                        فعال
                      </>
                    ) : (
                      <>
                        <EyeOff
                          size={
                            18
                          }
                        />
                        مخفي
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      startEdit(resource)
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-[#FFF4F8]
                      px-4
                      py-2
                      font-bold
                      text-gray-700
                    "
                  >
                    <Pencil size={18} />
                    تعديل
                  </button>

                  <button
                    onClick={() =>
                      deleteResource(
                        resource.id
                      )
                    }
                    className="
                      rounded-xl
                      bg-red-500
                      p-3
                      text-white
                    "
                  >
                    <Trash2
                      size={18}
                    />
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </section>

      {/* EDIT MODAL — كانت الدوال موجودة بدون أي واجهة توصلها */}

      {editingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">تعديل المصدر</h2>

              <button
                onClick={cancelEdit}
                className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <input
                placeholder="عنوان المصدر"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                className="w-full rounded-xl border p-4 text-black"
              />

              <textarea
                placeholder="وصف المصدر"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="h-32 w-full rounded-xl border p-4 text-black"
              />

              <div className="rounded-xl border p-4">
                <label className="mb-3 flex items-center gap-2 font-bold">
                  <FileText size={18} />
                  استبدال ملف PDF (اختياري)
                </label>

                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setPdfFile(e.target.files[0]);
                    }
                  }}
                />
              </div>

              <div className="rounded-xl border p-4">
                <label className="mb-3 flex items-center gap-2 font-bold">
                  <ImageIcon size={18} />
                  استبدال الصورة (اختياري)
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setThumbnailFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={updateResource}
                disabled={saving}
                className="flex-1 rounded-xl bg-[#E96B8A] px-6 py-3 font-bold text-white"
              >
                {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
              </button>

              <button
                onClick={cancelEdit}
                className="rounded-xl border px-6 py-3 font-bold text-gray-700"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}