import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";
import type { Agent, BlogPost, Property } from "@/types";
import type { Crumb } from "@/components/ui/Breadcrumbs";

/**
 * Schema.org JSON-LD builders. Every builder returns a plain object that is
 * rendered through <JsonLd /> and validates against Google's Rich Results
 * requirements.
 */

const abs = (path: string) => new URL(path, siteConfig.url).toString();

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "RealEstateAgent", "LocalBusiness"],
    "@id": abs("/#organization"),
    name: siteConfig.legalName,
    url: siteConfig.url,
    logo: abs(siteConfig.ogImage),
    description: siteConfig.description,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "12 Meridian Avenue",
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: "10013",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.contact.lat,
      longitude: siteConfig.contact.lng,
    },
    openingHours: "Mo-Sa 09:00-19:00",
    sameAs: siteConfig.socials.map((s) => s.url),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": abs("/#website"),
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: { "@id": abs("/#organization") },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/properties?query={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: abs(item.href) } : {}),
    })),
  };
}

export function propertyJsonLd(property: Property) {
  return {
    "@context": "https://schema.org",
    "@type": "Residence",
    "@id": abs(`/properties/${property.slug}`),
    name: property.title,
    description: property.headline,
    url: abs(`/properties/${property.slug}`),
    image: property.images.map((img) => abs(img.src)),
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.area,
      unitCode: "MTK",
    },
    yearBuilt: property.yearBuilt,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location.city,
      addressCountry: property.location.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: property.location.lat,
      longitude: property.location.lng,
    },
    additionalProperty: {
      "@type": "PropertyValue",
      name: "Listed price",
      value: formatPrice(property.price, property.currency, false),
    },
  };
}

export function agentJsonLd(agent: Agent) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": abs(`/agents/${agent.slug}`),
    name: agent.name,
    jobTitle: agent.role,
    description: agent.bio,
    url: abs(`/agents/${agent.slug}`),
    image: abs(agent.portrait.src),
    telephone: agent.phone,
    email: agent.email,
    knowsLanguage: agent.languages,
    worksFor: { "@id": abs("/#organization") },
    sameAs: agent.socials.map((s) => s.url),
  };
}

export function blogPostJsonLd(post: BlogPost, authorName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": abs(`/blog/${post.slug}`),
    headline: post.title,
    description: post.excerpt,
    url: abs(`/blog/${post.slug}`),
    image: abs(post.heroImage.src),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: authorName },
    publisher: { "@id": abs("/#organization") },
    keywords: post.tags.join(", "),
    articleSection: post.category,
    mainEntityOfPage: abs(`/blog/${post.slug}`),
  };
}
