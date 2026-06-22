import type { EventInfo } from "./types";

/** Build a Google Calendar "add event" URL from an event. */
export function buildCalendarUrl(event: EventInfo, coupleNames: string): string {
  const start = new Date(event.date);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // +2h default

  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.title} — ${coupleNames}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `${event.title} pernikahan ${coupleNames}`,
    location: `${event.venue}, ${event.address}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Copy text to clipboard with a graceful fallback. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    return true;
  } catch {
    return false;
  }
}

export const attendanceLabel: Record<string, string> = {
  hadir: "Hadir",
  tidak_hadir: "Tidak Hadir",
  ragu: "Masih Ragu",
};

/** Human-friendly Indonesian relative time, e.g. "5 menit lalu". */
export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const secs = Math.max(0, Math.floor((Date.now() - then) / 1000));

  if (secs < 45) return "Baru saja";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} minggu lalu`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} bulan lalu`;
  return `${Math.floor(days / 365)} tahun lalu`;
}
