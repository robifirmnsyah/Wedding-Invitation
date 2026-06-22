"use client";

import { motion } from "framer-motion";

interface Props {
  className?: string;
  /** mirror vertically so grass hangs from the top edge */
  flip?: boolean;
  /** show a couple of slowly drifting leaves above the grass */
  withLeaves?: boolean;
}

// stable pseudo-random so SSR and CSR render identically
const rnd = (i: number, n: number) => (Math.sin(i * 53.13 + n * 12.9) + 1) / 2;

const blades = Array.from({ length: 70 }, (_, i) => {
  const x = (i / 70) * 1440 + rnd(i, 1) * 18;
  const h = 30 + rnd(i, 2) * 64;
  const lean = (rnd(i, 3) - 0.5) * 30;
  const dark = rnd(i, 4) > 0.5;
  return { x, h, lean, dark };
});

const FLOWER_HUES = ["#f3a8bc", "#f6d27a", "#fbfaf4", "#d4a9e6", "#f4a48f"];
const flowers = Array.from({ length: 16 }, (_, i) => {
  const x = rnd(i, 6) * 1440;
  const h = 44 + rnd(i, 7) * 40;
  const s = 7 + rnd(i, 8) * 6;
  return { x, h, s, hue: FLOWER_HUES[i % FLOWER_HUES.length] };
});

/**
 * A meadow "ground ledge" used between sections to chain them into one
 * continuous painted landscape. Transparent band that draws a grass + wildflower
 * strip; placed at section seams it makes each section feel like a stage in the
 * scenery. Self-contained SVG so it blends over either neighbouring colour.
 */
export function SceneDivider({
  className = "",
  flip = false,
  withLeaves = false,
}: Props) {
  return (
    <div
      className={`pointer-events-none relative -my-px h-16 w-full overflow-hidden sm:h-20 ${className}`}
      aria-hidden
    >
      {withLeaves && (
        <>
          <motion.span
            className="absolute left-[18%] top-1 text-olive/50"
            animate={{ x: [0, 14, 0], rotate: [0, 18, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Leaf />
          </motion.span>
          <motion.span
            className="absolute right-[24%] top-2 text-olive/40"
            animate={{ x: [0, -12, 0], rotate: [0, -16, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          >
            <Leaf />
          </motion.span>
        </>
      )}

      <svg
        viewBox="0 0 1440 110"
        preserveAspectRatio="none"
        className={`absolute inset-0 h-full w-full ${flip ? "rotate-180" : ""}`}
      >
        <defs>
          <linearGradient id="sd-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6f8a45" stopOpacity="0.0" />
            <stop offset="55%" stopColor="#5d7137" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#46562a" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* soft ground swell */}
        <path
          d="M0 70 C 300 48 560 78 760 64 C 1010 47 1240 76 1440 60 L1440 110 L0 110 Z"
          fill="url(#sd-ground)"
        />

        {/* grass blades */}
        {blades.map((b, i) => (
          <path
            key={i}
            d={`M${b.x} 110 Q ${b.x + b.lean} ${110 - b.h * 0.6} ${
              b.x + b.lean * 1.7
            } ${110 - b.h}`}
            stroke={b.dark ? "#3f5326" : "#5e7a35"}
            strokeWidth={3.6}
            strokeLinecap="round"
            fill="none"
            opacity={0.9}
          />
        ))}

        {/* wildflowers poking above the grass */}
        {flowers.map((f, i) => (
          <g key={`f${i}`}>
            <line
              x1={f.x}
              y1={110}
              x2={f.x}
              y2={110 - f.h}
              stroke="#52702f"
              strokeWidth={2}
            />
            {[0, 72, 144, 216, 288].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const cy = 110 - f.h;
              return (
                <ellipse
                  key={deg}
                  cx={f.x + Math.cos(rad) * f.s * 0.6}
                  cy={cy + Math.sin(rad) * f.s * 0.6}
                  rx={f.s * 0.5}
                  ry={f.s * 0.32}
                  fill={f.hue}
                  transform={`rotate(${deg} ${f.x} ${cy})`}
                />
              );
            })}
            <circle cx={f.x} cy={110 - f.h} r={f.s * 0.3} fill="#f6c84c" />
          </g>
        ))}
      </svg>
    </div>
  );
}

function Leaf() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 1 C 14 5, 18 9, 10 19 C 2 9, 6 5, 10 1 Z" />
    </svg>
  );
}
