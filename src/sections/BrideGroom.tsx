"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa6";
import { SectionTitle } from "@/components/Decor";
import { StaggerGroup, RevealItem } from "@/components/Reveal";
import {
  fadeIn,
  slideUp,
  softMask,
  staggerTight,
} from "@/animations/variants";
import config, { isTasyakur } from "@/lib/config";
import type { Person } from "@/lib/types";

function PersonCard({
  person,
  title,
  delay = 0,
}: {
  person: Person;
  title: string;
  delay?: number;
}) {
  return (
    <StaggerGroup
      variants={staggerTight}
      delay={delay}
      className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-gold-600/50 bg-[#FFFFFF] p-2.5 sm:p-3.5 shadow-lifted"
    >
      {/* Inner Inset Frame */}
      <div className="relative flex flex-col items-center overflow-hidden rounded-[1.65rem] sm:rounded-[2.15rem] border border-gold-600/35 px-5 pt-8 pb-10 text-center sm:px-8 sm:pt-10 sm:pb-12">
        
        {/* Title / Role Eyebrow */}
        <RevealItem variants={fadeIn}>
          <span className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-gold-700">
            {title}
          </span>
        </RevealItem>

        {/* Arched portrait photo */}
        <RevealItem variants={softMask} className="mt-6">
          <div className="relative mx-auto w-52 sm:w-60">
            <div className="arch-frame relative aspect-[2/3] w-full overflow-hidden border border-gold-600/40 bg-ivory-100 p-2 shadow-paper">
              <div className="arch-frame relative h-full w-full overflow-hidden">
                <Image
                  src={person.photo}
                  alt={`Potret ${person.fullName}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 13rem, 15rem"
                  className="object-cover"
                  style={{ objectPosition: "center top" }}
                />
              </div>
            </div>
            {/* Arched Frame Overlay Ornament */}
            <Image
              src="/assets/decorative/vintage-garden-frame/portrait-arch-frame.png"
              alt=""
              fill
              loading="lazy"
              sizes="(max-width: 640px) 13rem, 15rem"
              className="pointer-events-none z-[1] scale-[1.08] object-contain"
              aria-hidden="true"
            />
          </div>
        </RevealItem>

        {/* Full Name in Upright Display Font (Not Italic) */}
        <RevealItem variants={slideUp}>
          <h3 className="mt-6 font-display font-semibold text-olive-900 text-2xl sm:text-3xl tracking-tight">
            {person.fullName}
          </h3>
        </RevealItem>

        {/* Parents line */}
        <RevealItem
          as="p"
          variants={fadeIn}
          className="mt-3 max-w-xs font-body text-sm leading-relaxed text-olive-800"
        >
          {person.parents}
        </RevealItem>

        {/* Instagram Pill Button */}
        <RevealItem variants={slideUp} className="mt-6">
          <a
            href={`https://instagram.com/${person.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram ${person.fullName}: @${person.instagram} (tab baru)`}
            className="inline-flex items-center gap-2 rounded-full border border-gold-600/60 bg-olive-900 px-5 py-2 font-body text-xs font-medium tracking-wide text-ivory-50 shadow-sm transition-all duration-300 hover:bg-olive-800 hover:shadow-md"
          >
            <FaInstagram className="text-sm text-gold-400" aria-hidden="true" />
            <span>@{person.instagram}</span>
          </a>
        </RevealItem>

      </div>
    </StaggerGroup>
  );
}

/**
 * Bride & groom section — card based presentation with animated side florals.
 */
export function BrideGroom() {
  const { groom, bride } = config.couple;
  const person1 = isTasyakur ? groom : bride;
  const person2 = isTasyakur ? bride : groom;
  const title1 = isTasyakur ? "Mempelai Pria" : "Mempelai Wanita";
  const title2 = isTasyakur ? "Mempelai Wanita" : "Mempelai Pria";

  return (
    <section
      aria-labelledby="bride-groom-title"
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
          duration: 7,
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
          duration: 7.8,
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

      {/* Hovering Songbird */}
      <motion.div
        className="pointer-events-none absolute right-4 top-16 z-0 h-16 w-16 opacity-60 sm:right-12 sm:h-20 sm:w-20"
        animate={{
          x: [0, -6, 0],
          y: [0, -8, 0],
          rotate: [1, -2, 1],
        }}
        transition={{
          duration: 6,
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

      {/* ── SECTION TITLE: The Bride & Groom ────────────────────────────── */}
      <div className="relative z-10 mb-14 text-center">
        <SectionTitle
          id="bride-groom-title"
          title="The Bride & Groom"
        />
      </div>

      {/* ── PERSON CARDS GRID ────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center justify-center gap-10">
        <PersonCard person={person1} title={title1} />
        
        {/* Elegant Center Ampersand */}
        <div className="flex items-center justify-center">
          <span className="font-accent text-4xl text-gold-700 sm:text-5xl">&amp;</span>
        </div>

        <PersonCard person={person2} title={title2} delay={0.16} />
      </div>
    </section>
  );
}
