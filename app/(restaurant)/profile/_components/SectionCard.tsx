import { cn } from "@/lib/utils";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

/**
 * One section of the account, drawn as a block of the page rather than a card
 * floating on it.
 *
 * The home page is built from ruled boxes — `max-w-7xl`, a rule down each side,
 * sections divided by more rules — so the account is too: each section is a row
 * of that frame, with what it is on the left and the fields on the right. At
 * `lg` that split is the whole point: the reader can scan the left column to
 * find the section they came for without reading a single field.
 */
export function SectionCard({
  title,
  description,
  icon,
  action,
  className,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  /** Sits under the description — a secondary action for the section. */
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn("border-b border-border/50", className)}
    >
      <div
        className={cn(
          "grid gap-x-10 gap-y-6 py-9 sm:py-10 lg:grid-cols-[17rem_1fr]",
          CELL,
        )}
      >
        <div className="lg:sticky lg:top-32 lg:self-start">
          {icon && (
            <span
              aria-hidden
              className="mb-4 grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground"
            >
              {icon}
            </span>
          )}

          <h2 className="text-[20px] leading-[1.15] font-medium tracking-[-0.03em]">
            {title}
          </h2>

          {description && (
            <p className="mt-2.5 max-w-[42ch] text-[13px] leading-[1.7] text-muted-foreground">
              {description}
            </p>
          )}

          {action && <div className="mt-5">{action}</div>}
        </div>

        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
