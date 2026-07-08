import { agents } from "@/data/agents";
import { faqs } from "@/data/faqs";
import { neighborhoods } from "@/data/neighborhoods";
import { posts } from "@/data/posts";
import { properties } from "@/data/properties";
import { testimonials } from "@/data/testimonials";
import { services, stats, timeline, values } from "@/data/company";
import type {
  Agent,
  BlogPost,
  Property,
  PropertyFilters,
} from "@/types";

/**
 * Content service — the single seam between data and presentation.
 *
 * Today it reads from static modules; swapping to a headless CMS, REST or
 * GraphQL source only requires changing these function bodies (they are
 * already async for that reason). No component imports `src/data` directly.
 */

/* ------------------------------- Properties ----------------------------- */

export async function getProperties(
  filters: PropertyFilters = {},
): Promise<Property[]> {
  let list = [...properties];
  const { query, type, status, minBedrooms, maxPrice, sort } = filters;

  if (query) {
    const q = query.toLowerCase();
    list = list.filter((p) =>
      [p.title, p.location.city, p.location.country, p.location.neighborhood]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }
  if (type && type !== "all") list = list.filter((p) => p.type === type);
  if (status && status !== "all")
    list = list.filter((p) => p.status === status);
  if (minBedrooms) list = list.filter((p) => p.bedrooms >= minBedrooms);
  if (maxPrice) list = list.filter((p) => p.price <= maxPrice);

  switch (sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    default:
      list.sort(
        (a, b) =>
          new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
      );
  }
  return list;
}

export async function getFeaturedProperties(): Promise<Property[]> {
  return properties.filter((p) => p.featured);
}

export async function getPropertyBySlug(
  slug: string,
): Promise<Property | undefined> {
  return properties.find((p) => p.slug === slug);
}

export async function getSimilarProperties(
  property: Property,
  limit = 3,
): Promise<Property[]> {
  return properties
    .filter((p) => p.id !== property.id)
    .sort((a, b) => {
      const score = (x: Property) =>
        (x.type === property.type ? 2 : 0) +
        (x.location.country === property.location.country ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, limit);
}

export async function getAllPropertySlugs(): Promise<string[]> {
  return properties.map((p) => p.slug);
}

/* --------------------------------- Agents ------------------------------- */

export async function getAgents(): Promise<Agent[]> {
  return [...agents];
}

export async function getAgentBySlug(
  slug: string,
): Promise<Agent | undefined> {
  return agents.find((a) => a.slug === slug);
}

export async function getAgentById(id: string): Promise<Agent | undefined> {
  return agents.find((a) => a.id === id);
}

export async function getAgentListings(agentId: string): Promise<Property[]> {
  return properties.filter((p) => p.agentId === agentId);
}

export async function getAllAgentSlugs(): Promise<string[]> {
  return agents.map((a) => a.slug);
}

/* ---------------------------------- Blog -------------------------------- */

export async function getPosts(): Promise<BlogPost[]> {
  return [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getFeaturedPost(): Promise<BlogPost | undefined> {
  return posts.find((p) => p.featured) ?? posts[0];
}

export async function getPostBySlug(
  slug: string,
): Promise<BlogPost | undefined> {
  return posts.find((p) => p.slug === slug);
}

export async function getRelatedPosts(
  post: BlogPost,
  limit = 3,
): Promise<BlogPost[]> {
  return posts
    .filter((p) => p.id !== post.id)
    .sort((a, b) => {
      const overlap = (x: BlogPost) =>
        (x.category === post.category ? 2 : 0) +
        x.tags.filter((t) => post.tags.includes(t)).length;
      return overlap(b) - overlap(a);
    })
    .slice(0, limit);
}

export async function getAllPostSlugs(): Promise<string[]> {
  return posts.map((p) => p.slug);
}

export async function getBlogCategories(): Promise<string[]> {
  return [...new Set(posts.map((p) => p.category))];
}

/* ----------------------------- Supporting data -------------------------- */

export async function getTestimonials() {
  return [...testimonials];
}

export async function getFaqs() {
  return [...faqs];
}

export async function getNeighborhoods() {
  return [...neighborhoods];
}

export async function getStats() {
  return [...stats];
}

export async function getServices() {
  return [...services];
}

export async function getTimeline() {
  return [...timeline];
}

export async function getValues() {
  return [...values];
}
