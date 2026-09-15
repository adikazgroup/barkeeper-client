/**
 * The board's header.
 *
 * Drawn in the same language as the home page's hero — the shared backdrop,
 * the pill badge, the gradient headline — so arriving at the menu reads as
 * turning a page rather than landing on a different site. It is pulled up under
 * the sticky header exactly as the home hero is, so the transparent bar sits on
 * the hero's own art instead of on flat page background.
 *
 * `children` is the counter rail's slot: the tabs live in the hero so the
 * reader picks a counter before the plates start, and the skeleton can paint
 * the same header while the plates are still on their way.
 */

import { HeroBackdrop } from "../../_components/home/HeroBackdrop";
import { BeamBorder } from "../../_components/home/BeamBorder";

export function MenuHero({ children }: { children?: React.ReactNode }) {
  return (
    <section
      aria-labelledby="menu-hero-heading"
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
            Menu
          </span>
          Cooked to order, every order
        </p>

        <h1
          id="menu-hero-heading"
          className="mx-auto mt-5 max-w-[16ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[38px] leading-[1.06] font-medium tracking-[-0.04em] text-balance text-transparent sm:text-[54px]"
        >
          Everything the kitchen has on
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-pretty text-muted-foreground sm:text-[17px]">
          Hand-breaded in the morning, sauced to order, and sent out the minute
          it&rsquo;s ready. Pick a counter below and see what&rsquo;s on.
        </p>

        {children && <div className="mt-9 sm:mt-10">{children}</div>}
      </div>
    </section>
  );
}
