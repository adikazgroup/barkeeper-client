import { BeamBorder } from "../../_components/home/BeamBorder";
import { HeroBackdrop } from "../../_components/home/HeroBackdrop";


export function CheckoutHero() {
  return (
    <section
      aria-labelledby="checkout-hero-heading"
      className="relative -mt-16 overflow-hidden border-b border-border/50"
    >
      <HeroBackdrop />

      <div className="relative mx-auto max-w-7xl border-x border-border/50 px-5 pb-14 text-center sm:px-8 sm:pb-16  pt-28">
        <p className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card/20 py-1.5 pr-4 pl-2 text-[12px] font-medium text-muted-foreground backdrop-blur-sm">
          <BeamBorder />
          <span
            aria-hidden
            className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold tracking-wide text-background uppercase"
          >
            Checkout
          </span>
          Collection from the counter
        </p>

        <h1
          id="checkout-hero-heading"
          className="mx-auto mt-5 max-w-[18ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[38px] leading-[1.06] font-medium tracking-[-0.04em] text-balance text-transparent sm:text-[54px]"
        >
          When would you like it
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-pretty text-muted-foreground sm:text-[17px]">
          Pick a time, leave the kitchen a note if you need to, and pay on the
          next screen. Nothing is charged until you do.
        </p>
      </div>
    </section>
  );
}
