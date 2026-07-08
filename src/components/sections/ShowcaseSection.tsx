"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn, formatPrice } from "@/lib/utils";
import type { Property } from "@/types";

/**
 * Interactive property showcase: a cinematic split view where hovering or
 * focusing a residence in the index cross-fades the large stage image.
 */
export function ShowcaseSection({ properties }: { properties: Property[] }) {
  const list = properties.slice(0, 4);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = useReducedMotion();
  const active = list[activeIndex];

  if (list.length === 0) return null;

  return (
    <section className="section-padding" aria-labelledby="showcase-title">
      <div className="container-content">
        <SectionHeading
          overline="Signature Showcase"
          title={<span id="showcase-title">Four residences, four worlds</span>}
        />
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-stretch">
          {/* Index */}
          <ul className="flex flex-col justify-center divide-y divide-ivory/10">
            {list.map((property, i) => {
              const isActive = i === activeIndex;
              return (
                <li key={property.id}>
                  <Reveal delay={i * 0.06}>
                    <Link
                      href={`/properties/${property.slug}`}
                      onMouseEnter={() => setActiveIndex(i)}
                      onFocus={() => setActiveIndex(i)}
                      className="group flex items-center justify-between gap-6 py-7"
                    >
                      <div>
                        <p className="text-caption uppercase tracking-widest text-mist">
                          {String(i + 1).padStart(2, "0")} ·{" "}
                          {property.location.city}
                        </p>
                        <h3
                          className={cn(
                            "mt-2 font-serif text-h2 font-medium transition-colors duration-(--duration-base)",
                            isActive
                              ? "text-champagne"
                              : "text-ivory group-hover:text-champagne",
                          )}
                        >
                          {property.title}
                        </h3>
                      </div>
                      <span
                        className={cn(
                          "flex size-12 shrink-0 items-center justify-center rounded-full border transition-all duration-(--duration-base)",
                          isActive
                            ? "border-gold bg-gold/15 shadow-gold-glow"
                            : "border-ivory/15 group-hover:border-gold/50",
                        )}
                      >
                        <ArrowUpRight
                          aria-hidden
                          className={cn(
                            "size-5 transition-all duration-(--duration-base)",
                            isActive ? "text-champagne" : "text-mist",
                          )}
                        />
                      </span>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>

          {/* Stage */}
          <Reveal delay={0.15} className="relative min-h-105">
            <div className="absolute inset-0 overflow-hidden rounded-lg border border-ivory/10 shadow-floating">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, scale: reduced ? 1 : 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
                  className="absolute inset-0"
                >
                  <Image
                    src={active.images[0].src}
                    alt={active.images[0].alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-midnight/85 via-transparent to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-8">
                <div>
                  <p className="flex items-center gap-1.5 text-body-sm text-silver">
                    <MapPin aria-hidden className="size-3.5 text-gold" />
                    {active.location.neighborhood}, {active.location.country}
                  </p>
                  <p className="mt-1 font-serif text-h3 font-semibold text-ivory">
                    {formatPrice(active.price, active.currency)}
                  </p>
                </div>
                <p className="text-body-sm text-mist">
                  {active.bedrooms} bd · {active.area.toLocaleString()} m²
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
