import Link from "next/link";
import {
  type LucideIcon,
  Beef,
  Beer,
  CakeSlice,
  CupSoda,
  Drumstick,
  Martini,
  Salad,
  Sandwich,
  Soup,
  UtensilsCrossed,
  Wine,
} from "lucide-react";

import { getCategoryTree } from "@/lib/categories";
import type { CategoryNode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

const CELL = "px-5 sm:px-8";
const HALF_MINIMUM = 6;
const SECONDS_PER_CARD = 10;

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  wings: Drumstick,
  appetizers: Drumstick,
  starters: Drumstick,
  salads: Salad,
  "sides-salads": Salad,
  "side-orders": Salad,
  sandwiches: Sandwich,
  "burgers-sandwiches": Sandwich,
  entrees: Beef,
  plates: Beef,
  mains: Beef,
  pasta: Soup,
  dessert: CakeSlice,
  desserts: CakeSlice,
  cocktails: Martini,
  beer: Beer,
  wine: Wine,
  "non-alcoholic": CupSoda,
};

function Card({
  category,
  index,
  duplicate = false,
}: {
  category: CategoryNode;
  index: number;
  duplicate?: boolean;
}) {
  const Icon = CATEGORY_ICONS[category.slug] ?? UtensilsCrossed;

  const sections = category.subCategories?.length ?? 0;
  const count = sections > 0 ? sections : category.totalFoods;
  const [one, many] =
    sections > 0
      ? (["section", "sections"] as const)
      : (["dish", "dishes"] as const);

  return (
    <li
      aria-hidden={duplicate || undefined}
      className="flex w-70 shrink-0 sm:w-80"
    >
      <Link
        href={`/menu?category=${category.slug}`}
        tabIndex={duplicate ? -1 : undefined}
        className={cn(
          "group relative flex w-full flex-col rounded-2xl border border-border/60 bg-card/30 p-7 text-center",
          "transition-[background-color,border-color,box-shadow] duration-300 ease-out",
          "hover:border-primary/30 hover:shadow-[0_28px_60px_-40px_rgba(0,0,0,0.5)]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        )}
      >
        {/* The shoulders: where it sits on the board, and how much is in it. */}
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[15px] font-semibold tabular-nums text-muted-foreground ">
            {String(index).padStart(2, "0")}
          </span>

          <span className="rounded-full border border-border px-3 py-1.5 text-[11.5px] whitespace-nowrap text-muted-foreground transition-colors duration-300 group-hover:border-primary/30 group-hover:text-primary">
            {count} {count === 1 ? one : many}
          </span>
        </div>

        <span
          aria-hidden
          className="mx-auto mt-16 grid h-24 w-22 place-items-center rounded-[1.75rem] bg-muted text-muted-foreground transition-colors duration-300  group-hover:text-primary"
        >
          <Icon className="size-9" strokeWidth={1.5} />
        </span>

        <h4 className="mt-16 text-[19px] leading-tight text-primary font-semibold tracking-[-0.02em] group-hover:text-foreground">
          {category.name}
        </h4>

        {category.description && (
          <p className="mx-auto mt-2.5 line-clamp-2 max-w-[30ch] text-[13px] leading-[1.7] text-muted-foreground">
            {category.description}
          </p>
        )}
      </Link>
    </li>
  );
}

function Row({
  categories,
  reverse,
}: {
  categories: CategoryNode[];
  reverse?: boolean;
}) {
  const half =
    categories.length >= HALF_MINIMUM
      ? categories
      : [...categories, ...categories];

  const render = (duplicate: boolean) =>
    half.map((category, position) => (
      <Card
        key={`${duplicate ? "copy" : "row"}-${position}-${category._id}`}
        category={category}
        index={(position % categories.length) + 1}
        duplicate={duplicate}
      />
    ));

  return (
    <div className="border-t border-border/50 py-10">
      <div className="marquee-mask overflow-hidden">
        <ul
          className={cn(
            "marquee-pausable flex w-max gap-4 sm:gap-5",
            reverse ? "animate-marquee-reverse" : "animate-marquee",
          )}
          style={
            {
              "--marquee-duration": `${half.length * SECONDS_PER_CARD}s`,
            } as React.CSSProperties
          }
        >
          {render(false)}
          {render(true)}
        </ul>
      </div>
    </div>
  );
}

/** The headings keep the page's frame; the track below them does not. */
function Framed({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="border-x border-border/50">{children}</div>
    </div>
  );
}

export async function Categories({
  /** The row label and the line beside it — editorial, so the page writes it. */
  title,
  blurb,
  /** The section heading, which the row above the track does not repeat. */
  heading = false,
  reverse = false,
}: {
  title: string;
  blurb: string;
  heading?: boolean;
  reverse?: boolean;
}) {
  const categories = await getCategoryTree();

  if (categories.length === 0) return null;

  return (
    <section id="menu">
      {heading && (
        <Framed>
          <Reveal
            className={cn(
              "flex flex-wrap items-center justify-between gap-5 border-y border-border/50 py-10",
              CELL,
            )}
          >
            <h2 className="max-w-[18ch] text-[30px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[40px]">
              Start with what you are in the mood for
            </h2>
            <p className="max-w-[44ch] text-[14px] leading-[1.65] text-muted-foreground">
              The kitchen&rsquo;s headings, exactly as they are printed. Pick
              one and the menu opens at it.
            </p>
          </Reveal>
        </Framed>
      )}

      <Framed>
        <Reveal
          y={12}
          className={cn(
            "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5 border-border/50  py-5",
            !heading && "border-t",
            CELL,
          )}
        >
          <h3 className="font-mono text-[10.5px] tracking-[0.16em] text-foreground uppercase">
            {title}
          </h3>
          <p className="text-[13px] leading-[1.6] text-muted-foreground">
            {blurb}
          </p>
        </Reveal>
      </Framed>

      <Row categories={categories} reverse={reverse} />
    </section>
  );
}
