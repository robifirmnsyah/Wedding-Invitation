"use client";

import type { CSSProperties } from "react";

/**
 * Gentle continuous blossom-petal drift — CSS-driven (transform/opacity only)
 * so it costs nothing on the main thread. Frozen by the site-wide
 * prefers-reduced-motion rule in globals.css, same as every other loop.
 */
const PETALS = [
  { left: "6%", size: 8, duration: 11, delay: 0 },
  { left: "16%", size: 6, duration: 13.5, delay: 2.2 },
  { left: "27%", size: 9, duration: 10.5, delay: 4.6 },
  { left: "38%", size: 7, duration: 14, delay: 1.1 },
  { left: "50%", size: 6, duration: 12, delay: 6.3 },
  { left: "61%", size: 8, duration: 13, delay: 3.4 },
  { left: "72%", size: 7, duration: 11.5, delay: 5.5 },
  { left: "83%", size: 9, duration: 14.5, delay: 0.8 },
  { left: "91%", size: 6, duration: 12.5, delay: 7.2 },
  { left: "45%", size: 8, duration: 15, delay: 8.6 },
] as const;

export function PetalFall() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[6] overflow-hidden"
    >
      {PETALS.map((petal, i) => (
        <span
          key={i}
          className="petal rounded-[0_100%_0_100%] bg-ivory-50/90"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size,
            "--petal-duration": `${petal.duration}s`,
            "--petal-delay": `${petal.delay}s`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
