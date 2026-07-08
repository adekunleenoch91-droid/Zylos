import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { PropertyStatus } from "@/types";

interface BadgeProps {
  children: ReactNode;
  tone?: "gold" | "neutral" | PropertyStatus;
  className?: string;
}

const tones: Record<string, string> = {
  gold: "bg-gold/15 text-champagne border-gold/30",
  neutral: "bg-ivory/8 text-silver border-ivory/15",
  "for-sale": "bg-gold/15 text-champagne border-gold/30",
  "for-rent": "bg-info/15 text-[#9ec5fe] border-info/30",
  sold: "bg-ivory/8 text-mist border-ivory/15",
  new: "bg-success/15 text-[#86efac] border-success/30",
};

/** Small status/label chip; status meaning is always carried by its text. */
export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2.5 py-1 text-caption font-medium uppercase tracking-wider backdrop-blur-sm",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
