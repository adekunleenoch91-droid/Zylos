import type { Metadata } from "next";
import Image from "next/image";
import { Award, Compass, Eye } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { CtaSection } from "@/components/sections/CtaSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { AgentsPreview } from "@/components/sections/AgentsPreview";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/three/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbJsonLd } from "@/lib/seo";
import {
  getAgents,
  getProperties,
  getStats,
  getTimeline,
  getValues,
} from "@/services/content";

export const metadata: Metadata = {
  title: "About — The House of Zylos",
  description:
    "The story of Zylos: an international luxury real estate house built on discretion, craftsmanship, candour and generational patience.",
  alternates: { canonical: "/about" },
};

const crumbs = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

export default async function AboutPage() {
  const [timeline, values, stats, agents, properties] = await Promise.all([
    getTimeline(),
    getValues(),
    getStats(),
    getAgents(),
    getProperties(),
  ]);

  const listingCounts = Object.fromEntries(
    agents.map((a) => [
      a.id,
      properties.filter((p) => p.agentId === a.id).length,
    ]),
  );

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        overline="The House of Zylos"
        title={
          <>
            Seventeen years of{" "}
            <span className="italic text-gradient-gold">quiet work</span>
          </>
        }
        description="Zylos began with a single restored palazzo and a conviction: exceptional homes deserve the standards of the art world. Everything since has followed from that."
        variant="monolith"
        breadcrumbs={crumbs}
      />

      {/* Mission / vision */}
      <section className="section-padding" aria-labelledby="mission-title">
        <div className="container-content grid items-center gap-16 lg:grid-cols-2">
          <Parallax offset={40}>
            <Reveal>
              <div className="relative overflow-hidden rounded-lg border border-ivory/10 shadow-floating">
                <Image
                  src="/images/brand/about-hero.svg"
                  alt="Abstract architectural composition of golden arcs over a colonnade"
                  width={1600}
                  height={1000}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-auto w-full"
                />
              </div>
            </Reveal>
          </Parallax>
          <div>
            <SectionHeading
              overline="Mission & Vision"
              title={
                <span id="mission-title">
                  Homes treated as works of art
                </span>
              }
            />
            <Reveal delay={0.15}>
              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <Compass aria-hidden className="mt-1 size-5 shrink-0 text-gold" />
                  <div>
                    <h3 className="text-h4 font-semibold text-ivory">
                      Our mission
                    </h3>
                    <p className="mt-2 text-body leading-relaxed text-mist">
                      To place the world&apos;s most exceptional residences
                      with the people who will care for them next — privately,
                      rigorously, and with complete candour.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Eye aria-hidden className="mt-1 size-5 shrink-0 text-gold" />
                  <div>
                    <h3 className="text-h4 font-semibold text-ivory">
                      Our vision
                    </h3>
                    <p className="mt-2 text-body leading-relaxed text-mist">
                      A world where significant architecture passes between
                      generations as thoughtfully as significant art — and
                      where the advisory itself is worthy of the houses it
                      serves.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Award aria-hidden className="mt-1 size-5 shrink-0 text-gold" />
                  <div>
                    <h3 className="text-h4 font-semibold text-ivory">
                      Recognition
                    </h3>
                    <p className="mt-2 text-body leading-relaxed text-mist">
                      European Luxury Advisory of the Year (2024 & 2025),
                      Record Transaction of the Year (2025), and — more
                      meaningfully — a client return rate of ninety-eight
                      percent.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        className="section-padding bg-charcoal/50"
        aria-labelledby="values-title"
      >
        <div className="container-content">
          <SectionHeading
            overline="Core Values"
            title={<span id="values-title">What we refuse to compromise</span>}
            align="center"
          />
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <Reveal key={value.title} as="li" delay={i * 0.08}>
                <div className="h-full rounded-lg border border-ivory/10 bg-graphite/40 p-8 transition-all duration-(--duration-slow) hover:-translate-y-1.5 hover:border-gold/30 hover:shadow-floating">
                  <span
                    aria-hidden
                    className="font-serif text-display-lg font-semibold text-gradient-gold"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-h4 font-semibold text-ivory">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-body-sm leading-relaxed text-mist">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding" aria-labelledby="timeline-title">
        <div className="container-content">
          <SectionHeading
            overline="The Journey"
            title={<span id="timeline-title">From one palazzo to three continents</span>}
            align="center"
          />
          <ol className="relative mx-auto mt-16 max-w-3xl">
            {/* Golden spine */}
            <div
              aria-hidden
              className="absolute inset-y-0 left-5 w-px bg-gradient-to-b from-gold/60 via-gold/25 to-transparent sm:left-1/2"
            />
            {timeline.map((entry, i) => (
              <Reveal key={entry.year} as="li" delay={i * 0.05}>
                <div
                  className={`relative flex gap-8 pb-14 sm:w-1/2 ${
                    i % 2
                      ? "sm:ml-auto sm:pl-12"
                      : "sm:flex-row-reverse sm:pr-12 sm:text-right"
                  } pl-14 sm:pl-0`}
                >
                  <span
                    aria-hidden
                    className={`absolute top-1 flex size-3 items-center justify-center rounded-full border border-gold bg-midnight shadow-gold-glow ${
                      i % 2
                        ? "left-[14px] sm:-left-1.5"
                        : "left-[14px] sm:left-auto sm:-right-1.5"
                    }`}
                  />
                  <div>
                    <p className="font-serif text-h3 font-semibold text-gradient-gold">
                      {entry.year}
                    </p>
                    <h3 className="mt-2 text-h4 font-semibold text-ivory">
                      {entry.title}
                    </h3>
                    <p className="mt-2 text-body-sm leading-relaxed text-mist">
                      {entry.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <StatsSection stats={stats} />
      <AgentsPreview agents={agents} listingCounts={listingCounts} />
      <CtaSection />
    </>
  );
}
