/**
 * Zylos domain models.
 *
 * Content is fully separated from presentation: every page consumes these
 * types through the service layer in `src/services`, so the static data in
 * `src/data` can be replaced by a headless CMS, REST API, GraphQL endpoint
 * or database without touching any component.
 */

export type PropertyStatus = "for-sale" | "for-rent" | "sold" | "new";

export type PropertyType =
  | "villa"
  | "penthouse"
  | "estate"
  | "apartment"
  | "chalet";

export interface PropertyImage {
  src: string;
  alt: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  headline: string;
  description: string[];
  price: number;
  currency: "USD" | "EUR" | "GBP";
  status: PropertyStatus;
  type: PropertyType;
  location: {
    neighborhood: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
  bedrooms: number;
  bathrooms: number;
  /** Interior area in square meters. */
  area: number;
  /** Plot size in square meters, when applicable. */
  plot?: number;
  yearBuilt: number;
  featured: boolean;
  images: PropertyImage[];
  amenities: string[];
  features: { label: string; value: string }[];
  agentId: string;
  addedAt: string;
}

export interface Agent {
  id: string;
  slug: string;
  name: string;
  role: string;
  portrait: PropertyImage;
  bio: string;
  story: string[];
  specialization: string[];
  experienceYears: number;
  languages: string[];
  certifications: string[];
  awards: string[];
  phone: string;
  email: string;
  socials: { platform: "linkedin" | "instagram" | "x"; url: string }[];
  rating: number;
  salesVolume: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  heroImage: PropertyImage;
  authorId: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  featured: boolean;
  /** Section headings + paragraphs; headings drive the table of contents. */
  body: { heading?: string; paragraphs: string[]; quote?: string }[];
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  quote: string;
  rating: number;
  avatar: PropertyImage;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  city: string;
  description: string;
  propertyCount: number;
  image: PropertyImage;
}

export interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export interface ServiceOffering {
  id: string;
  title: string;
  description: string;
  icon: "key" | "compass" | "shield" | "globe" | "sparkles" | "landmark";
}

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

export interface PropertyFilters {
  query?: string;
  type?: PropertyType | "all";
  status?: PropertyStatus | "all";
  minBedrooms?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc";
}
