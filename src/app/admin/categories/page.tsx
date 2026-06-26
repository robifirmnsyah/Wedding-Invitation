"use client";

import { useEffect, useState, Suspense } from "react";
import { AdminShell } from "@/components/AdminShell";
import { useSearchParams } from "next/navigation";
import { CATEGORY_COLORS, getCategoryColor } from "@/lib/colors";

interface Category {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

function CategoriesContent() {
  const searchParams = useSearchParams();
  const side = searchParams.get("side") === "bride" ? "bride" : "groom";
  const sideLabel = side === "bride" ? "Pengantin Wanita" : "Pengantin Pria";

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("slate");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("slate");
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/categories?side=${side}`)
      .then((r) => r.json())
      .then((d) => {
        setCategories(d.categories ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [side]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;

    setAdding(true);
    setError("");

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, side, color: newColor }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Gagal menambahkan.");
        setAdding(false);
        return;
      }

      const { category } = await res.json();
      setCategories((prev) => [...prev, category].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName("");
      setNewColor("slate");
    } catch {
      setError("Terjadi kesalahan.");
    }
    setAdding(false);
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color || "slate");
    setError("");
  };

  const handleEditSave = async (id: string) => {
    const trimmed = editName.trim();
    if (!trimmed) return;

    setSavingEdit(true);
    setError("");

    try {
      const res = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: trimmed, color: editColor }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Gagal memperbarui.");
        setSavingEdit(false);
        return;
      }

      const { category } = await res.json();
      setCategories((prev) =>
        prev
          .map((c) => (c.id === id ? category : c))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      setEditingId(null);
    } catch {
      setError("Terjadi kesalahan.");
    }
    setSavingEdit(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(
        `/api/admin/categories?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch {
      // silently fail
    }
    setDeletingId(null);
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Kategori Tamu <span className="text-slate-400 font-normal">· {sideLabel}</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola kategori untuk mengelompokkan tamu undangan
          </p>
        </div>

        {/* Add form */}
        <form
          onSubmit={handleAdd}
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={100}
              placeholder="Nama kategori baru, misal: Teman Kuliah"
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="submit"
              disabled={adding || !newName.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {adding ? "Menambah..." : "Tambah"}
            </button>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Pilih Warna</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setNewColor(c.id)}
                  title={c.id}
                  className={`h-6 w-6 rounded-full ${c.bg} border-2 ${
                    newColor === c.id ? c.border + " ring-2 ring-emerald-500 ring-offset-1" : "border-transparent hover:scale-110"
                  } transition-all`}
                />
              ))}
            </div>
          </div>
        </form>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6h.008v.008H6V6Z"
              />
            </svg>
            <p className="mt-4 text-slate-500">
              Belum ada kategori. Tambahkan kategori pertama di atas.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const colorInfo = getCategoryColor(cat.color || "slate");

              if (editingId === cat.id) {
                const editColorInfo = getCategoryColor(editColor);
                return (
                  <div
                    key={cat.id}
                    className={`flex flex-col gap-3 rounded-2xl border ${editColorInfo.border} bg-white p-4 shadow-md sm:col-span-2 lg:col-span-1`}
                  >
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      maxLength={100}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEditSave(cat.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <div className="flex flex-wrap gap-2">
                      {CATEGORY_COLORS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setEditColor(c.id)}
                          title={c.id}
                          className={`h-6 w-6 rounded-full ${c.bg} border-2 ${
                            editColor === c.id
                              ? c.border + " ring-2 ring-emerald-500 ring-offset-1"
                              : "border-transparent hover:scale-110"
                          } transition-all`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => handleEditSave(cat.id)}
                        disabled={savingEdit || !editName.trim()}
                        className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                      >
                        {savingEdit ? "Menyimpan..." : "Simpan"}
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={cat.id}
                  className={`group flex items-center justify-between rounded-2xl border ${colorInfo.border} bg-white p-4 shadow-sm transition-all hover:shadow-md`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorInfo.bg} ${colorInfo.text}`}>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {cat.name}
                    </span>
                  </div>

                  {deletingId === cat.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="rounded-lg bg-red-100 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-200"
                      >
                        Hapus
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:text-slate-700"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(cat)}
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-emerald-50 hover:text-emerald-600 sm:opacity-0 sm:group-hover:opacity-100"
                        title="Edit kategori"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeletingId(cat.id)}
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                        title="Hapus kategori"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminShell>
  );
}

export default function AdminCategoriesPage() {
  return (
    <Suspense fallback={<div className="flex py-20 items-center justify-center">Memuat...</div>}>
      <CategoriesContent />
    </Suspense>
  );
}
