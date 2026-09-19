/**
 * The journal's header.
 *
 * Drawn in the same language as the menu and offers boards — the shared
 * backdrop, the pill badge, the gradient headline — so arriving here reads as
 * turning a page rather than landing on a different site. Pulled up under the
 * sticky bar exactly as those are, so the transparent header sits on the
 * hero's own art instead of on flat page background.
 */

import { BeamBorder } from "../../_components/home/BeamBorder";
import { HeroBackdrop } from "../../_components/home/HeroBackdrop";

export function BlogHero() {
  return (
    <section
      aria-labelledby="blog-hero-heading"
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
            Journal
          </span>
          Written behind the counter
        </p>

        <h1
          id="blog-hero-heading"
          className="mx-auto mt-5 max-w-[16ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[38px] leading-[1.06] font-medium tracking-[-0.04em] text-balance text-transparent sm:text-[54px]"
        >
          Notes from behind the counter
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-pretty text-muted-foreground sm:text-[17px]">
          How the food gets made, who makes it, and what we learned getting it
          right — written by the people at the pass.
        </p>
      </div>
    </section>
  );
}
