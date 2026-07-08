"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useScrolled } from "@/hooks/useScrolled";
import { transitions } from "@/lib/motion";

/** Floating back-to-top control, visible after meaningful scroll. */
export function BackToTop() {
  const visible = useScrolled(600);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={transitions.base}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="glass fixed bottom-6 right-6 z-40 rounded-full p-3.5 text-silver shadow-floating transition-colors duration-(--duration-base) hover:text-champagne hover:shadow-gold-glow"
        >
          <ArrowUp aria-hidden className="size-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
