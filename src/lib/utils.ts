import type { Property } from "@/types";

/** Merge conditional class names (lightweight `clsx`). */
export function cn(
  ...inputs: (string | false | null | undefined)[]
): string {
  return inputs.filter(Boolean).join(" ");
}

const currencySymbols: Record<Property["currency"], string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

/** Format a price as e.g. "€14.5M" (compact) or "€14,500,000" (full). */
export function formatPrice(
  price: number,
  currency: Property["currency"],
  compact = true,
): string {
  const symbol = currencySymbols[currency];
  if (compact) {
    if (price >= 1_000_000)
      return `${symbol}${(price / 1_000_000).toLocaleString("en-US", {
        maximumFractionDigits: 1,
      })}M`;
    return `${symbol}${(price / 1_000).toFixed(0)}K`;
  }
  return `${symbol}${price.toLocaleString("en-US")}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const statusLabels: Record<Property["status"], string> = {
  "for-sale": "For Sale",
  "for-rent": "For Rent",
  sold: "Sold",
  new: "New",
};

export const typeLabels: Record<Property["type"], string> = {
  villa: "Villa",
  penthouse: "Penthouse",
  estate: "Estate",
  apartment: "Apartment",
  chalet: "Chalet",
};

/** Slug → "Title Case" fallback for breadcrumbs. */
export function humanize(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
