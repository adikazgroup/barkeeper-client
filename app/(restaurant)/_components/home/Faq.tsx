"use client";

/**
 * Questions.
 *
 * Same frame as the sections above: the ruled max-w-7xl box, a header row,
 * then two halves split by a line rather than a gutter. The left half stays
 * put while the answers scroll — it is short, and pinning it keeps the way out
 * (write to a person) in view for the whole section.
 *
 * One answer is open at a time. Six or eight expanded answers make a section
 * nobody can scan, and the closed rows are the index.
 */

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { featuredFaq } from "@/lib/dummyData";
import { FaqAccordion } from "../FaqAccordion";

/** Horizontal padding lives on each cell so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

/* ---------------------------------------------------------------- section */

export function Faq() {
  return (
    <section id="faq" className="border-t border-border/50">
      <div className="mx-auto max-w-7xl">
        <div className="border-x border-border/50">
          <Reveal className="flex items-center justify-between gap-5 border-b border-border/50 px-5 py-10 sm:px-8">
            <h2 className="max-w-[18ch] text-[30px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[40px]">
              Questions, before you ask them
            </h2>
            <p className="max-w-[44ch] text-[14px] leading-[1.65] text-muted-foreground">
              Setup, languages, what the agent will and will not say — and what
              happens the day you want to take a thread back.
            </p>
          </Reveal>

          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            {/* left — the way out, pinned ------------------------------- */}
            <div className="relative isolate overflow-hidden border-b border-border/50 lg:border-b-0 lg:border-r">

              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 opacity-[0.10] grayscale dark:opacity-[0.07]"
                style={{
                  maskImage:
                    "linear-gradient(180deg, transparent 0%, #000 45%, #000 100%)",
                  WebkitMaskImage:
                    "linear-gradient(180deg, transparent 0%, #000 45%, #000 100%)",
                }}
              >
                <Image
                  src="/cta.png"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 460px"
                  className="object-cover object-center"
                />
              </div>

              <Reveal className={cn("py-9 lg:sticky lg:top-24", CELL)}>
                <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                  Still unsure?
                </p>
                <p className="mt-4 max-w-[24ch] text-[21px] font-medium leading-[1.35] tracking-[-0.02em]">
                  Ask us anything — a person answers, usually the same day.
                </p>

                <p className="mt-4 max-w-[42ch] text-[12.5px] leading-[1.7] text-muted-foreground">
                  Or start free and connect one channel first — no card, and
                  nothing installed on your site.
                </p>

                {/* Last, so the column reads statement → caveat → action. */}
                <Link
                  href="/contact"
                  className="mt-7 inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-[13px] font-medium transition-colors duration-200 hover:border-primary/30 hover:text-primary"
                >
                  Write to us
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden
                    className="size-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h13M12 5.5 18.5 12 12 18.5" />
                  </svg>
                </Link>
              </Reveal>
            </div>

            {/* right — the answers -------------------------------------- */}
            {/* The section that follows draws its own top rule, so the last
                row must not draw a bottom one — the two would stack. */}
            <Reveal delay={0.08}>
              <FaqAccordion items={featuredFaq()} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
