"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HiOutlineMapPin } from "react-icons/hi2";
import { SectionTitle } from "@/components/Decor";
import { StaggerGroup, RevealItem } from "@/components/Reveal";
import {
  fadeIn,
  slideUp,
  riseIn,
  scaleIn,
  staggerLoose,
} from "@/animations/variants";
import config from "@/lib/config";
import type { EventInfo } from "@/lib/types";

function parseEventDate(event: EventInfo) {
  const d = new Date(event.date);
  if (!isNaN(d.getTime())) {
    const dayName = d.toLocaleDateString("id-ID", { weekday: "long" }).toUpperCase();
    const dayNum = d.getDate();
    const monthYear = d.toLocaleDateString("id-ID", { month: "long", year: "numeric" }).toUpperCase();
    return { dayName, dayNum, monthYear };
  }
  return { dayName: "HARI", dayNum: "01", monthYear: event.dateLabel.toUpperCase() };
}

function EventCard({ event }: { event: EventInfo }) {
  const { dayName, dayNum, monthYear } = parseEventDate(event);

  return (
    <StaggerGroup
      variants={staggerLoose}
      className="relative z-10 mx-auto w-full max-w-lg overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-gold-600/50 bg-[#FFFFFF] p-2.5 sm:p-3.5 shadow-lifted"
    >
      {/* Inner Inset Border Frame */}
      <div className="relative flex flex-col items-center overflow-hidden rounded-[1.65rem] sm:rounded-[2.15rem] border border-gold-600/35 px-5 pt-10 pb-28 text-center sm:px-10 sm:pt-14 sm:pb-36">
        
        {/* Top Left Corner Floral Asset (Rotated to hang naturally into the card) */}
        <div className="pointer-events-none absolute -top-4 -left-4 h-28 w-28 opacity-90 sm:h-36 sm:w-36">
          <Image
            src="/assets/decorative/vintage-garden-frame/floral-top-right.png"
            alt=""
            fill
            className="object-contain rotate-180"
            aria-hidden="true"
          />
        </div>

        {/* Top Right Corner Floral Asset (Rotated to hang naturally into the card) */}
        <div className="pointer-events-none absolute -top-4 -right-4 h-28 w-28 opacity-90 sm:h-36 sm:w-36">
          <Image
            src="/assets/decorative/vintage-garden-frame/floral-top-left.png"
            alt=""
            fill
            className="object-contain rotate-180"
            aria-hidden="true"
          />
        </div>

        {/* Event Title (e.g. Resepsi) */}
        <RevealItem variants={riseIn} className="mt-3 sm:mt-5">
          {(() => {
            const lines = event.title.split("\n");
            return (
              <>
                <h3 className="font-accent text-[2.75rem] leading-tight text-olive-900 sm:text-[3.5rem]">
                  {lines[0]}
                </h3>
                {lines.length > 1 && (
                  <p className="mt-1 font-display text-xl sm:text-2xl text-olive-800">
                    {lines.slice(1).join(" ")}
                  </p>
                )}
              </>
            );
          })()}
        </RevealItem>

        {/* Date & Time Block */}
        <div className="mt-5 flex flex-col items-center">
          {/* Day Name */}
          <RevealItem variants={fadeIn}>
            <p className="font-body text-xs sm:text-sm font-semibold tracking-[0.22em] text-olive-800 uppercase">
              {dayName}
            </p>
          </RevealItem>

          {/* Big Date Number */}
          <RevealItem variants={scaleIn} className="mt-1.5 mb-3.5 sm:mt-2 sm:mb-4">
            <span className="font-display text-5xl sm:text-6xl font-normal leading-none text-olive-950 block">
              {dayNum}
            </span>
          </RevealItem>

          {/* Month & Year */}
          <RevealItem variants={fadeIn}>
            <p className="font-body text-xs sm:text-sm font-semibold tracking-[0.22em] text-olive-800 uppercase">
              {monthYear}
            </p>
          </RevealItem>

          {/* Time */}
          {event.time && (
            <RevealItem variants={fadeIn} className="mt-2.5">
              <p className="font-body text-xs sm:text-sm font-semibold text-olive-950">
                {event.time}
              </p>
            </RevealItem>
          )}
        </div>

        {/* Location Pin Icon */}
        <RevealItem variants={fadeIn} className="mt-6 flex justify-center text-gold-700">
          <HiOutlineMapPin className="text-2xl text-gold-700" aria-hidden="true" />
        </RevealItem>

        {/* Venue Name */}
        <RevealItem variants={slideUp} className="mt-2">
          <h4 className="font-display text-lg sm:text-xl font-bold text-olive-950">
            {event.venue}
          </h4>
        </RevealItem>

        {/* Address */}
        <RevealItem
          as="p"
          variants={fadeIn}
          className="mt-2 max-w-xs font-body text-xs leading-relaxed text-olive-800 sm:text-sm sm:max-w-sm"
        >
          {event.address}
        </RevealItem>

        {/* Google Maps Button */}
        <RevealItem variants={slideUp} className="mt-5">
          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Buka Google Maps lokasi ${event.venue}`}
            className="inline-flex items-center gap-2 rounded-full border border-gold-600/60 bg-olive-900 px-6 py-2.5 font-body text-xs sm:text-sm font-medium tracking-wide text-ivory-50 shadow-sm transition-all duration-300 hover:bg-olive-800 hover:scale-[1.02] hover:shadow-md"
          >
            <HiOutlineMapPin className="text-base text-gold-400" aria-hidden="true" />
            <span>Google Maps</span>
          </a>
        </RevealItem>

        {/* Bottom Floral Arrangement: Pink Roses & Hydrangeas */}
        <div className="pointer-events-none absolute -bottom-4 inset-x-0 h-32 w-full sm:h-44 sm:-bottom-6">
          <Image
            src="/assets/decorative/vintage-garden-frame/floral-bottom.png"
            alt=""
            fill
            className="object-contain object-bottom"
            aria-hidden="true"
          />
        </div>

        {/* Corner Leaf Sprigs for extra richness */}
        <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 opacity-80 sm:h-36 sm:w-36">
          <Image
            src="/assets/decorative/vintage-botanical-branch.png"
            alt=""
            fill
            className="object-contain -rotate-45"
            aria-hidden="true"
          />
        </div>
        <div className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 opacity-80 sm:h-36 sm:w-36">
          <Image
            src="/assets/decorative/vintage-botanical-branch.png"
            alt=""
            fill
            className="object-contain rotate-45 -scale-x-100"
            aria-hidden="true"
          />
        </div>

      </div>
    </StaggerGroup>
  );
}

/**
 * Event Details Section — card-based presentation with prominent date layout
 * and animated floating side florals.
 */
export function EventDetails() {
  return (
    <section
      aria-labelledby="event-title"
      className="relative overflow-hidden bg-ivory-50 px-4 py-20 sm:px-6 sm:py-28"
    >
      {/* ── ANIMATED SIDE BOTANICAL ASSETS ─────────────────────────────── */}
      
      {/* Left Animated Floral Bouquet */}
      <motion.div
        className="pointer-events-none absolute -left-16 top-1/4 z-0 h-[28rem] w-[18rem] opacity-75 sm:-left-10 sm:h-[36rem] sm:w-[24rem]"
        animate={{
          y: [0, -14, 0],
          rotate: [-1.5, 1.5, -1.5],
        }}
        transition={{
          duration: 7.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/assets/decorative/vintage-garden-frame/floral-left.png"
          alt=""
          fill
          className="object-contain object-left"
          aria-hidden="true"
        />
      </motion.div>

      {/* Right Animated Floral Bouquet */}
      <motion.div
        className="pointer-events-none absolute -right-16 top-1/3 z-0 h-[28rem] w-[18rem] opacity-75 sm:-right-10 sm:h-[36rem] sm:w-[24rem]"
        animate={{
          y: [0, 14, 0],
          rotate: [1.5, -1.5, 1.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/assets/decorative/vintage-garden-frame/floral-right.png"
          alt=""
          fill
          className="object-contain object-right"
          aria-hidden="true"
        />
      </motion.div>

      {/* ── SECTION TITLE: Wedding Event ────────────────────────────────── */}
      <div className="relative z-10 mb-14 text-center">
        <SectionTitle
          id="event-title"
          title="Wedding Event"
        />
      </div>

      {/* ── EVENT CARDS GRID ────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center justify-center gap-10">
        {config.event.akad && <EventCard event={config.event.akad} />}
        <EventCard event={config.event.resepsi} />
      </div>
    </section>
  );
}
