/**
 * The menu board, one card per heading, drifting past.
 *
 * A hungry visitor does not read a menu top to bottom — they decide whether
 * they want wings or a steak or a salad, and then they read. So the section is
 * the board's own headings and nothing else.
 *
 * The headings come from `GET /categories`, the same tree the menu page and
 * the blog rail read, so a category the admin adds appears here without a
 * deploy. Nothing is hand-kept any more: the name, the line under it and the
 * count on the shoulder are all the API's.
 *
 * No dish names and no prices on the cards. They are a way in, not the menu
 * itself. The count is the one number worth carrying, because it says how much
 * is behind the card.
 *
 * The card itself is symmetrical — number and count on the shoulders, the mark
 * in the middle, the words underneath — so ten of them read as a set of plates
 * rather than ten paragraphs of different lengths.
 *
 * The two rows travel against each other, which reads as one board turning
 * rather than two lists running away. Both stop the moment a pointer or the
 * keyboard lands on them: every card is a link, and a moving link is one
 * nobody can hit.
 */

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

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

/**
 * Cards in one half of a track before it repeats itself.
 *
 * The animation travels -50% to land exactly on the duplicate, so the two
 * halves have to match — and a half narrower than the screen would show its
 * own seam. A short row therefore goes round twice inside each half.
 */
const HALF_MINIMUM = 6;

/** Seconds per card, so both rows move at one speed whatever they hold. */
const SECONDS_PER_CARD = 10;

/**
 * A mark for the headings we know about, by slug.
 *
 * Deliberately a lookup with a fallback rather than a field on the category:
 * the public API exposes no icon, and a heading the kitchen invents tomorrow
 * should still draw a card rather than break one.
 */
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
  /** Position on the whole board, printed on the card's shoulder. */
  index: number;
  /** A copy that exists only to close the loop. */
  duplicate?: boolean;
}) {
  const Icon = CATEGORY_ICONS[category.slug] ?? UtensilsCrossed;

  // A heading with sub-headings is counted in those instead: "2 sections" says
  // more about what is behind the card than the dishes filed directly on it.
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
        href={`/menu#${category.slug}`}
        tabIndex={duplicate ? -1 : undefined}
        className={cn(
          "group relative flex w-full flex-col rounded-xl border border-border/60 bg-card p-7 text-center",
          "transition-[background-color,border-color,box-shadow] duration-300 ease-out",
          "hover:border-primary/30 hover:shadow-[0_28px_60px_-40px_rgba(0,0,0,0.5)]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        )}
      >
        {/* The shoulders: where it sits on the board, and how much is in it. */}
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[15px] font-semibold tabular-nums">
            {String(index).padStart(2, "0")}
          </span>

          <span className="rounded-full border border-border px-3 py-1.5 text-[11.5px] whitespace-nowrap text-muted-foreground transition-colors duration-300 group-hover:border-primary/30 group-hover:text-primary">
            {count} {count === 1 ? one : many}
          </span>
        </div>

        <span
          aria-hidden
          className="mx-auto mt-12 grid h-24 w-22 place-items-center rounded-[1.75rem] bg-muted text-muted-foreground transition-colors duration-300 group-hover:bg-primary/10 group-hover:text-primary"
        >
          <Icon className="size-9" strokeWidth={1.5} />
        </span>

        <h4 className="mt-12 text-[19px] leading-tight font-semibold tracking-[-0.02em]">
          {category.name}
        </h4>

        {category.description && (
          <p className="mx-auto mt-2.5 line-clamp-3 max-w-[30ch] text-[13px] leading-[1.7] text-muted-foreground">
            {category.description}
          </p>
        )}
      </Link>
    </li>
  );
}

function Row({
  categories,
  offset,
  reverse,
}: {
  categories: CategoryNode[];
  /** How many cards the earlier row already numbered. */
  offset: number;
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
        index={offset + (position % categories.length) + 1}
        duplicate={duplicate}
      />
    ));

  return (
    <div className="marquee-mask overflow-hidden border-t border-border/50 py-10">
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
  /**
   * Which stretch of the tree this row draws. The API has no notion of a
   * group, so the board is simply cut in two and the halves are hung in
   * different places on the page.
   */
  part = "first",
  /** The row label and the line beside it — editorial, so the page writes it. */
  title,
  blurb,
  /** The section heading. Only the first row on the page carries it. */
  heading = false,
  reverse = false,
}: {
  part?: "first" | "second";
  title: string;
  blurb: string;
  heading?: boolean;
  reverse?: boolean;
}) {
  const tree = await getCategoryTree();

  // Nothing on the board, or the API is unreachable: a section with no cards
  // in it is worse than no section, so it does not draw at all.
  if (tree.length === 0) return null;

  const split = Math.ceil(tree.length / 2);
  const categories =
    part === "first" ? tree.slice(0, split) : tree.slice(split);
  const offset = part === "first" ? 0 : split;

  // A tree short enough to fill one row leaves the second with nothing.
  if (categories.length === 0) return null;

  return (
    <section id={`menu-${part}`}>
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
            "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5 border-border/50 bg-card/20 py-5",
            // Without a heading above it, this row opens the section.
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

      <Row categories={categories} offset={offset} reverse={reverse} />
    </section>
  );
}
