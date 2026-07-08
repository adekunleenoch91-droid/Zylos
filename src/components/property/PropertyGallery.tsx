"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { PropertyImage } from "@/types";

/**
 * Property gallery: masonry-style grid, full-screen lightbox with keyboard
 * navigation, thumbnails and touch swipe.
 */
export function PropertyGallery({
  images,
  title,
}: {
  images: PropertyImage[];
  title: string;
}) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();
  const touchStartX = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox((i) =>
        i === null ? null : (i + dir + images.length) % images.length,
      ),
    [images.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [lightbox, close, step]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3 sm:grid-rows-2">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setLightbox(i)}
            aria-label={`Open image ${i + 1} of ${images.length}: ${img.alt}`}
            className={cn(
              "group relative overflow-hidden rounded-lg border border-ivory/10 focus-visible:outline-2 focus-visible:outline-gold",
              i === 0 && "sm:col-span-2 sm:row-span-2 aspect-4/3",
              (i === 1 || i === 2) && "aspect-4/3",
              // Any image after the first three becomes a panorama strip.
              i > 2 && "aspect-4/3 sm:col-span-3 sm:aspect-21/9",
            )}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              sizes={
                i === 0
                  ? "(max-width: 640px) 100vw, 66vw"
                  : "(max-width: 640px) 100vw, 33vw"
              }
              className="object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-105"
            />
            <span
              aria-hidden
              className="absolute inset-0 flex items-center justify-center bg-midnight/0 opacity-0 transition-all duration-(--duration-base) group-hover:bg-midnight/30 group-hover:opacity-100"
            >
              <Expand className="size-6 text-ivory drop-shadow-md" />
            </span>
          </button>
        ))}
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {lightbox !== null && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={`${title} — image gallery`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-100 flex flex-col bg-midnight/95 backdrop-blur-xl"
                onTouchStart={(e) => {
                  touchStartX.current = e.touches[0].clientX;
                }}
                onTouchEnd={(e) => {
                  if (touchStartX.current === null) return;
                  const dx = e.changedTouches[0].clientX - touchStartX.current;
                  if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1);
                  touchStartX.current = null;
                }}
              >
                <div className="flex items-center justify-between p-5">
                  <p className="text-body-sm text-mist">
                    {lightbox + 1} / {images.length}
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close gallery"
                    className="rounded-full border border-ivory/15 p-2.5 text-silver transition-colors hover:border-gold/50 hover:text-champagne"
                  >
                    <X aria-hidden className="size-5" />
                  </button>
                </div>

                <div className="relative flex-1 px-4 sm:px-16">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={lightbox}
                      initial={{ opacity: 0, scale: reduced ? 1 : 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                      className="relative h-full w-full"
                    >
                      <Image
                        src={images[lightbox].src}
                        alt={images[lightbox].alt}
                        fill
                        sizes="100vw"
                        className="object-contain"
                      />
                    </motion.div>
                  </AnimatePresence>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-ivory/15 bg-midnight/60 p-3 text-silver backdrop-blur-md transition-colors hover:border-gold/50 hover:text-champagne"
                  >
                    <ChevronLeft aria-hidden className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-ivory/15 bg-midnight/60 p-3 text-silver backdrop-blur-md transition-colors hover:border-gold/50 hover:text-champagne"
                  >
                    <ChevronRight aria-hidden className="size-5" />
                  </button>
                </div>

                <div className="flex justify-center gap-3 p-5">
                  {images.map((img, i) => (
                    <button
                      key={img.src}
                      type="button"
                      onClick={() => setLightbox(i)}
                      aria-label={`Go to image ${i + 1}`}
                      aria-current={i === lightbox || undefined}
                      className={cn(
                        "relative h-14 w-20 overflow-hidden rounded-md border transition-all duration-(--duration-base)",
                        i === lightbox
                          ? "border-gold shadow-gold-glow"
                          : "border-ivory/15 opacity-60 hover:opacity-100",
                      )}
                    >
                      <Image
                        src={img.src}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
