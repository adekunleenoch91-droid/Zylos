import { ArrowRight } from "lucide-react";
import { AgentCard } from "@/components/cards/AgentCard";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Agent } from "@/types";

interface AgentsPreviewProps {
  agents: Agent[];
  listingCounts: Record<string, number>;
}

/** Meet-the-advisors preview strip. */
export function AgentsPreview({ agents, listingCounts }: AgentsPreviewProps) {
  return (
    <section className="section-padding" aria-labelledby="agents-title">
      <div className="container-content">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            overline="The Advisors"
            title={<span id="agents-title">People worth trusting with a legacy</span>}
          />
          <Reveal delay={0.2}>
            <Button href="/agents" variant="secondary">
              All Advisors
              <ArrowRight aria-hidden className="size-4" />
            </Button>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {agents.slice(0, 4).map((agent, i) => (
            <Reveal key={agent.id} delay={i * 0.08}>
              <AgentCard
                agent={agent}
                listingsCount={listingCounts[agent.id] ?? 0}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
