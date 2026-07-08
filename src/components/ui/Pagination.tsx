"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

/** Accessible pagination control. */
export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="rounded-md border border-ivory/15 p-2.5 text-silver transition-colors hover:border-gold/50 hover:text-champagne disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft aria-hidden className="size-4" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`Page ${n}`}
          aria-current={n === page ? "page" : undefined}
          className={cn(
            "size-10 rounded-md border text-body-sm transition-all duration-(--duration-base)",
            n === page
              ? "border-gold bg-gold/15 text-champagne"
              : "border-ivory/15 text-silver hover:border-gold/50 hover:text-champagne",
          )}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="rounded-md border border-ivory/15 p-2.5 text-silver transition-colors hover:border-gold/50 hover:text-champagne disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight aria-hidden className="size-4" />
      </button>
    </nav>
  );
}
