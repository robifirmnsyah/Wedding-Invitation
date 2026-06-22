"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineEnvelopeOpen } from "react-icons/hi2";
import { WatercolorValley } from "@/components/WatercolorValley";
import { Petals } from "@/components/Petals";
import config from "@/lib/config";

interface Props {
  guestName: string;
  opened: boolean;
  onOpen: () => void;
}

/** Fullscreen opening cover: watercolor video valley + guest name overlay. */
export function Hero({ guestName, opened, onOpen }: Props) {
  const { groom, bride } = config.couple;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);

  return (
    <section className="relative flex h-[100svh] min-h-[600px] w-full items-center justify-center overflow-hidden">
      {/* Fallback painted valley — shown until/unless the video can play */}
      <WatercolorValley variant="sunrise" />
      {!videoReady && <Petals count={12} />}

      {/* Background motion video (webm preferred, mp4 fallback) */}
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          videoReady ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
        onCanPlay={() => setVideoReady(true)}
      >
        <source src="/assets/backgrounds/hero.webm" type="video/webm" />
        <source src="/assets/backgrounds/hero.mp4" type="video/mp4" />
      </video>

      {/* Soft ivory scrim to lift text legibility over the painting */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 42%, rgba(250,248,243,0.55) 0%, rgba(250,248,243,0.18) 38%, transparent 68%), linear-gradient(180deg, rgba(250,248,243,0.35) 0%, transparent 22%, transparent 70%, rgba(59,59,59,0.18) 100%)",
        }}
      />

      <motion.div
        className="relative z-10 mx-auto flex max-w-xl flex-col items-center px-6 text-center [text-shadow:0_1px_14px_rgba(250,248,243,0.85)]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-sub text-base italic tracking-[0.3em] text-olive-dark">
          {config.hero.tagline}
        </p>

        <h1 className="mt-3 font-heading text-5xl font-600 leading-tight text-olive-dark sm:text-6xl">
          {groom.shortName}
          <span className="mx-3 font-script text-4xl text-olive">&amp;</span>
          {bride.shortName}
        </h1>

        <p className="mt-3 font-body text-sm tracking-wide text-ink/80">
          {config.hero.dateLabel}
        </p>

        <div className="mt-10 rounded-2xl glass-soft px-6 py-4 shadow-sm ring-1 ring-olive/10 [text-shadow:none]">
          <p className="font-body text-xs uppercase tracking-widest text-ink/50">
            Kepada Yth.
          </p>
          <p className="mt-1 font-script text-3xl text-olive-dark">{guestName}</p>
        </div>

        {!opened && (
          <motion.button
            onClick={onOpen}
            className="btn-olive mt-8 [text-shadow:none]"
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <HiOutlineEnvelopeOpen className="text-lg" />
            Open Invitation
          </motion.button>
        )}
      </motion.div>

      {/* gentle scroll hint once opened */}
      {opened && (
        <motion.div
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-olive-dark/70"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <span className="font-body text-xs tracking-widest">SCROLL</span>
        </motion.div>
      )}
    </section>
  );
}
