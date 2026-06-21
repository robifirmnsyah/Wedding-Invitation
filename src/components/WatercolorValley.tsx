"use client";

import { Birds } from "./Birds";

type Variant = "sunrise" | "day" | "sunset";

const palettes: Record<
  Variant,
  { sky: [string, string, string]; sun: string; haze: string }
> = {
  sunrise: {
    sky: ["#fbf3e4", "#f3ead7", "#e3ecd6"],
    sun: "#f4d79e",
    haze: "#dce4d3",
  },
  day: {
    sky: ["#eaf2e3", "#f1efe2", "#f7f3e9"],
    sun: "#f7ecc9",
    haze: "#cdd9c0",
  },
  sunset: {
    sky: ["#f7e6c9", "#f2d9b8", "#e7c9a3"],
    sun: "#f0b878",
    haze: "#d9c6a4",
  },
};

interface Props {
  variant?: Variant;
  withBirds?: boolean;
  className?: string;
  /** show foreground meadow layer */
  withMeadow?: boolean;
}

/**
 * Layered watercolor mountain valley built purely from SVG + gradients.
 * Layer 1 (far): sky, sun glow, distant misty mountains
 * Layer 2 (mid): rolling hills + birds
 * Layer 3 (near): meadow silhouette
 */
export function WatercolorValley({
  variant = "sunrise",
  withBirds = true,
  className = "",
  withMeadow = true,
}: Props) {
  const p = palettes[variant];

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* Layer 1 — sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${p.sky[0]} 0%, ${p.sky[1]} 45%, ${p.sky[2]} 100%)`,
        }}
      />

      {/* Sun glow */}
      <div
        className="absolute left-1/2 top-[14%] h-[42vmin] w-[42vmin] -translate-x-1/2 rounded-full animate-pulseGlow"
        style={{
          background: `radial-gradient(circle, ${p.sun} 0%, ${p.sun}99 30%, transparent 68%)`,
          filter: "blur(6px)",
        }}
      />

      {/* Soft clouds */}
      <svg
        className="absolute inset-x-0 top-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id="m-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.haze} stopOpacity="0.85" />
            <stop offset="100%" stopColor={p.haze} stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="hill-1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9bae6f" />
            <stop offset="100%" stopColor="#7f945a" />
          </linearGradient>
          <linearGradient id="hill-2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7d9152" />
            <stop offset="100%" stopColor="#647a3c" />
          </linearGradient>
          <linearGradient id="meadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5d7137" />
            <stop offset="100%" stopColor="#46562a" />
          </linearGradient>
        </defs>

        {/* clouds */}
        <g fill="#ffffff" opacity="0.5">
          <ellipse cx="320" cy="150" rx="150" ry="34" />
          <ellipse cx="1100" cy="110" rx="180" ry="38" />
          <ellipse cx="760" cy="210" rx="120" ry="26" />
        </g>

        {/* Layer 1 — distant misty mountains */}
        <path
          d="M0 470 L180 340 L320 440 L470 300 L640 460 L820 330 L1000 470 L1180 360 L1320 460 L1440 400 L1440 900 L0 900 Z"
          fill="url(#m-far)"
        />

        {/* Layer 2 — rolling hills */}
        <path
          d="M0 560 C 260 470 480 600 760 540 C 1040 480 1240 600 1440 540 L1440 900 L0 900 Z"
          fill="url(#hill-1)"
          opacity="0.95"
        />
        <path
          d="M0 660 C 300 600 520 700 820 640 C 1100 585 1280 690 1440 650 L1440 900 L0 900 Z"
          fill="url(#hill-2)"
        />

        {/* A large watercolor tree on the mid layer */}
        <g opacity="0.9" transform="translate(1150 540)">
          <rect x="34" y="40" width="10" height="120" rx="4" fill="#6b5a3c" />
          <circle cx="40" cy="40" r="58" fill="#5f7438" />
          <circle cx="8" cy="64" r="40" fill="#6c8242" />
          <circle cx="74" cy="62" r="42" fill="#54692f" />
        </g>

        {/* Layer 3 — foreground meadow */}
        {withMeadow && (
          <path
            d="M0 740 C 260 690 520 790 820 740 C 1100 695 1300 780 1440 745 L1440 900 L0 900 Z"
            fill="url(#meadow)"
          />
        )}
      </svg>

      {withBirds && <Birds />}
    </div>
  );
}
