"use client";

import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/Decor";
import { Petals } from "@/components/Petals";
import { useCountdown } from "@/hooks/useCountdown";
import config from "@/lib/config";

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl paper-card font-heading text-2xl font-600 text-olive-dark sm:h-20 sm:w-20 sm:text-3xl">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-2 font-body text-xs uppercase tracking-widest text-ink/60">
        {label}
      </span>
    </div>
  );
}

/** Save the Date countdown surrounded by a floral circle. */
export function SaveDate() {
  const t = useCountdown(config.countdownTarget);

  return (
    <section className="section-pad relative overflow-hidden bg-cream">
      <Petals count={10} />
      <SectionTitle eyebrow="Save The Date" title="Counting The Days" />

      <Reveal className="mx-auto mt-8 flex max-w-lg flex-col items-center">
        <p className="font-script text-3xl text-olive">{config.hero.dateLabel}</p>

        <div className="mt-8 grid grid-cols-4 gap-3 sm:gap-5">
          <Unit value={t.days} label="Hari" />
          <Unit value={t.hours} label="Jam" />
          <Unit value={t.minutes} label="Menit" />
          <Unit value={t.seconds} label="Detik" />
        </div>

        {t.done && (
          <p className="mt-6 font-sub text-lg italic text-olive-dark">
            Alhamdulillah, hari bahagia telah tiba 🤍
          </p>
        )}
      </Reveal>
    </section>
  );
}
