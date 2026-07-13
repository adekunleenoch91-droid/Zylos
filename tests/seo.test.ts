import { describe, expect, it } from "vitest";
import {
  agentJsonLd,
  blogPostJsonLd,
  breadcrumbJsonLd,
  organizationJsonLd,
  propertyJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { agents } from "@/data/agents";
import { posts } from "@/data/posts";
import { properties } from "@/data/properties";

describe("organizationJsonLd", () => {
  it("declares the correct schema types and identity", () => {
    const ld = organizationJsonLd() as Record<string, unknown>;
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toEqual([
      "Organization",
      "RealEstateAgent",
      "LocalBusiness",
    ]);
    expect(ld.name).toBeTruthy();
  });
});

describe("websiteJsonLd", () => {
  it("exposes a SearchAction pointing at the properties search", () => {
    const ld = websiteJsonLd() as Record<string, any>;
    expect(ld["@type"]).toBe("WebSite");
    expect(ld.potentialAction["@type"]).toBe("SearchAction");
    expect(ld.potentialAction.target.urlTemplate).toContain(
      "/properties?query=",
    );
  });
});

describe("breadcrumbJsonLd", () => {
  it("numbers positions from 1 and preserves labels", () => {
    const ld = breadcrumbJsonLd([
      { label: "Home", href: "/" },
      { label: "Properties", href: "/properties" },
      { label: "A Villa" },
    ]) as Record<string, any>;
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement).toHaveLength(3);
    expect(ld.itemListElement[0].position).toBe(1);
    expect(ld.itemListElement[2].name).toBe("A Villa");
    // Last crumb has no href, so no item URL is emitted.
    expect(ld.itemListElement[2].item).toBeUndefined();
  });
});

describe("propertyJsonLd", () => {
  it("maps property data into a Residence with floor size in m²", () => {
    const ld = propertyJsonLd(properties[0]) as Record<string, any>;
    expect(ld["@type"]).toBe("Residence");
    expect(ld.numberOfRooms).toBe(properties[0].bedrooms);
    expect(ld.floorSize.unitCode).toBe("MTK");
    expect(ld.image.length).toBe(properties[0].images.length);
  });
});

describe("agentJsonLd", () => {
  it("maps an agent into a Person linked to the organization", () => {
    const ld = agentJsonLd(agents[0]) as Record<string, any>;
    expect(ld["@type"]).toBe("Person");
    expect(ld.name).toBe(agents[0].name);
    expect(ld.knowsLanguage).toEqual(agents[0].languages);
  });
});

describe("blogPostJsonLd", () => {
  it("maps a post into a BlogPosting with dates and author", () => {
    const ld = blogPostJsonLd(posts[0], "Test Author") as Record<string, any>;
    expect(ld["@type"]).toBe("BlogPosting");
    expect(ld.author.name).toBe("Test Author");
    expect(ld.datePublished).toBe(posts[0].publishedAt);
    expect(ld.dateModified).toBe(posts[0].updatedAt);
  });
});
