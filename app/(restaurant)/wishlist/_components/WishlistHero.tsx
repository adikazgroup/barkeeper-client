import { BeamBorder } from "../../_components/home/BeamBorder";
import { HeroBackdrop } from "../../_components/home/HeroBackdrop";

/** The band over the wishlist — drawn as the cart's is, so the two read as a pair. */
export function WishlistHero() {
  return (
    <section
      aria-labelledby="wishlist-hero-heading"
      className="relative -mt-16 overflow-hidden border-b border-border/50"
    >
      <HeroBackdrop />

      <div className="relative mx-auto max-w-7xl border-x border-border/50 px-5 pt-24 pb-12 text-center sm:px-8 sm:pt-28 sm:pb-16">
        <p className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card/20 py-1.5 pr-4 pl-2 text-[12px] font-medium text-muted-foreground backdrop-blur-sm">
          <BeamBorder />
          <span
            aria-hidden
            className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold tracking-wide text-background uppercase"
          >
            Wishlist
          </span>
          Saved for the next craving
        </p>

        <h1
          id="wishlist-hero-heading"
          className="mx-auto mt-5 max-w-[18ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[34px] leading-[1.08] font-medium tracking-[-0.04em] text-balance text-transparent sm:text-[54px] sm:leading-[1.06]"
        >
          The plates you keep coming back to
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-pretty text-muted-foreground sm:mt-6 sm:text-[17px]">
          Every dish you hearted, in one place. Add one to your cart whenever
          you are ready — it stays saved here either way.
        </p>
      </div>
    </section>
  );
}
