import { cn } from "@/lib/utils";

/** Shimmering placeholder used while content loads — never a blank screen. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer rounded-md bg-[linear-gradient(110deg,#1A2238_35%,#232D4A_50%,#1A2238_65%)] bg-size-[200%_100%]",
        className,
      )}
    />
  );
}

/** Card-shaped skeleton matching PropertyCard dimensions. */
export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-ivory/10 bg-graphite/40">
      <Skeleton className="aspect-4/3 rounded-none" />
      <div className="space-y-3 p-6">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}
