"use client";

import {
  animate,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef } from "react";

interface CountUpProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

/** Animates a number counting upward when it scrolls into view. */
export function CountUp({
  value,
  suffix = "",
  duration = 1.8,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduced) {
      el.textContent = `${value.toLocaleString()}${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        el.textContent = `${Math.round(latest).toLocaleString()}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, duration, reduced]);

  return (
    <span ref={ref} className={className} aria-label={`${value}${suffix}`}>
      0{suffix}
    </span>
  );
}
