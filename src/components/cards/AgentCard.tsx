import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2 } from "lucide-react";
import { Rating } from "@/components/ui/Rating";
import type { Agent } from "@/types";

interface AgentCardProps {
  agent: Agent;
  listingsCount: number;
}

/** Premium advisor card with portrait, credentials and profile link. */
export function AgentCard({ agent, listingsCount }: AgentCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-ivory/10 bg-graphite/50 shadow-md transition-all duration-(--duration-slow) hover:-translate-y-1.5 hover:border-gold/25 hover:shadow-floating">
      <div className="relative aspect-4/5 overflow-hidden">
        <Image
          src={agent.portrait.src}
          alt={agent.portrait.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-104"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-transparent to-transparent"
        />
        <div className="absolute inset-x-5 bottom-5">
          <p className="text-overline uppercase text-champagne">{agent.role}</p>
          <h3 className="mt-1 font-serif text-h3 font-medium text-ivory">
            <Link href={`/agents/${agent.slug}`}>
              <span className="absolute inset-0" aria-hidden />
              {agent.name}
            </Link>
          </h3>
        </div>
        <ArrowUpRight
          aria-hidden
          className="absolute right-5 top-5 size-5 text-ivory/0 transition-all duration-(--duration-base) group-hover:text-champagne group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-2 text-body-sm text-mist">
          <Building2 aria-hidden className="size-4 text-gold/80" />
          {listingsCount} {listingsCount === 1 ? "listing" : "listings"}
          <span aria-hidden className="text-mist/40">
            ·
          </span>
          {agent.experienceYears} yrs
        </div>
        <Rating value={agent.rating} />
      </div>
    </article>
  );
}
