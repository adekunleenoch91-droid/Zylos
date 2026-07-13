"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Route-level error boundary. Catches unexpected exceptions during rendering
 * and offers a graceful, on-brand recovery without breaking the experience.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced to the browser console and any attached RUM/error tracker.
    console.error(error);
  }, [error]);

  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(110%_90%_at_50%_0%,#1A2238_0%,#0A142F_55%,#060D22_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
      />
      <div className="container-content relative z-10 py-24 text-center">
        <p className="text-overline font-medium uppercase text-champagne">
          Something interrupted us
        </p>
        <h1 className="mx-auto mt-5 max-w-2xl font-serif text-h1 font-medium text-ivory">
          A moment of turbulence
        </h1>
        <p className="mx-auto mt-5 max-w-md text-body-lg text-mist">
          An unexpected error occurred while preparing this view. The issue has
          been noted — please try again, or return to more familiar ground.
        </p>
        {error.digest && (
          <p className="mt-4 text-caption uppercase tracking-widest text-mist/60">
            Reference · {error.digest}
          </p>
        )}
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button onClick={reset} size="lg">
            <RotateCcw aria-hidden className="size-4" />
            Try Again
          </Button>
          <Button href="/" variant="outline" size="lg">
            Return Home
          </Button>
        </div>
      </div>
    </section>
  );
}
