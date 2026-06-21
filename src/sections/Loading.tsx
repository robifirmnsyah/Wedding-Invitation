"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GiVineLeaf } from "react-icons/gi";
import { Petals } from "@/components/Petals";
import config from "@/lib/config";

/** Watercolor logo reveal loading screen that fades into the cover. */
export function Loading({ show }: { show: boolean }) {
  const { groom, bride } = config.couple;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-ivory"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <Petals count={10} />
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <GiVineLeaf className="text-4xl text-olive" />
            <p className="mt-4 font-script text-3xl text-olive">
              {groom.shortName} &amp; {bride.shortName}
            </p>
            <p className="mt-2 font-sub text-sm italic tracking-widest text-ink/60">
              The Wedding Invitation
            </p>
            <motion.div
              className="mt-6 h-[3px] w-32 overflow-hidden rounded-full bg-sage"
              aria-hidden
            >
              <motion.div
                className="h-full bg-olive"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
