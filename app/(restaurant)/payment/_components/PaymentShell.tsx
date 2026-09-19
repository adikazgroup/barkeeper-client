import { BeamBorder } from "../../_components/home/BeamBorder";
import { HeroBackdrop } from "../../_components/home/HeroBackdrop";

/**
 * The frame the two return screens share.
 *
 * Stripe sends the customer back to one of two places and neither is a page
 * they navigated to, so both are drawn as one panel in the middle of the site's
 * own frame rather than as a full hero — the news is short, and there is one
 * thing to do next.
 */
export function PaymentShell({
  badge,
  children,
}: {
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <main>
      <section className="relative -mt-16 overflow-hidden pt-28 pb-20 sm:pb-28">
        <HeroBackdrop />

        <div className="relative mx-auto max-w-7xl border-x border-border/50 px-5 py-14 text-center sm:px-8 sm:py-16">
          <p className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card/20 py-1.5 pr-4 pl-2 text-[12px] font-medium text-muted-foreground backdrop-blur-sm">
            <BeamBorder />
            <span
              aria-hidden
              className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold tracking-wide text-background uppercase"
            >
              Payment
            </span>
            {badge}
          </p>

          <div className="mx-auto mt-8 max-w-xl">{children}</div>
        </div>
      </section>
    </main>
  );
}
