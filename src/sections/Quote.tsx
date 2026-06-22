"use client";

import { Reveal } from "@/components/Reveal";
import { LeafDivider } from "@/components/Decor";
import { fadeIn } from "@/animations/variants";
import config from "@/lib/config";

/** Islamic verse — QS Ar-Rum 21 with fade-in calligraphy. */
export function Quote() {
  const { quote } = config;

  return (
    <section className="section-pad relative overflow-hidden bg-cream/55 backdrop-blur-sm">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 30%, rgba(220,228,211,0.7) 0%, transparent 70%)",
        }}
      />
      <Reveal
        variants={fadeIn}
        className="relative mx-auto flex max-w-2xl flex-col items-center text-center"
      >
        <p className="font-heading text-lg font-500 text-olive">{quote.ref}</p>
        <LeafDivider />
        <p
          dir="rtl"
          lang="ar"
          className="mt-2 font-sub text-2xl leading-loose text-ink sm:text-3xl"
          style={{ lineHeight: 2.2 }}
        >
          {quote.arabic}
        </p>
        <p className="mt-8 font-sub text-lg italic leading-relaxed text-ink/80">
          “{quote.translation}”
        </p>
      </Reveal>

      {/* Reserve room so the verse never sits behind the meadow art below */}
      <div aria-hidden className="h-[clamp(110px,20vw,300px)]" />

      {/* Meadow footer — grass, wildflowers & bunny pinned to the bottom of THIS
          section (scrolls with it). `100% auto` + bottom keeps the art full-width
          and uncropped, so the bunny is never cut off. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[clamp(130px,24vw,340px)] bg-bottom bg-no-repeat"
        style={{
          backgroundImage: "url(/assets/backgrounds/foreground.png)",
          backgroundSize: "100% auto",
        }}
      />
    </section>
  );
}
