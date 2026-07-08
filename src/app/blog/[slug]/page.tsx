import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, List } from "lucide-react";
import { BlogCard } from "@/components/cards/BlogCard";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { blogPostJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import {
  getAgentById,
  getAllPostSlugs,
  getPostBySlug,
  getRelatedPosts,
} from "@/services/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const headingId = (heading: string) =>
  heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.heroImage.src }],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [author, related] = await Promise.all([
    getAgentById(post.authorId),
    getRelatedPosts(post),
  ]);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Journal", href: "/blog" },
    { label: post.title },
  ];

  const tocEntries = post.body
    .filter((section) => section.heading)
    .map((section) => ({
      label: section.heading as string,
      id: headingId(section.heading as string),
    }));

  return (
    <article>
      <JsonLd
        data={[
          blogPostJsonLd(post, author?.name ?? "Zylos Editorial"),
          breadcrumbJsonLd(crumbs),
        ]}
      />

      {/* Hero */}
      <header className="relative">
        <div className="relative h-[52vh] min-h-96 overflow-hidden">
          <Image
            src={post.heroImage.src}
            alt={post.heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-midnight/30"
          />
        </div>
        <div className="container-content relative z-10 -mt-40 pb-4">
          <Reveal>
            <Breadcrumbs items={crumbs} />
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge tone="gold">{post.category}</Badge>
              <span className="flex items-center gap-1.5 text-caption uppercase tracking-wider text-mist">
                <Clock aria-hidden className="size-3" />
                {post.readingMinutes} min read
              </span>
            </div>
            <h1 className="mt-5 max-w-4xl font-serif text-display-lg font-medium text-ivory">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {author && (
                  <>
                    <span className="relative size-12 overflow-hidden rounded-full border border-gold/40">
                      <Image
                        src={author.portrait.src}
                        alt={author.portrait.alt}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </span>
                    <div>
                      <Link
                        href={`/agents/${author.slug}`}
                        className="text-body font-semibold text-ivory transition-colors hover:text-champagne"
                      >
                        {author.name}
                      </Link>
                      <p className="text-body-sm text-mist">
                        <time dateTime={post.publishedAt}>
                          {formatDate(post.publishedAt)}
                        </time>
                        {post.updatedAt !== post.publishedAt && (
                          <> · Updated {formatDate(post.updatedAt)}</>
                        )}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <ShareButtons title={post.title} path={`/blog/${post.slug}`} />
            </div>
          </Reveal>
        </div>
      </header>

      {/* Body */}
      <div className="container-content mt-16 grid gap-16 lg:grid-cols-4">
        {/* Table of contents */}
        {tocEntries.length > 0 && (
          <nav
            aria-label="Table of contents"
            className="max-lg:hidden lg:sticky lg:top-28 lg:self-start"
          >
            <p className="flex items-center gap-2 text-overline uppercase text-gold">
              <List aria-hidden className="size-4" />
              Contents
            </p>
            <ol className="mt-5 space-y-3 border-l border-ivory/10">
              {tocEntries.map((entry) => (
                <li key={entry.id}>
                  <a
                    href={`#${entry.id}`}
                    className="-ml-px block border-l border-transparent pl-4 text-body-sm text-mist transition-colors hover:border-gold hover:text-champagne"
                  >
                    {entry.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="prose-luxury max-w-3xl lg:col-span-3">
          {post.body.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 id={headingId(section.heading)}>{section.heading}</h2>
              )}
              {section.paragraphs.map((paragraph, j) => (
                <p key={j}>{paragraph}</p>
              ))}
              {section.quote && <blockquote>{section.quote}</blockquote>}
            </section>
          ))}

          {/* Tags */}
          <div className="mt-12 flex flex-wrap gap-2 border-t border-ivory/10 pt-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm border border-ivory/15 px-3 py-1.5 text-caption uppercase tracking-wider text-mist"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="mt-12 rounded-lg border border-gold/20 bg-graphite/40 p-8">
            <h2 className="mt-0 font-serif text-h3 font-medium text-ivory">
              The Journal, quarterly
            </h2>
            <p className="mt-3 text-body text-mist">
              Essays like this one, delivered four times a year. Nothing else.
            </p>
            <div className="mt-5 max-w-md">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section
          className="section-padding mt-8 bg-charcoal/50"
          aria-labelledby="related-title"
        >
          <div className="container-content">
            <SectionHeading
              overline="Continue Reading"
              title={<span id="related-title">Related essays</span>}
            />
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <BlogCard post={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
