"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  slideUp,
  staggerContainer,
  viewportOnce,
  viewportOnceEarly,
} from "@/animations/variants";

type Tag = "div" | "section" | "li" | "span" | "p" | "ol" | "ul";

interface RevealProps {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  as?: Tag;
  /** trigger as soon as the top edge appears — for very tall blocks */
  early?: boolean;
}

/**
 * Scroll-reveal wrapper (Framer Motion whileInView). Fires once, shortly
 * before the element reaches the centre of the viewport.
 */
export function Reveal({
  children,
  variants = slideUp,
  className = "",
  delay = 0,
  as = "div",
  early = false,
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={early ? viewportOnceEarly : viewportOnce}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  as?: Tag;
  early?: boolean;
}

/**
 * Orchestrates child `RevealItem`s so a group enters as one sequence rather
 * than a slab. Pair with `RevealItem` — plain children are unaffected.
 */
export function StaggerGroup({
  children,
  className = "",
  variants = staggerContainer,
  delay = 0,
  as = "div",
  early = false,
}: StaggerProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={early ? viewportOnceEarly : viewportOnce}
      transition={{ delayChildren: delay }}
    >
      {children}
    </MotionTag>
  );
}

interface ItemProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  as?: Tag;
  style?: React.CSSProperties;
}

/** A single participant in a `StaggerGroup`. */
export function RevealItem({
  children,
  className = "",
  variants = slideUp,
  as = "div",
  style,
}: ItemProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag className={className} variants={variants} style={style}>
      {children}
    </MotionTag>
  );
}
