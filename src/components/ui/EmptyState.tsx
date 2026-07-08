import { SearchX } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

/** Helpful empty state with guidance and a clear next step. */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-ivory/15 bg-graphite/30 px-8 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
        <SearchX aria-hidden className="size-7 text-gold" />
      </span>
      <h3 className="mt-6 font-serif text-h3 text-ivory">{title}</h3>
      <p className="mt-3 max-w-md text-body text-mist">{description}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
