/**
 * Six plates, photographed.
 *
 * The board above says what the kitchen has headings for; this says what it
 * actually cooks. The photograph is the whole argument, so it takes the top of
 * the card and the words underneath stay to a line of description and a price —
 * a visitor deciding whether to order is choosing between pictures, not
 * reading paragraphs.
 *
 * Which plates these are is the admin's call, not a developer's: the rail is
 * `GET /foods?isFeatured=true`, which returns the featured foods already in
 * `featuredSorting` order. Re-ordering the rail in the admin re-orders it here.
 */

import { getFeaturedFoods } from "@/lib/foods";
import { cn } from "@/lib/utils";

import { Reveal } from "./Reveal";
import { PopularDishesGrid } from "./PopularDishesGrid";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

/** Two full rows of three at the widest layout, and no orphan on the third. */
const RAIL_SIZE = 6;

export async function PopularDishes() {
  const foods = await getFeaturedFoods({ limit: RAIL_SIZE });

  // Nothing featured, or the API is unreachable: the section does not draw at
  // all rather than heading an empty grid.
  if (foods.length === 0) return null;

  return (
    <section id="popular" className="border-t border-border/50">
      <div className="mx-auto max-w-7xl">
        <div className="border-x border-border/50">
          <Reveal
            className={cn(
              "flex flex-wrap items-center justify-between gap-5 border-b border-border/50 py-10",
              CELL,
            )}
          >
            <h2 className="max-w-[18ch] text-[30px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[40px]">
              What leaves the pass most
            </h2>
            <p className="max-w-[44ch] text-[14px] leading-[1.65] text-muted-foreground">
              The plates that carry the place. Everything is cooked when you
              order it, so nothing here has been sitting under a lamp.
            </p>
          </Reveal>

          <PopularDishesGrid foods={foods} />
        </div>
      </div>
    </section>
  );
}
