import { Eye, Gem, HandHeart, Hourglass } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const pillars = [
  {
    Icon: Eye,
    title: "Discretion first",
    description:
      "Over sixty percent of our placements never reach the open market. Your search — and your sale — stays private.",
  },
  {
    Icon: Gem,
    title: "Gallery standards",
    description:
      "Every residence we represent is documented, presented and negotiated with the rigour of a museum acquisition.",
  },
  {
    Icon: HandHeart,
    title: "Advisory, not brokerage",
    description:
      "We decline more mandates than we accept. When we take yours, you work directly with a partner — never a pipeline.",
  },
  {
    Icon: Hourglass,
    title: "Generational patience",
    description:
      "We measure relationships in decades. Most of our clients return, and many of their children do too.",
  },
];

/** The four pillars that differentiate the house. */
export function WhyZylos() {
  return (
    <section className="section-padding" aria-labelledby="why-title">
      <div className="container-content">
        <SectionHeading
          overline="Why Zylos"
          title={<span id="why-title">Built on quieter principles</span>}
          align="center"
        />
        <ul className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {pillars.map(({ Icon, title, description }, i) => (
            <Reveal key={title} as="li" delay={i * 0.08}>
              <div className="group h-full rounded-lg border border-ivory/10 bg-graphite/40 p-8 transition-all duration-(--duration-slow) hover:-translate-y-1.5 hover:border-gold/30 hover:shadow-floating">
                <span className="flex size-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 transition-shadow duration-(--duration-base) group-hover:shadow-gold-glow">
                  <Icon aria-hidden className="size-5 text-gold" />
                </span>
                <h3 className="mt-6 text-h4 font-semibold text-ivory">
                  {title}
                </h3>
                <p className="mt-3 text-body-sm leading-relaxed text-mist">
                  {description}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
