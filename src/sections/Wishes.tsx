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
import { useGuestName } from "@/hooks/useGuestName";
import { attendanceLabel, relativeTime } from "@/lib/utils";
import type { Wish } from "@/lib/types";

const PAGE_SIZE = 4;
const ATTENDANCE: Wish["attendance"][] = ["hadir", "tidak_hadir", "ragu"];
const GUEST_FALLBACK = "Tamu Undangan";

/** Guestbook: form + paginated wishes with replies. */
export function Wishes() {
  const guestName = useGuestName();
  const isPersonalised = guestName !== GUEST_FALLBACK;

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState<Wish["attendance"]>("hadir");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  // reply thread state (one open form at a time)
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyName, setReplyName] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyStatus, setReplyStatus] = useState<"idle" | "sending" | "error">(
    "idle"
  );

  useEffect(() => {
    fetch("/api/wishes")
      .then((r) => r.json())
      .then((d) => setWishes(d.wishes ?? []))
      .catch(() => {});
  }, []);

  // prefill the name with the invited guest's name once it resolves
  useEffect(() => {
    if (isPersonalised) {
      setName((cur) => (cur ? cur : guestName));
      setReplyName((cur) => (cur ? cur : guestName));
    }
  }, [guestName, isPersonalised]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setStatus("sending");
    const verified =
      isPersonalised &&
      name.trim().toLowerCase() === guestName.trim().toLowerCase();
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, attendance, verified }),
      });
      if (!res.ok) throw new Error();
      const { wish } = await res.json();
      setWishes((prev) => [wish, ...prev]);
      setMessage("");
      setAttendance("hadir");
      setStatus("idle");
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
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="font-body text-xs uppercase tracking-widest text-ink/60">
                Nama
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                required
                placeholder="Nama Anda"
                className="mt-1 w-full rounded-lg border border-olive/20 bg-ivory px-4 py-2.5 text-sm outline-none focus:border-olive focus:ring-1 focus:ring-olive/40"
              />
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
              {status === "sending" ? "Mengirim..." : "Kirim Ucapan"}
            </button>
            {status === "error" && (
              <p className="text-center text-xs text-red-500">
                Gagal mengirim. Silakan coba lagi.
              </p>
            )}
          </form>
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
