"use client";

import { motion } from "framer-motion";

function Bird({ scale = 1 }: { scale?: number }) {
  return (
    <svg
      width={28 * scale}
      height={14 * scale}
      viewBox="0 0 28 14"
      fill="none"
      aria-hidden
    >
      <motion.path
        d="M1 8 C 6 1, 11 1, 14 6 C 17 1, 22 1, 27 8"
        stroke="#3b3b3b"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        animate={{ d: [
          "M1 8 C 6 1, 11 1, 14 6 C 17 1, 22 1, 27 8",
          "M1 5 C 6 6, 11 6, 14 3 C 17 6, 22 6, 27 5",
          "M1 8 C 6 1, 11 1, 14 6 C 17 1, 22 1, 27 8",
        ] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

const flock = [
  { top: "18%", delay: 0, dur: 26, scale: 1, drift: 30 },
  { top: "24%", delay: 4, dur: 32, scale: 0.7, drift: 18 },
  { top: "15%", delay: 9, dur: 30, scale: 0.85, drift: 24 },
  { top: "30%", delay: 14, dur: 38, scale: 0.6, drift: 14 },
  { top: "21%", delay: 2, dur: 34, scale: 0.5, drift: 12 },
];

/** A flock of bird silhouettes drifting across the sky on a loop. */
export function Birds() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {flock.map((b, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: b.top }}
          initial={{ x: "-10vw", y: 0 }}
          animate={{ x: "110vw", y: [0, -b.drift, b.drift / 2, 0] }}
          transition={{
            x: { duration: b.dur, repeat: Infinity, ease: "linear", delay: b.delay },
            y: { duration: b.dur / 2, repeat: Infinity, ease: "easeInOut", delay: b.delay },
          }}
        >
          <Bird scale={b.scale} />
        </motion.div>
      ))}
    </div>
  );
}
