"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { HiXMark, HiArrowDownTray } from "react-icons/hi2";
import { motionTokens } from "@/animations/tokens";

interface Props {
  src: string;
  open: boolean;
  onClose: () => void;
  /** file name used when downloading */
  downloadName?: string;
}

/** Fullscreen QRIS viewer: enlarge the code and download the image. */
export function QrisModal({
  src,
  open,
  onClose,
  downloadName = "qris1.jpeg",
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      previousFocusRef.current?.focus?.();
      previousFocusRef.current = null;
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            "button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])"
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
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="QRIS pembayaran"
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-olive-950/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: motionTokens.durationFast,
            ease: motionTokens.easeOut,
          }}
          onClick={onClose}
        >
          <button
            ref={closeRef}
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="lightbox-control absolute right-4 top-4 z-10 rounded-full"
          >
            <HiXMark className="text-2xl" aria-hidden="true" />
          </button>

          <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.4, ease: motionTokens.easeOut }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[68vh] w-[88vw] max-w-md">
              <Image
                src={src}
                alt="QRIS pembayaran"
                fill
                sizes="90vw"
                className="rounded-xl object-contain"
                priority
              />
            </div>

            <a
              href={src}
              download={downloadName}
              className="btn-olive mt-5"
              onClick={(e) => e.stopPropagation()}
            >
              <HiArrowDownTray className="text-lg" aria-hidden="true" />
              Unduh QRIS
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
