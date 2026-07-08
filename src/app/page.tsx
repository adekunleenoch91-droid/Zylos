import type { Metadata } from "next";
import { AgentsPreview } from "@/components/sections/AgentsPreview";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { BrandIntro } from "@/components/sections/BrandIntro";
import { CtaSection } from "@/components/sections/CtaSection";
import { FeaturedProperties } from "@/components/sections/FeaturedProperties";
import { LifestyleSection } from "@/components/sections/LifestyleSection";
import { NeighborhoodsSection } from "@/components/sections/NeighborhoodsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ShowcaseSection } from "@/components/sections/ShowcaseSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { WhyZylos } from "@/components/sections/WhyZylos";
import { HeroExperience } from "@/components/three/HeroExperience";
import {
  getAgents,
  getFeaturedProperties,
  getNeighborhoods,
  getPosts,
  getProperties,
  getServices,
  getStats,
  getTestimonials,
} from "@/services/content";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Luxury Real Estate & Private Advisory`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [
    featured,
    allProperties,
    agents,
    posts,
    testimonials,
    neighborhoods,
    stats,
    services,
  ] = await Promise.all([
    getFeaturedProperties(),
    getProperties(),
    getAgents(),
    getPosts(),
    getTestimonials(),
    getNeighborhoods(),
    getStats(),
    getServices(),
  ]);

  const listingCounts = Object.fromEntries(
    agents.map((a) => [
      a.id,
      allProperties.filter((p) => p.agentId === a.id).length,
    ]),
  );

  return (
    <>
      <HeroExperience />
      <BrandIntro />
      <FeaturedProperties properties={featured} />
      <WhyZylos />
      <ServicesSection services={services} />
      <ShowcaseSection properties={featured} />
      <NeighborhoodsSection neighborhoods={neighborhoods} />
      <LifestyleSection />
      <AgentsPreview agents={agents} listingCounts={listingCounts} />
      <TestimonialsSection testimonials={testimonials} />
      <StatsSection stats={stats} />
      <BlogPreview posts={posts} />
      <CtaSection />
    </>
  );
}
