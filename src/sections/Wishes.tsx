"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiOutlinePaperAirplane,
  HiCheckBadge,
  HiCheckCircle,
  HiXCircle,
  HiQuestionMarkCircle
} from "react-icons/hi2";
import { SectionTitle } from "@/components/Decor";
import { StaggerGroup, RevealItem } from "@/components/Reveal";
import { useGuestInfo } from "@/hooks/useGuestName";
import { motionTokens } from "@/animations/tokens";
import {
  slideFromLeft,
  slideFromRight,
  staggerContainer,
} from "@/animations/variants";
import { attendanceLabel, relativeTime } from "@/lib/utils";
import type { Wish } from "@/lib/types";

const PAGE_SIZE = 4;
const ATTENDANCE: Wish["attendance"][] = ["hadir", "tidak_hadir", "ragu"];
const GUEST_FALLBACK = "Tamu Undangan";

interface RegisteredGuest {
  id: string;
  unique_code: string;
  name: string;
  pax: number;
  rsvp_status: string;
  wish_message: string;
}

const formState = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: {
    duration: motionTokens.durationBase,
    ease: motionTokens.easeOut,
  },
} as const;

export function Wishes() {
  const guestInfo = useGuestInfo();
  const guestName = guestInfo.name;
  const guestCode = guestInfo.code;
  const isPersonalised = guestName !== GUEST_FALLBACK;

  const [registeredGuest, setRegisteredGuest] = useState<RegisteredGuest | null>(null);
  const [guestLookupDone, setGuestLookupDone] = useState(false);

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState<Wish["attendance"]>("hadir");
  const [pax, setPax] = useState<number>(1);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    if (!guestCode) {
      setGuestLookupDone(true);
      return;
    }

    fetch(`/api/rsvp?code=${encodeURIComponent(guestCode)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.guest) {
          setRegisteredGuest(d.guest);
          if (d.guest.rsvp_status && d.guest.rsvp_status !== "pending") {
            setAttendance(d.guest.rsvp_status as Wish["attendance"]);
          }
          if (d.guest.pax) {
            setPax(d.guest.pax);
          }
          if (d.guest.wish_message) {
            setMessage(d.guest.wish_message);
          }
        }
        setGuestLookupDone(true);
      })
      .catch(() => {
        setGuestLookupDone(true);
      });
  }, [guestCode]);

  useEffect(() => {
    fetch("/api/wishes")
      .then((r) => r.json())
      .then((d) => {
        const list: Wish[] = d.wishes ?? [];
        list.sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });
        setWishes(list);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (registeredGuest) {
      setName(registeredGuest.name);
    } else if (isPersonalised) {
      setName((cur) => (cur ? cur : guestName));
    }
  }, [guestName, isPersonalised, registeredGuest]);

  const submitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();

    const senderName = (registeredGuest ? registeredGuest.name : name).trim();
    if (!senderName || !message.trim()) return;

    setStatus("sending");

    try {
      if (guestCode && registeredGuest) {
        try {
          await fetch("/api/rsvp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code: guestCode,
              rsvp_status: attendance,
              wish_message: message.trim(),
            }),
          });
        } catch {}
      }

      const verified = Boolean(
        registeredGuest ||
        (isPersonalised && senderName.toLowerCase() === guestName.trim().toLowerCase())
      );

      const wishRes = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: senderName,
          message: message.trim(),
          attendance,
          verified,
        }),
      });

      if (!wishRes.ok) throw new Error();

      const { wish } = await wishRes.json();
      setWishes((prev) => [wish, ...prev]);
      setStatus("success");
      setPage(1); // reset to first page to see new wish
    } catch {
      setStatus("error");
    }
  };

  const totalPages = Math.ceil(wishes.length / PAGE_SIZE);
  const paginatedWishes = wishes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getAttendanceIcon = (status: string) => {
    if (status === "hadir") return <HiCheckCircle className="text-emerald-500 text-xl" title="Hadir" />;
    if (status === "tidak_hadir") return <HiXCircle className="text-rose-500 text-xl" title="Tidak Hadir" />;
    return <HiQuestionMarkCircle className="text-amber-500 text-xl" title="Masih Ragu" />;
  };

  return (
    <section
      aria-labelledby="wishes-title"
      className="section-pad relative overflow-hidden "
    >
      <div className="relative z-[1]">
        <SectionTitle id="wishes-title" eyebrow="Send Your Love" title="Wedding Wishes" />

      <StaggerGroup
        variants={staggerContainer}
        early
        className="mx-auto mt-12 flex max-w-lg flex-col gap-8"
      >
        <RevealItem variants={slideFromLeft} className="paper-card h-fit p-5 sm:p-6">
          <AnimatePresence mode="wait" initial={false}>
          {status === "success" ? (
            <motion.div key="success" {...formState} className="py-8 text-center" role="status">
              <motion.div
                className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-olive-600 "
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...motionTokens.spring, delay: 0.1 }}
              >
                <svg
                  aria-hidden="true"
                  className="h-7 w-7 text-olive-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </motion.div>
              <p
                className="font-display font-semibold text-olive-900"
                style={{ fontSize: "var(--text-h3)" }}
              >
                Terima Kasih, {registeredGuest?.name || name || "Tamu Undangan"}!
              </p>
              <p className="mt-3 font-body text-sm leading-relaxed text-olive-700">
                RSVP dan ucapan Anda telah tersimpan. Kami sangat menantikan kehadiran Anda.
              </p>
            </motion.div>
          ) : (
            <motion.form key="form" {...formState} onSubmit={submitRsvp} className="space-y-4">
              {registeredGuest ? (
                <div className="border border-sage-300  p-3">
                  <div className="flex items-center gap-2">
                    <HiCheckBadge
                      aria-hidden="true"
                      className="text-lg text-olive-600"
                    />
                    <span className="font-body text-sm font-medium text-olive-900">
                      {registeredGuest.name}
                    </span>
                  </div>
                  <p className="mt-1 font-body text-xs text-olive-700">
                    Kode: {registeredGuest.unique_code} · Kuota: {registeredGuest.pax} orang
                  </p>
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="guest-name"
                    className="font-body text-xs font-medium text-olive-700"
                  >
                    Nama Anda
                  </label>
                  <input
                    id="guest-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={60}
                    required
                    placeholder="Nama Anda"
                    className="mt-1.5 min-h-10 w-full rounded border border-sage-300  px-3 py-2 font-body text-sm text-olive-900 outline-none transition-colors duration-200 placeholder:text-sage-500 focus:border-olive-600"
                  />
                </div>
              )}

              {/* Kehadiran Dropdown & Plus/Minus Jumlah Tamu Counter */}
              <div className="grid grid-cols-2 gap-3 items-end">
                {/* Kehadiran Dropdown */}
                <div>
                  <label
                    htmlFor="attendance-select"
                    className="font-body text-xs font-medium text-olive-700 block mb-1.5"
                  >
                    Kehadiran
                  </label>
                  <div className="relative">
                    <select
                      id="attendance-select"
                      value={attendance}
                      onChange={(e) => setAttendance(e.target.value as Wish["attendance"])}
                      className="min-h-10 w-full rounded-lg border border-sage-300 bg-[#FFFFFF] px-3 py-2 font-body text-sm text-olive-900 outline-none transition-colors duration-200 focus:border-olive-600 focus:ring-1 focus:ring-olive-600 cursor-pointer appearance-none pr-8"
                    >
                      <option value="hadir">Hadir</option>
                      <option value="tidak_hadir">Tidak Hadir</option>
                      <option value="ragu">Masih Ragu</option>
                    </select>
                    {/* Custom chevron icon */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-olive-600">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Konfirmasi Jumlah Orang (Plus / Minus Counter) */}
                <div>
                  <label
                    className="font-body text-xs font-medium text-olive-700 block mb-1.5"
                  >
                    Jumlah Tamu
                  </label>
                  <div className="flex min-h-10 w-full items-center justify-between rounded-lg border border-sage-300 bg-[#FFFFFF] px-1.5">
                    <button
                      type="button"
                      onClick={() => setPax((p) => Math.max(1, p - 1))}
                      disabled={attendance === "tidak_hadir" || pax <= 1}
                      aria-label="Kurangi jumlah tamu"
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-sage-100/90 text-olive-900 font-bold text-base hover:bg-sage-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                    >
                      -
                    </button>
                    <span className="font-body text-xs sm:text-sm font-semibold text-olive-950 tabular-nums">
                      {pax} Orang
                    </span>
                    <button
                      type="button"
                      onClick={() => setPax((p) => Math.min(10, p + 1))}
                      disabled={attendance === "tidak_hadir" || pax >= 10}
                      aria-label="Tambah jumlah tamu"
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-sage-100/90 text-olive-900 font-bold text-base hover:bg-sage-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="wish-message"
                  className="font-body text-xs font-medium text-olive-700"
                >
                  Ucapan &amp; Doa
                </label>
                <textarea
                  id="wish-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                  required
                  rows={3}
                  placeholder="Tulis ucapan dan doa terbaik Anda..."
                  className="mt-1.5 w-full resize-none rounded border border-sage-300  px-3 py-2 font-body text-sm text-olive-900 outline-none transition-colors duration-200 placeholder:text-sage-500 focus:border-olive-600"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-olive w-full !py-2.5 !text-sm disabled:cursor-not-allowed disabled:opacity-45"
              >
                <HiOutlinePaperAirplane aria-hidden="true" />
                {status === "sending" ? "Mengirim..." : "Kirim"}
              </button>
              <AnimatePresence>
                {status === "error" && (
                  <motion.p
                    role="alert"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: motionTokens.durationFast }}
                    className="text-center font-body text-xs text-error"
                  >
                    Gagal mengirim. Silakan coba lagi.
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.form>
          )}
          </AnimatePresence>
        </RevealItem>

        <RevealItem variants={slideFromLeft} className="flex flex-col">
          <p className="mb-3 font-body text-sm text-olive-700" aria-live="polite">
            {wishes.length} ucapan
          </p>
          <div className="space-y-3">
            {wishes.length === 0 && (
              <p className="paper-card p-4 text-center font-body text-sm text-olive-700">
                Jadilah yang pertama memberi ucapan
              </p>
            )}
            <AnimatePresence initial={false}>
            {paginatedWishes.map((w) => (
              <motion.article
                key={w.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  duration: motionTokens.durationBase,
                  ease: motionTokens.easeOut,
                }}
                className="paper-card p-3 sm:p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="flex items-center gap-1.5 font-body text-sm font-semibold text-olive-900">
                    {w.name}
                    {w.verified && (
                      <span
                        className="inline-flex items-center gap-0.5 rounded-full border border-sage-300  px-1 py-0.5 text-[10px] font-medium text-olive-700"
                        title="Tamu undangan"
                      >
                        <HiCheckBadge
                          aria-hidden="true"
                          className="text-xs text-olive-600"
                        />
                      </span>
                    )}
                  </p>
                  <span className="shrink-0">{getAttendanceIcon(w.attendance)}</span>
                </div>

                <p className="mt-1.5 font-body text-sm leading-relaxed text-olive-700">
                  {w.message}
                </p>

                <div className="mt-2 text-right">
                  <span className="font-body text-xs text-sage-500 italic">
                    {relativeTime(w.createdAt)}
                  </span>
                </div>
              </motion.article>
            ))}
            </AnimatePresence>
          </div>
          
          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2 py-1 font-body text-sm font-medium text-olive-700 transition-colors hover:text-olive-900 disabled:opacity-40 disabled:hover:text-olive-700"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                // Simple logic to show current, first, last, and surrounding pages
                if (
                  pageNum === 1 || 
                  pageNum === totalPages ||
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <button
                      key={i}
                      onClick={() => setPage(pageNum)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-body text-sm transition-colors ${
                        page === pageNum
                          ? 'bg-olive-600 text-ivory-50'
                          : 'text-olive-700 hover:'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === page - 2 || 
                  pageNum === page + 2
                ) {
                  return <span key={i} className="px-1 text-olive-400">...</span>;
                }
                return null;
              })}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-2 py-1 font-body text-sm font-medium text-olive-700 transition-colors hover:text-olive-900 disabled:opacity-40 disabled:hover:text-olive-700"
              >
                Next
              </button>
            </div>
          )}
        </RevealItem>
      </StaggerGroup>
      </div>
    </section>
  );
}
