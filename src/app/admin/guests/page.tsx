"use client";

import { useCallback, useEffect, useState, useMemo, Suspense } from "react";
import { AdminShell } from "@/components/AdminShell";
import { useSearchParams } from "next/navigation";
import { getCategoryColor } from "@/lib/colors";
import { isTasyakur } from "@/lib/config";

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

const DEFAULT_WHATSAPP_TEMPLATE = isTasyakur
  ? `Assalamu'alaikum Warahmatullahi Wabarakatuh,

Kepada Yth. Bapak/Ibu/Saudara/i {nama},

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara Tasyakur Menjelang Pernikahan putra kami:

*Robi Firmansyah & Tiara Nurillatiffah*

Silakan buka tautan undangan digital berikut untuk melihat detail acara:
{link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Atas perhatian dan kehadirannya, kami ucapkan terima kasih.

Wassalamu'alaikum Warahmatullahi Wabarakatuh

Hormat kami,
*Kel. Bpk. Indra Gunawan & Ibu Tini Martini*`
  : `Assalamu'alaikum Warahmatullahi Wabarakatuh,

Kepada Yth. Bapak/Ibu/Saudara/i {nama},

Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir di pernikahan kami.

Silakan buka undangan personal Anda:
{link}

Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.

Wassalamu'alaikum Warahmatullahi Wabarakatuh

Tiara & Robi`;

function normalizeWhatsAppNumber(contact: string): string | null {
  const digits = contact.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length >= 10) return `62${digits.slice(1)}`;
  if (digits.startsWith("8") && digits.length >= 9) return `62${digits}`;
  if (digits.startsWith("62") && digits.length >= 10) return digits;
  return null;
}

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

const getReceptionMessage = (
  guestName: string,
  link: string,
  senderType: "pengantin" | "ortu",
  side: "bride" | "groom"
) => {
  if (senderType === "pengantin") {
    return `_Assalamu'alaikum Warahmatullahi Wabarakatuh_

Tanpa mengurangi rasa hormat, melalui pesan ini kami ingin mengundang Bapak/Ibu/Saudara/i *${guestName}* untuk hadir dan memberikan doa restu pada hari bahagia kami.

Detail informasi mengenai acara dapat diakses melalui tautan berikut:

${link}

Kehadiran serta doa restu dari Bapak/Ibu/Saudara/i tentu akan menjadi kebahagiaan dan kehormatan yang sangat berarti bagi kami.

_Mohon maaf undangan ini hanya dapat kami sampaikan melalui pesan digital._

Atas perhatian dan keikhlasan doa Bapak/Ibu/Saudara/i, kami ucapkan terima kasih.

_Wassalamu'alaikum Warahmatullahi Wabarakatuh_

*Hormat kami,*
*Tiara & Robi*`;
  } else {
    const parentsName = side === "groom" ? "Indra Gunawan & Tini Martini" : "Enung Suherman & Amah";
    return `_Assalamu'alaikum Warahmatullahi Wabarakatuh_

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i *${guestName}* untuk menghadiri acara pernikahan putra-putri kami.

Informasi lengkap mengenai jadwal dan lokasi acara dapat diakses melalui tautan undangan digital berikut:

${link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.

_Mohon maaf apabila penyampaian undangan ini hanya dapat kami kirimkan melalui pesan singkat._

Atas perhatian, keikhlasan doa, dan kehadiran Bapak/Ibu/Saudara/i, kami mengucapkan terima kasih banyak.

_Wassalamu'alaikum Warahmatullahi Wabarakatuh_

*Hormat kami yang mengundang,*
*${parentsName}*`;
  }
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const activeFilterCount =
    (filterCategory ? 1 : 0) +
    (filterRsvp ? 1 : 0) +
    (sortKey !== "created_at" || sortDir !== "desc" ? 1 : 0);


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

  const fetchData = useCallback(() => {
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
  }, [side]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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



  const invitationLinkFor = (guest: Guest) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `${baseUrl}/?to=${encodeURIComponent(guest.name)}`;
  };

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [senderModalGuest, setSenderModalGuest] = useState<{ guest: Guest; action: "wa" | "copy" } | null>(null);

  const messageFor = (guest: Guest, senderType?: "pengantin" | "ortu") => {
    if (isTasyakur) {
      return DEFAULT_WHATSAPP_TEMPLATE
        .replaceAll("{nama}", guest.name)
        .replaceAll("{link}", invitationLinkFor(guest));
    }
    const type = senderType || "pengantin";
    return getReceptionMessage(guest.name, invitationLinkFor(guest), type, side);
  };

  const executeOpenWhatsApp = async (guest: Guest, senderType: "pengantin" | "ortu") => {
    const message = messageFor(guest, senderType);
    const phoneNumber = normalizeWhatsAppNumber(guest.contact);

    if (phoneNumber) {
      window.open(
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    // If no phone number, open native share sheet (e.g. Android/iOS contact picker)
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: isTasyakur
            ? `Undangan Tasyakur untuk ${guest.name}`
            : `Undangan Pernikahan untuk ${guest.name}`,
          text: message,
        });
        return;
      } catch (err: any) {
        if (err?.name === "AbortError") return;
      }
    }

    // Fallback: Open WhatsApp directly so user can pick any contact to share to
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const executeCopyMessage = async (guest: Guest, senderType: "pengantin" | "ortu") => {
    try {
      await navigator.clipboard.writeText(messageFor(guest, senderType));
      setCopiedId(guest.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { }
  };

  const handleOpenGuestWhatsApp = (guest: Guest) => {
    if (isTasyakur) {
      executeOpenWhatsApp(guest, "pengantin");
    } else {
      setSenderModalGuest({ guest, action: "wa" });
    }
  };

  const handleCopyGuestWhatsAppMessage = (guest: Guest) => {
    if (isTasyakur) {
      executeCopyMessage(guest, "pengantin");
    } else {
      setSenderModalGuest({ guest, action: "copy" });
    }
  };

  const handleSenderSelect = (senderType: "pengantin" | "ortu") => {
    if (!senderModalGuest) return;
    const { guest, action } = senderModalGuest;
    setSenderModalGuest(null);

    if (action === "wa") {
      executeOpenWhatsApp(guest, senderType);
    } else {
      executeCopyMessage(guest, senderType);
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
    } catch { }
    setDeletingId(null);
  };

  const copyInvitationLink = (guest: Guest) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${baseUrl}/?to=${encodeURIComponent(guest.name)}`;
    navigator.clipboard?.writeText(link);
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

        {/* Compact Filters & Search */}
        <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm sm:p-4">
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, kode, kontak..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-8 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 sm:py-2.5"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setShowMobileFilters((prev) => !prev)}
              aria-expanded={showMobileFilters}
              className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all sm:hidden ${activeFilterCount > 0 || showMobileFilters
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Expanded Filter Options (Collapsible on mobile, inline on desktop) */}
          <div
            className={`mt-2.5 pt-2.5 border-t border-slate-100 sm:mt-3 sm:pt-0 sm:border-t-0 ${showMobileFilters ? "block" : "hidden sm:flex"
              } sm:flex sm:flex-wrap sm:items-center sm:gap-2.5`}
          >
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white sm:w-auto sm:text-sm sm:py-2"
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white sm:w-auto sm:text-sm sm:py-2"
              >
                <option value="">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="hadir">Hadir</option>
                <option value="tidak_hadir">Tidak Hadir</option>
                <option value="ragu">Ragu</option>
              </select>
            </div>

            <div className="mt-2 flex items-center gap-2 sm:mt-0">
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white sm:w-auto sm:text-sm sm:py-2"
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
                className="shrink-0 rounded-xl border border-slate-200 bg-slate-50/70 p-2 text-slate-600 transition hover:bg-slate-100 sm:py-2 sm:px-2.5"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  {sortDir === "asc" ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h13.5m-13.5 6H12m-8.25 6h5.25m4.5 0 3-3m0 0 3 3m-3-3v9" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h13.5m-13.5 6H12m-8.25 6h5.25m4.5-9 3 3m0 0 3-3m-3 3v-9" />
                  )}
                </svg>
              </button>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterCategory("");
                    setFilterRsvp("");
                    setSortKey("created_at");
                    setSortDir("desc");
                  }}
                  className="rounded-xl px-2 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                >
                  Reset
                </button>
              )}
            </div>
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
            <div className="space-y-2 lg:hidden">
              {sorted.map((g) => {
                const badge = RSVP_BADGE[g.rsvp_status] ?? RSVP_BADGE.pending;
                return (
                  <div key={g.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs transition hover:border-slate-300">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="font-semibold text-slate-900 text-sm leading-tight truncate">{g.name}</p>
                          {g.guest_categories && (() => {
                            const catMatch = categories.find((c) => c.name === g.guest_categories!.name);
                            const colorInfo = getCategoryColor(catMatch?.color ?? "slate");
                            return (
                              <span className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${colorInfo.bg} ${colorInfo.text}`}>
                                {g.guest_categories.name}
                              </span>
                            );
                          })()}
                          <span className="text-[11px] font-medium text-slate-400">· {g.pax} org</span>
                        </div>
                        {g.contact && (
                          <p className="mt-1 text-xs text-slate-500 font-mono truncate">
                            {g.contact}
                          </p>
                        )}
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2">
                      <button
                        type="button"
                        onClick={() => handleOpenGuestWhatsApp(g)}
                        title={
                          normalizeWhatsAppNumber(g.contact)
                            ? `Buka Chat WhatsApp (${g.name})`
                            : `Bagikan Undangan (${g.name}) via WhatsApp / Kontak`
                        }
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${normalizeWhatsAppNumber(g.contact)
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                          }`}
                      >
                        {normalizeWhatsAppNumber(g.contact) ? (
                          <>
                            <svg className="h-3.5 w-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                            </svg>
                            <span>Chat WA</span>
                          </>
                        ) : (
                          <>
                            <svg className="h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                            </svg>
                            <span>Bagikan</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleCopyGuestWhatsAppMessage(g)}
                          title={copiedId === g.id ? "Pesan WA Tersalin!" : "Salin Pesan WhatsApp"}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                        >
                          {copiedId === g.id ? (
                            <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v9.25c0 .621-.504 1.125-1.125 1.125Z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => openEditModal(g)}
                          title="Edit Tamu"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </button>
                        {deletingId === g.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(g.id)} className="rounded-lg bg-red-100 px-2 py-1 text-[11px] font-medium text-red-600 hover:bg-red-200">Hapus</button>
                            <button onClick={() => setDeletingId(null)} className="rounded-lg px-2 py-1 text-[11px] text-slate-500 hover:text-slate-700">Batal</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeletingId(g.id)}
                            title="Hapus"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        )}
                      </div>
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
                            <button
                              type="button"
                              onClick={() => handleOpenGuestWhatsApp(g)}
                              title={
                                normalizeWhatsAppNumber(g.contact)
                                  ? `Buka Chat WhatsApp (${g.name})`
                                  : `Bagikan Undangan (${g.name}) via WhatsApp / Kontak`
                              }
                              className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50 transition-colors"
                            >
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyGuestWhatsAppMessage(g)}
                              title={copiedId === g.id ? "Pesan WA Tersalin!" : "Salin Pesan WhatsApp"}
                              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            >
                              {copiedId === g.id ? (
                                <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                              ) : (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v9.25c0 .621-.504 1.125-1.125 1.125Z" />
                                </svg>
                              )}
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

      {/* Sender Choice Modal */}
      {senderModalGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all">
            <h3 className="text-lg font-bold text-slate-900 text-center">
              Pilih Pengirim Undangan
            </h3>
            <p className="mt-2 text-sm text-slate-500 text-center">
              Pilih format pesan berdasarkan pengirim undangan untuk <span className="font-semibold text-slate-700">{senderModalGuest.guest.name}</span>.
            </p>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => handleSenderSelect("pengantin")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 p-4 text-left transition-colors group"
              >
                <div className="font-bold text-slate-800 group-hover:text-slate-900 text-sm">
                  Pengantin
                </div>
                <div className="mt-0.5 text-xs text-slate-500">
                  Format dari Tiara & Robi
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSenderSelect("ortu")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 p-4 text-left transition-colors group"
              >
                <div className="font-bold text-slate-800 group-hover:text-slate-900 text-sm">
                  Orang Tua
                </div>
                <div className="mt-0.5 text-xs text-slate-500">
                  Format dari {side === "groom" ? "Indra & Martini" : "Enung & Amah"}
                </div>
              </button>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSenderModalGuest(null)}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                Batal
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
        className={`flex w-full items-center gap-1 ${alignCls} uppercase transition-colors hover:text-slate-800 ${active ? "text-emerald-600" : ""
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
