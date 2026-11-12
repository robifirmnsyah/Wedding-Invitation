"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const ASSET_ROOT = "/assets/decorative/vintage-garden-frame";

interface Props {
  /** file name inside public/assets/decorative/vintage-garden-frame */
  src: string;
  /** which edge the sprig grows in from */
  side: "left" | "right";
  /** positioning + size classes for the wrapper */
  className: string;
  /** how far the element drifts across the section, in pixels */
  distance?: number;
  opacity?: number;
  sizes?: string;
}

/**
 * A watercolour botanical fragment anchored to a section edge, drifting slowly
 * against the scroll so chapters feel like parts of one garden.
 *
 * Decorative only: aria-hidden, pointer-events none, and clipped by the
 * section's own overflow so it can never create horizontal scroll.
 */
export function BotanicalParallax({
  src,
  side,
  className,
  distance = 60,
  opacity = 0.3,
  sizes = "(max-width: 640px) 40vw, 18rem",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        y: reduced ? 0 : y,
        opacity,
        scaleX: side === "right" ? -1 : 1,
      }}
    >
      <Image
        src={`${ASSET_ROOT}/${src}`}
        alt=""
        fill
        loading="lazy"
        sizes={sizes}
        className="object-contain"
        aria-hidden="true"
      />
    </motion.div>
  );
}
