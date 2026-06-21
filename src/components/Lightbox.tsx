"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { HiXMark, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import type { GalleryItem } from "@/lib/types";

interface Props {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}

/** Fullscreen lightbox with keyboard + touch-swipe navigation. */
export function Lightbox({ items, index, onClose, onNavigate }: Props) {
  const touchStartX = useRef<number | null>(null);
  const open = index !== null;

  const go = useCallback(
    (dir: number) => {
      if (index === null) return;
      const next = (index + dir + items.length) % items.length;
      onNavigate(next);
    },
    [index, items.length, onNavigate]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
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

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            aria-label="Tutup"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/15 text-ivory transition-colors hover:bg-ivory/30"
          >
            <HiXMark className="text-2xl" />
          </button>

          <button
            aria-label="Sebelumnya"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className="absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/15 text-ivory transition-colors hover:bg-ivory/30 sm:left-6"
          >
            <HiChevronLeft className="text-2xl" />
          </button>
          <button
            aria-label="Berikutnya"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className="absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/15 text-ivory transition-colors hover:bg-ivory/30 sm:right-6"
          >
            <HiChevronRight className="text-2xl" />
          </button>

          <motion.figure
            key={index}
            className="relative mx-auto flex max-h-[85vh] w-[90vw] max-w-3xl flex-col items-center"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[70vh] w-full">
              <Image
                src={current.src}
                alt={current.caption || "Foto galeri"}
                fill
                sizes="90vw"
                className="rounded-lg object-contain"
                priority
              />
            </div>
            {current.caption && (
              <figcaption className="mt-4 font-script text-2xl text-ivory">
                {current.caption}
              </figcaption>
            )}
            <span className="mt-1 font-body text-xs text-ivory/60">
              {(index ?? 0) + 1} / {items.length}
            </span>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
