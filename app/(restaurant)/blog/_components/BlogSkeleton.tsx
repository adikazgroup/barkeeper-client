/**
 * What the grid looks like while the posts are on their way.
 *
 * Only the cards are drawn: the hero and the toolbar are rendered by the page
 * outside the `Suspense` boundary, so they stay put across a search or a change
 * of desk instead of flashing away and back.
 */

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

export function BlogSkeleton() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="border-x border-border/50">
        <div
          className={`grid grid-cols-1 gap-4 py-6 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 ${CELL}`}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex h-full flex-col overflow-hidden rounded-lg border border-border/60 bg-card/40"
            >
              <div className="aspect-16/10 animate-pulse border-b border-border/50 bg-muted" />

              <div className="flex flex-1 flex-col p-5">
                <div className="flex gap-2.5">
                  <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
                  <div className="h-2.5 w-12 animate-pulse rounded bg-muted" />
                </div>
                <div className="mt-4 h-4 w-4/5 animate-pulse rounded bg-muted" />
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-muted/70" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-muted/70" />
                </div>
                <div className="mt-6 h-3 w-24 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
