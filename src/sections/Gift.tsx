"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineClipboard,
  HiCheck,
  HiGift,
} from "react-icons/hi2";
import { StaggerGroup, RevealItem } from "@/components/Reveal";
import { SectionTitle } from "@/components/Decor";
import { motionTokens } from "@/animations/tokens";
import { fadeIn, slideUp, riseIn, staggerLoose } from "@/animations/variants";
import { copyToClipboard } from "@/lib/utils";
import config from "@/lib/config";

function CopyButton({ value, holder }: { value: string; holder: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };
  return (
    <motion.button
      type="button"
      onClick={onCopy}
      aria-label={`Salin nomor rekening ${holder}`}
      className={`w-full cursor-pointer rounded-xl py-2.5 px-4 font-body text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm flex items-center justify-center gap-2 ${
        copied
          ? "bg-olive-600 text-ivory-50"
          : "bg-[#BCA369] text-white hover:bg-[#A88F55] active:scale-[0.98]"
      }`}
      whileTap={{ scale: 0.98 }}
    >
      {copied ? (
        <>
          <HiCheck className="text-base" aria-hidden="true" />
          <span>Tersalin ke Clipboard</span>
        </>
      ) : (
        <>
          <HiOutlineClipboard className="text-base" aria-hidden="true" />
          <span>Copy Nomor Rekening</span>
        </>
      )}
    </motion.button>
  );
}

/**
 * Wedding Gift Section — card-based presentation with ATM bank cards
 * and animated floating side florals.
 */
export function Gift() {
  const { gift } = config;
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section
      aria-labelledby="gift-title"
      className="relative overflow-hidden bg-ivory-50 px-4 py-20 sm:px-6 sm:py-28"
    >
      {/* ── ANIMATED SIDE BOTANICAL ASSETS ─────────────────────────────── */}
      
      {/* Left Animated Floral Bouquet */}
      <motion.div
        className="pointer-events-none absolute -left-16 top-1/4 z-0 h-[28rem] w-[18rem] opacity-75 sm:-left-10 sm:h-[36rem] sm:w-[24rem]"
        animate={{
          y: [0, -14, 0],
          rotate: [-1.5, 1.5, -1.5],
        }}
        transition={{
          duration: 7.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/assets/decorative/vintage-garden-frame/floral-left.png"
          alt=""
          fill
          className="object-contain object-left"
          aria-hidden="true"
        />
      </motion.div>

      {/* Right Animated Floral Bouquet */}
      <motion.div
        className="pointer-events-none absolute -right-16 top-1/3 z-0 h-[28rem] w-[18rem] opacity-75 sm:-right-10 sm:h-[36rem] sm:w-[24rem]"
        animate={{
          y: [0, 14, 0],
          rotate: [1.5, -1.5, 1.5],
        }}
        transition={{
          duration: 8.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/assets/decorative/vintage-garden-frame/floral-right.png"
          alt=""
          fill
          className="object-contain object-right"
          aria-hidden="true"
        />
      </motion.div>

      {/* ── SECTION TITLE: Wedding Gift ─────────────────────────────────── */}
      <div className="relative z-10 mb-14 text-center">
        <SectionTitle
          id="gift-title"
          title="Wedding Gift"
        />
      </div>

      {/* ── GIFT CARD CONTAINER ─────────────────────────────────────────── */}
      <StaggerGroup
        variants={staggerLoose}
        className="relative z-10 mx-auto w-full max-w-lg overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-gold-600/50 bg-[#FFFFFF] p-2.5 sm:p-3.5 shadow-lifted"
      >
        {/* Inner Inset Border Frame */}
        <div className="relative flex flex-col items-center overflow-hidden rounded-[1.65rem] sm:rounded-[2.15rem] border border-gold-600/35 px-5 pt-10 pb-24 text-center sm:px-8 sm:pt-14 sm:pb-32">
          
          {/* Top Left Corner Floral Asset */}
          <div className="pointer-events-none absolute -top-4 -left-4 h-28 w-28 opacity-90 sm:h-36 sm:w-36">
            <Image
              src="/assets/decorative/vintage-garden-frame/floral-top-right.png"
              alt=""
              fill
              className="object-contain rotate-180"
              aria-hidden="true"
            />
          </div>

          {/* Top Right Corner Floral Asset */}
          <div className="pointer-events-none absolute -top-4 -right-4 h-28 w-28 opacity-90 sm:h-36 sm:w-36">
            <Image
              src="/assets/decorative/vintage-garden-frame/floral-top-left.png"
              alt=""
              fill
              className="object-contain rotate-180"
              aria-hidden="true"
            />
          </div>

          {/* Card Title */}
          <RevealItem variants={riseIn} className="mt-3 sm:mt-5">
            <h3 className="font-accent text-[2.75rem] leading-tight text-olive-900 sm:text-[3.5rem]">
              Wedding Gift
            </h3>
          </RevealItem>

          {/* Note / Description */}
          <RevealItem
            as="p"
            variants={fadeIn}
            className="mt-4 max-w-md font-body text-xs sm:text-sm leading-relaxed text-olive-800 px-2"
          >
            {gift.note}
          </RevealItem>

          {/* Toggle Button */}
          <RevealItem variants={slideUp} className="mt-6">
            <motion.button
              type="button"
              onClick={() => setShowDetails((prev) => !prev)}
              whileTap={{ scale: 0.96 }}
              aria-expanded={showDetails}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gold-600/60 bg-olive-900 px-6 py-2.5 font-body text-xs sm:text-sm font-semibold tracking-wide text-ivory-50 shadow-sm transition-all duration-300 hover:bg-olive-800 hover:scale-[1.02] hover:shadow-md"
            >
              <HiGift className="text-base text-gold-400" aria-hidden="true" />
              <span>{showDetails ? "Sembunyikan Rekening" : "Klik Disini"}</span>
            </motion.button>
          </RevealItem>

          {/* Bank Accounts List */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                key="bank-list"
                initial={{ opacity: 0, height: 0, y: 16 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: 16 }}
                transition={{
                  duration: motionTokens.durationBase,
                  ease: motionTokens.easeOut,
                }}
                className="mt-8 w-full space-y-4 overflow-hidden text-left"
              >
                {gift.banks.map((b) => (
                  <motion.div
                    key={b.number}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-2xl border border-gold-600/30 bg-gradient-to-br from-white via-[#FCFAF5] to-[#F7F3E9] p-5 sm:p-6 shadow-md"
                  >
                    {/* Top row: Chip & Bank Logo */}
                    <div className="flex items-center justify-between gap-4">
                      {/* Gold Chip */}
                      <div
                        className="flex h-8 w-11 items-center justify-center rounded border border-amber-300/80 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 shadow-sm"
                        aria-hidden="true"
                      >
                        <div className="h-5 w-7 rounded-[2px] border border-amber-400/60 bg-amber-200/50" />
                      </div>

                      {/* Bank Logo */}
                      {b.logo ? (
                        <span className="relative flex h-8 w-28 items-center justify-end">
                          <Image
                            src={b.logo}
                            alt={b.bank}
                            fill
                            sizes="6rem"
                            className={`object-contain object-right ${
                              b.bank.toLowerCase().includes("bca")
                                ? "scale-[1.35] origin-right"
                                : b.bank.toLowerCase().includes("jago")
                                ? "scale-90 origin-right"
                                : ""
                            }`}
                          />
                        </span>
                      ) : (
                        <p className="font-display text-lg font-bold text-olive-900">
                          {b.bank}
                        </p>
                      )}
                    </div>

                    {/* Account Number & Holder */}
                    <div className="my-4">
                      <p className="font-body text-lg sm:text-xl font-bold tracking-wider text-olive-950 tabular-nums">
                        {b.number}
                      </p>
                      <p className="mt-0.5 font-body text-xs sm:text-sm font-medium text-olive-800">
                        {b.holder}
                      </p>
                    </div>

                    {/* Copy Button */}
                    <CopyButton value={b.number} holder={b.holder} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Floral Arrangement: Pink Roses & Hydrangeas */}
          <div className="pointer-events-none absolute -bottom-4 inset-x-0 h-28 w-full sm:h-36 sm:-bottom-6">
            <Image
              src="/assets/decorative/vintage-garden-frame/floral-bottom.png"
              alt=""
              fill
              className="object-contain object-bottom"
              aria-hidden="true"
            />
          </div>

          {/* Corner Leaf Sprigs */}
          <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 opacity-80 sm:h-32 sm:w-32">
            <Image
              src="/assets/decorative/vintage-botanical-branch.png"
              alt=""
              fill
              className="object-contain -rotate-45"
              aria-hidden="true"
            />
          </div>
          <div className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 opacity-80 sm:h-32 sm:w-32">
            <Image
              src="/assets/decorative/vintage-botanical-branch.png"
              alt=""
              fill
              className="object-contain rotate-45 -scale-x-100"
              aria-hidden="true"
            />
          </div>

        </div>
      </StaggerGroup>
    </section>
  );
}
