/**
 * The questions a visitor would otherwise have written the form to ask.
 *
 * The same accordion the home page and /faq use, on the same featured set, so
 * an answer is worded one way across the site. The full list lives at /faq —
 * this is the short way past the form, not a second copy of it.
 */

import Link from "next/link";
import { Phone } from "lucide-react";

import { cn } from "@/lib/utils";
import { COMPANY, featuredFaq } from "@/lib/dummyData";
import { Reveal } from "../../_components/home/Reveal";
import { FaqAccordion } from "../../_components/FaqAccordion";
import { TEL } from "../_data";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

export function FAQSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-t border-border/50"
    >
      <div className="mx-auto max-w-7xl">
        <div className="border-x border-border/50">
          <Reveal
            className={cn(
              "flex flex-wrap items-center justify-between gap-5 border-b border-border/50 py-10",
              CELL,
            )}
          >
            <h2
              id="faq-heading"
              className="max-w-[18ch] text-[30px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[40px]"
            >
              The ones we get asked most
            </h2>
            <p className="max-w-[44ch] text-[14px] leading-[1.65] text-muted-foreground">
              Straight answers, before you write. If yours is not here, ring the
              counter — someone will know it off the top of their head.
            </p>
          </Reveal>

          <Reveal>
            <FaqAccordion items={featuredFaq()} />
          </Reveal>

          {/* Still stuck */}
          <div
            className={cn(
              "flex flex-col items-start justify-between gap-5 border-t border-border/50 py-8 sm:flex-row sm:items-center",
              CELL,
            )}
          >
            <p className="max-w-[38ch] text-[17px] leading-[1.4] font-medium tracking-[-0.02em]">
              Still stuck? Ask us the way you&rsquo;d ask a neighbour.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/faq"
                className="inline-flex h-10 items-center rounded-full border border-border bg-card px-4 text-[13px] font-medium transition-colors duration-200 hover:border-primary/30 hover:text-primary"
              >
                Read every question
              </Link>

              <a
                href={TEL}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-[13px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5"
              >
                <Phone aria-hidden className="size-3.5" />
                {COMPANY.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
