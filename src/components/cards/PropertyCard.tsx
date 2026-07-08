"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Bath, BedDouble, Heart, MapPin, Ruler } from "lucide-react";
import { useState, type PointerEvent } from "react";
import { Badge } from "@/components/ui/Badge";
import { cn, formatPrice, statusLabels, typeLabels } from "@/lib/utils";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

/**
 * Signature listing card: 3D pointer tilt, image zoom, gradient overlay,
 * favorite toggle. Tilt is disabled for touch input and reduced motion.
 */
export function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const reduced = useReducedMotion();
  const [saved, setSaved] = useState(false);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [4, -4]), {
    stiffness: 220,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-4, 4]), {
    stiffness: 220,
    damping: 24,
  });

  function handlePointerMove(e: PointerEvent<HTMLElement>) {
    if (reduced || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handlePointerLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  const cover = property.images[0];

  return (
    <motion.article
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}
      className="group relative overflow-hidden rounded-lg border border-ivory/10 bg-graphite/50 shadow-md transition-shadow duration-(--duration-slow) hover:shadow-floating hover:border-gold/25"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-105"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-midnight/85 via-midnight/10 to-transparent"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          <Badge tone={property.status}>{statusLabels[property.status]}</Badge>
          <Badge tone="neutral">{typeLabels[property.type]}</Badge>
        </div>
        <button
          type="button"
          onClick={() => setSaved((s) => !s)}
          aria-pressed={saved}
          aria-label={saved ? "Remove from saved properties" : "Save property"}
          className="absolute right-4 top-4 z-10 rounded-full border border-ivory/15 bg-midnight/50 p-2.5 backdrop-blur-md transition-all duration-(--duration-base) hover:border-gold/50 hover:shadow-gold-glow"
        >
          <Heart
            aria-hidden
            className={cn(
              "size-4 transition-colors",
              saved ? "fill-gold text-gold" : "text-ivory",
            )}
          />
        </button>
        <p className="absolute bottom-4 left-4 font-serif text-h3 font-semibold text-ivory drop-shadow-md">
          {formatPrice(property.price, property.currency)}
          {property.status === "for-rent" && (
            <span className="ml-1 text-body-sm font-normal text-silver">
              / season
            </span>
          )}
        </p>
      </div>

      <div className="p-6">
        <h3 className="text-h4 font-semibold text-ivory transition-colors duration-(--duration-base) group-hover:text-champagne">
          <Link href={`/properties/${property.slug}`} className="focus-visible:outline-none">
            {/* Stretched link makes the whole card clickable */}
            <span className="absolute inset-0" aria-hidden />
            {property.title}
          </Link>
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-body-sm text-mist">
          <MapPin aria-hidden className="size-3.5 text-gold" />
          {property.location.neighborhood}, {property.location.city},{" "}
          {property.location.country}
        </p>
        <dl className="mt-5 flex items-center gap-5 border-t border-ivory/10 pt-4 text-body-sm text-silver">
          <div className="flex items-center gap-2">
            <BedDouble aria-hidden className="size-4 text-gold/80" />
            <dt className="sr-only">Bedrooms</dt>
            <dd>{property.bedrooms}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Bath aria-hidden className="size-4 text-gold/80" />
            <dt className="sr-only">Bathrooms</dt>
            <dd>{property.bathrooms}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Ruler aria-hidden className="size-4 text-gold/80" />
            <dt className="sr-only">Area</dt>
            <dd>{property.area.toLocaleString()} m²</dd>
          </div>
        </dl>
      </div>
    </motion.article>
  );
}
