import { BlogQuery, getBlogPage } from "../_query";

/**
 * How many stories the current filter matched, sat to the left of the
 * controls that set it.
 *
 * Split out from the grid so it can share the toolbar row with the filter
 * while still being the thing that waits for the fetch: the controls stay put
 * and usable, and only this line goes quiet while a new query runs.
 */
export async function BlogCount(query: BlogQuery) {
  const { total, activeCategory } = await getBlogPage(query);

  return (
    <p className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
      {total} {total === 1 ? "story" : "stories"}
      {activeCategory
        ? ` from the ${activeCategory.name.toLowerCase()} desk`
        : ""}
      {query.searchTerm ? ` matching “${query.searchTerm}”` : ""}
    </p>
  );
}

/** The same line's height, held while the count is on its way. */
export function BlogCountSkeleton() {
  return <div className="h-3 w-36 animate-pulse rounded bg-muted" />;
}
