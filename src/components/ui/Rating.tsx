import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Five-star rating; value is exposed to assistive tech as text. */
export function Rating({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="img"
      aria-label={`Rated ${value} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(
            "size-3.5",
            i < Math.round(value)
              ? "fill-gold text-gold"
              : "fill-transparent text-mist/40",
          )}
        />
      ))}
    </div>
  );
}
