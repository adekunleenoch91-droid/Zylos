"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useInView, useReducedMotion } from "framer-motion";
import { Move3d, RotateCw } from "lucide-react";
import { useRef, useState } from "react";
import { useQualityTier } from "@/hooks/useQualityTier";
import { typeLabels } from "@/lib/utils";
import type { PropertyImage, PropertyType } from "@/types";

const PropertyViewerCanvas = dynamic(
  () => import("@/components/three/PropertyViewerCanvas"),
  { ssr: false },
);

interface PropertyViewerProps {
  type: PropertyType;
  title: string;
  fallbackImage: PropertyImage;
}

/**
 * Interactive 3D exploration of the residence's architectural massing.
 * Purely supplementary to the gallery: when WebGL is unavailable, on very
 * constrained devices, or under reduced-motion preferences, it degrades to
 * the hero photograph so no information is ever lost.
 */
export function PropertyViewer({
  type,
  title,
  fallbackImage,
}: PropertyViewerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useQualityTier();
  const reduced = useReducedMotion() ?? false;
  const inView = useInView(ref, { margin: "120px" });
  const [interacted, setInteracted] = useState(false);

  const webgl = tier !== null && tier !== "fallback" && tier !== "low";
  const autoRotate = webgl && !reduced && inView && !interacted;

  return (
    <div
      ref={ref}
      className="relative aspect-16/10 overflow-hidden rounded-lg border border-ivory/10 bg-[radial-gradient(120%_100%_at_50%_0%,#1A2238_0%,#0A142F_60%,#060D22_100%)] shadow-floating sm:aspect-21/9"
      onPointerDown={() => setInteracted(true)}
    >
      {webgl ? (
        <>
          <div
            className="absolute inset-0"
            role="img"
            aria-label={`Interactive three-dimensional model of ${title}, a ${typeLabels[type].toLowerCase()} — drag to explore from any angle`}
          >
            <PropertyViewerCanvas
              type={type}
              autoRotate={autoRotate}
              active={inView}
              highQuality={tier === "high"}
            />
          </div>
          {/* Interaction hint */}
          <div
            className="glass pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 text-caption uppercase tracking-wider text-silver transition-opacity duration-(--duration-slow)"
            style={{ opacity: interacted ? 0 : 1 }}
            aria-hidden
          >
            {reduced ? (
              <>
                <Move3d className="size-3.5 text-gold" />
                Drag to explore
              </>
            ) : (
              <>
                <RotateCw className="size-3.5 text-gold" />
                Drag to explore in 3D
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <Image
            src={fallbackImage.src}
            alt={fallbackImage.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-midnight/60 to-transparent"
          />
        </>
      )}
    </div>
  );
}
