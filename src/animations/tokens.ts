/**
 * Motion tokens (design-system/MASTER.md §15) — the single source both CSS
 * variables in globals.css and JS animation (Framer Motion / GSAP) consume.
 *
 * One rhythm for the whole invitation: a slow cinematic ease-out, reveals
 * between 0.7s and 1.1s, and ambient loops long enough (7-18s) to read as
 * breathing rather than animation.
 */
export const motionTokens = {
  /** press feedback, colour swaps, focus rings */
  durationFast: 0.2,
  /** the default content reveal */
  durationBase: 0.8,
  /** hero assets, section-scale reveals */
  durationSlow: 1.1,
  /** the cover → invitation handover */
  durationSection: 1.2,

  /** primary cinematic ease — entrances settle rather than stop */
  easeOut: [0.22, 1, 0.36, 1] as const,
  easeIn: [0.4, 0, 1, 1] as const,
  /** symmetric, for ambient loops that must not read as a beat */
  easeSoft: [0.45, 0, 0.55, 1] as const,

  /** travel distances — small enough that text never smears */
  distanceSm: 14,
  distanceMobile: 24,
  distanceDesktop: 36,

  /** child stagger inside one group */
  stagger: 0.1,
  staggerTight: 0.06,
  staggerLoose: 0.16,
  /** pause before a group's children start */
  delayChildren: 0.08,

  /** ambient loop durations — slow, desynchronised on purpose */
  loopSlow: 18,
  loopMedium: 11,
  loopFast: 7,

  /** subtle spring — used only where an element should settle, never bounce */
  spring: { type: "spring", stiffness: 120, damping: 20, mass: 0.9 } as const,
} as const;

/**
 * Shared viewport config for whileInView. The negative bottom margin fires the
 * reveal shortly before the element reaches the centre of the screen, so
 * content is already settled by the time the reader arrives at it.
 */
export const viewportOnce = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -12% 0px",
} as const;

/** For tall blocks where `amount` would otherwise delay the trigger too long. */
export const viewportOnceEarly = {
  once: true,
  amount: 0.05,
  margin: "0px 0px -8% 0px",
} as const;
