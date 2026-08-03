"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ArrowRight,
  Layers,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

// لون احتياطي بس لو الباقة مالهاش لون محدد في قاعدة البيانات
const DEFAULT_PACKAGE_COLOR = "#7A1F3D";

type PackageInfo = {
  id: string;
  title: string;
  color: string | null;
  thumbnail: string | null;
};

type ModuleRow = {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  package_id: string;
  packages: PackageInfo | null;
};

type ModuleForm = {
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  package_id: string;
};

const EMPTY_MODULE: ModuleForm = {
  title: "",
  description: "",
  sort_order: 1,
  is_active: true,
  package_id: "",
};

export default function AdminModulesPage() {
  const router = useRouter();

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [packages, setPackages] = useState<PackageInfo[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ModuleForm>(EMPTY_MODULE);

  useEffect(() => {
    checkAdminAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setLoading(true);
    setError("");

    try {
      const [{ data: modulesData, error: modulesError }, { data: packagesData, error: packagesError }] =
        await Promise.all([
          supabase
            .from("course_modules")
            .select("*, packages(id, title, color, thumbnail)")
            .order("package_id", { ascending: true })
            .order("sort_order", { ascending: true }),
          supabase
            .from("packages")
            .select("id, title, color, thumbnail")
            .order("title", { ascending: true }),
        ]);

      if (modulesError) throw modulesError;
      if (packagesError) throw packagesError;

      // فلترة أي صف رجع من غير id صالح (حماية إضافية) —
      // عشان نضمن إن أي رابط هنبنيه بعد كده يبقى دايمًا فيه id حقيقي
      const safeModules = (modulesData ?? []).filter(
        (m: any) => m?.id && m.id !== "undefined" && m.id !== "null"
      ) as unknown as ModuleRow[];

      setModules(safeModules);
      setPackages((packagesData ?? []) as PackageInfo[]);
    } catch (err: any) {
      console.error("Load modules error:", err?.message, err?.details, err?.hint, err?.code);
      setError(err?.message || "تعذّر تحميل بيانات الوحدات");
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setEditingId(null);
    setForm({
      ...EMPTY_MODULE,
      package_id: packages[0]?.id ?? "",
      sort_order: modules.length + 1,
    });
    setShowForm(true);
  }

  function openEditForm(mod: ModuleRow) {
    setEditingId(mod.id);
    setForm({
      title: mod.title,
      description: mod.description ?? "",
      sort_order: mod.sort_order,
      is_active: mod.is_active,
      package_id: mod.package_id,
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_MODULE);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("اكتبي عنوان الوحدة على الأقل");
      return;
    }

    if (!form.package_id) {
      setError("اختاري الباقة التابعة لها الوحدة");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from("course_modules")
          .update({
            title: form.title,
            description: form.description,
            sort_order: form.sort_order,
            is_active: form.is_active,
            package_id: form.package_id,
          })
          .eq("id", editingId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("course_modules").insert({
          title: form.title,
          description: form.description,
          sort_order: form.sort_order,
          is_active: form.is_active,
          package_id: form.package_id,
        });

        if (insertError) throw insertError;
      }

      closeForm();
      await loadData();
    } catch (err) {
      console.error("Save module error:", err);
      setError("تعذّر حفظ الوحدة، حاولي مرة أخرى");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteModule(mod: ModuleRow) {
    const confirmed = window.confirm(
      `هل تريدين حذف الوحدة "${mod.title}"؟ سيتم حذف كل دروسها أيضًا.`
    );

    if (!confirmed) return;

    try {
      const { error: deleteError } = await supabase.from("course_modules").delete().eq("id", mod.id);
      if (deleteError) throw deleteError;
      await loadData();
    } catch (err) {
      console.error("Delete module error:", err);
      setError("تعذّر حذف الوحدة");
    }
  }

  if (checkingAccess) {
    return (
      <div dir="rtl" className="flex min-h-screen items-center justify-center text-lg font-bold text-black">
        جارٍ التحقق من الصلاحيات...
      </div>
    );
  }

  return (
    <main dir="rtl" className="mx-auto max-w-6xl px-8 py-10">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-2 font-bold text-[#E96B8A] transition hover:gap-3"
      >
        <ArrowRight size={18} />
        العودة للوحة التحكم
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-bold text-gray-400">إدارة الوحدات التدريبية</p>
          <h1 className="mt-1 text-4xl font-black text-black">الوحدات</h1>
        </div>

        <button
          onClick={openCreateForm}
          disabled={packages.length === 0}
          className="flex items-center gap-2 rounded-2xl bg-[#E96B8A] px-6 py-3.5 font-bold text-white transition disabled:opacity-60"
        >
          <Plus size={18} />
          إضافة وحدة جديدة
        </button>
      </div>

      {packages.length === 0 && !loading && (
        <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 font-bold text-yellow-700">
          لا توجد باقات بعد — أضيفي باقة أولًا قبل إنشاء وحدة
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-bold text-red-600">
          {error}
        </div>
      )}

      {/* MODULE FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-black">
              {editingId ? "تعديل الوحدة" : "إضافة وحدة جديدة"}
            </h2>
            <button type="button" onClick={closeForm} className="rounded-full p-2 text-gray-400 hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block font-bold text-black">الباقة</label>
              <select
                value={form.package_id}
                onChange={(e) => setForm({ ...form, package_id: e.target.value })}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E96B8A]"
              >
                <option value="" disabled>
                  اختاري الباقة
                </option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-bold text-black">عنوان الوحدة</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="مثال: أساسيات تحديد المسار المهني"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E96B8A]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-bold text-black">وصف الوحدة</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E96B8A]"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-black">ترتيب الوحدة</label>
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

          <div className="mt-8 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-[#E96B8A] px-8 py-3.5 font-bold text-white transition disabled:opacity-60"
            >
              {saving ? "جارٍ الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة الوحدة"}
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

      {/* MODULES LIST */}
      <div className="mt-10 space-y-4">
        {loading && <p className="font-bold text-black">جارٍ تحميل الوحدات...</p>}

        {!loading && modules.length === 0 && (
          <div className="rounded-3xl bg-white p-14 text-center shadow-sm">
            <p className="font-bold text-black">لا توجد وحدات مضافة بعد</p>
          </div>
        )}

        {!loading &&
          modules.map((mod) => {
            const accent = mod.packages?.color || DEFAULT_PACKAGE_COLOR;

            // حماية حاسمة: منعرضش رابط أصلًا لو الـ id مش موجود —
            // كده منقدرش نبني رابط زي /admin/modules/undefined تاني
            const hasValidId = Boolean(mod.id) && mod.id !== "undefined" && mod.id !== "null";

            return (
              <div
                key={mod.id ?? mod.title}
                className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-black"
                    style={{ backgroundColor: "#FFF0F5", color: accent }}
                  >
                    <Layers size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-black">{mod.title}</h3>
                      {!mod.is_active && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                          غير نشطة
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {mod.packages?.title ?? "بدون باقة محددة"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {hasValidId ? (
                    <Link
                      href={`/admin/modules/${mod.id}`}
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold text-white transition"
                      style={{ backgroundColor: accent }}
                    >
                      إدارة المحاضرات
                    </Link>
                  ) : (
                    <span className="rounded-xl bg-gray-100 px-4 py-2.5 font-bold text-gray-400">
                      معرّف غير صالح
                    </span>
                  )}

                  <button
                    onClick={() => openEditForm(mod)}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 font-bold text-black hover:bg-gray-50"
                  >
                    <Pencil size={16} />
                    تعديل
                  </button>

                  <button
                    onClick={() => handleDeleteModule(mod)}
                    className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 font-bold text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    حذف
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
}