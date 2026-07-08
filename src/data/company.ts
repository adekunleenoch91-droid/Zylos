import type { ServiceOffering, Stat, TimelineEntry } from "@/types";

export const stats: Stat[] = [
  { id: "s-01", value: 4, suffix: "B+", label: "Portfolio value advised" },
  { id: "s-02", value: 27, suffix: "", label: "Countries served" },
  { id: "s-03", value: 480, suffix: "+", label: "Residences placed" },
  { id: "s-04", value: 98, suffix: "%", label: "Clients who return" },
];

export const services: ServiceOffering[] = [
  {
    id: "svc-01",
    title: "Private Acquisition",
    description:
      "Retained buyer advisory with access to residences that never reach the open market — sourced, vetted and negotiated on your behalf.",
    icon: "key",
  },
  {
    id: "svc-02",
    title: "Discreet Sale",
    description:
      "Gallery-standard presentation and curated introductions for significant homes, placed quietly with qualified buyers worldwide.",
    icon: "shield",
  },
  {
    id: "svc-03",
    title: "Investment Advisory",
    description:
      "Architectural real estate as a generational asset class — portfolio strategy, market intelligence and cross-border structuring support.",
    icon: "compass",
  },
  {
    id: "svc-04",
    title: "Global Relocation",
    description:
      "End-to-end relocation across 27 countries: residence sourcing, schooling, staffing and settling-in, handled by one team.",
    icon: "globe",
  },
  {
    id: "svc-05",
    title: "Estate Care",
    description:
      "Year-round stewardship for the homes we place — key-holding, seasonal preparation, renovation oversight and rental placement.",
    icon: "sparkles",
  },
  {
    id: "svc-06",
    title: "Heritage & New Build",
    description:
      "Advisory for historic restorations and ground-up commissions, from architect selection through to the final walkthrough.",
    icon: "landmark",
  },
];

export const timeline: TimelineEntry[] = [
  {
    year: "2009",
    title: "A single mandate",
    description:
      "Zylos begins with one restored palazzo on Lake Como and a conviction: exceptional homes deserve the standards of the art world.",
  },
  {
    year: "2013",
    title: "The quiet market",
    description:
      "Our off-market practice is formalised. More than half of all placements now occur without a public listing.",
  },
  {
    year: "2017",
    title: "Across the Atlantic",
    description:
      "The Americas practice opens in New York, led from a Tribeca loft that doubles as our first gallery space.",
  },
  {
    year: "2021",
    title: "Asia-Pacific",
    description:
      "Tokyo becomes our third region, anchoring a practice built around the urban sanctuary.",
  },
  {
    year: "2024",
    title: "Estate Care",
    description:
      "Stewardship becomes a discipline of its own — caring for the homes we place, season after season.",
  },
  {
    year: "2026",
    title: "A digital gallery",
    description:
      "Zylos brings its gallery standard online: an immersive digital home for the world's most exceptional residences.",
  },
];

export const values = [
  {
    title: "Discretion",
    description:
      "The most significant work we do is never published. Confidentiality is not a policy here; it is the practice itself.",
  },
  {
    title: "Craftsmanship",
    description:
      "We hold advisory to the standard of the architecture we represent — considered, precise, and built to last.",
  },
  {
    title: "Candour",
    description:
      "We decline more mandates than we accept, and we will tell you when a house is wrong for you. Trust compounds.",
  },
  {
    title: "Patience",
    description:
      "Great houses move on their own calendar. We measure relationships in decades, not transactions.",
  },
];
