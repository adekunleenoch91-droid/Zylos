import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

/** Editorial article card. */
export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-ivory/10 bg-graphite/50 shadow-md transition-all duration-(--duration-slow) hover:-translate-y-1.5 hover:border-gold/25 hover:shadow-floating">
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={post.heroImage.src}
          alt={post.heroImage.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-105"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-midnight/70 to-transparent"
        />
        <div className="absolute left-4 top-4">
          <Badge tone="gold">{post.category}</Badge>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 text-caption uppercase tracking-wider text-mist">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1">
            <Clock aria-hidden className="size-3" />
            {post.readingMinutes} min read
          </span>
        </div>
        <h3 className="mt-3 font-serif text-h4 font-semibold leading-snug text-ivory transition-colors duration-(--duration-base) group-hover:text-champagne">
          <Link href={`/blog/${post.slug}`}>
            <span className="absolute inset-0" aria-hidden />
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-2 text-body-sm leading-relaxed text-mist">
          {post.excerpt}
        </p>
      </div>
    </article>
  );
}
