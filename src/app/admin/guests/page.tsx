"use client";

import { useEffect, useState, useMemo, Suspense, useRef } from "react";
import { AdminShell } from "@/components/AdminShell";
import { useSearchParams } from "next/navigation";
import { toCsv } from "@/lib/csv";
import { getCategoryColor } from "@/lib/colors";

interface Category {
  id: string;
  name: string;
  color: string;
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

type SortKey = "name" | "unique_code" | "category" | "pax" | "rsvp_status" | "created_at";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "created_at", label: "Terbaru" },
  { key: "name", label: "Nama" },
  { key: "unique_code", label: "Kode" },
  { key: "category", label: "Kategori" },
  { key: "pax", label: "Jumlah" },
  { key: "rsvp_status", label: "Status" },
];

const RSVP_BADGE: Record<string, { label: string; cls: string }> = {
  hadir: { label: "Hadir", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  tidak_hadir: { label: "Tidak Hadir", cls: "bg-rose-50 text-rose-700 ring-rose-200" },
  ragu: { label: "Ragu", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  pending: { label: "Pending", cls: "bg-slate-100 text-slate-600 ring-slate-200" },
};

function GuestsContent() {
  const searchParams = useSearchParams();
  const side = searchParams.get("side") === "bride" ? "bride" : "groom";
  const sideLabel = side === "bride" ? "Pengantin Wanita" : "Pengantin Pria";

  const [guests, setGuests] = useState<Guest[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterRsvp, setFilterRsvp] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bulkStatus, setBulkStatus] = useState<string | null>(null);

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch(`/api/admin/guests?side=${side}`).then((r) => r.json()),
      fetch(`/api/admin/categories?side=${side}`).then((r) => r.json()),
    ])
      .then(([gData, cData]) => {
        setGuests(gData.guests ?? []);
        setCategories(cData.categories ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [side]);

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

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    const valueOf = (g: Guest): string | number => {
      switch (sortKey) {
        case "name":
          return g.name.toLowerCase();
        case "unique_code":
          return g.unique_code.toLowerCase();
        case "category":
          return (g.guest_categories?.name ?? "").toLowerCase();
        case "pax":
          return g.pax;
        case "rsvp_status":
          return g.rsvp_status;
        case "created_at":
        default:
          return g.created_at;
      }
    };
    return [...filtered].sort((a, b) => {
      const va = valueOf(a);
      const vb = valueOf(b);
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "created_at" || key === "pax" ? "desc" : "asc");
    }
  };

  const openAddModal = () => {
    setEditingGuest(null);
    setFormData({ name: "", category_id: "", pax: 1, contact_type: "WhatsApp", contact: "" });
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
    if (!formData.category_id) {
      setFormError("Kategori wajib diisi.");
      return;
    }
    
    setSaving(true);
    setFormError("");

    try {
      const payload = { ...formData, side };
      if (editingGuest) {
        const res = await fetch("/api/admin/guests", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingGuest.id, ...payload }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        const { guest } = await res.json();
        setGuests((prev) => prev.map((g) => (g.id === guest.id ? guest : g)));
      } else {
        const res = await fetch("/api/admin/guests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        const { guest } = await res.json();
        setGuests((prev) => [guest, ...prev]);
      }
      setShowModal(false);
    } catch (e: any) {
      setFormError(e.message || "Terjadi kesalahan.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/guests?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) setGuests((prev) => prev.filter((g) => g.id !== id));
    } catch {}
    setDeletingId(null);
  };

  const copyInvitationLink = (guest: Guest) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${baseUrl}/?to=${encodeURIComponent(guest.name)}&id=${guest.unique_code}`;
    navigator.clipboard?.writeText(link);
  };

  const handleDownloadCsv = () => {
    const header = ["unique_code", "name", "category", "pax", "contact_type", "contact"];
    const rows = guests.map((g) => [
      g.unique_code,
      g.name,
      g.guest_categories?.name || "",
      g.pax.toString(),
      g.contact_type,
      g.contact
    ]);
    const csvContent = toCsv([header, ...rows]);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `tamu-${side}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkStatus("Mengunggah...");
    try {
      const text = await file.text();
      const res = await fetch("/api/admin/guests/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ side, csv: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal mengunggah CSV");
      } else {
        const { created, updated, categoriesCreated, errors } = data.summary;
        let msg = `Berhasil! Dibuat: ${created}, Diperbarui: ${updated}, Kategori Baru: ${categoriesCreated}.`;
        if (errors.length > 0) {
          msg += `\nTerdapat ${errors.length} error (lihat console).`;
          console.warn("CSV Import Errors:", errors);
        }
        alert(msg);
        fetchData();
      }
    } catch (err) {
      alert("Terjadi kesalahan saat memproses file.");
    }
    setBulkStatus(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Tamu Undangan <span className="text-slate-400 font-normal">· {sideLabel}</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {guests.length} tamu terdaftar
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              onClick={handleDownloadCsv}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 sm:w-auto"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download CSV
            </button>
            <div>
              <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleUploadCsv} />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={!!bulkStatus}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                {bulkStatus || "Upload CSV"}
              </button>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-600 hover:to-emerald-700 sm:w-auto"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Tambah Tamu
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, kode, atau kontak..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="hadir">Hadir</option>
            <option value="tidak_hadir">Tidak Hadir</option>
            <option value="ragu">Ragu</option>
          </select>
          <div className="flex gap-2">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  Urutkan: {o.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              title={sortDir === "asc" ? "Naik (A-Z)" : "Turun (Z-A)"}
              className="shrink-0 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-600 transition-colors hover:bg-slate-50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                {sortDir === "asc" ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h13.5m-13.5 6H12m-8.25 6h5.25m4.5 0 3-3m0 0 3 3m-3-3v9" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h13.5m-13.5 6H12m-8.25 6h5.25m4.5-9 3 3m0 0 3-3m-3 3v-9" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Table / List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
            {search || filterCategory || filterRsvp
              ? "Tidak ada tamu yang sesuai filter."
              : "Belum ada tamu. Klik \"Tambah Tamu\" atau \"Upload CSV\" untuk memulai."}
          </div>
        ) : (
          <>
            {/* Mobile card list */}
            <div className="space-y-3 lg:hidden">
              {sorted.map((g) => {
                const badge = RSVP_BADGE[g.rsvp_status] ?? RSVP_BADGE.pending;
                return (
                  <div key={g.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">{g.name}</p>
                        <code className="mt-1 inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                          {g.unique_code}
                        </code>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>

                    <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                       <div>
                         <dt className="text-xs text-slate-400">Kategori</dt>
                         <dd className="mt-0.5">
                           {g.guest_categories ? (() => {
                             const catMatch = categories.find(c => c.name === g.guest_categories!.name);
                             const colorInfo = getCategoryColor(catMatch?.color ?? "slate");
                             return (
                               <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorInfo.bg} ${colorInfo.text}`}>
                                 {g.guest_categories.name}
                               </span>
                             );
                           })() : <span className="text-slate-400">—</span>}
                         </dd>
                       </div>
                      <div>
                        <dt className="text-xs text-slate-400">Jumlah</dt>
                        <dd className="text-slate-700">{g.pax}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-xs text-slate-400">{g.contact_type}</dt>
                        <dd className="break-words text-slate-700">{g.contact || "—"}</dd>
                      </div>
                    </dl>

                    <div className="mt-3 flex items-center justify-end gap-1 border-t border-slate-100 pt-3">
                      <button onClick={() => copyInvitationLink(g)} title="Salin Link" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-5.236a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 1 0-6.364 6.364l1.757 1.757" />
                        </svg>
                      </button>
                      <button onClick={() => openEditModal(g)} title="Edit Tamu" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                      {deletingId === g.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(g.id)} className="rounded-lg bg-red-100 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-200">Hapus</button>
                          <button onClick={() => setDeletingId(null)} className="rounded-lg px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-700">Batal</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingId(g.id)} title="Hapus" className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
              <table className="w-full min-w-[800px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <SortableTh label="Kode" sortKey="unique_code" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                    <SortableTh label="Nama" sortKey="name" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                    <SortableTh label="Kategori" sortKey="category" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                    <SortableTh label="Jumlah" sortKey="pax" activeKey={sortKey} dir={sortDir} onSort={toggleSort} align="center" />
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Kontak</th>
                    <SortableTh label="Status" sortKey="rsvp_status" activeKey={sortKey} dir={sortDir} onSort={toggleSort} align="center" />
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sorted.map((g) => {
                    const badge = RSVP_BADGE[g.rsvp_status] ?? RSVP_BADGE.pending;
                    return (
                      <tr key={g.id} className="transition-colors hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <code className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{g.unique_code}</code>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900">{g.name}</td>
                         <td className="px-4 py-3">
                           {g.guest_categories ? (() => {
                             const catMatch = categories.find(c => c.name === g.guest_categories!.name);
                             const colorInfo = getCategoryColor(catMatch?.color ?? "slate");
                             return (
                               <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${colorInfo.bg} ${colorInfo.text}`}>
                                 {g.guest_categories.name}
                               </span>
                             );
                           })() : <span className="text-slate-400">—</span>}
                         </td>
                        <td className="px-4 py-3 text-center text-slate-700">{g.pax}</td>
                        <td className="px-4 py-3">
                          <div className="text-slate-500">
                            <span className="text-xs text-slate-400">{g.contact_type}: </span>
                            <span className="text-slate-700">{g.contact || "—"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${badge.cls}`}>{badge.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => copyInvitationLink(g)} title="Salin" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-5.236a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 1 0-6.364 6.364l1.757 1.757" />
                              </svg>
                            </button>
                            <button onClick={() => openEditModal(g)} title="Edit" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                              </svg>
                            </button>
                            {deletingId === g.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleDelete(g.id)} className="rounded-lg bg-red-100 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-200">Hapus</button>
                                <button onClick={() => setDeletingId(null)} className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:text-slate-700">Batal</button>
                              </div>
                            ) : (
                              <button onClick={() => setDeletingId(g.id)} title="Hapus" className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              {editingGuest ? "Edit Tamu" : "Tambah Tamu Baru"}
            </h2>

            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="guest-name" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Tamu *</label>
                <input
                  id="guest-name" type="text" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={100} placeholder="Nama lengkap tamu"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label htmlFor="guest-category" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Kategori *</label>
                <select
                  id="guest-category" value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="guest-pax" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Jumlah (Pax)</label>
                <input
                  id="guest-pax" type="number" min={1} max={20} value={formData.pax}
                  onChange={(e) => setFormData({ ...formData, pax: parseInt(e.target.value) || 1 })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="guest-contact-type" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Tipe Kontak</label>
                  <select
                    id="guest-contact-type" value={formData.contact_type}
                    onChange={(e) => setFormData({ ...formData, contact_type: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {CONTACT_TYPES.map((ct) => <option key={ct} value={ct}>{ct}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="guest-contact" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Kontak</label>
                  <input
                    id="guest-contact" type="text" value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    maxLength={100} placeholder="No. WA / Email / dll"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {editingGuest && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Kode Unik</p>
                  <p className="mt-1 font-mono text-lg font-bold text-emerald-600">{editingGuest.unique_code}</p>
                </div>
              )}

              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{formError}</div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
              >
                Batal
              </button>
              <button
                onClick={handleSave} disabled={saving}
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : editingGuest ? "Simpan Perubahan" : "Tambah Tamu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function SortableTh({
  label,
  sortKey,
  activeKey,
  dir,
  onSort,
  align = "left",
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  dir: "asc" | "desc";
  onSort: (key: SortKey) => void;
  align?: "left" | "center" | "right";
}) {
  const active = activeKey === sortKey;
  const alignCls =
    align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start";
  return (
    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`flex w-full items-center gap-1 ${alignCls} uppercase transition-colors hover:text-slate-800 ${
          active ? "text-emerald-600" : ""
        }`}
      >
        {label}
        <svg
          className={`h-3.5 w-3.5 transition-opacity ${active ? "opacity-100" : "opacity-30"}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          {active && dir === "asc" ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          )}
        </svg>
      </button>
    </th>
  );
}

export default function AdminGuestsPage() {
  return (
    <Suspense fallback={<div className="flex py-20 items-center justify-center">Memuat...</div>}>
      <GuestsContent />
    </Suspense>
  );
}
