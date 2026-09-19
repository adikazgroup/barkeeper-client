

import Link from "next/link";

import { BeamBorder } from "./BeamBorder";
import { ClosingCtaForm } from "./ClosingCtaForm";
import { CtaSideArt } from "./CtaSideArt";
import { Reveal } from "./Reveal";

export function ClosingCta() {
  return (
    <section
      id="start"
      className="relative isolate border-t border-border/50"
    >
      <div className="mx-auto max-w-7xl border-x border-border/50">
        <div className="relative isolate overflow-hidden  px-6 py-16 backdrop-blur-sm sm:px-10 ">
          <CtaSideArt />

          <div className="flex flex-col items-center text-center">
            <Reveal>
              <p className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card/60 py-1.5 pr-3.5 pl-2.5 font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase backdrop-blur-sm">
                <BeamBorder />
                <span className="relative flex size-1.5 shrink-0">
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary/50 motion-reduce:hidden" />
                  <span className="relative size-1.5 rounded-full bg-primary" />
                </span>
                Your inbox is filling up right now
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-7 max-w-[17ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[36px] leading-[1.04] font-medium tracking-[-0.045em] text-transparent sm:text-[54px]">
                Someone is asking about a price right now
              </h2>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-6 max-w-[60ch] text-[15px] leading-[1.7] text-muted-foreground sm:text-[16px]">
                The kitchen writes now and then — a new dish on the board, a
                quiet weeknight offer, the odd late opening. Nothing else.
              </p>
            </Reveal>

            <Reveal
              delay={0.2}
              className="mt-9 flex w-full justify-center sm:w-auto"
            >
              <ClosingCtaForm />
            </Reveal>


            <Reveal delay={0.26}>
              <p className="mt-5 text-[12px] text-muted-foreground">
                Already on the list?{" "}
                <Link
                  href="/unsubscribe"
                  className="underline decoration-border underline-offset-4 transition-colors duration-200 hover:text-foreground hover:decoration-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Unsubscribe
                </Link>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
