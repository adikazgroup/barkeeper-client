/**
 * The deals the kitchen is running, read from its own list.
 *
 * `GET /promotions` returns only what is live, newest first, so nothing here
 * compares a date against the clock — whatever comes back is on. When the list
 * is empty, or the API is unreachable, the section does not draw at all rather
 * than heading an empty grid.
 *
 * One more than the page shows is asked for, which is how the section knows
 * whether there is a rest of the board to link to without a second request.
 */

import { getLivePromotions } from "@/lib/promotions";
import { cn } from "@/lib/utils";

import { Reveal } from "./Reveal";
import { PromotionsGrid } from "./PromotionsGrid";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

/** Two side by side is the widest the row goes. */
const ON_PAGE = 2;

export async function Promotions() {
  const live = await getLivePromotions({ limit: ON_PAGE + 1 });

  if (live.length === 0) return null;

  const hasMore = live.length > ON_PAGE;
  const shown = live.slice(0, ON_PAGE);

  return (
    <section id="offers" className="border-t border-border/50">
      <div className="mx-auto max-w-7xl">
        <div className="border-x border-border/50">
          <Reveal
            className={cn(
              "flex flex-wrap items-center justify-between gap-5 border-b border-border/50 py-10",
              CELL,
            )}
          >
            <h2 className="max-w-[18ch] text-[30px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[40px]">
              Offers worth clearing an evening for
            </h2>
            <p className="max-w-[44ch] text-[14px] leading-[1.65] text-muted-foreground">
              The kitchen runs a couple of deals at a time. They change when the
              week does, so what is here is what is on.
            </p>
          </Reveal>

          <PromotionsGrid
            promotions={shown}
            seeMoreHref={hasMore ? "/promotions" : undefined}
          />
        </div>
      </div>
    </section>
  );
}
