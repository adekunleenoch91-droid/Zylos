import {
  Compass,
  Globe2,
  KeyRound,
  Landmark,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ServiceOffering } from "@/types";

const icons = {
  key: KeyRound,
  compass: Compass,
  shield: ShieldCheck,
  globe: Globe2,
  sparkles: Sparkles,
  landmark: Landmark,
} as const;

/** Premium services grid. */
export function ServicesSection({ services }: { services: ServiceOffering[] }) {
  return (
    <section
      className="section-padding bg-charcoal/50"
      aria-labelledby="services-title"
    >
      <div className="container-content">
        <SectionHeading
          overline="Services"
          title={<span id="services-title">One house, every discipline</span>}
          description="From first introduction to long-term stewardship, every service is delivered by the same small team that knows your name."
        />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-lg border border-ivory/10 bg-ivory/10 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = icons[service.icon];
            return (
              <Reveal key={service.id} as="li" delay={i * 0.06}>
                <div className="group h-full bg-charcoal p-8 transition-colors duration-(--duration-slow) hover:bg-graphite">
                  <Icon
                    aria-hidden
                    className="size-6 text-gold transition-transform duration-(--duration-base) group-hover:-translate-y-0.5"
                  />
                  <h3 className="mt-5 text-h4 font-semibold text-ivory group-hover:text-champagne">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-body-sm leading-relaxed text-mist">
                    {service.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
