"use client";

import { useMemo } from "react";

interface Props {
  count?: number;
  /** "down" floats petals downward (falling), "up" drifts them upward */
  direction?: "down" | "up";
  color?: string;
  className?: string;
}

type Petal = {
  left: number;
  size: number;
  delay: number;
  duration: number;
  swayDelay: number;
  rotate: number;
  hue: string;
};

const palette = ["#e9b8c4", "#f3d9a0", "#cdd9b5", "#f0e0c8", "#d9b8e0"];

/** Lightweight CSS-driven floating petals/leaves overlay. */
export function Petals({
  count = 14,
  direction = "down",
  color,
  className = "",
}: Props) {
  const petals = useMemo<Petal[]>(() => {
    // deterministic-ish pseudo random so SSR/CSR match closely enough (no Math.random in render path issues)
    return Array.from({ length: count }).map((_, i) => {
      const r = (n: number) => ((Math.sin(i * 999 + n) + 1) / 2);
      return {
        left: r(1) * 100,
        size: 8 + r(2) * 12,
        delay: r(3) * 12,
        duration: 11 + r(4) * 12,
        swayDelay: r(5) * 6,
        rotate: r(6) * 360,
        hue: color ?? palette[i % palette.length],
      };
    });
  }, [count, color]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute animate-floatUp"
          style={{
            left: `${p.left}%`,
            bottom: direction === "up" ? "-10%" : "auto",
            top: direction === "down" ? "-10%" : "auto",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            animationDirection: direction === "down" ? "reverse" : "normal",
          }}
        >
          <span
            className="block animate-sway"
            style={{ animationDelay: `${p.swayDelay}s` }}
          >
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 20 20"
              style={{ transform: `rotate(${p.rotate}deg)`, opacity: 0.8 }}
            >
              <path
                d="M10 1 C 14 5, 18 9, 10 19 C 2 9, 6 5, 10 1 Z"
                fill={p.hue}
              />
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}
