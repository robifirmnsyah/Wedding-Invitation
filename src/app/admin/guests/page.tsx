"use client";

import { useEffect, useState, useMemo } from "react";
import { AdminShell } from "@/components/AdminShell";

interface Category {
  id: string;
  name: string;
}

interface Guest {
  id: string;
  unique_code: string;
  name: string;
  category_id: string | null;
  pax: number;
  contact_type: string;
  contact: string;
  rsvp_status: string;
  wish_message: string;
  created_at: string;
  guest_categories: { name: string } | null;
}

const CONTACT_TYPES = ["WhatsApp", "Email", "Instagram", "Telegram", "Lainnya"];

const RSVP_BADGE: Record<string, { label: string; cls: string }> = {
  hadir: {
    label: "Hadir",
    cls: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/20",
  },
  tidak_hadir: {
    label: "Tidak Hadir",
    cls: "bg-rose-500/15 text-rose-400 ring-rose-500/20",
  },
  ragu: {
    label: "Ragu",
    cls: "bg-amber-500/15 text-amber-400 ring-amber-500/20",
  },
  pending: {
    label: "Pending",
    cls: "bg-slate-500/15 text-slate-400 ring-slate-500/20",
  },
};

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterRsvp, setFilterRsvp] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    pax: 1,
    contact_type: "WhatsApp",
    contact: "",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete confirm
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/guests").then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ])
      .then(([gData, cData]) => {
        setGuests(gData.guests ?? []);
        setCategories(cData.categories ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return guests.filter((g) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !g.name.toLowerCase().includes(q) &&
          !g.unique_code.toLowerCase().includes(q) &&
          !g.contact.toLowerCase().includes(q)
        )
          return false;
      }
      if (filterCategory && g.category_id !== filterCategory) return false;
      if (filterRsvp && g.rsvp_status !== filterRsvp) return false;
      return true;
    });
  }, [guests, search, filterCategory, filterRsvp]);

  const openAddModal = () => {
    setEditingGuest(null);
    setFormData({
      name: "",
      category_id: "",
      pax: 1,
      contact_type: "WhatsApp",
      contact: "",
    });
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      category_id: guest.category_id ?? "",
      pax: guest.pax,
      contact_type: guest.contact_type,
      contact: guest.contact,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setFormError("Nama tamu wajib diisi.");
      return;
    }
    setSaving(true);
    setFormError("");

    try {
      if (editingGuest) {
        // Update
        const res = await fetch("/api/admin/guests", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingGuest.id, ...formData }),
        });
        if (!res.ok) {
          const data = await res.json();
          setFormError(data.error ?? "Gagal memperbarui.");
          setSaving(false);
          return;
        }
        const { guest } = await res.json();
        setGuests((prev) => prev.map((g) => (g.id === guest.id ? guest : g)));
      } else {
        // Create
        const res = await fetch("/api/admin/guests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const data = await res.json();
          setFormError(data.error ?? "Gagal menambahkan.");
          setSaving(false);
          return;
        }
        const { guest } = await res.json();
        setGuests((prev) => [guest, ...prev]);
      }
      setShowModal(false);
    } catch {
      setFormError("Terjadi kesalahan.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/guests?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setGuests((prev) => prev.filter((g) => g.id !== id));
      }
    } catch {
      // silently fail
    }
    setDeletingId(null);
  };

  const copyInvitationLink = (guest: Guest) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${baseUrl}/?to=${encodeURIComponent(guest.name)}&id=${guest.unique_code}`;
    navigator.clipboard?.writeText(link);
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Tamu Undangan</h1>
            <p className="mt-1 text-sm text-slate-400">
              {guests.length} tamu terdaftar
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-600 hover:to-emerald-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tambah Tamu
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-slate-900/50 p-4 sm:flex-row">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, kode, atau kontak..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={filterRsvp}
            onChange={(e) => setFilterRsvp(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="hadir">Hadir</option>
            <option value="tidak_hadir">Tidak Hadir</option>
            <option value="ragu">Ragu</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-slate-900/50">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Kode
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Kategori
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Jumlah
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Kontak
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-slate-500"
                    >
                      {search || filterCategory || filterRsvp
                        ? "Tidak ada tamu yang sesuai filter."
                        : "Belum ada tamu. Klik \"Tambah Tamu\" untuk memulai."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((g) => {
                    const badge = RSVP_BADGE[g.rsvp_status] ?? RSVP_BADGE.pending;
                    return (
                      <tr
                        key={g.id}
                        className="transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3">
                          <code className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-400">
                            {g.unique_code}
                          </code>
                        </td>
                        <td className="px-4 py-3 font-medium text-white">
                          {g.name}
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {g.guest_categories?.name ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-center text-slate-300">
                          {g.pax}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-400">
                            <span className="text-xs text-slate-500">
                              {g.contact_type}:{" "}
                            </span>
                            <span className="text-slate-300">{g.contact || "—"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${badge.cls}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            {/* Copy link */}
                            <button
                              onClick={() => copyInvitationLink(g)}
                              title="Salin Link Undangan"
                              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-5.236a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 1 0-6.364 6.364l1.757 1.757" />
                              </svg>
                            </button>
                            {/* Edit */}
                            <button
                              onClick={() => openEditModal(g)}
                              title="Edit Tamu"
                              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                              </svg>
                            </button>
                            {/* Delete */}
                            {deletingId === g.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDelete(g.id)}
                                  className="rounded-lg bg-red-500/20 px-2 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/30"
                                >
                                  Hapus
                                </button>
                                <button
                                  onClick={() => setDeletingId(null)}
                                  className="rounded-lg px-2 py-1 text-xs text-slate-500 transition-colors hover:text-slate-300"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeletingId(g.id)}
                                title="Hapus Tamu"
                                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white">
              {editingGuest ? "Edit Tamu" : "Tambah Tamu Baru"}
            </h2>

            <div className="mt-6 space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="guest-name"
                  className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                >
                  Nama Tamu *
                </label>
                <input
                  id="guest-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  maxLength={100}
                  placeholder="Nama lengkap tamu"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="guest-category"
                  className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                >
                  Kategori
                </label>
                <select
                  id="guest-category"
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pax */}
              <div>
                <label
                  htmlFor="guest-pax"
                  className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                >
                  Jumlah (Pax)
                </label>
                <input
                  id="guest-pax"
                  type="number"
                  min={1}
                  max={20}
                  value={formData.pax}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pax: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Contact type & Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="guest-contact-type"
                    className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >
                    Tipe Kontak
                  </label>
                  <select
                    id="guest-contact-type"
                    value={formData.contact_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact_type: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
                  >
                    {CONTACT_TYPES.map((ct) => (
                      <option key={ct} value={ct}>
                        {ct}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="guest-contact"
                    className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >
                    Kontak
                  </label>
                  <input
                    id="guest-contact"
                    type="text"
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                    maxLength={100}
                    placeholder="No. WA / Email / dll"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Unique code display (edit mode) */}
              {editingGuest && (
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Kode Unik
                  </p>
                  <p className="mt-1 font-mono text-lg font-bold text-emerald-400">
                    {editingGuest.unique_code}
                  </p>
                </div>
              )}

              {/* Error */}
              {formError && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {formError}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:text-slate-200"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50"
              >
                {saving
                  ? "Menyimpan..."
                  : editingGuest
                    ? "Simpan Perubahan"
                    : "Tambah Tamu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
