import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import {
  getAllAgentSlugs,
  getAllPostSlugs,
  getAllPropertySlugs,
  getPosts,
  getProperties,
} from "@/services/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [propertySlugs, agentSlugs, postSlugs, properties, posts] =
    await Promise.all([
      getAllPropertySlugs(),
      getAllAgentSlugs(),
      getAllPostSlugs(),
      getProperties(),
      getPosts(),
    ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/properties", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/agents", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" as const },
  ].map((r) => ({
    url: `${siteConfig.url}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const propertyRoutes: MetadataRoute.Sitemap = propertySlugs.map((slug) => ({
    url: `${siteConfig.url}/properties/${slug}`,
    lastModified: new Date(
      properties.find((p) => p.slug === slug)?.addedAt ?? Date.now(),
    ),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const agentRoutes: MetadataRoute.Sitemap = agentSlugs.map((slug) => ({
    url: `${siteConfig.url}/agents/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const postRoutes: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
    url: `${siteConfig.url}/blog/${slug}`,
    lastModified: new Date(
      posts.find((p) => p.slug === slug)?.updatedAt ?? Date.now(),
    ),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...propertyRoutes, ...agentRoutes, ...postRoutes];
}
