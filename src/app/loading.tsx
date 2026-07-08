import { Logo } from "@/components/layout/Logo";

/** Route-level loading experience — brand mark with a breathing gold line. */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-screen flex-col items-center justify-center gap-6"
    >
      <Logo className="pointer-events-none" />
      <div className="h-px w-40 overflow-hidden bg-ivory/10">
        <div className="animate-shimmer h-full w-full bg-[linear-gradient(90deg,transparent,#D4AF37,transparent)] bg-size-[200%_100%]" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
