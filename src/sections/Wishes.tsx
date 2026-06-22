"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiOutlinePaperAirplane,
  HiCheckBadge,
  HiOutlineArrowUturnLeft,
} from "react-icons/hi2";
import { SectionTitle } from "@/components/Decor";
import { Reveal } from "@/components/Reveal";
import { useGuestInfo } from "@/hooks/useGuestName";
import { attendanceLabel, relativeTime } from "@/lib/utils";
import type { Wish } from "@/lib/types";

const PAGE_SIZE = 4;
const ATTENDANCE: Wish["attendance"][] = ["hadir", "tidak_hadir", "ragu"];
const GUEST_FALLBACK = "Tamu Undangan";

const COUNTERS: {
  key: Wish["attendance"];
  label: string;
  ring: string;
  text: string;
  bg: string;
}[] = [
  { key: "hadir", label: "Hadir", ring: "ring-emerald-500/30", text: "text-emerald-700", bg: "bg-emerald-50" },
  { key: "tidak_hadir", label: "Tidak Hadir", ring: "ring-rose-500/30", text: "text-rose-700", bg: "bg-rose-50" },
  { key: "ragu", label: "Masih Ragu", ring: "ring-amber-500/30", text: "text-amber-700", bg: "bg-amber-50" },
];

interface RegisteredGuest {
  id: string;
  unique_code: string;
  name: string;
  pax: number;
  rsvp_status: string;
  wish_message: string;
}

/** Guestbook: RSVP counters + form + paginated wishes with replies. */
export function Wishes() {
  const guestInfo = useGuestInfo();
  const guestName = guestInfo.name;
  const guestCode = guestInfo.code;
  const isPersonalised = guestName !== GUEST_FALLBACK;
  const hasInvitationCode = !!guestCode;

  // Registered guest data from Supabase
  const [registeredGuest, setRegisteredGuest] = useState<RegisteredGuest | null>(null);
  const [guestLookupDone, setGuestLookupDone] = useState(false);

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState<Wish["attendance"]>("hadir");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // reply thread state (one open form at a time)
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyName, setReplyName] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyStatus, setReplyStatus] = useState<"idle" | "sending" | "error">(
    "idle"
  );

  // Look up registered guest by unique code
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
          // Prefill form with existing data
          if (d.guest.rsvp_status && d.guest.rsvp_status !== "pending") {
            setAttendance(d.guest.rsvp_status as Wish["attendance"]);
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
      .then((d) => setWishes(d.wishes ?? []))
      .catch(() => {});
  }, []);

  // prefill the name with the invited guest's name once it resolves
  useEffect(() => {
    if (registeredGuest) {
      setName(registeredGuest.name);
      setReplyName(registeredGuest.name);
    } else if (isPersonalised) {
      setName((cur) => (cur ? cur : guestName));
      setReplyName((cur) => (cur ? cur : guestName));
    }
  }, [guestName, isPersonalised, registeredGuest]);

  const counts = useMemo(() => {
    const c = { hadir: 0, tidak_hadir: 0, ragu: 0 } as Record<
      Wish["attendance"],
      number
    >;
    for (const w of wishes) c[w.attendance] = (c[w.attendance] ?? 0) + 1;
    return c;
  }, [wishes]);

  const submitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasInvitationCode || !registeredGuest) return;
    if (!message.trim()) return;

    setStatus("sending");

    try {
      // Submit RSVP to Supabase via the RSVP API
      const rsvpRes = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: guestCode,
          rsvp_status: attendance,
          wish_message: message.trim(),
        }),
      });

      if (!rsvpRes.ok) throw new Error();

      // Also add to the wishes guestbook (file-based) for display
      const wishRes = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registeredGuest.name,
          message: message.trim(),
          attendance,
          verified: true,
        }),
      });

      if (wishRes.ok) {
        const { wish } = await wishRes.json();
        setWishes((prev) => [wish, ...prev]);
      }

      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const submitReply = async (wishId: string) => {
    if (!replyName.trim() || !replyMessage.trim()) return;
    setReplyStatus("sending");
    try {
      const res = await fetch("/api/wishes/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishId, name: replyName, message: replyMessage }),
      });
      if (!res.ok) throw new Error();
      const { reply } = await res.json();
      setWishes((prev) =>
        prev.map((w) =>
          w.id === wishId
            ? { ...w, replies: [...(w.replies ?? []), reply] }
            : w
        )
      );
      setReplyMessage("");
      setReplyTo(null);
      setReplyStatus("idle");
    } catch {
      setReplyStatus("error");
    }
  };

  return (
    <section className="section-pad relative overflow-hidden bg-cream">
      <SectionTitle eyebrow="Send Your Love" title="Wedding Wishes" />

      <div className="mx-auto mt-10 grid max-w-4xl gap-8 lg:grid-cols-2">
        {/* form */}
        <Reveal className="paper-card rounded-2xl p-6 shadow-md ring-1 ring-olive/10">
          {!guestLookupDone ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-olive border-t-transparent" />
            </div>
          ) : !hasInvitationCode ? (
            /* No invitation code — show a message */
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sage/40">
                <svg className="h-7 w-7 text-olive" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <p className="font-heading text-lg font-600 text-olive-dark">
                RSVP Khusus Tamu Terdaftar
              </p>
              <p className="mt-2 font-body text-sm text-ink/60">
                Untuk mengisi RSVP dan memberikan ucapan, silakan buka undangan melalui link khusus yang telah dikirimkan kepada Anda.
              </p>
            </div>
          ) : !registeredGuest ? (
            /* Invalid code */
            <div className="py-8 text-center">
              <p className="font-heading text-lg font-600 text-rose-600">
                Kode Undangan Tidak Valid
              </p>
              <p className="mt-2 font-body text-sm text-ink/60">
                Kode undangan yang Anda gunakan tidak ditemukan. Pastikan Anda membuka link yang benar.
              </p>
            </div>
          ) : status === "success" ? (
            /* Success message */
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 ring-2 ring-emerald-500/30">
                <svg className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <p className="font-heading text-lg font-600 text-olive-dark">
                Terima Kasih, {registeredGuest.name}!
              </p>
              <p className="mt-2 font-body text-sm text-ink/60">
                RSVP dan ucapan Anda telah tersimpan. Kami sangat menantikan kehadiran Anda.
              </p>
            </div>
          ) : (
            /* RSVP Form for registered guests */
            <form onSubmit={submitRsvp} className="space-y-4">
              <div className="rounded-xl bg-sage/30 p-3">
                <div className="flex items-center gap-2">
                  <HiCheckBadge className="text-lg text-olive" />
                  <span className="font-heading text-sm font-600 text-olive-dark">
                    {registeredGuest.name}
                  </span>
                </div>
                <p className="mt-1 font-body text-xs text-ink/50">
                  Kode: {registeredGuest.unique_code} · Kuota: {registeredGuest.pax} orang
                </p>
              </div>

              <div>
                <label className="font-body text-xs uppercase tracking-widest text-ink/60">
                  Kehadiran
                </label>
                <div className="mt-1 grid grid-cols-3 gap-2">
                  {ATTENDANCE.map((a) => (
                    <button
                      type="button"
                      key={a}
                      onClick={() => setAttendance(a)}
                      className={`rounded-lg border px-2 py-2 text-xs transition-colors ${
                        attendance === a
                          ? "border-olive bg-olive text-ivory"
                          : "border-olive/20 bg-ivory text-ink/70 hover:bg-sage/40"
                      }`}
                    >
                      {attendanceLabel[a]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-body text-xs uppercase tracking-widest text-ink/60">
                  Ucapan &amp; Doa
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                  required
                  rows={3}
                  placeholder="Tulis ucapan dan doa terbaik Anda..."
                  className="mt-1 w-full resize-none rounded-lg border border-olive/20 bg-ivory px-4 py-2.5 text-sm outline-none focus:border-olive focus:ring-1 focus:ring-olive/40"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-olive w-full disabled:opacity-60"
              >
                <HiOutlinePaperAirplane />
                {status === "sending" ? "Mengirim..." : "Kirim RSVP & Ucapan"}
              </button>
              {status === "error" && (
                <p className="text-center text-xs text-red-500">
                  Gagal mengirim. Silakan coba lagi.
                </p>
              )}
            </form>
          )}
        </Reveal>

        {/* list */}
        <div className="flex flex-col">
          <p className="mb-3 font-body text-sm text-ink/60">
            {wishes.length} ucapan
          </p>
          <div className="no-scrollbar max-h-[28rem] space-y-3 overflow-y-auto pr-1">
            {wishes.length === 0 && (
              <p className="rounded-xl bg-ivory/70 p-4 text-center text-sm text-ink/50">
                Jadilah yang pertama memberi ucapan 🤍
              </p>
            )}
            {wishes.slice(0, visible).map((w) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-ivory/80 p-4 shadow-sm ring-1 ring-olive/10"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="flex items-center gap-1.5 font-heading text-base font-600 text-olive-dark">
                    {w.name}
                    {w.verified && (
                      <span
                        className="inline-flex items-center gap-0.5 rounded-full bg-olive/10 px-1.5 py-0.5 text-[10px] font-medium text-olive"
                        title="Tamu undangan"
                      >
                        <HiCheckBadge className="text-sm text-olive" />
                        Tamu
                      </span>
                    )}
                  </p>
                  <span className="shrink-0 rounded-full bg-sage/60 px-2 py-0.5 text-[10px] uppercase tracking-wide text-olive-dark">
                    {attendanceLabel[w.attendance]}
                  </span>
                </div>

                <p className="mt-1 font-body text-sm leading-relaxed text-ink/75">
                  {w.message}
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <span className="font-body text-[11px] text-ink/40">
                    {relativeTime(w.createdAt)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyTo((cur) => (cur === w.id ? null : w.id));
                      setReplyStatus("idle");
                    }}
                    className="inline-flex items-center gap-1 font-body text-[11px] font-medium text-olive transition-colors hover:text-olive-dark"
                  >
                    <HiOutlineArrowUturnLeft className="text-xs" />
                    Balas
                  </button>
                </div>

                {/* replies */}
                {w.replies && w.replies.length > 0 && (
                  <ul className="mt-3 space-y-2 border-l-2 border-sage pl-3">
                    {w.replies.map((r) => (
                      <li key={r.id}>
                        <div className="flex items-center gap-2">
                          <p className="font-heading text-sm font-600 text-olive-dark">
                            {r.name}
                          </p>
                          <span className="font-body text-[10px] text-ink/40">
                            {relativeTime(r.createdAt)}
                          </span>
                        </div>
                        <p className="font-body text-xs leading-relaxed text-ink/70">
                          {r.message}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}

                {/* inline reply form */}
                <AnimatePresence initial={false}>
                  {replyTo === w.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-2 rounded-lg bg-sage/20 p-3">
                        <input
                          value={replyName}
                          onChange={(e) => setReplyName(e.target.value)}
                          maxLength={60}
                          placeholder="Nama Anda"
                          className="w-full rounded-md border border-olive/20 bg-ivory px-3 py-1.5 text-xs outline-none focus:border-olive"
                        />
                        <textarea
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          maxLength={300}
                          rows={2}
                          placeholder={`Balas ${w.name}...`}
                          className="w-full resize-none rounded-md border border-olive/20 bg-ivory px-3 py-1.5 text-xs outline-none focus:border-olive"
                        />
                        <div className="flex items-center justify-end gap-2">
                          {replyStatus === "error" && (
                            <span className="mr-auto text-[11px] text-red-500">
                              Gagal mengirim.
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setReplyTo(null)}
                            className="rounded-full px-3 py-1.5 text-xs text-ink/60 hover:text-ink"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={() => submitReply(w.id)}
                            disabled={replyStatus === "sending"}
                            className="btn-olive !px-4 !py-1.5 !text-xs disabled:opacity-60"
                          >
                            {replyStatus === "sending" ? "..." : "Kirim"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          {visible < wishes.length && (
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="btn-ghost mx-auto mt-4"
            >
              Lihat ucapan lainnya
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
