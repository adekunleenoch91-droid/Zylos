import Link from "next/link";
import { Compass, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* Ambient backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(110%_90%_at_50%_0%,#1A2238_0%,#0A142F_55%,#060D22_100%)]"
      />
      {/* Golden horizon line */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
      />
      <div className="container-content relative z-10 py-32 text-center">
        <p className="font-serif text-[clamp(6rem,20vw,14rem)] font-semibold leading-none text-gradient-gold opacity-90">
          404
        </p>
        <h1 className="mt-6 font-serif text-h1 font-medium text-ivory">
          This address is not on our map
        </h1>
        <p className="mx-auto mt-5 max-w-md text-body-lg text-mist">
          The page you are looking for has moved, sold quietly, or never
          existed. The collection, however, is very much open.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button href="/" size="lg">
            <Compass aria-hidden className="size-4" />
            Return Home
          </Button>
          <Button href="/properties" variant="outline" size="lg">
            <Search aria-hidden className="size-4" />
            Search Properties
          </Button>
        </div>
        <p className="mt-12 text-body-sm text-mist">
          Looking for something specific?{" "}
          <Link
            href="/contact"
            className="text-gold underline underline-offset-4 transition-colors hover:text-bronze"
          >
            Ask us directly
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
