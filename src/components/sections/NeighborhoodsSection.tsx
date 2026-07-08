import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Neighborhood } from "@/types";

/** Featured destinations mosaic. */
export function NeighborhoodsSection({
  neighborhoods,
}: {
  neighborhoods: Neighborhood[];
}) {
  return (
    <section
      className="section-padding bg-charcoal/50"
      aria-labelledby="neighborhoods-title"
    >
      <div className="container-content">
        <SectionHeading
          overline="Destinations"
          title={
            <span id="neighborhoods-title">Where our clients call home</span>
          }
          description="Four addresses that define our practice — each with its own light, pace and code of privacy."
        />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {neighborhoods.map((n, i) => (
            <Reveal key={n.id} as="li" delay={i * 0.08}>
              <Link
                href={`/properties?query=${encodeURIComponent(n.city)}`}
                className="group relative block overflow-hidden rounded-lg border border-ivory/10 shadow-md transition-all duration-(--duration-slow) hover:-translate-y-1.5 hover:border-gold/25 hover:shadow-floating"
              >
                <div className="relative aspect-3/4">
                  <Image
                    src={n.image.src}
                    alt={n.image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/20 to-transparent"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-caption uppercase tracking-widest text-champagne">
                    {n.city}
                  </p>
                  <h3 className="mt-1 font-serif text-h3 font-medium text-ivory">
                    {n.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-body-sm text-silver opacity-0 transition-opacity duration-(--duration-slow) group-hover:opacity-100">
                    {n.description}
                  </p>
                  <p className="mt-3 text-caption uppercase tracking-wider text-mist">
                    {n.propertyCount} residences
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
