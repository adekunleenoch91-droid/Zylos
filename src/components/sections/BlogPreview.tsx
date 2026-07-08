import { ArrowRight } from "lucide-react";
import { BlogCard } from "@/components/cards/BlogCard";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { BlogPost } from "@/types";

/** Journal preview strip for the homepage. */
export function BlogPreview({ posts }: { posts: BlogPost[] }) {
  return (
    <section
      className="section-padding bg-charcoal/50"
      aria-labelledby="journal-title"
    >
      <div className="container-content">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            overline="The Journal"
            title={<span id="journal-title">Intelligence, not noise</span>}
            description="Market insight and architectural stories from the people who close the quiet transactions."
          />
          <Reveal delay={0.2}>
            <Button href="/blog" variant="secondary">
              Read the Journal
              <ArrowRight aria-hidden className="size-4" />
            </Button>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {posts.slice(0, 3).map((post, i) => (
            <Reveal key={post.id} delay={i * 0.08}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
