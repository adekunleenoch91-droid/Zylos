import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { Reveal } from "@/components/motion/Reveal";
import { CtaSection } from "@/components/sections/CtaSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/three/PageHero";
import { Badge } from "@/components/ui/Badge";
import { breadcrumbJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import {
  getAgentById,
  getBlogCategories,
  getFeaturedPost,
  getPosts,
} from "@/services/content";

export const metadata: Metadata = {
  title: "The Journal — Luxury Real Estate Intelligence",
  description:
    "Market insight, architectural stories and advisory frameworks from the Zylos partners — intelligence for owners and buyers of exceptional homes.",
  alternates: { canonical: "/blog" },
};

const crumbs = [
  { label: "Home", href: "/" },
  { label: "Journal", href: "/blog" },
];

export default async function BlogPage() {
  const [posts, categories, featured] = await Promise.all([
    getPosts(),
    getBlogCategories(),
    getFeaturedPost(),
  ]);
  const featuredAuthor = featured
    ? await getAgentById(featured.authorId)
    : undefined;
  const rest = posts.filter((p) => p.id !== featured?.id);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        overline="The Journal"
        title={
          <>
            Intelligence,{" "}
            <span className="italic text-gradient-gold">not noise</span>
          </>
        }
        description="Essays and frameworks from the people who close the quiet transactions — published when there is something worth saying."
        variant="panels"
        breadcrumbs={crumbs}
      />

      {/* Featured article */}
      {featured && (
        <section className="pb-20" aria-labelledby="featured-article">
          <div className="container-content">
            <Reveal>
              <Link
                href={`/blog/${featured.slug}`}
                className="group relative block overflow-hidden rounded-xl border border-ivory/10 shadow-floating"
              >
                <div className="relative aspect-16/9 sm:aspect-21/9">
                  <Image
                    src={featured.heroImage.src}
                    alt={featured.heroImage.alt}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-103"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-midnight/95 via-midnight/40 to-transparent"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge tone="gold">Featured</Badge>
                    <Badge tone="neutral">{featured.category}</Badge>
                    <span className="flex items-center gap-1.5 text-caption uppercase tracking-wider text-mist">
                      <Clock aria-hidden className="size-3" />
                      {featured.readingMinutes} min read
                    </span>
                  </div>
                  <h2
                    id="featured-article"
                    className="mt-4 max-w-3xl font-serif text-h1 font-medium text-ivory transition-colors group-hover:text-champagne"
                  >
                    {featured.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-body-lg text-silver max-sm:hidden">
                    {featured.excerpt}
                  </p>
                  <p className="mt-6 flex items-center gap-3 text-body-sm text-mist">
                    {featuredAuthor && (
                      <span className="text-silver">{featuredAuthor.name}</span>
                    )}
                    <span aria-hidden>·</span>
                    <time dateTime={featured.publishedAt}>
                      {formatDate(featured.publishedAt)}
                    </time>
                    <ArrowRight
                      aria-hidden
                      className="size-4 text-gold transition-transform duration-(--duration-base) group-hover:translate-x-1"
                    />
                  </p>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* Index */}
      <section className="pb-24" aria-label="All articles">
        <div className="container-content">
          <BlogExplorer posts={rest} categories={categories} />
        </div>
      </section>

      <CtaSection />
    </>
  );
}
