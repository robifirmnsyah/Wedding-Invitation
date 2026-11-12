"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Lightbox } from "@/components/Lightbox";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import config from "@/lib/config";

const AUTO_ADVANCE_MS = 4800;
const SLIDE_DURATION = 0.9;
const RAIL_SECONDS_PER_PHOTO = 4.8;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * A portrait-album scene: one large image is the focus, while the thumbnails
 * below invite guests to browse without making the page feel like a dense grid.
 */
export function Gallery() {
  const items = config.gallery;
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const railTrackRef = useRef<HTMLDivElement>(null);
  const [railDistance, setRailDistance] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const current = items[displayedIndex];
  const nextIndex = (displayedIndex + 1) % items.length;
  const railItems = [...items, ...items];

  const move = (direction: -1 | 1) => {
    setSlideDirection(direction);
    setDisplayedIndex((index) => (index + direction + items.length) % items.length);
  };

  // Keep one upcoming image warm so the gentle crossfade never waits for a
  // network request. The rest remain lazy-loaded until a guest reaches them.
  useEffect(() => {
    const preloaded = new window.Image();
    preloaded.src = items[nextIndex].src;
  }, [items, nextIndex]);

  // The rail contains two identical runs. Translating exactly one run means
  // the restart is invisible: it is a continuous right-to-left marquee.
  useEffect(() => {
    const updateDistance = () => {
      const track = railTrackRef.current;
      if (track) setRailDistance(track.scrollWidth / 2);
    };

    updateDistance();
    window.addEventListener("resize", updateDistance);
    return () => window.removeEventListener("resize", updateDistance);
  }, []);

  // A self-scheduling timer avoids intersection-observer edge cases on mobile
  // browsers. It lets each photo breathe before the next gentle transition,
  // pauses for the lightbox, then resumes after the guest closes it.
  useEffect(() => {
    if (lightboxIndex !== null) return;

    const timeout = window.setTimeout(() => {
      setSlideDirection(1);
      setDisplayedIndex((index) => (index + 1) % items.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timeout);
  }, [items.length, lightboxIndex, displayedIndex]);

  return (
    <section aria-labelledby="gallery-title" className="section-pad overflow-hidden ">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-accent text-[clamp(2.55rem,11vw,4rem)] leading-none text-olive-800">
          Portraits of Us
        </p>
        <p id="gallery-title" className="mt-3 font-body text-sm tracking-[0.12em] text-olive-700">
          A collection of our favorite moments
        </p>
      </div>

      <div className="mx-auto mt-9 max-w-2xl sm:max-w-3xl">
        <div className="relative aspect-square w-full overflow-hidden rounded-[1.75rem]  shadow-paper sm:rounded-[2.25rem]">
          <AnimatePresence initial={false} mode="sync">
            <motion.button
              key={current.src}
              type="button"
              aria-label={`Perbesar foto: ${current.caption}`}
              className="absolute inset-0 block w-full cursor-zoom-in"
              initial={{ opacity: 0, x: 60 * slideDirection, scale: 1.015 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60 * slideDirection, scale: 0.99 }}
              transition={{ duration: reducedMotion ? 0 : SLIDE_DURATION, ease: EASE }}
              onClick={() => setLightboxIndex(displayedIndex)}
            >
              <Image
                src={current.src}
                alt={current.caption}
                fill
                loading="lazy"
                sizes="(max-width: 640px) calc(100vw - 2.5rem), 48rem"
                className="object-cover"
                style={{ objectPosition: "center center" }}
              />
              <span className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-olive-950/45 to-transparent" />
              <span className="absolute bottom-4 left-5 font-display text-lg italic text-ivory-50 sm:bottom-5 sm:left-6">
                {current.caption}
              </span>
            </motion.button>
          </AnimatePresence>

          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Foto sebelumnya"
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white drop-shadow-md transition-transform hover:scale-110 sm:left-4"
          >
            <HiChevronLeft className="h-8 w-8" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Foto berikutnya"
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white drop-shadow-md transition-transform hover:scale-110 sm:right-4"
          >
            <HiChevronRight className="h-8 w-8" />
          </button>
        </div>

        <p className="mt-3 text-center font-body text-xs tracking-[0.08em] text-olive-700/75" aria-live="off">
          Foto {displayedIndex + 1} dari {items.length}
        </p>

        <div className="mt-4 overflow-hidden pb-2 sm:mt-5">
          <motion.div
            ref={railTrackRef}
            className="flex items-center gap-3"
            initial={false}
            animate={railDistance && !reducedMotion ? { x: [0, -railDistance] } : { x: 0 }}
            transition={{
              duration: railDistance ? items.length * RAIL_SECONDS_PER_PHOTO : 0,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            {railItems.map((item, railIndex) => {
              const index = railIndex % items.length;
              const isPrimaryCopy = railIndex < items.length;
              const isWide = item.span === "wide";
              return (
                <button
                  key={`${item.src}-${railIndex}`}
                  type="button"
                  onClick={() => {
                    setSlideDirection(index >= displayedIndex ? 1 : -1);
                    setDisplayedIndex(index);
                  }}
                  aria-label={`Pilih foto ${index + 1}: ${item.caption}`}
                  aria-current={displayedIndex === index ? "true" : undefined}
                  tabIndex={isPrimaryCopy ? 0 : -1}
                  className={`relative h-20 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-24 ${
                    isWide ? "aspect-[3/2]" : "aspect-[2/3]"
                  } ${
                    displayedIndex === index
                      ? "border-gold-600 shadow-paper"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    sizes="8rem"
                    className="object-cover"
                    style={{ objectPosition: "center center" }}
                  />
                </button>
              );
            })}
          </motion.div>
        </div>

        <div className="mt-12 text-center sm:mt-14">
          <p className="font-display text-base font-medium tracking-[0.18em] text-olive-800 sm:text-lg">
            #pasTIBIsah
          </p>
        </div>
      </div>

      <Lightbox
        items={items}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(index) => {
          setLightboxIndex(index);
          setSlideDirection(index >= displayedIndex ? 1 : -1);
          setDisplayedIndex(index);
        }}
      />
    </section>
  );
}
