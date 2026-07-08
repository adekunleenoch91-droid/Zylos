"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { statusLabels, typeLabels } from "@/lib/utils";
import type { Property, PropertyFilters } from "@/types";

const PAGE_SIZE = 6;

interface PropertyExplorerProps {
  properties: Property[];
  initialQuery?: string;
}

/**
 * The property discovery experience: search, filters, sorting and animated
 * pagination over the full collection. Filtering runs client-side over
 * server-rendered data, so results are instant.
 */
export function PropertyExplorer({
  properties,
  initialQuery = "",
}: PropertyExplorerProps) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<PropertyFilters["type"]>("all");
  const [status, setStatus] = useState<PropertyFilters["status"]>("all");
  const [minBeds, setMinBeds] = useState(0);
  const [sort, setSort] = useState<NonNullable<PropertyFilters["sort"]>>("newest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = [...properties];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) =>
        [p.title, p.location.city, p.location.country, p.location.neighborhood]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    if (type !== "all") list = list.filter((p) => p.type === type);
    if (status !== "all") list = list.filter((p) => p.status === status);
    if (minBeds > 0) list = list.filter((p) => p.bedrooms >= minBeds);
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
  }, [properties, query, type, status, minBeds, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const selectClass =
    "rounded-md border border-ivory/15 bg-graphite/60 px-3.5 py-2.5 text-body-sm text-silver transition-colors focus:border-gold/70 focus:outline-none";

  function resetFilters() {
    setQuery("");
    setType("all");
    setStatus("all");
    setMinBeds(0);
    setSort("newest");
    setPage(1);
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="glass sticky top-20 z-30 rounded-lg p-4 shadow-md lg:top-24">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-mist"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by residence, city or country…"
              aria-label="Search properties"
              className="w-full rounded-md border border-ivory/15 bg-graphite/60 py-2.5 pl-11 pr-4 text-body-sm text-ivory placeholder:text-mist transition-colors focus:border-gold/70 focus:outline-none"
            />
          </div>
          <div
            className="flex flex-wrap items-center gap-3"
            role="group"
            aria-label="Property filters"
          >
            <SlidersHorizontal aria-hidden className="hidden size-4 text-gold lg:block" />
            <select
              aria-label="Property type"
              value={type}
              onChange={(e) => {
                setType(e.target.value as PropertyFilters["type"]);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="all">All types</option>
              {Object.entries(typeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              aria-label="Availability"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as PropertyFilters["status"]);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="all">Any status</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              aria-label="Minimum bedrooms"
              value={minBeds}
              onChange={(e) => {
                setMinBeds(Number(e.target.value));
                setPage(1);
              }}
              className={selectClass}
            >
              <option value={0}>Any beds</option>
              {[4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n}+ beds
                </option>
              ))}
            </select>
            <select
              aria-label="Sort order"
              value={sort}
              onChange={(e) =>
                setSort(e.target.value as NonNullable<PropertyFilters["sort"]>)
              }
              className={selectClass}
            >
              <option value="newest">Newest first</option>
              <option value="price-desc">Price · high to low</option>
              <option value="price-asc">Price · low to high</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result count */}
      <p aria-live="polite" className="mt-8 text-body-sm text-mist">
        {filtered.length}{" "}
        {filtered.length === 1 ? "residence" : "residences"} in the open
        collection
      </p>

      {/* Grid */}
      {visible.length > 0 ? (
        <motion.ul layout className="mt-6 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((property, i) => (
              <motion.li
                layout
                key={property.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, delay: i * 0.04, ease: EASE_OUT_EXPO }}
              >
                <PropertyCard property={property} priority={i < 3} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <div className="mt-10">
          <EmptyState
            title="No residences match — yet"
            description="Most of the Zylos portfolio is never listed publicly. Adjust your filters, or tell us what you are looking for and we will search privately."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="secondary" onClick={resetFilters}>
                  Clear Filters
                </Button>
                <Button href="/contact">Request a Private Search</Button>
              </div>
            }
          />
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-14">
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}
    </div>
  );
}
