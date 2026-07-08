import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import type { Stat } from "@/types";

/** Animated company statistics band. */
export function StatsSection({ stats }: { stats: Stat[] }) {
  return (
    <section
      className="border-y border-ivory/10 bg-gradient-to-b from-charcoal to-midnight"
      aria-label="Zylos in numbers"
    >
      <div className="container-content">
        <dl className="grid grid-cols-2 divide-ivory/10 py-16 max-lg:gap-10 lg:grid-cols-4 lg:divide-x">
          {stats.map((stat, i) => (
            <Reveal key={stat.id} delay={i * 0.08} className="text-center">
              <dd className="font-serif text-display-lg font-semibold text-gradient-gold">
                {stat.id === "s-01" && (
                  <span aria-hidden className="mr-1 align-top text-h2">
                    $
                  </span>
                )}
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="mt-3 text-body-sm uppercase tracking-widest text-mist">
                {stat.label}
              </dt>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
