import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { COMPANY } from "@/lib/dummyData";
import { ChevronRightIcon } from "@/components/icons/Icons";
import { HeroBackdrop } from "../_components/home";
import { BeamBorder } from "../_components/home/BeamBorder";
import { Reveal } from "../_components/home/Reveal";

export const metadata: Metadata = {
  title: "About — Barkeeper",
  description:
    "Why we built an AI agent for the shops that sell in Instagram and Messenger threads, and what we hold ourselves to while running it.",
};

/**
 * Padding sits on each cell, never on the column, so every rule reaches the
 * frame the way the marketing sections do.
 */
const CELL = "px-5 sm:px-8";

/* -------------------------------------------------------------------------- */
/*                                   CONTENT                                  */
/* -------------------------------------------------------------------------- */

/**
 * Figures the rest of the site already stands behind — the channels it
 * connects, the languages it answers in, the stores it writes to. Nothing here
 * is a business metric, because a number on an About page is a promise and
 * these are the ones the product actually keeps.
 */
const FACTS = [
  { value: "5", label: "Channels in one inbox" },
  { value: "3", label: "Languages, including Banglish" },
  { value: "4", label: "Store platforms, plus an API" },
  { value: "1", label: "Thread per customer" },
];

const BELIEFS = [
  {
    title: "Answer in the thread",
    body: "A customer who asks a price in a DM wants the price in that DM. Not a link to a website, not a ticket number, not a widget on a page they were never on.",
  },
  {
    title: "Never invent an answer",
    body: "The agent quotes the catalogue, the prices and the policies you gave it. Where it does not know, it stops and hands you the thread rather than guessing well.",
  },
  {
    title: "The shop keeps the last word",
    body: "You can open any conversation and take over mid-sentence. The agent steps back with the history intact, and hands back when you are done.",
  },
  {
    title: "Your data stays your data",
    body: "Conversations are used to answer that customer and to keep your agent's tone consistent. They are never shared with another shop, and never used to train general-purpose models.",
  },
];

/* -------------------------------------------------------------------------- */
/*                                  SECTIONS                                  */
/* -------------------------------------------------------------------------- */

/**
 * The opening. The hero's backdrop, badge and gradient headline return, so an
 * About page arriving from the footer reads as the same site rather than as a
 * document bolted onto it.
 */
function AboutHero() {
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
              About {COMPANY.name}
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-7 max-w-[19ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[40px] leading-[1.03] font-medium tracking-[-0.045em] text-transparent sm:text-[58px]">
              Built for shops that sell in the inbox
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-7 max-w-[54ch] text-[15px] leading-[1.7] text-muted-foreground sm:text-[16.5px]">
              In Bangladesh a shop is a conversation. The catalogue is a
              Facebook album, the storefront is an Instagram grid, and the
              checkout is someone typing a delivery address at eleven at night.
              We built the agent that keeps up with it.
            </p>
          </Reveal>
        </div>

        {/* The figures, ruled into the frame like the rest of the page. */}
        <div className="grid grid-cols-2 border-t border-border/50 lg:grid-cols-4">
          {FACTS.map((fact, index) => (
            <Reveal
              as="div"
              key={fact.label}
              delay={index * 0.05}
              y={12}
              // Rules only where two cells meet: a bottom rule on the top row
              // in two columns, none at all in four, and a right-hand rule on
              // every cell that is not last in its row.
              className={`border-border/50 max-lg:nth-[-n+2]:border-b max-lg:odd:border-r lg:not-nth-[4n]:border-r ${CELL} py-8`}
            >
              <p className="text-[clamp(2.2rem,4vw,2.9rem)] leading-none font-medium tracking-tighter">
                {fact.value}
              </p>
              <p className="mt-3 max-w-[22ch] text-[13px] leading-[1.6] text-muted-foreground">
                {fact.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Why the product exists, with the inbox itself as the supporting picture. */
function Story() {
  return (
    <section className="border-t border-border/50">
      <div className="mx-auto max-w-7xl border-x border-border/50">
        <Reveal
          className={`flex flex-col gap-5 border-b border-border/50 py-10 sm:flex-row sm:items-center sm:justify-between ${CELL}`}
        >
          <h2 className="max-w-[18ch] text-[30px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[40px]">
            Why we built it
          </h2>
          <p className="max-w-[44ch] text-[14px] leading-[1.65] text-muted-foreground">
            Not because inboxes are hard to read. Because there are more of them
            than there are hours, and the ones that go unanswered were going to
            be orders.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div
            className={`border-b border-border/50 py-11 lg:border-r lg:border-b-0 ${CELL}`}
          >
            <p className="max-w-[54ch] text-[15px] leading-[1.8] text-muted-foreground">
              Every shop we spoke to told a version of the same story. The
              messages arrive faster in the evening than anyone can type. A
              customer asks whether the blue one is left in medium, waits nine
              minutes, and buys it somewhere else. The size chart gets pasted
              for the fortieth time that week.
            </p>
            <p className="mt-5 max-w-[54ch] text-[15px] leading-[1.8] text-muted-foreground">
              None of that is a support problem. It is a sales problem wearing a
              support problem&rsquo;s clothes — and the tools built for it
              assumed a website with a checkout, which is not how these shops
              sell at all.
            </p>
            <p className="mt-5 max-w-[54ch] text-[15px] leading-[1.8] text-muted-foreground">
              So the agent works where the customer already is, reads from the
              stock you actually hold, and writes the order into the store when
              the conversation closes. The shop keeps its voice. The customer
              never learns there was software in the thread.
            </p>

            <Link
              href="/#how-it-works"
              className="group mt-9 inline-flex h-10 items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-4 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5"
            >
              See how it works
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
                <ChevronRightIcon className="size-4" />
              </span>
            </Link>
          </div>

          {/* The picture is framed the way the feature bento frames its own:
              a card ground with the image inset, so it reads as a held object
              rather than as a bleed.

              From `lg` up it carries no ratio of its own — it takes whatever
              height the prose beside it comes to, so the two columns end on
              the same line instead of the picture running on past the text.
              Stacked, there is nothing to match, so it keeps a 4:5 crop. */}
          <div className={`flex py-11 ${CELL}`}>
            <div className="flex flex-1 rounded-xl border border-border bg-card p-2">
              <div className="relative aspect-4/5 w-full overflow-hidden rounded-lg bg-muted lg:aspect-auto">
                <Image
                  src="/cta.png"
                  alt="A pass in service, with orders going out as they are called"
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The rules we hold the agent to — the part a merchant is really buying. */
function Beliefs() {
  return (
    <section className="border-t border-border/50">
      <div className="mx-auto max-w-7xl border-x border-border/50">
        <Reveal
          className={`flex flex-col gap-5 border-b border-border/50 py-10 sm:flex-row sm:items-center sm:justify-between ${CELL}`}
        >
          <h2 className="max-w-[18ch] text-[30px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[40px]">
            What we hold it to
          </h2>
          <p className="max-w-[44ch] text-[14px] leading-[1.65] text-muted-foreground">
            An agent answering as your shop is answering as you. These are the
            four rules we will not trade away for a better demo.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2">
          {BELIEFS.map((belief, index) => (
            <Reveal
              as="div"
              key={belief.title}
              delay={index * 0.06}
              y={12}
              // Four tiles: in one column the last has no rule beneath it, in
              // two the bottom row has none. Stated per breakpoint rather than
              // reset, so no two rules of equal weight can contradict.
              className={`border-border/50 max-sm:nth-[-n+3]:border-b sm:nth-[-n+2]:border-b sm:odd:border-r ${CELL} py-9`}
            >
              <span className="font-mono text-[10.5px] tabular-nums text-primary/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-[19px] leading-tight font-medium tracking-[-0.03em]">
                {belief.title}
              </h3>
              <p className="mt-3 max-w-[44ch] text-[13.5px] leading-[1.75] text-muted-foreground">
                {belief.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Who and where we are, kept to what the legal pages already say. */
function Where() {
  return (
    <section className="border-t border-border/50">
      <div className="mx-auto max-w-7xl border-x border-border/50">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
          <div
            className={`border-b border-border/50 py-11 lg:border-r lg:border-b-0 ${CELL}`}
          >
            <Reveal>
              <p className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
                Where we are
              </p>
              <p className="mt-5 text-[21px] leading-[1.35] font-medium tracking-[-0.02em]">
                {COMPANY.legalName}
              </p>
              <p className="mt-3 text-[14px] leading-[1.8] text-muted-foreground">
                {COMPANY.address.street}
                <br />
                {COMPANY.address.locality}
              </p>

              <a
                href={`mailto:${COMPANY.email}`}
                className="mt-7 inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-[13px] font-medium transition-colors duration-200 hover:border-primary/30 hover:text-primary"
              >
                {COMPANY.email}
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
              </a>
            </Reveal>
          </div>

          <div className={`py-11 ${CELL}`}>
            <Reveal delay={0.08}>
              <p className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
                The short version
              </p>
              <p className="mt-5 max-w-[46ch] text-[24px] leading-[1.25] font-medium tracking-[-0.035em] sm:text-[30px]">
                We are a small team in Dhaka building for shops we can go and
                visit.
              </p>
              <p className="mt-5 max-w-[52ch] text-[14px] leading-[1.75] text-muted-foreground">
                That is deliberate. The product is shaped by sitting with people
                while their inbox fills up, not by guessing at it from a
                different market — which is also why Bangla, English and the mix
                of the two were in the first version rather than the fourth.
              </p>
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

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Story />
      <Beliefs />
      <Where />
    </>
  );
}
