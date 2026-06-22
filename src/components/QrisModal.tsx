"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { HiXMark, HiArrowDownTray } from "react-icons/hi2";

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
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            aria-label="Tutup"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/15 text-ivory transition-colors hover:bg-ivory/30"
          >
            <HiXMark className="text-2xl" />
          </button>

          <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
              <HiArrowDownTray className="text-lg" />
              Unduh QRIS
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
