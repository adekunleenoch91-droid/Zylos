/** Global site configuration — single source for brand + SEO metadata. */
export const siteConfig = {
  name: "Zylos",
  legalName: "Zylos International Realty",
  tagline: "Where Architecture Becomes Legacy",
  description:
    "Zylos is an international luxury real estate house curating the world's most exceptional residences — architectural villas, penthouses and private estates in the most coveted destinations.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zylos.example.com",
  ogImage: "/images/brand/og-image.svg",
  contact: {
    phone: "+1 (212) 555-0180",
    email: "concierge@zylos.example.com",
    address: "12 Meridian Avenue, New York, NY 10013",
    hours: "Monday – Saturday, 9:00 – 19:00",
    lat: 40.7209,
    lng: -74.0007,
  },
  socials: [
    { platform: "Instagram", url: "https://instagram.com" },
    { platform: "LinkedIn", url: "https://linkedin.com" },
    { platform: "X", url: "https://x.com" },
  ],
  nav: [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "About", href: "/about" },
    { label: "Agents", href: "/agents" },
    { label: "Journal", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
