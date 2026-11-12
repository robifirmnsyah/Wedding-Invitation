"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { HiXMark, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import type { GalleryItem } from "@/lib/types";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motionTokens } from "@/animations/tokens";

interface Props {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}

/** Fullscreen lightbox with keyboard, focus, and touch-swipe navigation. */
export function Lightbox({ items, index, onClose, onNavigate }: Props) {
  const touchStartX = useRef<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [direction, setDirection] = useState(0);
  const open = index !== null;

  const go = useCallback(
    (dir: number) => {
      if (index === null) return;
      setDirection(dir);
      const next = (index + dir + items.length) % items.length;
      onNavigate(next);
    },
    [index, items.length, onNavigate]
  );

  useEffect(() => {
    if (!open) {
      previousFocusRef.current?.focus?.();
      previousFocusRef.current = null;
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
          )
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go, onClose]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  const current = index !== null ? items[index] : null;
  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.4, ease: motionTokens.easeOut };

  /** next/prev slide in from the side they came from, so direction reads */
  const slide = {
    enter: reducedMotion
      ? { opacity: 0 }
      : { opacity: 0, x: direction * 40, scale: 0.98 },
    center: { opacity: 1, x: 0, scale: 1 },
    exit: reducedMotion
      ? { opacity: 0 }
      : { opacity: 0, x: direction * -40, scale: 0.98 },
  };

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          aria-describedby="lightbox-count"
          tabIndex={-1}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-olive-950/95 p-4"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={transition}
          onClick={onClose}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <h2 id="lightbox-title" className="sr-only">
            {current.caption || "Foto galeri"}
          </h2>
          <button
            ref={closeRef}
            type="button"
            aria-label="Tutup galeri"
            onClick={onClose}
            className="lightbox-control absolute right-4 top-4 z-10"
          >
            <HiXMark className="text-2xl" aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="Foto sebelumnya"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className="lightbox-control absolute left-3 z-10 sm:left-6"
          >
            <HiChevronLeft className="text-2xl" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Foto berikutnya"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className="lightbox-control absolute right-3 z-10 sm:right-6"
          >
            <HiChevronRight className="text-2xl" aria-hidden="true" />
          </button>

          <div
            className="relative mx-auto flex max-h-[85vh] w-[90vw] max-w-3xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.figure
                key={index}
                className="flex w-full flex-col items-center"
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
              >
                <div className="relative h-[70vh] w-full">
                  <Image
                    src={current.src}
                    alt={current.caption || "Foto galeri"}
                    fill
                    sizes="90vw"
                    className="object-contain"
                    priority
                  />
                </div>
                {current.caption && (
                  <figcaption className="mt-4 font-display text-2xl italic text-ivory-50">
                    {current.caption}
                  </figcaption>
                )}
              </motion.figure>
            </AnimatePresence>
            <div className="mt-3 flex flex-col items-center gap-1.5 text-center">
              <span id="lightbox-count" className="font-body text-xs text-ivory-50/70">
                {(index ?? 0) + 1} / {items.length}
              </span>
              <p className="mt-1 font-display text-sm font-medium tracking-[0.18em] text-ivory-50/90 sm:text-base">
                #pasTIBIsah
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
