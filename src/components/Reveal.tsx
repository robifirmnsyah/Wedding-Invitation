"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { slideUp, inViewOnce } from "@/animations/variants";

interface Props {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "span";
}

/** Scroll-reveal wrapper (Framer Motion whileInView). */
export function Reveal({
  children,
  variants = slideUp,
  className = "",
  delay = 0,
  as = "div",
}: Props) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
