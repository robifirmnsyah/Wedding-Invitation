import type { Variants } from "framer-motion";
import { motionTokens, viewportOnce, viewportOnceEarly } from "./tokens";

const { easeOut, durationBase, durationSlow } = motionTokens;

const base = { duration: durationBase, ease: easeOut } as const;
const slow = { duration: durationSlow, ease: easeOut } as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: slow },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: motionTokens.distanceMobile },
  show: { opacity: 1, y: 0, transition: base },
};

/** A touch further and slower — for section headings and lead paragraphs. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: motionTokens.distanceDesktop },
  show: { opacity: 1, y: 0, transition: slow },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: base },
};

/** Portraits, photos, map frames — settles from a hair oversize. */
export const softMask: Variants = {
  hidden: { opacity: 0, scale: 1.04, y: motionTokens.distanceSm },
  show: { opacity: 1, scale: 1, y: 0, transition: slow },
};

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -motionTokens.distanceDesktop },
  show: { opacity: 1, x: 0, transition: slow },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: motionTokens.distanceDesktop },
  show: { opacity: 1, x: 0, transition: slow },
};

/** Ornamental hairlines and dividers — drawn rather than faded. */
export const drawLine: Variants = {
  hidden: { opacity: 0, scaleX: 0.3, originX: "50%" },
  show: {
    opacity: 1,
    scaleX: 1,
    originX: "50%",
    transition: { duration: durationSlow, ease: easeOut },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: motionTokens.stagger,
      delayChildren: motionTokens.delayChildren,
    },
  },
};

export const staggerTight: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: motionTokens.staggerTight,
      delayChildren: motionTokens.delayChildren,
    },
  },
};

export const staggerLoose: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: motionTokens.staggerLoose,
      delayChildren: motionTokens.delayChildren,
    },
  },
};

/** Shared viewport config for whileInView animations. */
export const inViewOnce = viewportOnce;
export { viewportOnce, viewportOnceEarly };
