import type { Metadata } from "next";
import Link from "next/link";

import { FAQ_CATEGORIES, FAQ_ITEMS, faqByCategory } from "@/lib/dummyData";
import { COMPANY, LEGAL_PAGES } from "@/lib/dummyData";
import { ChevronRightIcon } from "@/components/icons/Icons";
import { HeroBackdrop } from "../_components/home";
import { BeamBorder } from "../_components/home/BeamBorder";
import { Reveal } from "../_components/home/Reveal";
import { FaqAccordion } from "../_components/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ — Barkeeper",
  description:
    "Setup, languages, what the agent will and will not say, which stores it syncs with, how billing works, and what happens to your customers' messages.",
};

/** Padding sits on each cell, so every rule reaches the frame. */
const CELL = "px-5 sm:px-8";

/**
 * Every question, as one structured document for search engines. The visible
 * accordion is the same content — this only states its shape.
 * See https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */
function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // The content is ours, not user input, and JSON.stringify escapes it.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                  SECTIONS                                  */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative -mt-16 isolate overflow-hidden pt-16">
      <HeroBackdrop />

      <div className="mx-auto max-w-7xl border-x border-border/50">
        <div
          className={`flex flex-col items-center pt-20 pb-16 text-center ${CELL}`}
        >
          <Reveal>
            <p className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card/20 py-1.5 pr-3.5 pl-2.5 font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase backdrop-blur-sm">
              <BeamBorder />
              <span className="relative flex size-1.5 shrink-0">
                <span className="relative size-1.5 rounded-full bg-primary" />
              </span>
              {FAQ_ITEMS.length} questions answered
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-7 max-w-[18ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[40px] leading-[1.03] font-medium tracking-[-0.045em] text-transparent sm:text-[58px]">
              Questions, before you ask them
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-7 max-w-[54ch] text-[15px] leading-[1.7] text-muted-foreground sm:text-[16.5px]">
              Setup, languages, what the agent will and will not say, which
              stores it writes to, how billing works, and what happens to your
              customers&rsquo; messages. If yours is not here, a person will
              answer it.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * The questions themselves.
 *
 * Grouped rather than presented as one long list: a visitor arrives with a
 * question that already belongs to a category, and twenty-four rows in a
 * single column is a list nobody scans. The category index sticks alongside
 * on wide screens, the way the policy pages carry their contents.
 */
function Questions() {
  return (
    <section className="border-t border-border/50">
      <div className="mx-auto max-w-7xl border-x border-border/50">
        <div className="grid lg:grid-cols-[16rem_minmax(0,1fr)]">
          {/* the index ------------------------------------------------- */}
          <nav
            aria-label="Question categories"
            className="border-b border-border/50 lg:border-r lg:border-b-0"
          >
            <div className={`py-10 lg:sticky lg:top-16 lg:py-9 ${CELL}`}>
              <p className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
                Jump to
              </p>

              <ol className="mt-5 space-y-1">
                {FAQ_CATEGORIES.map((category, index) => (
                  <li key={category.id}>
                    <a
                      href={`#${category.id}`}
                      className="group -mx-2 flex items-baseline gap-2.5 rounded-md px-2 py-1.5 text-[12.5px] leading-normal text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                    >
                      <span className="font-mono tabular-nums opacity-40 transition-opacity duration-200 group-hover:opacity-100">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {category.title}
                      <span className="ml-auto font-mono text-[10.5px] tabular-nums opacity-40">
                        {faqByCategory(category.id).length}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>

              <p className="mt-8 border-t border-border/50 pt-6 max-w-[28ch] text-[12.5px] leading-[1.7] text-muted-foreground">
                Still unsure? A person answers, usually the same day.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-[12.5px] font-medium transition-colors duration-200 hover:border-primary/30 hover:text-primary"
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
            </div>
          </nav>

          {/* the answers ----------------------------------------------- */}
          <div className="min-w-0">
            {FAQ_CATEGORIES.map((category, index) => (
              <section
                key={category.id}
                id={category.id}
                // Clears the fixed header when an index link jumps here.
                className="scroll-mt-24 border-border/50 [&:not(:last-child)]:border-b"
              >
                <Reveal
                  className={`flex flex-col gap-2 border-b border-border/50 py-8 ${CELL}`}
                >
                  <h2 className="flex items-baseline gap-3 text-[22px] leading-[1.2] font-medium tracking-[-0.035em] sm:text-[26px]">
                    <span className="font-mono text-[11px] tabular-nums text-primary/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {category.title}
                  </h2>
                  <p className="max-w-[52ch] pl-[1.6rem] text-[13.5px] leading-[1.65] text-muted-foreground">
                    {category.blurb}
                  </p>
                </Reveal>

                {/* Nothing is open by default here: with six groups on the
                    page, one open row per group is six answers expanded
                    before the reader has asked anything. */}
                <FaqAccordion
                  items={faqByCategory(category.id)}
                  defaultOpen={null}
                />
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Where a question goes when the list did not answer it. */
function StillStuck() {
  const privacy = LEGAL_PAGES.find((page) => page.href === "/privacy");

  return (
    <section className="border-t border-border/50">
      <div className="mx-auto max-w-7xl border-x border-border/50">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal
            className={`border-b border-border/50 py-11 lg:border-r lg:border-b-0 ${CELL}`}
          >
            <p className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
              Not answered here
            </p>
            <h2 className="mt-5 max-w-[20ch] text-[26px] leading-[1.15] font-medium tracking-[-0.035em] sm:text-[32px]">
              Ask us anything — a person answers
            </h2>
            <p className="mt-5 max-w-[48ch] text-[14px] leading-[1.75] text-muted-foreground">
              Usually the same day, and usually the person who would end up
              building whatever you are asking for. Write to {COMPANY.email} or
              use the form.
            </p>

            <Link
              href="/contact"
              className="group mt-8 inline-flex h-10 items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-4 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5"
            >
              Contact us
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
                <ChevronRightIcon className="size-4" />
              </span>
            </Link>
          </Reveal>

          <div className={`py-11 ${CELL}`}>
            <Reveal delay={0.08}>
              <p className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
                Read further
              </p>
              <ul className="mt-5 space-y-1">
                {[
                  { label: "Everything the kitchen has on", href: "/menu" },
                  { label: "What is on offer this week", href: "/promotions" },
                  { label: "Notes from behind the counter", href: "/blog" },
                  ...(privacy
                    ? [{ label: privacy.label, href: privacy.href }]
                    : []),
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group -mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-2.5 text-[13.5px] text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                    >
                      {link.label}
                      <span
                        aria-hidden
                        className="opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    PAGE                                    */
/* -------------------------------------------------------------------------- */

export default function FaqPage() {
  return (
    <main>
      <FaqJsonLd />
      <Hero />
      <Questions />
      <StillStuck />
    </main>
  );
}
