"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

/**
 * Minimalist loading screen: a breathing heart mark (its two lobes read as
 * two figures leaning together) over a plain white ground.
 */
function HeartMark() {
  return (
    <div className="relative h-24 w-24">
      <Image
        src="/assets/logo/logo-olive.png"
        alt="Loading"
        fill
        sizes="96px"
        className="object-contain"
        priority
      />
    </div>
  );
}

export function Loading({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <HeartMark />
          </motion.div>
          <p className="mt-4 font-body text-sm tracking-[0.05em] text-neutral-500">
            Loading...
          </p>
          <span className="sr-only" role="status">
            Memuat undangan…
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
