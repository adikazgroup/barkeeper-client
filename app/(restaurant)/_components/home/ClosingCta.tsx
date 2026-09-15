/**
 * The closing ask.
 *
 * The page ends where it began: the hero's live badge, its gradient headline
 * and its pill buttons all return, so the last screen reads as the bookend of
 * the first rather than as a new idea introduced at the bottom.
 *
 * This section stays inside the page's frame — max-w-7xl, border-x, the same
 * box every other section is drawn in. The full-bleed picture that used to sit
 * behind it now lives under the footer, where it closes the page instead of
 * competing with the ask.
 *
 * Nothing sits under the buttons. Everything a visitor still needs to know has
 * been said by now; a closing section that keeps talking after the ask is a
 * closing section that doesn't trust it.
 */

import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons/Icons";
import { BeamBorder } from "./BeamBorder";
import { Reveal } from "./Reveal";

export function ClosingCta() {
  return (
    <section
      id="start"
      className="relative isolate border-t border-border/50"
    >
      <div className="mx-auto max-w-7xl border-x border-border/50">
        {/* A panel rather than a bare stretch of page: the ask gets an edge of
            its own so it reads as the one thing left to do. */}
        <div className="relative isolate overflow-hidden bg-card/40 px-6 py-16 backdrop-blur-sm sm:px-10 ">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-40 left-1/2 size-155 max-w-[140%] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
            <div className="bg-grain absolute inset-0 opacity-[0.05] mix-blend-multiply dark:opacity-[0.07] dark:mix-blend-screen" />
          </div>

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
                Connect one channel and watch the agent handle the next ten
                conversations — in your voice, with your real stock. If it does
                not earn its place, cancel before the trial ends.
              </p>
            </Reveal>

            <Reveal
              delay={0.2}
              className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
            >
              <Link
                href="/menu"
                className="group inline-flex h-11 w-full items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-5 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
              >
                Order now
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
                  <ChevronRightIcon className="size-4" />
                </span>
              </Link>

              <Link
                href="/contact"
                className="inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-card/60 px-5 text-[14px] font-medium backdrop-blur-sm transition-colors duration-200 hover:bg-foreground hover:text-background sm:w-auto"
              >
                Talk to us
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
