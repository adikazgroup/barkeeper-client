import { cn } from "@/lib/utils";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

/**
 * One section of the account, drawn as a block of the page rather than a card
 * floating on it.
 *
 * Its heading sits across the top, the way every marketing section's does —
 * title on the left, the line about it on the right — and the fields get the
 * whole width beneath. Set beside the fields instead, the heading holds a
 * column of its own that is empty for most of the section's height, which on
 * an account made of short forms is a third of the page spent on two lines of
 * text.
 */
export function SectionCard({
  title,
  description,
  icon,
  className,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("border-b border-border/50", className)}>
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-b border-border/50 py-6",
          CELL,
        )}
      >
        <h2 className="flex items-center gap-2.5 text-[20px] leading-[1.15] font-medium tracking-[-0.03em]">
          {icon && (
            <span
              aria-hidden
              className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-card text-muted-foreground"
            >
              {icon}
            </span>
          )}
          {title}
        </h2>

        {description && (
          <p className="max-w-[48ch] text-[13px] leading-[1.7] text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <div className={cn("py-8 sm:py-9", CELL)}>{children}</div>
    </section>
  );
}
