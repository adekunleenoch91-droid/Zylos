import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

interface SectionHeadingProps {
  overline: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/** Standard section header: gold overline, display title, optional lede. */
export function SectionHeading({
  overline,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      as="header"
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p className="text-overline font-medium uppercase text-gold">
        {overline}
      </p>
      <h2 className="mt-4 font-serif text-h2 font-medium text-ivory">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-body-lg text-mist">{description}</p>
      )}
    </Reveal>
  );
}
