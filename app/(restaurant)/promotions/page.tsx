import type { Metadata } from "next";

import { BeamBorder } from "../_components/home/BeamBorder";
import { HeroBackdrop } from "../_components/home/HeroBackdrop";
import { PromotionsGrid } from "../_components/home/PromotionsGrid";
import { getLivePromotions } from "@/lib/promotions";
import { cn } from "@/lib/utils";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

/**
 * Far more than the kitchen would ever run at once, so the page is the whole
 * board rather than the first page of it. The endpoint defaults to 10.
 */
const EVERYTHING = 100;

export const metadata: Metadata = {
  title: "Offers — Barkeeper",
  description:
    "Every deal the kitchen is running right now, in the order it put them on.",
};

export default async function PromotionsPage() {
  const promotions = await getLivePromotions({ limit: EVERYTHING });

  return (
    <main>
      {/* Drawn in the same language as the menu's header — shared backdrop,
          pill badge, gradient headline — so arriving here reads as turning a
          page rather than landing on a different site. */}
      <section
        aria-labelledby="offers-hero-heading"
        className="relative -mt-16 overflow-hidden border-b border-border/50 pt-28"
      >
        <HeroBackdrop />

        <div className="relative mx-auto max-w-7xl border-x border-border/50 px-5 pb-14 text-center sm:px-8 sm:pb-16">
          <p className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card/20 py-1.5 pr-4 pl-2 text-[12px] font-medium text-muted-foreground backdrop-blur-sm">
            <BeamBorder />
            <span
              aria-hidden
              className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold tracking-wide text-background uppercase"
            >
              Offers
            </span>
            What the kitchen is running this week
          </p>

          <h1
            id="offers-hero-heading"
            className="mx-auto mt-5 max-w-[16ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[38px] leading-[1.06] font-medium tracking-[-0.04em] text-balance text-transparent sm:text-[54px]"
          >
            Every offer that is on
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-pretty text-muted-foreground sm:text-[17px]">
            Deals change when the week does. Everything below is live right now
            — when one ends it simply leaves the board.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl">
        <div className="border-x border-border/50">
          {promotions.length === 0 ? (
            <p
              className={cn(
                "py-24 text-center text-[14px] leading-[1.7] text-muted-foreground",
                CELL,
              )}
            >
              Nothing is running just now. The kitchen puts new deals on when
              the week turns — worth looking again in a few days.
            </p>
          ) : (
            <PromotionsGrid promotions={promotions} />
          )}
        </div>
      </div>
    </main>
  );
}
