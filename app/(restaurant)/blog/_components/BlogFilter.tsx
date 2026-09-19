"use client";

import { useEffect, useState } from "react";

import { SearchIcon, XIcon } from "@/components/icons/Icons";
import { SimpleSelect } from "@/components/ui";
import useUpdateSearchParam from "@/hooks/useUpdateSearchParam";
import type { CategoryNode } from "@/lib/types";

interface BlogFilterProps {
  category?: string;
  searchTerm?: string;
  /** The desks stories can be filed under, from `GET /categories`. */
  categories: CategoryNode[];
}

export default function BlogFilter({
  category,
  searchTerm,
  categories,
}: BlogFilterProps) {
  const updateSearchParam = useUpdateSearchParam();


  const [search, setSearch] = useState(searchTerm ?? "");

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

  // "All stories" is not a category the API knows about — it is the absence
  // of the filter, so it carries an empty slug.
  const options = [
    { value: "", label: "All stories" },
    ...categories.map((c) => ({ value: c.slug, label: c.name })),
  ];

  // Nothing to clear when nothing is set, and a permanently visible Clear
  // button reads as a filter that is always on.
  const isFiltered = Boolean(active || search);

  return (
    <div className="flex w-full items-center gap-2 sm:w-auto">
      <div className="w-40 shrink-0 sm:w-44">
        <SimpleSelect
          options={options}
          value={active}
          onChange={(value) => updateSearchParam({ category: value, page: "" })}
          placeholder="All stories"
          className="h-9 rounded-lg bg-card/40 text-[13px] ring-border/70 backdrop-blur-sm"
        />
      </div>

      <div className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground z-10" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search the journal…"
          aria-label="Search the journal"
          className="h-9 w-full rounded-lg border border-border/70 bg-card/40 pr-8 pl-9 text-[13px] backdrop-blur-sm transition-colors placeholder:text-muted-foreground/70 focus:border-primary/40 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Clear search"
            className="absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <XIcon className="size-3.5" />
          </button>
        )}
      </div>

      {isFiltered && (
        <button
          type="button"
          // Pushed in one update rather than two, so the grid re-renders once
          // and the URL never passes through a half-cleared state.
          onClick={() =>
            updateSearchParam({ category: "", search: "", page: "" })
          }
          className="h-9 shrink-0 cursor-pointer rounded-lg px-3 text-[12.5px] font-medium whitespace-nowrap text-muted-foreground transition-colors duration-200 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Clear
        </button>
      )}
    </div>
  );
}
