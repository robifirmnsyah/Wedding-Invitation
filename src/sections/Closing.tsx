"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { StaggerGroup, RevealItem } from "@/components/Reveal";
import { fadeIn, riseIn, slideUp, staggerLoose } from "@/animations/variants";
import config, { isTasyakur } from "@/lib/config";

/**
 * Closing Section — A grand botanical garden arch pavilion composition
 * celebrating the couple with architectural depth, canopy trees, and floral terraces.
 */
export function Closing() {
  const { groom, bride } = config.couple;

  return (
    <section
      aria-labelledby="closing-title"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ivory-50 px-4 py-20 sm:px-6 sm:py-28"
    >
      {/* ── TOP WATERCOLOR CANOPY TREES & BIRDS ─────────────────────────── */}
      <div className="pointer-events-none absolute -top-10 inset-x-0 h-64 w-full opacity-35 sm:h-80">
        <Image
          src="/assets/decorative/vintage-garden-frame/watercolor-tree-grove.png"
          alt=""
          fill
          className="object-cover object-top"
          aria-hidden="true"
        />
      </div>

      {/* Floating Songbird Hovering */}
      <motion.div
        className="pointer-events-none absolute right-6 top-16 z-20 h-16 w-16 opacity-85 sm:right-16 sm:top-20 sm:h-20 sm:w-20"
        animate={{
          y: [0, -8, 0],
          x: [0, 4, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/assets/decorative/vintage-garden-frame/bird-hovering.png"
          alt=""
          fill
          className="object-contain"
          aria-hidden="true"
        />
      </motion.div>

      {/* ── ARCHED PAVILION CONTAINER ───────────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-md sm:max-w-lg">
        
        {/* Top Grand Garland Arch */}
        <div className="pointer-events-none absolute -top-10 inset-x-0 z-20 h-24 w-full sm:-top-14 sm:h-32">
          <Image
            src="/assets/decorative/vintage-garden-frame/floral-top.png"
            alt=""
            fill
            className="object-contain object-top"
            aria-hidden="true"
          />
        </div>

        {/* The Archway Pavilion Body */}
        <StaggerGroup
          variants={staggerLoose}
          className="relative overflow-hidden rounded-t-[10rem] sm:rounded-t-[13rem] rounded-b-[2rem] border-2 border-gold-600/50 bg-[#FFFFFF] px-6 pt-20 pb-36 text-center shadow-lifted sm:px-10 sm:pt-24 sm:pb-44"
        >
          {/* Inner Inset Arch Line */}
          <div className="pointer-events-none absolute inset-2 sm:inset-3 rounded-t-[9.5rem] sm:rounded-t-[12.5rem] rounded-b-[1.65rem] border border-gold-600/35" />

          {/* Title: Terima Kasih */}
          <RevealItem variants={riseIn} className="mt-2">
            <h3
              id="closing-title"
              className="font-accent text-4xl sm:text-5xl md:text-6xl text-olive-900 leading-tight"
            >
              Terima Kasih
            </h3>
          </RevealItem>

          {/* Closing Heartfelt Message */}
          <RevealItem
            as="p"
            variants={fadeIn}
            className="mt-6 max-w-sm font-body text-xs leading-relaxed text-olive-800 sm:text-sm sm:max-w-md mx-auto"
          >
            Atas kehadiran dan doa restu yang Bapak/Ibu/Saudara/i berikan, kami ucapkan terima kasih. Semoga Allah SWT senantiasa melimpahkan rahmat dan berkah-Nya kepada kita semua.
          </RevealItem>

          {/* Kami Yang Berbahagia */}
          <RevealItem variants={fadeIn} className="mt-8">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-gold-800">
              Kami Yang Berbahagia,
            </p>
          </RevealItem>

          {/* Couple Short Names */}
          <RevealItem variants={slideUp} className="mt-2.5 flex flex-col items-center">
            {isTasyakur && (
              <p className="font-body text-sm sm:text-base font-medium text-olive-800 mb-2">
                Kel. Bpk. Indra Gunawan &amp; Ibu Tini Martini
              </p>
            )}
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-olive-950">
              {isTasyakur ? groom.shortName : bride.shortName}
              <span className="mx-2 font-accent font-normal text-gold-700">&amp;</span>
              {isTasyakur ? bride.shortName : groom.shortName}
            </h2>
          </RevealItem>

          {/* Wassalamu'alaikum */}
          <RevealItem
            as="p"
            variants={fadeIn}
            className="mt-7 font-body text-xs sm:text-sm text-olive-700 tracking-wide"
          >
            Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </RevealItem>

          {/* Bottom Lush Garden Floral Terrace */}
          <div className="pointer-events-none absolute -bottom-4 inset-x-0 h-32 w-full sm:h-44 sm:-bottom-6">
            <Image
              src="/assets/decorative/vintage-garden-frame/floral-bottom.png"
              alt=""
              fill
              className="object-contain object-bottom"
              aria-hidden="true"
            />
          </div>

          {/* Side Floral Sprigs */}
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
        </StaggerGroup>
      </div>
    </section>
  );
}
