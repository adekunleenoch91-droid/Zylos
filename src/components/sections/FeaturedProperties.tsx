import { ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Property } from "@/types";

/** Featured listings grid with staggered reveals. */
export function FeaturedProperties({ properties }: { properties: Property[] }) {
  return (
    <section
      className="section-padding bg-charcoal/50"
      aria-labelledby="featured-title"
    >
      <div className="container-content">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            overline="Featured Residences"
            title={<span id="featured-title">The current collection</span>}
            description="A small selection from our open portfolio. The majority of Zylos placements are shared privately with registered clients."
          />
          <Reveal delay={0.2}>
            <Button href="/properties" variant="secondary">
              View All Properties
              <ArrowRight aria-hidden className="size-4" />
            </Button>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {properties.slice(0, 4).map((property, i) => (
            <Reveal key={property.id} delay={i * 0.08} as="div">
              <PropertyCard property={property} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
