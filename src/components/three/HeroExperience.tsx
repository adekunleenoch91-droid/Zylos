"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useQualityTier } from "@/hooks/useQualityTier";
import { EASE_OUT_EXPO } from "@/lib/motion";

const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), {
  ssr: false,
  loading: () => <HeroBackdrop />,
});

/** Static gradient backdrop — shown while the scene loads and as the
 *  graceful fallback when WebGL is unavailable. */
function HeroBackdrop({ withArt = false }: { withArt?: boolean }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(180deg,#060D22_0%,#0A142F_45%,#1A2238_80%,#2B3A63_100%)]"
    >
      {withArt && (
        <Image
          src="/images/properties/property-1-exterior.svg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/30 to-transparent" />
    </div>
  );
}

const headlineSequence = (delay: number, reduced: boolean) => ({
  initial: { opacity: 0, y: reduced ? 0 : 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.1, delay: reduced ? 0 : delay, ease: EASE_OUT_EXPO },
});

/**
 * Homepage hero: a 220vh scroll-driven cinematic sequence. The villa scene
 * stays pinned while scrolling drives the camera; the headline overlay
 * plays a staged entrance and gently recedes as the journey begins.
 */
export function HeroExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const tier = useQualityTier();
  const reduced = useReducedMotion() ?? false;
  const inView = useInView(sectionRef, { margin: "200px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const overlayY = useTransform(scrollYProgress, [0, 0.35], [0, -70]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  const webgl = tier !== null && tier !== "fallback";

  return (
    <section
      ref={sectionRef}
      aria-label="Zylos — where architecture becomes legacy"
      className="relative h-[220vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* 3D scene / fallback */}
        <div
          className="absolute inset-0"
          role="img"
          aria-label="A modern luxury villa at dusk, its warm windows reflected in an infinity pool"
        >
          {webgl ? (
            <HeroCanvas
              progress={scrollYProgress}
              tier={tier}
              reducedMotion={reduced}
              active={inView}
            />
          ) : (
            <HeroBackdrop withArt={tier === "fallback"} />
          )}
        </div>

        {/* Bottom fade into the next section for seamless continuity */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-midnight to-transparent"
        />

        {/* Headline overlay */}
        <motion.div
          style={reduced ? undefined : { opacity: overlayOpacity, y: overlayY }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        >
          <motion.p
            {...headlineSequence(0.4, reduced)}
            className="text-overline font-medium uppercase text-champagne"
          >
            Zylos · International Luxury Real Estate
          </motion.p>
          <motion.h1
            {...headlineSequence(0.65, reduced)}
            className="mt-6 max-w-5xl font-serif text-display-xl font-medium text-ivory"
          >
            Where architecture
            <br />
            <span className="text-gradient-gold italic">becomes legacy</span>
          </motion.h1>
          <motion.p
            {...headlineSequence(0.95, reduced)}
            className="mt-8 max-w-xl text-body-lg text-silver"
          >
            A curated portfolio of the world&apos;s most exceptional residences
            — discovered quietly, acquired wisely, kept for generations.
          </motion.p>
          <motion.div
            {...headlineSequence(1.2, reduced)}
            className="mt-12 flex flex-col gap-4 sm:flex-row"
          >
            <Button href="/properties" size="lg">
              Explore the Collection
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Private Consultation
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          style={reduced ? undefined : { opacity: cueOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-mist"
          aria-hidden
        >
          <span className="text-caption uppercase tracking-widest">Scroll</span>
          <ChevronDown className="size-4 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
