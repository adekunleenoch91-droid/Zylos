import type { Metadata } from "next";
import { AgentCard } from "@/components/cards/AgentCard";
import { Reveal } from "@/components/motion/Reveal";
import { CtaSection } from "@/components/sections/CtaSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/three/PageHero";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getAgentListings, getAgents } from "@/services/content";

export const metadata: Metadata = {
  title: "Advisors — The People Behind Zylos",
  description:
    "Meet the Zylos advisory partners: a deliberately small team of luxury real estate specialists across Europe, the Americas and Asia-Pacific.",
  alternates: { canonical: "/agents" },
};

const crumbs = [
  { label: "Home", href: "/" },
  { label: "Agents", href: "/agents" },
];

export default async function AgentsPage() {
  const agents = await getAgents();
  const counts = await Promise.all(
    agents.map(async (a) => (await getAgentListings(a.id)).length),
  );

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        overline="The Advisors"
        title={
          <>
            A small team,{" "}
            <span className="italic text-gradient-gold">deliberately</span>
          </>
        }
        description="Five partners across three continents. Each accepts a limited number of mandates a year, so every client works with a name — never a department."
        variant="columns"
        breadcrumbs={crumbs}
      />

      <section className="pb-24" aria-label="Advisory team">
        <div className="container-content">
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {agents.map((agent, i) => (
              <Reveal key={agent.id} delay={i * 0.06}>
                <AgentCard agent={agent} listingsCount={counts[i]} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
