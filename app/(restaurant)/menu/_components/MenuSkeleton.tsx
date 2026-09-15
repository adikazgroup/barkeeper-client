import { MenuHero } from "./MenuHero";

/**
 * Mirrors the shape of the board so nothing shifts when it lands.
 *
 * The hero is the real one, rail slot and all — it needs no data, so the
 * header paints straight away and only the plates arrive late.
 */
export function MenuSkeleton() {
  return (
    <>
      <MenuHero>
        {/* The counter rail, in the hero's slot like the real one */}
        <div className="mx-auto flex w-fit max-w-full gap-1 rounded-full border border-border bg-card/60 p-1 backdrop-blur-sm">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 shrink-0 animate-pulse rounded-full bg-muted"
            />
          ))}
        </div>
      </MenuHero>

      <section className="min-h-125">
        <div className="mx-auto max-w-7xl">
          <div className="border-x border-border/50">
            {/* The counter's name and its count */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 px-5 py-8 sm:px-8">
              <div className="h-8 w-44 animate-pulse rounded bg-muted" />
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
            </div>

            {/* Plates, three to a row */}
            <div className="grid gap-4 px-5 py-10 sm:grid-cols-2 sm:gap-5 sm:px-8 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col rounded-2xl border border-border/60 bg-card p-2"
                >
                  <div className="aspect-square w-full animate-pulse rounded-xl bg-muted" />

                  <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="h-5 w-28 animate-pulse rounded bg-muted" />
                      <div className="h-4 w-14 animate-pulse rounded bg-muted" />
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="h-3 w-full animate-pulse rounded bg-muted" />
                      <div className="h-3 w-3/5 animate-pulse rounded bg-muted" />
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-3">
                      <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
                      <div className="h-9 w-28 animate-pulse rounded-full bg-muted" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
