import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Zylos wordmark — a serif logotype with a gold keystone accent.
 * Rendered as text for perfect scaling and accessibility.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Zylos — Home"
      className={cn(
        "group inline-flex items-baseline gap-1 font-serif text-2xl font-semibold tracking-[0.18em] text-ivory",
        className,
      )}
    >
      <span
        aria-hidden
        className="mr-1 inline-block size-2 translate-y-[-0.35em] rotate-45 bg-gold transition-transform duration-(--duration-base) group-hover:rotate-[135deg]"
      />
      ZYLOS
    </Link>
  );
}
