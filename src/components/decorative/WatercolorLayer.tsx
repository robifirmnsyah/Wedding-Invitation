"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { motionTokens } from "@/animations/tokens";

const ASSET_ROOT = "/assets/decorative/vintage-garden-frame";

interface Props {
  src: string;
  className: string;
  opacity?: number;
  sizes?: string;
  /** Decorative art is rendered below readable section content by default. */
  zIndex?: number;
  quality?: number;
  priority?: boolean;
}

/**
 * A self-contained, transparent watercolour layer for a content chapter.
 * It reserves no layout space and its entrance is intentionally modest, so
 * the invitation reads as one garden rather than a gallery of effects.
 */
export function WatercolorLayer({
  src,
  className,
  opacity = 1,
  sizes = "(max-width: 640px) 100vw, 48rem",
  zIndex = 0,
  quality,
  priority = false,
}: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${className}`}
      style={{ zIndex }}
      initial={reduced ? { opacity } : { opacity: 0, scale: 0.985, y: 10 }}
      whileInView={reduced ? undefined : { opacity, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: motionTokens.durationSlow, ease: motionTokens.easeOut }}
    >
      <Image
        src={`${ASSET_ROOT}/${src}`}
        alt=""
        fill
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        quality={quality}
        sizes={sizes}
        className="object-contain"
      />
    </motion.div>
  );
}
