import type { Transition, Variants } from "framer-motion";

/**
 * Motion tokens — the single timing vocabulary for every UI animation.
 * Mirrors the CSS motion tokens in globals.css.
 */

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;
export const EASE_IN_OUT_SOFT = [0.65, 0, 0.35, 1] as const;

export const transitions = {
  fast: { duration: 0.2, ease: EASE_OUT_QUART } satisfies Transition,
  base: { duration: 0.35, ease: EASE_OUT_QUART } satisfies Transition,
  slow: { duration: 0.6, ease: EASE_OUT_EXPO } satisfies Transition,
  cinematic: { duration: 1.2, ease: EASE_OUT_EXPO } satisfies Transition,
  spring: { type: "spring", stiffness: 260, damping: 28 } satisfies Transition,
};

/** Fade + rise reveal used across all sections. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
};

/** Container that staggers its children's reveals. */
export const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

/** Page transition — cinematic cross-fade with subtle depth (300–600ms). */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 16, filter: "blur(6px)" },
  enter: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE_OUT_EXPO },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: "blur(6px)",
    transition: { duration: 0.3, ease: EASE_IN_OUT_SOFT },
  },
};
