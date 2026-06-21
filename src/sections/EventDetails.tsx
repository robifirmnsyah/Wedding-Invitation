"use client";

import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/Decor";
import { WatercolorValley } from "@/components/WatercolorValley";
import { buildCalendarUrl } from "@/lib/utils";
import config from "@/lib/config";
import type { EventInfo } from "@/lib/types";
import { HiOutlineCalendarDays, HiOutlineClock, HiOutlineMapPin } from "react-icons/hi2";

function EventCard({ event }: { event: EventInfo }) {
  const coupleNames = `${config.couple.groom.shortName} & ${config.couple.bride.shortName}`;

  return (
    <Reveal className="relative w-full max-w-sm">
      <div className="arch-card overflow-hidden paper-card p-6 pt-10 text-center shadow-lg ring-1 ring-olive/10">
        {/* floral arch hint */}
        <div className="absolute inset-x-0 top-0 h-24 opacity-30">
          <WatercolorValley variant="day" withBirds={false} withMeadow={false} />
        </div>

        <h3 className="relative font-heading text-2xl font-600 text-olive-dark">
          {event.title}
        </h3>

        <div className="relative mt-5 space-y-3 text-sm text-ink/80">
          <p className="flex items-center justify-center gap-2">
            <HiOutlineCalendarDays className="text-olive" /> {event.dateLabel}
          </p>
          <p className="flex items-center justify-center gap-2">
            <HiOutlineClock className="text-olive" /> {event.time}
          </p>
          <p className="flex flex-col items-center gap-1">
            <span className="flex items-center gap-2 font-500 text-ink">
              <HiOutlineMapPin className="text-olive" /> {event.venue}
            </span>
            <span className="text-xs text-ink/60">{event.address}</span>
          </p>
        </div>

        <div className="relative mt-5 overflow-hidden rounded-lg ring-1 ring-olive/15">
          <iframe
            src={event.mapsEmbed}
            title={`Peta ${event.title}`}
            className="h-40 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="relative mt-5 flex flex-wrap justify-center gap-2">
          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <HiOutlineMapPin /> Lihat Lokasi
          </a>
          <a
            href={buildCalendarUrl(event, coupleNames)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-olive !px-5 !py-2.5"
          >
            <HiOutlineCalendarDays /> Simpan Tanggal
          </a>
        </div>
      </div>
    </Reveal>
  );
}

/** Resepsi arch card over a mountain-valley backdrop. */
export function EventDetails() {
  return (
    <section className="section-pad relative overflow-hidden bg-ivory">
      <SectionTitle eyebrow="Save The Moment" title="Wedding Event" />
      <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center justify-center">
        <EventCard event={config.event.resepsi} />
      </div>
    </section>
  );
}
