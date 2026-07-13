import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bath,
  BedDouble,
  Building,
  Calendar,
  Check,
  Mail,
  MapPin,
  Phone,
  Ruler,
} from "lucide-react";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { ScheduleViewingForm } from "@/components/forms/ScheduleViewingForm";
import { Reveal } from "@/components/motion/Reveal";
import { FloorPlan } from "@/components/property/FloorPlan";
import { LocationMap } from "@/components/property/LocationMap";
import { MortgageCalculator } from "@/components/property/MortgageCalculator";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyViewer } from "@/components/three/PropertyViewer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbJsonLd, propertyJsonLd } from "@/lib/seo";
import {
  formatPrice,
  statusLabels,
  typeLabels,
} from "@/lib/utils";
import {
  getAgentById,
  getAllPropertySlugs,
  getPropertyBySlug,
  getSimilarProperties,
} from "@/services/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPropertySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property Not Found" };
  const title = `${property.title} — ${property.location.city}`;
  const description = `${property.headline}. ${property.bedrooms} bedrooms · ${property.bathrooms} bathrooms · ${property.area.toLocaleString()} m² in ${property.location.neighborhood}, ${property.location.city}. ${formatPrice(property.price, property.currency, false)}.`;
  return {
    title,
    description,
    alternates: { canonical: `/properties/${property.slug}` },
    openGraph: {
      title,
      description,
      images: [{ url: property.images[0].src }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const [agent, similar] = await Promise.all([
    getAgentById(property.agentId),
    getSimilarProperties(property),
  ]);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: property.title },
  ];

  const keyFacts = [
    { Icon: BedDouble, label: "Bedrooms", value: String(property.bedrooms) },
    { Icon: Bath, label: "Bathrooms", value: String(property.bathrooms) },
    {
      Icon: Ruler,
      label: "Interior",
      value: `${property.area.toLocaleString()} m²`,
    },
    { Icon: Calendar, label: "Completed", value: String(property.yearBuilt) },
    { Icon: Building, label: "Type", value: typeLabels[property.type] },
  ];

  return (
    <article>
      <JsonLd data={[propertyJsonLd(property), breadcrumbJsonLd(crumbs)]} />

      {/* Header */}
      <header className="container-content pt-32 lg:pt-40">
        <Reveal>
          <Breadcrumbs items={crumbs} />
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone={property.status}>
                  {statusLabels[property.status]}
                </Badge>
                <Badge tone="neutral">{typeLabels[property.type]}</Badge>
              </div>
              <h1 className="mt-4 font-serif text-display-lg font-medium text-ivory">
                {property.title}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-body-lg text-mist">
                <MapPin aria-hidden className="size-4 text-gold" />
                {property.location.neighborhood}, {property.location.city},{" "}
                {property.location.country}
              </p>
            </div>
            <p className="font-serif text-display-lg font-semibold text-gradient-gold">
              {formatPrice(property.price, property.currency)}
            </p>
          </div>
        </Reveal>
      </header>

      {/* Gallery */}
      <div className="container-content mt-12">
        <Reveal>
          <PropertyGallery images={property.images} title={property.title} />
        </Reveal>
      </div>

      {/* Key facts strip */}
      <div className="container-content mt-10">
        <Reveal>
          <dl className="glass grid grid-cols-2 gap-6 rounded-lg p-8 sm:grid-cols-3 lg:grid-cols-5">
            {keyFacts.map(({ Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon aria-hidden className="size-5 shrink-0 text-gold" />
                <div>
                  <dt className="text-caption uppercase tracking-wider text-mist">
                    {label}
                  </dt>
                  <dd className="text-body font-semibold text-ivory">
                    {value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      {/* Body */}
      <div className="container-content mt-20 grid gap-16 lg:grid-cols-3">
        <div className="space-y-20 lg:col-span-2">
          {/* Narrative */}
          <Reveal as="section" aria-labelledby="about-residence">
            <h2
              id="about-residence"
              className="font-serif text-h2 font-medium text-ivory"
            >
              The residence
            </h2>
            <p className="mt-4 text-h4 font-normal italic text-champagne">
              {property.headline}
            </p>
            <div className="mt-6 space-y-5">
              {property.description.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-body-lg leading-relaxed text-silver"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          {/* Interactive 3D viewer */}
          <Reveal as="section" aria-labelledby="viewer-title">
            <h2
              id="viewer-title"
              className="font-serif text-h2 font-medium text-ivory"
            >
              In three dimensions
            </h2>
            <p className="mt-4 max-w-2xl text-body leading-relaxed text-mist">
              Explore the residence&apos;s architectural massing from any
              angle. A measured model and full virtual tour are presented
              privately during your viewing.
            </p>
            <div className="mt-8">
              <PropertyViewer
                type={property.type}
                title={property.title}
                fallbackImage={property.images[0]}
              />
            </div>
          </Reveal>

          {/* Specifications */}
          <Reveal as="section" aria-labelledby="specs-title">
            <h2
              id="specs-title"
              className="font-serif text-h2 font-medium text-ivory"
            >
              Specifications
            </h2>
            <dl className="mt-8 grid gap-px overflow-hidden rounded-lg border border-ivory/10 bg-ivory/10 sm:grid-cols-2 lg:grid-cols-3">
              {property.features.map((feature) => (
                <div key={feature.label} className="bg-charcoal p-6">
                  <dt className="text-caption uppercase tracking-wider text-mist">
                    {feature.label}
                  </dt>
                  <dd className="mt-1.5 text-body font-semibold text-ivory">
                    {feature.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Amenities */}
          <Reveal as="section" aria-labelledby="amenities-title">
            <h2
              id="amenities-title"
              className="font-serif text-h2 font-medium text-ivory"
            >
              Amenities
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {property.amenities.map((amenity) => (
                <li
                  key={amenity}
                  className="flex items-center gap-3 text-body text-silver"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                    <Check aria-hidden className="size-3.5 text-gold" />
                  </span>
                  {amenity}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Floor plan */}
          <Reveal as="section" aria-labelledby="plan-title">
            <h2
              id="plan-title"
              className="font-serif text-h2 font-medium text-ivory"
            >
              The plan
            </h2>
            <div className="mt-8">
              <FloorPlan property={property} />
            </div>
          </Reveal>

          {/* Neighborhood + map */}
          <Reveal as="section" aria-labelledby="location-title">
            <h2
              id="location-title"
              className="font-serif text-h2 font-medium text-ivory"
            >
              The neighborhood
            </h2>
            <p className="mt-5 text-body-lg leading-relaxed text-silver">
              {property.location.neighborhood} is among{" "}
              {property.location.city}&apos;s most guarded addresses — the kind
              of place where privacy is a shared understanding rather than a
              rule. Our advisors can speak to schools, marinas, clubs and the
              rhythm of each season on request.
            </p>
            <div className="mt-8">
              <LocationMap
                label={property.location.neighborhood}
                sublabel={`${property.location.city}, ${property.location.country}`}
              />
            </div>
          </Reveal>

          {/* Financing */}
          <Reveal as="section" aria-label="Financing calculator">
            <MortgageCalculator property={property} />
          </Reveal>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
          {agent && (
            <Reveal>
              <div className="rounded-lg border border-ivory/10 bg-graphite/40 p-8">
                <p className="text-overline uppercase text-gold">
                  Your advisor
                </p>
                <div className="mt-5 flex items-center gap-4">
                  <span className="relative size-16 overflow-hidden rounded-full border border-gold/40">
                    <Image
                      src={agent.portrait.src}
                      alt={agent.portrait.alt}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </span>
                  <div>
                    <Link
                      href={`/agents/${agent.slug}`}
                      className="text-h4 font-semibold text-ivory transition-colors hover:text-champagne"
                    >
                      {agent.name}
                    </Link>
                    <p className="text-body-sm text-mist">{agent.role}</p>
                    <Rating value={agent.rating} className="mt-1" />
                  </div>
                </div>
                <div className="mt-6 space-y-3 border-t border-ivory/10 pt-6 text-body-sm">
                  <a
                    href={`tel:${agent.phone.replace(/[^+\d]/g, "")}`}
                    className="flex items-center gap-3 text-silver transition-colors hover:text-champagne"
                  >
                    <Phone aria-hidden className="size-4 text-gold/70" />
                    {agent.phone}
                  </a>
                  <a
                    href={`mailto:${agent.email}`}
                    className="flex items-center gap-3 text-silver transition-colors hover:text-champagne"
                  >
                    <Mail aria-hidden className="size-4 text-gold/70" />
                    {agent.email}
                  </a>
                </div>
                <Button
                  href={`/agents/${agent.slug}`}
                  variant="secondary"
                  className="mt-6 w-full"
                >
                  View Profile
                </Button>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.1}>
            <div
              className="rounded-lg border border-gold/20 bg-graphite/40 p-8"
              id="schedule-viewing"
            >
              <h2 className="font-serif text-h3 font-medium text-ivory">
                Private viewing
              </h2>
              <div className="mt-6">
                <ScheduleViewingForm propertyTitle={property.title} />
              </div>
            </div>
          </Reveal>
        </aside>
      </div>

      {/* Similar properties */}
      {similar.length > 0 && (
        <section
          className="section-padding mt-8 bg-charcoal/50"
          aria-labelledby="similar-title"
        >
          <div className="container-content">
            <SectionHeading
              overline="Continue Exploring"
              title={<span id="similar-title">Residences in conversation</span>}
            />
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {similar.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <PropertyCard property={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
