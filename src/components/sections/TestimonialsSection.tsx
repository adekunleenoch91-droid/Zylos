"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Rating } from "@/components/ui/Rating";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types";

const AUTOPLAY_MS = 7000;

/**
 * Testimonial carousel: cross-fading quotes with autoplay that pauses on
 * hover/focus, stops off-screen, and is disabled under reduced motion.
 */
export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const regionRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (dir: 1 | -1) =>
      setIndex((i) => (i + dir + testimonials.length) % testimonials.length),
    [testimonials.length],
  );

  useEffect(() => {
    if (paused || reduced) return;
    const el = regionRef.current;
    let timer: ReturnType<typeof setInterval> | null = null;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        timer = setInterval(() => go(1), AUTOPLAY_MS);
      } else if (timer) {
        clearInterval(timer);
        timer = null;
      }
    });
    if (el) observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [go, paused, reduced]);

  const t = testimonials[index];

  return (
    <section className="section-padding" aria-label="Client testimonials">
      <div className="container-content">
        <SectionHeading
          overline="Testimonials"
          title="In our clients' words"
          align="center"
        />
        <div
          ref={regionRef}
          className="relative mx-auto mt-14 max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <Quote
            aria-hidden
            className="absolute -top-6 left-1/2 size-12 -translate-x-1/2 text-gold/20"
          />
          <div aria-live="polite" className="min-h-64 text-center">
            <AnimatePresence mode="wait">
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: reduced ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -12 }}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              >
                <blockquote className="pt-8 font-serif text-h3 font-medium italic leading-relaxed text-ivory">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-8 flex flex-col items-center gap-3">
                  <span className="relative size-14 overflow-hidden rounded-full border border-gold/40">
                    <Image
                      src={t.avatar.src}
                      alt={t.avatar.alt}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </span>
                  <span>
                    <span className="block text-body font-semibold text-champagne">
                      {t.name}
                    </span>
                    <span className="block text-body-sm text-mist">
                      {t.position}
                    </span>
                  </span>
                  <Rating value={t.rating} />
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="rounded-full border border-ivory/15 p-3 text-silver transition-all duration-(--duration-base) hover:border-gold/50 hover:text-champagne hover:shadow-gold-glow"
            >
              <ChevronLeft aria-hidden className="size-4" />
            </button>
            <div className="flex gap-2" role="tablist" aria-label="Testimonials">
              {testimonials.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Testimonial ${i + 1} of ${testimonials.length}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-(--duration-base)",
                    i === index
                      ? "w-8 bg-gold"
                      : "w-3 bg-ivory/20 hover:bg-ivory/40",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="rounded-full border border-ivory/15 p-3 text-silver transition-all duration-(--duration-base) hover:border-gold/50 hover:text-champagne hover:shadow-gold-glow"
            >
              <ChevronRight aria-hidden className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
