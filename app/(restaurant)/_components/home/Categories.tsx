"use client";

/**
 * The menu board, one card per heading, drifting past.
 *
 * A hungry visitor does not read a menu top to bottom — they decide whether
 * they want wings or a steak or a drink, and then they read. So the section is
 * the board's own headings, grouped into kitchen and bar exactly as they are
 * printed, and nothing else.
 *
 * No dish names and no prices on the cards. They are a way in, not the menu
 * itself: naming four dishes out of twelve picks an arbitrary four, and a price
 * here is a price that goes stale in two places instead of one. The count is
 * the one number worth carrying, because it says how much is behind the card.
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
  Wine,
} from "lucide-react";

import {
  categoriesInGroup,
  MENU_CATEGORIES,
  MENU_GROUPS,
  type MenuCategory,
  type MenuGroup,
  type MenuGroupId,
  type MenuIcon,
} from "@/lib/dummyData";
import { cn } from "@/lib/utils";

import { Reveal } from "./Reveal";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

/**
 * Cards in one half of a track before it repeats itself.
 *
 * The animation travels -50% to land exactly on the duplicate, so the two
 * halves have to match — and a half narrower than the screen would show its
 * own seam. A short group therefore goes round twice inside each half.
 */
const HALF_MINIMUM = 6;

/** Seconds per card, so both rows move at one speed whatever they hold. */
const SECONDS_PER_CARD = 10;

const CATEGORY_ICONS: Record<MenuIcon, LucideIcon> = {
  starters: Drumstick,
  salad: Salad,
  sandwich: Sandwich,
  mains: Beef,
  pasta: Soup,
  dessert: CakeSlice,
  cocktail: Martini,
  beer: Beer,
  wine: Wine,
  soft: CupSoda,
};

function Card({
  category,
  group,
  index,
  duplicate = false,
}: {
  category: MenuCategory;
  group: MenuGroup;
  /** Position on the whole board, printed on the card's shoulder. */
  index: number;
  /** A copy that exists only to close the loop. */
  duplicate?: boolean;
}) {
  const Icon = CATEGORY_ICONS[category.icon];

  return (
    <li
      aria-hidden={duplicate || undefined}
      className="flex w-70 shrink-0 sm:w-80"
    >
      <Link
        href={`/menu#${category.id}`}
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
          <span className="flex items-baseline gap-2">
            <span className="font-mono text-[15px] font-semibold tabular-nums">
              {String(index).padStart(2, "0")}
            </span>
            <span className="text-[13px] text-muted-foreground">
              {group.label}
            </span>
          </span>

          <span className="rounded-full border border-border px-3 py-1.5 text-[11.5px] whitespace-nowrap text-muted-foreground transition-colors duration-300 group-hover:border-primary/30 group-hover:text-primary">
            {category.items.length} {category.unit ?? group.unit}
          </span>
        </div>

        <span
          aria-hidden
          className="mx-auto mt-12 grid w-22 h-24 place-items-center rounded-[1.75rem] bg-muted text-muted-foreground transition-colors duration-300 group-hover:bg-primary/10 group-hover:text-primary"
        >
          <Icon className="size-9" strokeWidth={1.5} />
        </span>

        <h4 className="mt-12 text-[19px] leading-tight font-semibold tracking-[-0.02em]">
          {category.title}
        </h4>

        <p className="mx-auto mt-2.5 max-w-[30ch] text-[13px] leading-[1.7] text-muted-foreground">
          {category.blurb}
        </p>
      </Link>
    </li>
  );
}

function Row({ group, reverse }: { group: MenuGroup; reverse?: boolean }) {
  const categories = categoriesInGroup(group.id);

  const half =
    categories.length >= HALF_MINIMUM
      ? categories
      : [...categories, ...categories];

  const render = (duplicate: boolean) =>
    half.map((category, position) => (
      <Card
        key={`${duplicate ? "copy" : "row"}-${position}-${category.id}`}
        category={category}
        group={group}
        index={MENU_CATEGORIES.indexOf(category) + 1}
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


export function Categories({
  group: groupId,
  /** The section heading. Only the first group on the page carries it. */
  heading = false,
  reverse = false,
}: {
  group: MenuGroupId;
  heading?: boolean;
  reverse?: boolean;
}) {
  const group = MENU_GROUPS.find((candidate) => candidate.id === groupId);
  if (!group) throw new Error(`Unknown menu group: ${groupId}`);

  return (
    <section id={`menu-${group.id}`}>
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
              The kitchen&rsquo;s headings and the bar&rsquo;s, exactly as they
              are printed. Pick one and the menu opens at it.
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
            {group.title}
          </h3>
          <p className="text-[13px] leading-[1.6] text-muted-foreground">
            {group.blurb}
          </p>
        </Reveal>
      </Framed>

      <Row group={group} reverse={reverse} />
    </section>
  );
}
