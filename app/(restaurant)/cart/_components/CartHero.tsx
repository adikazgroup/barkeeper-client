import { BeamBorder } from "../../_components/home/BeamBorder";
import { HeroBackdrop } from "../../_components/home/HeroBackdrop";


export function CartHero({ children }: { children?: React.ReactNode }) {
  return (
    <section
      aria-labelledby="cart-hero-heading"
      className="relative -mt-16 overflow-hidden border-b border-border/50 "
    >
      <HeroBackdrop />

      <div className="relative mx-auto max-w-7xl border-x border-border/50 px-5 pb-14 text-center sm:px-8 sm:pb-16 pt-28">
        <p className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card/20 py-1.5 pr-4 pl-2 text-[12px] font-medium text-muted-foreground backdrop-blur-sm">
          <BeamBorder />
          <span
            aria-hidden
            className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold tracking-wide text-background uppercase"
          >
            Cart
          </span>
          Nothing is cooked until you send it
        </p>

        <h1
          id="cart-hero-heading"
          className="mx-auto mt-5 max-w-[18ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[38px] leading-[1.06] font-medium tracking-[-0.04em] text-balance text-transparent sm:text-[54px]"
        >
          Everything on your docket
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-pretty text-muted-foreground sm:text-[17px]">
          The plates you picked off the board, in one place. Change a size or a
          quantity here — the kitchen only hears about it once you send it.
        </p>

        {children && <div className="mt-9 sm:mt-10">{children}</div>}
      </div>
    </section>
  );
}
