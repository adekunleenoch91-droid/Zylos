"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

interface AgentPortraitProps {
  src: string;
  alt: string;
}

/**
 * Advisor portrait with a befitting entrance: the image unveils top-to-bottom
 * as it scrolls into view, settling from a gentle scale, followed by a single
 * gold sheen sweep. On hover it eases into a slow zoom. All motion is disabled
 * under reduced-motion.
 */
export function AgentPortrait({ src, alt }: AgentPortraitProps) {
  const reduced = useReducedMotion();

  return (
    <>
      <motion.div
        className="absolute inset-0"
        initial={reduced ? false : { opacity: 0, scale: 1.08 }}
        whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-105"
        />
      </motion.div>
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -inset-x-1/4 bg-gradient-to-tr from-transparent via-gold/25 to-transparent"
          initial={{ x: "-120%", opacity: 0 }}
          whileInView={{ x: "120%", opacity: [0, 0.8, 0] }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.25 }}
        />
      )}
    </>
  );
}
