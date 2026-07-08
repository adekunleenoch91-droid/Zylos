import type { Metadata } from "next";
import { PropertyExplorer } from "@/components/property/PropertyExplorer";
import { LocationMap } from "@/components/property/LocationMap";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/three/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getProperties } from "@/services/content";

export const metadata: Metadata = {
  title: "Properties — The Zylos Collection",
  description:
    "Explore the open Zylos collection: architectural villas, trophy penthouses, private estates and alpine chalets in the world's most coveted destinations.",
  alternates: { canonical: "/properties" },
  openGraph: {
    title: "Properties — The Zylos Collection",
    description:
      "Architectural villas, trophy penthouses, private estates and alpine chalets, curated by Zylos.",
  },
};

const crumbs = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
];

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const properties = await getProperties();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        overline="The Collection"
        title={
          <>
            Residences of{" "}
            <span className="italic text-gradient-gold">consequence</span>
          </>
        }
        description="Every residence below has been walked, vetted and documented by a Zylos partner. The wider portfolio is shared privately."
        variant="gallery"
        breadcrumbs={crumbs}
      />

      <section className="pb-24">
        <div className="container-content">
          <PropertyExplorer properties={properties} initialQuery={query} />
        </div>
      </section>

      <section
        className="section-padding bg-charcoal/50"
        aria-labelledby="map-title"
      >
        <div className="container-content grid items-center gap-12 lg:grid-cols-2">
          <SectionHeading
            overline="Global Reach"
            title={<span id="map-title">Where the collection lives</span>}
            description="From the Riviera to the high Alps, Tribeca to Tokyo — our advisors work in twenty-seven countries, with deep roots in each. Precise addresses are shared privately once a conversation begins."
          />
          <Reveal delay={0.15}>
            <LocationMap
              label="The Zylos Collection"
              sublabel="27 countries · 4 regional practices"
              markerX={58}
              markerY={38}
            />
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
