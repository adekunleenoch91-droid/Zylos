"use client";

import dynamic from "next/dynamic";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { useQualityTier } from "@/hooks/useQualityTier";
import { EASE_OUT_EXPO } from "@/lib/motion";
import type { SculptureVariant } from "@/components/three/AmbientSculpture";

const AmbientCanvas = dynamic(
  () => import("@/components/three/AmbientCanvas"),
  { ssr: false },
);

interface PageHeroProps {
  overline: string;
  title: ReactNode;
  description?: string;
  variant: SculptureVariant;
  breadcrumbs?: Crumb[];
  children?: ReactNode;
}

/**
 * Shared sub-page hero: title block over an ambient 3D sculpture backdrop.
 * The sculpture is decorative — all information lives in the HTML — so the
 * canvas degrades silently to the gradient backdrop without WebGL.
 */
export function PageHero({
  overline,
  title,
  description,
  variant,
  breadcrumbs,
  children,
}: PageHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const tier = useQualityTier();
  const reduced = useReducedMotion() ?? false;
  const inView = useInView(ref, { margin: "100px" });
  const webgl = tier !== null && tier !== "fallback" && tier !== "low";

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE_OUT_EXPO },
  });

  return (
    <section
      ref={ref}
      className="relative flex min-h-[68vh] items-end overflow-hidden pb-16 pt-40"
    >
      {/* Backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_10%,#1A2238_0%,#0A142F_55%,#060D22_100%)]"
      >
        {webgl && (
          <div className="absolute inset-y-0 right-0 hidden w-3/5 md:block">
            <AmbientCanvas
              variant={variant}
              reducedMotion={reduced}
              active={inView}
            />
            {/* Blend the scene into the page gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-midnight to-transparent" />
          </div>
        )}
      </div>

      <div className="container-content relative z-10">
        {breadcrumbs && (
          <motion.div {...enter(0.1)} className="mb-8">
            <Breadcrumbs items={breadcrumbs} />
          </motion.div>
        )}
        <motion.p
          {...enter(0.2)}
          className="text-overline font-medium uppercase text-gold"
        >
          {overline}
        </motion.p>
        <motion.h1
          {...enter(0.35)}
          className="mt-5 max-w-3xl font-serif text-display-lg font-medium text-ivory"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            {...enter(0.5)}
            className="mt-6 max-w-2xl text-body-lg text-mist"
          >
            {description}
          </motion.p>
        )}
        {children && (
          <motion.div {...enter(0.6)} className="mt-10">
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
