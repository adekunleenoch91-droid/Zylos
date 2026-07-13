import { describe, expect, it } from "vitest";
import {
  cn,
  formatDate,
  formatPrice,
  humanize,
  statusLabels,
  typeLabels,
} from "@/lib/utils";

describe("cn", () => {
  it("joins truthy class names and drops falsy ones", () => {
    expect(cn("a", false, "b", null, undefined, "c")).toBe("a b c");
  });

  it("returns an empty string when nothing is truthy", () => {
    expect(cn(false, null, undefined)).toBe("");
  });
});

describe("formatPrice", () => {
  it("formats millions compactly with the right currency symbol", () => {
    expect(formatPrice(14_500_000, "EUR")).toBe("€14.5M");
    expect(formatPrice(23_800_000, "USD")).toBe("$23.8M");
  });

  it("formats sub-million values in thousands", () => {
    expect(formatPrice(750_000, "GBP")).toBe("£750K");
  });

  it("formats full values with grouping when not compact", () => {
    expect(formatPrice(14_500_000, "EUR", false)).toBe("€14,500,000");
  });
});

describe("formatDate", () => {
  it("renders a long, human-readable US date", () => {
    expect(formatDate("2026-06-20")).toBe("June 20, 2026");
  });
});

describe("humanize", () => {
  it("title-cases a slug", () => {
    expect(humanize("meridian-cliff-villa")).toBe("Meridian Cliff Villa");
  });
});

describe("label maps", () => {
  it("covers every status and type", () => {
    expect(statusLabels["for-sale"]).toBe("For Sale");
    expect(statusLabels["for-rent"]).toBe("For Rent");
    expect(typeLabels.penthouse).toBe("Penthouse");
    expect(typeLabels.chalet).toBe("Chalet");
  });
});
