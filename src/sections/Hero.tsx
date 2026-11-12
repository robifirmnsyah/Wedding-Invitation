"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { HiArrowDown } from "react-icons/hi2";
import { VintageGardenFrame } from "@/components/decorative/VintageGardenFrame";
import { PetalFall } from "@/components/decorative/PetalFall";
import { Sprig } from "@/components/Decor";
import { motionTokens } from "@/animations/tokens";
import config, { isTasyakur } from "@/lib/config";

interface Props {
  guestName: string;
  opened: boolean;
  onOpen: () => void;
  onScrollToContent: () => void;
}

const EASE = motionTokens.easeOut;

/** The cover column enters after the veil lifts, one line at a time. */
const CENTRE_DELAY = 2.65;

const coverStack = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: CENTRE_DELAY },
  },
};

/** The revealed column enters after the cover panel has dissolved away. */
const openedStack = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.13, delayChildren: 0.54 },
  },
};

const line = {
  hidden: { opacity: 0, y: 18, filter: "blur(3px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.72, ease: EASE },
  },
};

/** The portrait settles rather than slides — it is the anchor of the reveal. */
const framePop = {
  hidden: { opacity: 0, y: 26, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.95, ease: EASE },
  },
};

export function Hero({ guestName, opened, onOpen, onScrollToContent }: Props) {
  const { groom, bride } = config.couple;
  const person1 = isTasyakur ? groom : bride;
  const person2 = isTasyakur ? bride : groom;

  const names = (
    <>
      <span className="block">
        {person1.shortName}
        <span className="ml-2 text-gold-700 sm:ml-3">&amp;</span>
      </span>
      <span className="block">{person2.shortName}</span>
    </>
  );

  return (
    <section
      aria-label="Sampul undangan"
      className="vintage-garden-cover relative z-10 flex min-h-svh w-full touch-pan-y items-center justify-center overflow-visible "
    >
      <motion.div
        className="relative mx-auto h-svh min-h-[568px] w-full max-w-[560px] overflow-visible  text-center shadow-paper"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          scale: opened ? [1, 1.055, 1] : 1,
        }}
        transition={{
          duration: opened ? 1.28 : 0.9,
          times: opened ? [0, 0.38, 1] : undefined,
          ease: EASE,
        }}
      >
        <VintageGardenFrame opened={opened} />
        {opened && <PetalFall />}

        {/* ── Cover: names, guest, invitation button ───────────────────── */}
        <AnimatePresence>
          {!opened && (
            <motion.div
              className="absolute inset-x-[13%] top-[20%] z-10 flex flex-col items-center px-3 sm:top-[19%] sm:px-8"
              variants={coverStack}
              initial="hidden"
              animate="show"
              exit={{
                opacity: 0,
                scale: 0.94,
                y: -20,
                filter: "blur(5px)",
                transition: { duration: 0.56, ease: motionTokens.easeIn },
              }}
            >
              <motion.h1
                variants={line}
                className="font-accent leading-[1.06] text-olive-900"
                style={{ fontSize: "clamp(3rem, 13vw, 4.75rem)" }}
              >
                {names}
              </motion.h1>

              <motion.div variants={line} className="mt-6 sm:mt-8">
                <p className="font-display text-base text-olive-700 sm:text-lg">
                  Kepada
                </p>
                <p className="mt-1 font-display text-xl font-medium text-olive-900 sm:text-2xl">
                  {guestName}
                </p>
              </motion.div>

              <motion.button
                onClick={onOpen}
                className="btn-olive mt-6 min-w-48 rounded-full normal-case tracking-[0.02em] shadow-paper sm:mt-8"
                aria-label={`Buka undangan ${person1.shortName} dan ${person2.shortName}`}
                variants={line}
                whileTap={{ scale: 0.96 }}
              >
                Buka Undangan
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* A soft ivory veil makes the cover feel as though it opens into
            the invitation, instead of immediately becoming the next page. */}
        <AnimatePresence>
          {opened && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[9] "
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, times: [0, 0.38, 1], ease: EASE }}
            />
          )}
        </AnimatePresence>

        {/* ── Revealed: monogram, names, date, framed portrait ─────────── */}
        <AnimatePresence>
          {opened && (
            <motion.div
              className="absolute inset-x-[8%] top-[13%] z-10 flex flex-col items-center"
              variants={openedStack}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
            >
              <motion.div
                variants={line}
                aria-hidden="true"
                className="flex items-center gap-2 text-gold-700"
              >
                <Sprig style={{ transform: "scaleX(-1)" }} />
                <span className="font-accent text-xl leading-none">
                  {person1.shortName[0]}
                  {person2.shortName[0]}
                </span>
                <Sprig />
              </motion.div>

              <motion.p variants={line} className="eyebrow mt-3 whitespace-pre-line text-center">
                {config.hero.tagline}
              </motion.p>

              <motion.h2
                variants={line}
                className="mt-2 font-accent leading-[1.06] text-olive-900"
                style={{ fontSize: "clamp(2.5rem, 11.5vw, 4.25rem)" }}
              >
                {names}
              </motion.h2>

              <motion.p
                variants={line}
                className="mt-3 font-body text-sm tracking-[0.08em] text-olive-700 sm:text-base"
              >
                {config.hero.dateLabel}
              </motion.p>

              <motion.div
                variants={framePop}
                className="relative mt-7 w-[60%] max-w-[17rem]"
              >
                <div className="arch-frame relative aspect-[2/3] w-full border border-gold-600/40 bg-ivory-100 p-2 shadow-paper">
                  <div className="arch-frame relative h-full w-full">
                    <Image
                      src={config.hero.photo}
                      alt={`${person1.shortName} & ${person2.shortName}`}
                      fill
                      sizes="(max-width: 640px) 52vw, 17rem"
                      className="object-cover"
                      style={{ objectPosition: "center 22%" }}
                    />
                  </div>
                </div>
                <Image
                  src="/assets/decorative/vintage-garden-frame/portrait-arch-frame.png"
                  alt=""
                  fill
                  sizes="(max-width: 640px) 58vw, 19rem"
                  className="pointer-events-none z-[1] scale-[1.12] object-contain"
                  aria-hidden="true"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {opened && (
            <motion.button
              type="button"
              onClick={onScrollToContent}
              aria-label="Scroll ke isi undangan"
              className="absolute bottom-[4%] left-1/2 z-20 -translate-x-1/2 text-olive-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 0.45, delay: 1.2, ease: EASE } }}
            >
              <motion.span
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-paper"
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 1.35, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <HiArrowDown className="h-6 w-6" aria-label="Scroll ke bawah" />
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
