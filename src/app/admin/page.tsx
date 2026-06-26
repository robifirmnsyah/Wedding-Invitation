"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { getCategoryColor } from "@/lib/colors";

interface Stats {
  total: number;
  hadir: number;
  tidak_hadir: number;
  ragu: number;
  pending: number;
  total_pax: number;
  hadir_pax: number;
  groom: number;
  groom_pax: number;
  bride: number;
  bride_pax: number;
}

interface CategoryBreakdown {
  name: string;
  side: string;
  color: string;
  count: number;
  pax: number;
}

const STAT_CARDS = [
  {
    key: "total" as const,
    label: "Total Tamu",
    gradient: "from-blue-500 to-blue-600",
    shadow: "shadow-blue-500/25",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    key: "hadir" as const,
    label: "Hadir",
    gradient: "from-emerald-500 to-emerald-600",
    shadow: "shadow-emerald-500/25",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    key: "tidak_hadir" as const,
    label: "Tidak Hadir",
    gradient: "from-rose-500 to-rose-600",
    shadow: "shadow-rose-500/25",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    key: "ragu" as const,
    label: "Masih Ragu",
    gradient: "from-amber-500 to-amber-600",
    shadow: "shadow-amber-500/25",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
      </svg>
    ),
  },
  {
    key: "pending" as const,
    label: "Belum RSVP",
    gradient: "from-slate-500 to-slate-600",
    shadow: "shadow-slate-500/25",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats ?? null);
        setCategoryBreakdown(d.categoryBreakdown ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AdminShell>
      <div className="space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Ringkasan data tamu undangan
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
        ) : stats ? (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
              {STAT_CARDS.map((card) => {
                // "Total" counts every person (sum of all pax), not just the
                // number of invitations.
                const value =
                  card.key === "total" ? stats.total_pax : stats[card.key];
                return (
                  <div
                    key={card.key}
                    className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-5`}
                  >
                    <div
                      className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`}
                    />
                    <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${card.gradient} p-2.5 text-white shadow-lg ${card.shadow}`}>
                      {card.icon}
                    </div>
                    <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
                      {value}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 uppercase tracking-wider">
                      {card.label}
                    </p>
                    {card.key === "total" && (
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {stats.total} undangan
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Per-side totals: Pengantin Pria vs Pengantin Wanita */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                {
                  label: "Tamu Pengantin Pria",
                  count: stats.groom,
                  pax: stats.groom_pax,
                  gradient: "from-sky-500 to-blue-600",
                  ring: "ring-sky-500/20",
                },
                {
                  label: "Tamu Pengantin Wanita",
                  count: stats.bride,
                  pax: stats.bride_pax,
                  gradient: "from-pink-500 to-rose-600",
                  ring: "ring-pink-500/20",
                },
              ].map((side) => {
                const pct =
                  stats.total > 0
                    ? Math.round((side.count / stats.total) * 100)
                    : 0;
                return (
                  <div
                    key={side.label}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                        {side.label}
                      </h3>
                      <span
                        className={`rounded-full bg-gradient-to-r ${side.gradient} px-2.5 py-0.5 text-xs font-semibold text-white`}
                      >
                        {pct}%
                      </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-slate-900">
                        {side.count}
                      </span>
                      <span className="text-sm text-slate-500">tamu</span>
                      <span className="ml-2 text-sm font-medium text-slate-400">
                        · {side.pax} kursi
                      </span>
                    </div>
                    <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${side.gradient} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Secondary stats row */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Total PAX */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Estimasi Total Kursi
                </h3>
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-slate-900">
                    {stats.total_pax}
                  </span>
                  <span className="text-sm text-slate-500">kursi total</span>
                </div>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-emerald-600">
                    {stats.hadir_pax}
                  </span>
                  <span className="text-sm text-slate-500">
                    kursi konfirmasi hadir
                  </span>
                </div>
                {stats.total_pax > 0 && (
                  <div className="mt-4">
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
                        style={{
                          width: `${Math.round(
                            (stats.hadir_pax / stats.total_pax) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {Math.round(
                        (stats.hadir_pax / stats.total_pax) * 100
                      )}
                      % konfirmasi hadir
                    </p>
                  </div>
                )}
              </div>

              {/* Category breakdown */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Berdasarkan Kategori
                </h3>
                <div className="mt-4 space-y-3">
                  {categoryBreakdown.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      Belum ada data kategori.
                    </p>
                  ) : (
                    categoryBreakdown.map((cat, i) => {
                      const colorInfo = getCategoryColor(cat.color || "slate");
                      const sideLabel =
                        cat.side === "bride" ? "Wanita" : "Pria";
                      return (
                        <div
                          key={`${cat.name}-${cat.side}-${i}`}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span
                              className={`h-3 w-3 shrink-0 rounded-full ${colorInfo.bg} ${colorInfo.border} border`}
                            />
                            <span className="truncate text-sm text-slate-700">
                              {cat.name}
                            </span>
                            <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                              {sideLabel}
                            </span>
                          </div>
                          <span
                            className={`shrink-0 rounded-full ${colorInfo.bg} ${colorInfo.text} px-3 py-1 text-xs font-semibold`}
                          >
                            {cat.count} tamu · {cat.pax} kursi
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* RSVP response rate */}
            {stats.total > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Response Rate RSVP
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { label: "Hadir", value: stats.hadir, color: "bg-emerald-500" },
                    { label: "Tidak Hadir", value: stats.tidak_hadir, color: "bg-rose-500" },
                    { label: "Ragu", value: stats.ragu, color: "bg-amber-500" },
                    { label: "Pending", value: stats.pending, color: "bg-slate-400" },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="mx-auto mb-2 h-3 w-full rounded-full bg-slate-100">
                        <div
                          className={`h-3 rounded-full ${item.color} transition-all duration-500`}
                          style={{
                            width: `${Math.round(
                              (item.value / stats.total) * 100
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">{item.label}</p>
                      <p className="text-lg font-bold text-slate-900">
                        {Math.round((item.value / stats.total) * 100)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-slate-500">
              Gagal memuat data. Pastikan Supabase sudah terkonfigurasi dengan benar.
            </p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
