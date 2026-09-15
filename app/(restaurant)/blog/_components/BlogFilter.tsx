"use client";

import { useEffect, useState } from "react";

import { SearchIcon, XIcon } from "@/components/icons/Icons";
import useUpdateSearchParam from "@/hooks/useUpdateSearchParam";
import type { CategoryNode } from "@/lib/types";

interface BlogFilterProps {
  category?: string;
  searchTerm?: string;
  /** The desks that actually have posts, from `GET /categories`. */
  categories: CategoryNode[];
}

export default function BlogFilter({
  category,
  searchTerm,
  categories,
}: BlogFilterProps) {
  const updateSearchParam = useUpdateSearchParam();

  // The input is typed into locally and pushed to the URL on a pause, so the
  // server component is not re-run on every keystroke.
  const [search, setSearch] = useState(searchTerm ?? "");

  // Re-sync during render (not in an effect) when the URL changes from
  // outside — a category click, the back button, a shared link.
  const [prevSearchTerm, setPrevSearchTerm] = useState(searchTerm);
  if (searchTerm !== prevSearchTerm) {
    setPrevSearchTerm(searchTerm);
    setSearch(searchTerm ?? "");
  }

  useEffect(() => {
    if (search === (searchTerm ?? "")) return;
    const id = setTimeout(() => updateSearchParam({ search, page: "" }), 350);
    return () => clearTimeout(id);
  }, [search, searchTerm, updateSearchParam]);

  const active = category ?? "";

  // "All" is not a category the API knows about — it is the absence of the
  // filter, so it carries an empty slug.
  const desks = [{ _id: "all", name: "All", slug: "" }, ...categories];

  return (
    <div className="sticky top-16 z-40 border-y border-primary/12 bg-background/90 backdrop-blur-md lg:top-18">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:px-6 lg:flex-row lg:items-center lg:gap-6 lg:px-8">
        {/* Desks, as a rail — the whole set is visible, no dropdown to open. */}
        <div className="relative min-w-0 flex-1">
          <nav
            aria-label="Filter by category"
            className="flex items-center gap-1.5 overflow-x-auto pr-10 scrollbar-hide"
          >
            {desks.map((c) => {
              const isActive = active === c.slug;

              return (
                <button
                  key={c._id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() =>
                    updateSearchParam({ category: c.slug, page: "" })
                  }
                  className={`h-10 shrink-0 cursor-pointer rounded-md border px-4 text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isActive
                      ? "border-primary bg-primary text-white"
                      : "border-primary/20 text-(--rc-premium-muted) hover:border-primary/50 hover:text-primary dark:text-white/60"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </nav>

          {/* The rail scrolls, and a desk clipped mid-word looks like a bug
              rather than an invitation. The fade says there is more. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-background to-transparent"
          />
        </div>

        {/* Search */}
        <div className="relative w-full shrink-0 lg:w-72">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-primary" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the journal…"
            aria-label="Search the journal"
            className="h-10 w-full rounded-md border border-primary/20 bg-card pr-10 pl-10 text-sm text-(--rc-premium-dark) transition-colors placeholder:text-(--rc-premium-muted)/60 focus:border-primary focus:outline-none dark:text-white dark:placeholder:text-white/40 [&::-webkit-search-cancel-button]:appearance-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded text-(--rc-premium-muted) transition-colors hover:bg-primary/10 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-white/50"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
