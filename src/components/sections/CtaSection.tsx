import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

/** Closing conversion band — the invitation to begin a conversation. */
export function CtaSection() {
  return (
    <section aria-labelledby="cta-title" className="section-padding">
      <div className="container-content">
        <Reveal>
          <div className="relative overflow-hidden rounded-xl border border-gold/20 bg-[radial-gradient(120%_140%_at_50%_0%,#1A2238_0%,#0A142F_60%,#060D22_100%)] px-8 py-20 text-center shadow-floating sm:px-16">
            {/* Golden horizon accent */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-gold/60 to-transparent"
            />
            <p className="text-overline font-medium uppercase text-champagne">
              Begin the Conversation
            </p>
            <h2
              id="cta-title"
              className="mx-auto mt-5 max-w-3xl font-serif text-h1 font-medium text-ivory"
            >
              The residence you are looking for
              <br />
              <span className="italic text-gradient-gold">
                is rarely listed
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-body-lg text-mist">
              Tell us how you intend to live. A Zylos partner will respond
              personally within one business day.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button href="/contact" size="lg">
                Request a Consultation
              </Button>
              <Button href="/properties" variant="outline" size="lg">
                Browse the Collection
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
