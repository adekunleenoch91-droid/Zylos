import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Award,
  Globe2,
  GraduationCap,
  Mail,
  Phone,
  TrendingUp,
} from "lucide-react";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { AgentContactForm } from "@/components/forms/AgentContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Rating } from "@/components/ui/Rating";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { agentJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import {
  getAgentBySlug,
  getAgentListings,
  getAllAgentSlugs,
  getTestimonials,
} from "@/services/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllAgentSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getAgentBySlug(slug);
  if (!agent) return { title: "Advisor Not Found" };
  return {
    title: `${agent.name} — ${agent.role}`,
    description: agent.bio,
    alternates: { canonical: `/agents/${agent.slug}` },
    openGraph: {
      title: `${agent.name} — ${agent.role}`,
      description: agent.bio,
      images: [{ url: agent.portrait.src }],
    },
  };
}

export default async function AgentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const agent = await getAgentBySlug(slug);
  if (!agent) notFound();

  const [listings, testimonials] = await Promise.all([
    getAgentListings(agent.id),
    getTestimonials(),
  ]);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Agents", href: "/agents" },
    { label: agent.name },
  ];

  const credentials = [
    {
      Icon: TrendingUp,
      label: "Career volume",
      value: agent.salesVolume,
    },
    {
      Icon: Globe2,
      label: "Languages",
      value: agent.languages.join(" · "),
    },
    {
      Icon: GraduationCap,
      label: "Certifications",
      value: agent.certifications.join(" · "),
    },
    {
      Icon: Award,
      label: "Recognition",
      value: agent.awards.join(" · "),
    },
  ];

  return (
    <article>
      <JsonLd data={[agentJsonLd(agent), breadcrumbJsonLd(crumbs)]} />

      <div className="container-content pt-32 lg:pt-40">
        <Reveal>
          <Breadcrumbs items={crumbs} />
        </Reveal>

        <div className="mt-10 grid gap-12 lg:grid-cols-3">
          {/* Portrait + contact */}
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-lg border border-ivory/10 shadow-floating">
              <div className="relative aspect-4/5">
                <Image
                  src={agent.portrait.src}
                  alt={agent.portrait.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-3 bg-graphite/60 p-6 text-body-sm">
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
                <div className="flex items-center justify-between border-t border-ivory/10 pt-3">
                  <Rating value={agent.rating} />
                  <ul className="flex gap-2" aria-label="Social profiles">
                    {agent.socials.map((s) => (
                      <li key={s.platform}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex size-8 items-center justify-center rounded-full border border-ivory/15 text-caption uppercase text-silver transition-colors hover:border-gold/50 hover:text-champagne"
                        >
                          {s.platform.slice(0, 2)}
                          <span className="sr-only">{s.platform}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Story */}
          <div className="lg:col-span-2">
            <Reveal>
              <p className="text-overline font-medium uppercase text-gold">
                {agent.role}
              </p>
              <h1 className="mt-3 font-serif text-display-lg font-medium text-ivory">
                {agent.name}
              </h1>
              <p className="mt-5 text-h4 font-normal italic text-champagne">
                {agent.bio}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-wrap gap-2">
                {agent.specialization.map((s) => (
                  <span
                    key={s}
                    className="rounded-sm border border-gold/25 bg-gold/8 px-3 py-1.5 text-caption uppercase tracking-wider text-champagne"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 space-y-5">
                {agent.story.map((paragraph, i) => (
                  <p key={i} className="text-body-lg leading-relaxed text-silver">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <dl className="mt-12 grid gap-px overflow-hidden rounded-lg border border-ivory/10 bg-ivory/10 sm:grid-cols-2">
                {credentials.map(({ Icon, label, value }) => (
                  <div key={label} className="bg-charcoal p-6">
                    <dt className="flex items-center gap-2 text-caption uppercase tracking-wider text-mist">
                      <Icon aria-hidden className="size-4 text-gold" />
                      {label}
                    </dt>
                    <dd className="mt-2 text-body font-medium leading-relaxed text-ivory">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-12 rounded-lg border border-gold/20 bg-graphite/40 p-8">
                <h2 className="font-serif text-h3 font-medium text-ivory">
                  Write to {agent.name.split(" ")[0]}
                </h2>
                <div className="mt-6">
                  <AgentContactForm agentName={agent.name} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Listings */}
      {listings.length > 0 && (
        <section
          className="section-padding mt-8 bg-charcoal/50"
          aria-labelledby="agent-listings"
        >
          <div className="container-content">
            <SectionHeading
              overline="Current Mandates"
              title={
                <span id="agent-listings">
                  Residences represented by {agent.name.split(" ")[0]}
                </span>
              }
            />
            <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {listings.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <PropertyCard property={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <TestimonialsSection testimonials={testimonials.slice(0, 3)} />
    </article>
  );
}
