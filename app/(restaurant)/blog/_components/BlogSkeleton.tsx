export function BlogSkeleton() {
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Filter rail */}
      <div className="border-y border-primary/12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-3 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-9 w-20 animate-pulse rounded-md bg-primary/8"
              />
            ))}
          </div>
          <div className="h-10 w-full animate-pulse rounded-md bg-primary/8 lg:w-72" />
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-3 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-8 h-3 w-32 animate-pulse rounded bg-primary/8" />

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex h-full flex-col">
              <div className="aspect-4/3 w-full animate-pulse rounded-lg border border-primary/15 bg-primary/8" />

              <div className="flex flex-1 flex-col pt-5">
                <div className="flex gap-3">
                  <div className="h-2.5 w-24 animate-pulse rounded bg-primary/8" />
                  <div className="h-2.5 w-16 animate-pulse rounded bg-primary/8" />
                </div>
                <div className="mt-4 h-5 w-4/5 animate-pulse rounded bg-primary/8" />
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-primary/6" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-primary/6" />
                </div>
                <div className="mt-5 h-8 w-36 animate-pulse rounded-full bg-primary/8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
