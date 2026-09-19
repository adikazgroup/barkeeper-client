import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { COMPANY } from "@/lib/dummyData";
import { ChevronRightIcon } from "@/components/icons/Icons";
import { ClosingCta, Faq, HeroBackdrop } from "../_components/home";
import { BeamBorder } from "../_components/home/BeamBorder";
import { Reveal } from "../_components/home/Reveal";

export const metadata: Metadata = {
  title: "About — Barkeeper’s",
  description:
    "A lively neighbourhood Irish bar in Hill East, Washington DC — award-winning wings, pub favourites, rotating taps and a room that fills up most nights.",
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
  { value: "11am", label: "Kitchen on, seven days" },
  { value: "2am", label: "Last call, every night" },
  { value: "16", label: "Taps, rotating" },
  { value: "1", label: "Neighbourhood bar in Hill East" },
];

const BELIEFS = [
  {
    title: "No stiff rules",
    body: "There is no dress code, no minimum spend and no wrong time to order wings. Come as you are, sit as long as you like, and order whatever you actually feel like eating.",
  },
  {
    title: "Fresh, or not at all",
    body: "Produce comes in that morning and the wings are brined the same day they are served. Nothing gets held over to save a delivery — if it is not right, it does not go on the board.",
  },
  {
    title: "The pour is worth the wait",
    body: "A Guinness is pulled, left to settle, then topped. It takes the time it takes. The same goes for anything off the grill — hot and right beats quick and grey.",
  },
  {
    title: "Everyone gets the same welcome",
    body: "Regulars and first-timers are served by the same people in the same way. Friendly faces are not a policy we wrote down, they are just who is behind the bar.",
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
            <h1 className="mt-7 max-w-[14ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[40px] leading-[1.03] font-medium tracking-[-0.045em] text-transparent sm:text-[58px]">
              A neighbourhood bar in Hill East
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-7 max-w-[54ch] text-[15px] leading-[1.7] text-muted-foreground sm:text-[16.5px]">
              Award-winning wings, pub favourites and a properly poured
              Guinness, on a corner of Southeast DC. Fresh pours, tasty bites,
              and a room that is easy to spend an evening in.
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

/** What the place is, with the room itself as the supporting picture. */
function Story() {
  return (
    <section className="border-t border-border/50">
      <div className="mx-auto max-w-7xl border-x border-border/50">
        <Reveal
          className={`flex flex-col gap-5 border-b border-border/50 py-10 sm:flex-row sm:items-center sm:justify-between ${CELL}`}
        >
          <h2 className="max-w-[18ch] text-[30px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[40px]">
            What the place is
          </h2>
          <p className="max-w-[44ch] text-[14px] leading-[1.65] text-muted-foreground">
            An Irish bar that happens to take its kitchen seriously — or a
            kitchen that happens to have a very good bar attached. Nobody has
            settled the argument.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div
            className={`border-b border-border/50 py-11 lg:border-r lg:border-b-0 ${CELL}`}
          >
            <p className="max-w-[54ch] text-[15px] leading-[1.8] text-muted-foreground">
              Hill East is a neighbourhood before it is a destination, and this
              is a neighbourhood bar. People come in after work without booking,
              sit at the same end of the bar they always do, and stay longer
              than they meant to. That is the whole ambition.
            </p>
            <p className="mt-5 max-w-[54ch] text-[15px] leading-[1.8] text-muted-foreground">
              The wings are what people tell their friends about, and they have
              the awards to back it up. Beyond those there are gourmet burgers
              on hand-pressed beef with melty cheddar and house sauce, and the
              pub favourites you would hope to find.
            </p>
            <p className="mt-5 max-w-[54ch] text-[15px] leading-[1.8] text-muted-foreground">
              Behind the bar: Guinness poured the way it should be, taps that
              rotate often enough to be worth asking about, craft cocktails that
              do not take themselves too seriously, and a shelf of single malts
              for the nights that call for one.
            </p>

            <Link
              href="/menu"
              className="group mt-9 inline-flex h-10 items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-4 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5"
            >
              See the menu
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
                  alt="The bar in service on a busy evening"
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

/** The four things the bar holds itself to, whatever the night is doing. */
function Beliefs() {
  return (
    <section className="border-t border-border/50">
      <div className="mx-auto max-w-7xl border-x border-border/50">
        <Reveal
          className={`flex flex-col gap-5 border-b border-border/50 py-10 sm:flex-row sm:items-center sm:justify-between ${CELL}`}
        >
          <h2 className="max-w-[18ch] text-[30px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[40px]">
            What we hold ourselves to
          </h2>
          <p className="max-w-[44ch] text-[14px] leading-[1.65] text-muted-foreground">
            Four things that do not change, whether the room is empty on a wet
            Tuesday or three deep at the bar on a Saturday.
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
                Come hungry, leave smiling. That is the entire business plan.
              </p>
              <p className="mt-5 max-w-[52ch] text-[14px] leading-[1.75] text-muted-foreground">
                No stiff rules, no velvet rope, no minimum spend — just good
                flavours and friendly faces. Walk in on a weekday and we will
                seat you. Thursday to Sunday evening fills up, so book a table
                and it is held for you.
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
      <Faq />
    </>
  );
}
