/**
 * Stands in while a form waits on the query string.
 *
 * `useSearchParams` suspends during prerender, so every screen that reads one
 * (the address carried over from register, the notice after a sign-out) needs a
 * boundary. This traces the same shape the form settles into, so the card does
 * not jump when it arrives — the card owns the width, so this sets none.
 */
export function AuthFormSkeleton({ fields = 2 }: { fields?: number }) {
  return (
    <div className="animate-pulse" aria-hidden>
      <div className="mb-6 flex flex-col items-center gap-3">
        <div className="h-7 w-44 rounded-lg bg-muted-foreground/15" />
        <div className="h-4 w-64 rounded bg-muted-foreground/10" />
      </div>

      <div className="mb-6 flex gap-3">
        <div className="h-11 flex-1 rounded-lg bg-muted-foreground/10" />
        <div className="h-11 flex-1 rounded-lg bg-muted-foreground/10" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-3 w-24 rounded bg-muted-foreground/15" />
            <div className="h-11 w-full rounded-lg bg-muted-foreground/10" />
          </div>
        ))}
        <div className="mt-6 h-11 w-full rounded-lg bg-primary/20" />
      </div>
    </div>
  );
}
