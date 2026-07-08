"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { BlogCard } from "@/components/cards/BlogCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types";

interface BlogExplorerProps {
  posts: BlogPost[];
  categories: string[];
}

/** Journal index with category chips and instant search. */
export function BlogExplorer({ posts, categories }: BlogExplorerProps) {
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = posts;
    if (category !== "All")
      list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) =>
        [p.title, p.excerpt, p.tags.join(" ")].join(" ").toLowerCase().includes(q),
      );
    }
    return list;
  }, [posts, category, query]);

  return (
    <div>
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by category"
        >
          {["All", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={cn(
                "rounded-full border px-4 py-2 text-body-sm transition-all duration-(--duration-base)",
                category === c
                  ? "border-gold bg-gold/15 text-champagne"
                  : "border-ivory/15 text-silver hover:border-gold/40 hover:text-champagne",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative md:w-72">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-mist"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the journal…"
            aria-label="Search articles"
            className="w-full rounded-md border border-ivory/15 bg-graphite/60 py-2.5 pl-11 pr-4 text-body-sm text-ivory placeholder:text-mist transition-colors focus:border-gold/70 focus:outline-none"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <motion.ul layout className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((post, i) => (
              <motion.li
                layout
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, delay: i * 0.04, ease: EASE_OUT_EXPO }}
              >
                <BlogCard post={post} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <div className="mt-10">
          <EmptyState
            title="Nothing here yet"
            description="No articles match your search. Try a different phrase or browse every category."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
              >
                View All Articles
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}
