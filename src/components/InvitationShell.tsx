"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useLenis } from "@/hooks/useLenis";
import { useGuestName } from "@/hooks/useGuestName";
import { DesktopPanel } from "@/components/DesktopPanel";
import { MusicButton } from "@/components/MusicButton";
import { Loading } from "@/sections/Loading";
import { Hero } from "@/sections/Hero";
import { Quote } from "@/sections/Quote";
import { Story } from "@/sections/Story";
import { BrideGroom } from "@/sections/BrideGroom";
import { SaveDate } from "@/sections/SaveDate";
import { EventDetails } from "@/sections/EventDetails";
import { Gallery } from "@/sections/Gallery";
import { Wishes } from "@/sections/Wishes";
import { Gift } from "@/sections/Gift";
import { Closing } from "@/sections/Closing";
import { motionTokens } from "@/animations/tokens";
import config, { isTasyakur } from "@/lib/config";

const easeInFastSlowOut = (progress: number) => {
  const split = 0.3;
  if (progress < split) {
    return 0.46 * (progress / split) ** 1.35;
  }

  const remaining = (progress - split) / (1 - split);
  return 0.46 + 0.54 * (1 - (1 - remaining) ** 2.35);
};

/**
 * Top-level client orchestrator: loading screen → cover → (on open) the full
 * scrollable invitation with smooth scroll and music.
 *
 * Desktop view displays a dedicated ambient decorative frame on the left,
 * while preserving the complete mobile invitation experience on the right.
 */
export function InvitationShell() {
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const guestName = useGuestName();

  useLenis(opened);

  // hide the loading screen after a short reveal
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 2400);
    return () => clearTimeout(id);
  }, []);

  // lock body scroll until the invitation is opened
  useEffect(() => {
    document.body.classList.toggle("locked", !opened);
    return () => document.body.classList.remove("locked");
  }, [opened]);

  const handleOpen = () => {
    setOpened(true);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  };

  const scrollToInvitation = () => {
    const destination = document.getElementById("isi-undangan");
    if (!destination) return;

    const startY = window.scrollY;
    const targetY = startY + destination.getBoundingClientRect().top;
    const duration = 1050;
    const startedAt = performance.now();

    const scrollFrame = (now: number) => {
      const elapsed = Math.min((now - startedAt) / duration, 1);
      window.scrollTo({ top: startY + (targetY - startY) * easeInFastSlowOut(elapsed) });
      if (elapsed < 1) requestAnimationFrame(scrollFrame);
    };

    requestAnimationFrame(scrollFrame);
  };

  return (
    <MotionConfig reducedMotion="never">
      <a href="#isi-undangan" className="skip-link">
        Lewati ke isi undangan
      </a>

      <Loading show={loading} />
      <DesktopPanel />
      <MusicButton src={config.music} active={opened} />

      <div className="relative min-h-screen w-full lg:flex lg:justify-end bg-[#f6f2e8]">
        <main className="relative w-full lg:w-[480px] xl:w-[520px] 2xl:w-[560px] min-h-screen bg-ivory-50 shadow-[-14px_0_36px_rgba(0,0,0,0.12)] border-l border-gold-600/25 z-20 overflow-x-hidden">
          <Hero
            guestName={guestName}
            opened={opened}
            onOpen={handleOpen}
            onScrollToContent={scrollToInvitation}
          />

          <AnimatePresence>
            {opened && (
              <motion.div
                id="isi-undangan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: motionTokens.durationSection,
                  delay: 0.72,
                  ease: motionTokens.easeOut,
                }}
              >
                <Quote />
                <BrideGroom />
                {!isTasyakur && <SaveDate />}
                <EventDetails />
                <Gallery />
                {!isTasyakur && (
                  <>
                    <Story />
                    <Wishes />
                    <Gift />
                  </>
                )}
                <Closing />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </MotionConfig>
  );
}
