"use client";

import { motion } from "framer-motion";
import { WatercolorValley } from "@/components/WatercolorValley";
import { Petals } from "@/components/Petals";
import { Reveal } from "@/components/Reveal";
import { fadeIn } from "@/animations/variants";
import config from "@/lib/config";

/** Golden sunset closing with petals drifting upward. */
export function Closing() {
  const { groom, bride } = config.couple;

  return (
    <section className="relative flex min-h-[90svh] w-full items-center justify-center overflow-hidden pb-[clamp(120px,24vh,300px)]">
      <WatercolorValley variant="sunset" />
      <Petals count={16} direction="up" />

      <Reveal
        variants={fadeIn}
        className="relative z-10 mx-auto max-w-xl px-6 text-center"
      >
        <p className="font-sub text-lg italic leading-relaxed text-ink/80">
          {config.closing.message}
        </p>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className="font-script text-2xl text-olive-dark">
            {config.closing.gratitude}
          </p>
          <h2 className="mt-4 font-heading text-4xl font-600 text-olive-dark">
            {groom.shortName}
            <span className="mx-3 font-script text-3xl text-olive">&amp;</span>
            {bride.shortName}
          </h2>
        </motion.div>

        <p className="mt-10 font-body text-xs tracking-widest text-ink/50">
          Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh
        </p>
      </Reveal>
    </section>
  );
}
