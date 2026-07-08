"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT_EXPO } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  /** Seconds to delay the reveal (used for stagger choreography). */
  delay?: number;
  /** Rise distance in px; 0 gives a pure fade. */
  y?: number;
  className?: string;
  as?: "div" | "section" | "span" | "li" | "header" | "figure";
  once?: boolean;
}

/**
 * Fade-and-rise reveal triggered when the element enters the viewport.
 * Collapses to a simple fade when the user prefers reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 32,
  className,
  as = "div",
  once = true,
}: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: reduced ? 0.2 : 0.8, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </Component>
  );
}
