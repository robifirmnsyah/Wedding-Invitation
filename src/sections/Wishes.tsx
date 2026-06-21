"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import { SectionTitle } from "@/components/Decor";
import { Reveal } from "@/components/Reveal";
import { attendanceLabel } from "@/lib/utils";
import type { Wish } from "@/lib/types";

const PAGE_SIZE = 4;
const ATTENDANCE: Wish["attendance"][] = ["hadir", "tidak_hadir", "ragu"];

/** Guestbook: form + paginated wishes list backed by /api/wishes. */
export function Wishes() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState<Wish["attendance"]>("hadir");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  useEffect(() => {
    fetch("/api/wishes")
      .then((r) => r.json())
      .then((d) => setWishes(d.wishes ?? []))
      .catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, attendance }),
      });
      if (!res.ok) throw new Error();
      const { wish } = await res.json();
      setWishes((prev) => [wish, ...prev]);
      setName("");
      setMessage("");
      setAttendance("hadir");
      setStatus("idle");
    } catch {
      setStatus("error");
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
          <div className="no-scrollbar max-h-[26rem] space-y-3 overflow-y-auto pr-1">
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
                <div className="flex items-center justify-between">
                  <p className="font-heading text-base font-600 text-olive-dark">
                    {w.name}
                  </p>
                  <span className="rounded-full bg-sage/60 px-2 py-0.5 text-[10px] uppercase tracking-wide text-olive-dark">
                    {attendanceLabel[w.attendance]}
                  </span>
                </div>
                <p className="mt-1 font-body text-sm leading-relaxed text-ink/75">
                  {w.message}
                </p>
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
