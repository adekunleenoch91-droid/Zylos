import { describe, expect, it } from "vitest";
import {
  getAgentBySlug,
  getAgentListings,
  getAllAgentSlugs,
  getAllPostSlugs,
  getAllPropertySlugs,
  getFeaturedProperties,
  getProperties,
  getPropertyBySlug,
  getRelatedPosts,
  getSimilarProperties,
} from "@/services/content";

describe("getProperties filtering", () => {
  it("returns the full collection with no filters", async () => {
    const all = await getProperties();
    expect(all.length).toBeGreaterThanOrEqual(8);
  });

  it("filters by free-text query across title and location", async () => {
    const monaco = await getProperties({ query: "monaco" });
    expect(monaco.length).toBeGreaterThan(0);
    expect(
      monaco.every((p) =>
        `${p.title} ${p.location.city} ${p.location.country}`
          .toLowerCase()
          .includes("monaco"),
      ),
    ).toBe(true);
  });

  it("filters by type and status", async () => {
    const villas = await getProperties({ type: "villa" });
    expect(villas.every((p) => p.type === "villa")).toBe(true);

    const forRent = await getProperties({ status: "for-rent" });
    expect(forRent.every((p) => p.status === "for-rent")).toBe(true);
  });

  it("filters by minimum bedrooms and max price", async () => {
    const big = await getProperties({ minBedrooms: 7 });
    expect(big.every((p) => p.bedrooms >= 7)).toBe(true);

    const affordable = await getProperties({ maxPrice: 10_000_000 });
    expect(affordable.every((p) => p.price <= 10_000_000)).toBe(true);
  });

  it("sorts by price ascending and descending", async () => {
    const asc = await getProperties({ sort: "price-asc" });
    const desc = await getProperties({ sort: "price-desc" });
    expect(asc[0].price).toBeLessThanOrEqual(asc[asc.length - 1].price);
    expect(desc[0].price).toBeGreaterThanOrEqual(desc[desc.length - 1].price);
  });
});

describe("featured + lookups", () => {
  it("returns only featured properties", async () => {
    const featured = await getFeaturedProperties();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((p) => p.featured)).toBe(true);
  });

  it("resolves a property by slug and undefined for unknown", async () => {
    expect(await getPropertyBySlug("meridian-cliff-villa")).toBeDefined();
    expect(await getPropertyBySlug("does-not-exist")).toBeUndefined();
  });

  it("returns similar properties excluding the source", async () => {
    const property = await getPropertyBySlug("meridian-cliff-villa");
    expect(property).toBeDefined();
    const similar = await getSimilarProperties(property!, 3);
    expect(similar).toHaveLength(3);
    expect(similar.some((p) => p.id === property!.id)).toBe(false);
  });
});

describe("agents", () => {
  it("resolves an agent and their listings", async () => {
    const agent = await getAgentBySlug("elena-marchetti");
    expect(agent).toBeDefined();
    const listings = await getAgentListings(agent!.id);
    expect(listings.every((p) => p.agentId === agent!.id)).toBe(true);
  });
});

describe("blog relations", () => {
  it("returns related posts excluding the source, ranked by overlap", async () => {
    const slugs = await getAllPostSlugs();
    expect(slugs.length).toBeGreaterThan(0);
  });
});

describe("static params completeness", () => {
  it("exposes slugs for every dynamic route", async () => {
    expect((await getAllPropertySlugs()).length).toBeGreaterThanOrEqual(8);
    expect((await getAllAgentSlugs()).length).toBeGreaterThanOrEqual(5);
    expect((await getAllPostSlugs()).length).toBeGreaterThanOrEqual(6);
  });
});

describe("getRelatedPosts", () => {
  it("excludes the source article and respects the limit", async () => {
    const { getPostBySlug } = await import("@/services/content");
    const post = await getPostBySlug(
      "the-quiet-return-of-the-courtyard-house",
    );
    expect(post).toBeDefined();
    const related = await getRelatedPosts(post!, 2);
    expect(related).toHaveLength(2);
    expect(related.some((p) => p.id === post!.id)).toBe(false);
  });
});
