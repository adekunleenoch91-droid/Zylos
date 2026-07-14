import Image from "next/image";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

/** Full-bleed lifestyle statement with parallax imagery. */
export function LifestyleSection() {
  return (
    <section
      className="relative overflow-hidden"
      aria-labelledby="lifestyle-title"
    >
      <Parallax offset={80} className="absolute inset-0">
        <div className="relative h-[130%] w-full -translate-y-[12%]">
          <Image
            src="/images/brand/lifestyle.jpg"
            alt=""
            role="presentation"
            fill
            sizes="100vw"
            className="object-cover opacity-50"
          />
        </div>
      </Parallax>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/70 to-midnight"
      />
      <div className="container-content relative z-10 py-40 text-center lg:py-52">
        <Reveal>
          <p className="text-overline font-medium uppercase text-champagne">
            The Zylos Life
          </p>
          <h2
            id="lifestyle-title"
            className="mx-auto mt-6 max-w-4xl font-serif text-display-lg font-medium text-ivory"
          >
            A home is the one work of art
            <br />
            <span className="italic text-gradient-gold">you live inside</span>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-body-lg text-silver">
            Beyond the transaction lies the life a residence makes possible —
            slow mornings above the water, long tables under the trees,
            rooms that hold three generations at once.
          </p>
          <div className="mt-12">
            <Button href="/about" size="lg" variant="secondary">
              Discover Our Philosophy
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
