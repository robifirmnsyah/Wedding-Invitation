"use client";

import { StaggerGroup, RevealItem } from "@/components/Reveal";
import { SprigDivider } from "@/components/Decor";
import { WatercolorLayer } from "@/components/decorative/WatercolorLayer";
import { useCountdown } from "@/hooks/useCountdown";
import {
  fadeIn,
  riseIn,
  scaleIn,
  staggerContainer,
  staggerTight,
} from "@/animations/variants";
import { buildCalendarUrl } from "@/lib/utils";
import config from "@/lib/config";
import { HiOutlineCalendarDays } from "react-icons/hi2";

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <RevealItem
      variants={scaleIn}
      className="flex flex-col items-center px-1"
    >
      <span className="font-display text-3xl font-semibold tabular-nums text-olive-900 sm:text-4xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 font-body text-[10px] font-medium uppercase tracking-wider text-olive-700 sm:text-xs">
        {label}
      </span>
    </RevealItem>
  );
}

/**
 * Save the Date — editorial countdown within the ornamental floral frame.
 * Content (text + timer) is centered inside the inner frame area with padding,
 * and the compact 'Add to Calendar' button sits directly below the frame.
 */
export function SaveDate() {
  const t = useCountdown(config.countdownTarget);
  const coupleNames = `${config.couple.groom.shortName} & ${config.couple.bride.shortName}`;
  const calendarUrl = buildCalendarUrl(config.event.resepsi, coupleNames);

  return (
    <section
      aria-labelledby="save-date-title"
      className="section-pad relative isolate overflow-hidden bg-ivory-50"
    >
      <div className="relative mx-auto flex w-full max-w-[36rem] flex-col items-center px-2 sm:max-w-[44rem] md:max-w-[48rem]">
        {/* Floral Frame Container — Enlarged Scale */}
        <div className="relative aspect-[2/3] w-full">
          <WatercolorLayer
            src="ornamental-calendar-frame.png"
            className="inset-0"
            opacity={0.98}
            sizes="(max-width: 640px) 98vw, 44rem"
          />

          {/* Inner Content Area (Centered delicately with generous breathing room) */}
          <StaggerGroup
            variants={staggerContainer}
            className="absolute inset-0 z-[1] flex flex-col items-center justify-center px-[22%] pt-[12%] pb-[12%] text-center sm:px-[25%]"
          >
            <RevealItem variants={riseIn}>
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-700 sm:text-xs">
                Save The Date
              </p>
              <h2
                id="save-date-title"
                className="mt-1 font-display text-xl sm:text-2xl md:text-3xl font-semibold text-olive-900"
              >
                Counting The Days
              </h2>
            </RevealItem>

            <RevealItem variants={fadeIn}>
              <SprigDivider className="!my-1.5 text-gold-600 sm:!my-3" />
            </RevealItem>

            <RevealItem variants={riseIn}>
              <time
                dateTime={config.countdownTarget}
                className="font-display text-xs sm:text-sm md:text-base font-medium italic text-gold-800"
              >
                {config.hero.dateLabel}
              </time>
            </RevealItem>

            <div
              role="timer"
              aria-label={`${t.days} days ${t.hours} hours ${t.minutes} minutes ${t.seconds} seconds to the wedding`}
              className="mt-2.5 w-full max-w-[11rem] sm:mt-4 sm:max-w-[13rem] mx-auto"
            >
              <StaggerGroup
                as="div"
                variants={staggerTight}
                aria-hidden="true"
                className="grid grid-cols-2 gap-y-2 gap-x-4 py-1 sm:py-2 sm:gap-y-3 sm:gap-x-6"
              >
                <Unit value={t.days} label="Days" />
                <Unit value={t.hours} label="Hours" />
                <Unit value={t.minutes} label="Minutes" />
                <Unit value={t.seconds} label="Seconds" />
              </StaggerGroup>
            </div>

            {t.done && (
              <RevealItem
                as="p"
                variants={fadeIn}
                className="mt-3 font-display text-xs font-medium italic text-olive-700 sm:text-sm"
              >
                Alhamdulillah, hari bahagia telah tiba 🤍
              </RevealItem>
            )}
          </StaggerGroup>
        </div>

        {/* Button Add to Calendar (Positioned OUTSIDE, compact & centered below frame) */}
        <RevealItem variants={fadeIn} className="mt-6 sm:mt-8 flex justify-center">
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Add to Google Calendar (tab baru)"
            className="btn-olive inline-flex w-auto items-center justify-center gap-2 !px-6 !py-2.5 !text-xs sm:!text-sm shadow-sm transition-all hover:scale-[1.02]"
          >
            <HiOutlineCalendarDays aria-hidden="true" className="text-base sm:text-lg" /> Add to Calendar
          </a>
        </RevealItem>
      </div>
    </section>
  );
}
