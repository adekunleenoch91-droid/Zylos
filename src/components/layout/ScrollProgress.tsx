"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** Thin gold reading-progress bar fixed beneath the navigation. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: reduced ? scrollYProgress : scaleX }}
      className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-gradient-to-r from-bronze via-gold to-champagne"
    />
  );
}
