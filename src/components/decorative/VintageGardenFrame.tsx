"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { motionTokens } from "@/animations/tokens";

const ASSET_ROOT = "/assets/decorative/vintage-garden-frame";
const EASE = motionTokens.easeOut;
const SOFT = motionTokens.easeSoft;

/**
 * The cover entrance is one choreographed sequence. Each asset enters at its
 * own beat, settles, and only then begins breathing — nothing sways while
 * something else is still arriving.
 */
const BEAT = {
  landscape: 0.15,
  arch: 0.42,
  top: 0.6,
  left: 0.92,
  right: 1.08,
  bottom: 1.48,
  veil: 1.86,
  birds: 2.28,
} as const;

/** Ambient loops all start after the last asset has landed. */
const AMBIENT_START = 0.15;

type DecorativeImageProps = {
  src: string;
  sizes: string;
  className: string;
  priority?: boolean;
};

function DecorativeImage({
  src,
  sizes,
  className,
  priority = false,
}: DecorativeImageProps) {
  return (
    <Image
      src={`${ASSET_ROOT}/${src}`}
      alt=""
      fill
      priority={priority}
      sizes={sizes}
      className={className}
      aria-hidden="true"
    />
  );
}

interface Props {
  /** true once "Buka Undangan" is pressed — the frame opens outward */
  opened?: boolean;
}

export function VintageGardenFrame({ opened = false }: Props) {
  /** Ambient motion intentionally remains active for the animated cover. */
  const loop = (
    keyframes: Record<string, number[]>,
    duration: number,
    delay = AMBIENT_START
  ) => ({
    animate: keyframes,
    transition: Object.fromEntries(
      Object.keys(keyframes).map((k) => [
        k,
        { duration, delay, repeat: Infinity, ease: SOFT },
      ])
    ),
  });

  return (
    <div
      className="pointer-events-none absolute inset-0 isolate overflow-visible"
      aria-hidden="true"
    >
      {/* 1 — the garden reveals from the ground upward */}
      <motion.div
        className="absolute inset-x-[6%] bottom-[3%] top-[3%] z-0"
        initial={{ opacity: 0, scale: 1.12, y: 24, clipPath: "inset(100% 6% 0 6% round 48% 48% 0 0)" }}
        animate={{
          opacity: 0.84,
          scale: opened ? 1.05 : 1,
          y: opened ? -8 : 0,
          clipPath: "inset(0% 0 0 0 round 0 0 0 0)",
        }}
        transition={{
          opacity: { duration: 1.3, delay: BEAT.landscape, ease: EASE },
          clipPath: { duration: 1.55, delay: BEAT.landscape, ease: EASE },
          scale: { duration: opened ? 1.4 : 1.55, delay: opened ? 0 : BEAT.landscape, ease: EASE },
          y: { duration: opened ? 1.4 : 1.55, delay: opened ? 0 : BEAT.landscape, ease: EASE },
        }}
      >
        <motion.div
          className="absolute inset-0"
          {...loop({ y: [0, -7, 0], scale: [1, 1.012, 1] }, motionTokens.loopSlow)}
        >
          <DecorativeImage
            src="garden-landscape.png"
            sizes="(max-width: 640px) 94vw, 34rem"
            className="object-contain object-bottom"
            priority
          />
        </motion.div>
      </motion.div>

      {/* 2 — the classical arch draws itself around the centre */}
      <motion.div
        className="vintage-garden-arch absolute inset-x-[11%] bottom-[9%] top-[9%] z-[1] origin-bottom"
        initial={{ opacity: 0, scaleY: 0.78, clipPath: "inset(100% 0 0 0)" }}
        animate={{ opacity: 1, scaleY: 1, clipPath: "inset(0% 0 0 0)" }}
        transition={{ duration: 1.35, delay: BEAT.arch, ease: EASE }}
      />

      {/* 7 — the ivory veil lifts to reveal the invitation area */}
      <motion.div
        className="absolute inset-x-[11%] bottom-[9%] top-[9%] z-[5] overflow-hidden rounded-t-[48%] bg-[#fffaf0]/85"
        initial={{ opacity: 0.92, scaleY: 1 }}
        animate={{ opacity: 0, scaleY: 0.97 }}
        transition={{ duration: 1.2, delay: BEAT.veil, ease: EASE }}
      />

      {/* 4 — top floral ornament descends */}
      <motion.div
        className="absolute -left-[14%] -right-[14%] -top-[1.5%] z-[4] h-[31%] origin-top"
        initial={{ opacity: 0, y: -82, rotate: -4, scale: 0.93 }}
        animate={{
          opacity: 0.98,
          y: opened ? -18 : 0,
          rotate: opened ? -1.5 : 0,
          scale: 1,
        }}
        transition={{
          opacity: { duration: 0.92, delay: BEAT.top, ease: EASE },
          y: { duration: opened ? 1.2 : 1.28, delay: opened ? 0 : BEAT.top, ease: EASE },
          rotate: { duration: 1.28, delay: BEAT.top, ease: EASE },
          scale: { duration: 1.28, delay: BEAT.top, ease: EASE },
        }}
      >
        <motion.div
          className="absolute inset-0"
          {...loop({ y: [0, 5, 0], rotate: [-0.7, 0.7, -0.7] }, 8.8)}
        >
          <DecorativeImage
            src="floral-top.png"
            sizes="(max-width: 640px) 128vw, 44rem"
            className="object-contain object-top"
          />
        </motion.div>
      </motion.div>

      {/* 5a — left arrangement grows in from its own edge */}
      <motion.div
        className="absolute -left-[23%] bottom-[1%] z-[3] h-[78%] w-[69%] origin-bottom-left sm:-left-[17%]"
        initial={{ opacity: 0, x: -108, y: 24, rotate: -5, scale: 0.94 }}
        animate={{
          opacity: 0.95,
          x: opened ? -22 : 0,
          rotate: 0,
          y: 0,
          scale: 1,
        }}
        transition={{
          opacity: { duration: 0.95, delay: BEAT.left, ease: EASE },
          x: { duration: opened ? 1.2 : 1.3, delay: opened ? 0 : BEAT.left, ease: EASE },
          y: { duration: 1.3, delay: BEAT.left, ease: EASE },
          rotate: { duration: 1.38, delay: BEAT.left, ease: EASE },
          scale: { duration: 1.3, delay: BEAT.left, ease: EASE },
        }}
      >
        <motion.div
          className="absolute inset-0 origin-bottom-left"
          {...loop({ x: [0, 7, 0], y: [0, -5, 0], rotate: [-1.2, 0.8, -1.2] }, 10.2)}
        >
          <DecorativeImage
            src="floral-left.png"
            sizes="(max-width: 640px) 69vw, 24rem"
            className="object-contain object-left-bottom"
          />
        </motion.div>
      </motion.div>

      {/* 5b — right arrangement, a beat behind so the pair reads as two gestures */}
      <motion.div
        className="absolute -right-[23%] bottom-[1%] z-[3] h-[78%] w-[69%] origin-bottom-right sm:-right-[17%]"
        initial={{ opacity: 0, x: 108, y: 28, rotate: 5, scale: 0.94 }}
        animate={{
          opacity: 0.95,
          x: opened ? 22 : 0,
          rotate: 0,
          y: 0,
          scale: 1,
        }}
        transition={{
          opacity: { duration: 0.95, delay: BEAT.right, ease: EASE },
          x: { duration: 1.3, delay: opened ? 0 : BEAT.right, ease: EASE },
          y: { duration: 1.3, delay: BEAT.right, ease: EASE },
          rotate: { duration: 1.38, delay: BEAT.right, ease: EASE },
          scale: { duration: 1.3, delay: BEAT.right, ease: EASE },
        }}
      >
        <motion.div
          className="absolute inset-0 origin-bottom-right"
          {...loop({ x: [0, -7, 0], y: [0, -6, 0], rotate: [1.15, -0.75, 1.15] }, 11.6)}
        >
          <DecorativeImage
            src="floral-right.png"
            sizes="(max-width: 640px) 69vw, 24rem"
            className="object-contain object-right-bottom"
          />
        </motion.div>
      </motion.div>

      {/* 6 — bottom ornament rises last and holds the composition down */}
      <motion.div
        className="absolute -bottom-[3%] -left-[16%] -right-[16%] z-[6] h-[27%] origin-bottom"
        initial={{ opacity: 0, y: 78, scale: 0.96, clipPath: "inset(100% 0 0 0)" }}
        animate={{
          opacity: 0.98,
          y: opened ? 16 : 0,
          scale: 1,
          clipPath: "inset(0% 0 0 0)",
        }}
        transition={{
          opacity: { duration: 0.9, delay: BEAT.bottom, ease: EASE },
          y: { duration: 1.18, delay: opened ? 0 : BEAT.bottom, ease: EASE },
          scale: { duration: 1.2, delay: BEAT.bottom, ease: EASE },
          clipPath: { duration: 1.12, delay: BEAT.bottom, ease: EASE },
        }}
      >
        <motion.div
          className="absolute inset-0"
          {...loop({ y: [0, 6, 0], rotate: [-0.3, 0.34, -0.3] }, 7.8)}
        >
          <DecorativeImage
            src="floral-bottom.png"
            sizes="(max-width: 640px) 132vw, 46rem"
            className="object-contain object-bottom"
          />
        </motion.div>
      </motion.div>

      {/* birds hover in place — they never travel across the frame */}
      <motion.div
        className="absolute bottom-[1%] left-[8%] z-[2] h-[10%] w-[20%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.72 }}
        transition={{ duration: 0.9, delay: BEAT.birds, ease: EASE }}
      >
        <motion.div
          className="absolute inset-0"
          {...loop(
            { x: [-4, 5, -4], y: [2, -5, 2], rotate: [-1.5, 1.5, -1.5] },
            motionTokens.loopFast
          )}
        >
          <DecorativeImage
            src="bird-flying-right.png"
            sizes="8rem"
            className="object-contain"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute right-[7%] top-[36%] z-[2] h-[11%] w-[20%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.68 }}
        transition={{ duration: 0.9, delay: BEAT.birds + 0.15, ease: EASE }}
      >
        <motion.div
          className="absolute inset-0"
          {...loop(
            { x: [4, -5, 4], y: [-1, -7, -1], rotate: [1.5, -1.5, 1.5] },
            8.5,
            AMBIENT_START + 0.6
          )}
        >
          <DecorativeImage
            src="bird-hovering.png"
            sizes="8rem"
            className="object-contain"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
