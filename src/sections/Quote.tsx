"use client";

import Image from "next/image";
import { StaggerGroup, RevealItem } from "@/components/Reveal";
import { fadeIn, riseIn, staggerLoose } from "@/animations/variants";
import config, { isTasyakur } from "@/lib/config";

/** Islamic verse — QS Ar-Rum 21 as a classic vintage botanical card. */
export function Quote() {
  const { quote, couple } = config;

  return (
    <section
      aria-labelledby="quote-ref"
      className="relative overflow-hidden bg-ivory-50 px-4 pt-32 pb-16 sm:px-6 sm:pt-40 sm:pb-24"
    >

      <StaggerGroup
        variants={staggerLoose}
        className="relative z-10 mx-auto max-w-lg sm:max-w-xl md:max-w-2xl"
      >
        {/* Outer Card with Gold Double Border & Soft Paper Shadow */}
        <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-gold-600/50 bg-[#FFFFFF] p-2.5 sm:p-3.5 shadow-lifted">
          {/* Inner Inset Border Frame */}
          <div className="relative flex flex-col items-center overflow-hidden rounded-[1.65rem] sm:rounded-[2.15rem] border border-gold-600/35 px-5 pt-12 pb-28 text-center sm:px-10 sm:pt-16 sm:pb-36">

            {/* Initials */}
            <RevealItem
              variants={riseIn}
              className="relative z-10 mb-5 flex items-center justify-center gap-4 text-olive-900 font-accent text-[3.5rem] leading-none sm:text-[4.75rem]"
            >
              <span>{isTasyakur ? couple.groom.shortName[0] : couple.bride.shortName[0]}</span>
              <span className="mt-1 font-serif text-2xl sm:text-4xl italic text-gold-700">
                &amp;
              </span>
              <span>{isTasyakur ? couple.bride.shortName[0] : couple.groom.shortName[0]}</span>
            </RevealItem>

            {/* Botanical Sprig Divider */}
            <div className="pointer-events-none relative z-10 mb-6 h-5 w-32 opacity-75">
              <Image
                src="/assets/decorative/vintage-garden-frame/botanical-divider.png"
                alt=""
                fill
                className="object-contain"
              />
            </div>

            {/* Translation text */}
            <RevealItem
              as="p"
              variants={fadeIn}
              className="relative z-10 mx-auto max-w-prose font-display text-[0.98rem] leading-[1.9] text-olive-900/90 sm:text-[1.125rem] sm:leading-[2]"
            >
              <span lang="id">&ldquo;{quote.translation}&rdquo;</span>
            </RevealItem>

            {/* Verse Reference */}
            <RevealItem
              as="p"
              variants={fadeIn}
              className="relative z-10 mt-7 font-body text-xs font-semibold tracking-[0.25em] text-olive-800 uppercase sm:text-sm"
            >
              <span id="quote-ref">{quote.ref}</span>
            </RevealItem>

            {/* Bottom Floral Arrangement: Pink Roses & Hydrangeas */}
            <div className="pointer-events-none absolute -bottom-4 inset-x-0 h-32 w-full sm:h-44 sm:-bottom-6">
              <Image
                src="/assets/decorative/vintage-garden-frame/floral-bottom.png"
                alt=""
                fill
                className="object-contain object-bottom"
              />
            </div>

            {/* Corner Leaf Sprigs for extra richness */}
            <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 opacity-80 sm:h-36 sm:w-36">
              <Image
                src="/assets/decorative/vintage-botanical-branch.png"
                alt=""
                fill
                className="object-contain -rotate-45"
              />
            </div>
            <div className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 opacity-80 sm:h-36 sm:w-36">
              <Image
                src="/assets/decorative/vintage-botanical-branch.png"
                alt=""
                fill
                className="object-contain rotate-45 -scale-x-100"
              />
            </div>

          </div>
        </div>
      </StaggerGroup>
    </section>
  );
}
