import Image from "next/image";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

/** Brand introduction — the first chapter after the hero. */
export function BrandIntro() {
  return (
    <section className="section-padding" aria-labelledby="brand-intro-title">
      <div className="container-content grid items-center gap-16 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="text-overline font-medium uppercase text-gold">
              The House of Zylos
            </p>
            <h2
              id="brand-intro-title"
              className="mt-4 font-serif text-h1 font-medium text-ivory"
            >
              An advisory house,
              <br />
              <span className="italic text-champagne">not a listings page</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 text-body-lg leading-relaxed text-silver">
              For nearly two decades, Zylos has curated the world&apos;s most
              exceptional residences with the standards of the art world —
              privately presented, rigorously vetted, and placed with the
              people who will care for them next.
            </p>
            <p className="mt-5 text-body-lg leading-relaxed text-mist">
              Most of what we do never appears on the open market. What you
              see here is an introduction; the collection itself is a
              conversation.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/about" variant="secondary">
                Our Story
              </Button>
              <Button href="/agents" variant="ghost">
                Meet the Advisors
              </Button>
            </div>
          </Reveal>
        </div>
        <Parallax offset={40} className="relative">
          <Reveal delay={0.2}>
            <div className="relative overflow-hidden rounded-lg border border-ivory/10 shadow-floating">
              <Image
                src="/images/brand/journey.jpg"
                alt="A tranquil residence interior at dusk, warm light across the floor"
                width={1600}
                height={1000}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto w-full"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-midnight/40 to-transparent"
              />
            </div>
            <figure className="glass absolute -bottom-8 left-8 hidden max-w-xs rounded-lg p-6 shadow-floating sm:block">
              <blockquote className="font-serif text-lg italic leading-relaxed text-ivory">
                “An exceptional home is never sold — only entrusted.”
              </blockquote>
              <figcaption className="mt-3 text-caption uppercase tracking-widest text-champagne">
                Lorenzo Marchetti · Founding Partner
              </figcaption>
            </figure>
          </Reveal>
        </Parallax>
      </div>
    </section>
  );
}
