import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { COMPANY, LEGAL_PAGES, POLICY_EFFECTIVE_DATE } from "@/lib/dummyData";
import { BeamBorder } from "../../_components/home/BeamBorder";
import { Reveal } from "../../_components/home/Reveal";
import { LegalContents } from "./LegalContents";

export interface LegalSection {
  /** Anchor target — also what the contents list links to. */
  id: string;
  title: string;
  body: ReactNode;
}

/**
 * Horizontal padding lives on each cell rather than on the grid, so the rules
 * between cells can reach the edges of the ruled frame — the same trick the
 * marketing sections use.
 */
const CELL = "px-5 sm:px-8";

/* -------------------------------------------------------------------------- */
/*                                 PRIMITIVES                                 */
/* -------------------------------------------------------------------------- */

/**
 * Body copy. Legal text is read in long runs, so it is set a step larger and
 * a good deal looser than the rest of the site — that, rather than a narrow
 * column, is what keeps a wide measure readable.
 */
export function P({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 text-[15px] leading-[1.8] text-muted-foreground first:mt-0">
      {children}
    </p>
  );
}

/** A bulleted list of obligations, categories or examples. */
export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-5 space-y-3.5 text-[15px] leading-[1.75] text-muted-foreground">
      {children}
    </ul>
  );
}

/**
 * One item. The marker is a ringed dot rather than a plain bullet — the same
 * shape the marketing page uses for its channel and step markers, shrunk.
 */
export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="relative pl-6 before:absolute before:top-[0.62em] before:left-0 before:size-1.5 before:rounded-full before:bg-primary/60 before:ring-4 before:ring-primary/10">
      {children}
    </li>
  );
}

/** Emphasis inside body copy, for defined terms and the words that bind. */
export function B({ children }: { children: ReactNode }) {
  return <strong className="font-medium text-foreground">{children}</strong>;
}

/**
 * A boxed aside for the one or two points on a page that a reader must not
 * miss — the things that would otherwise only be discovered in a dispute.
 *
 * Carried on the card ground with a primary rule down the leading edge, so it
 * reads as a raised note rather than as another paragraph in a box.
 */
export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="relative mt-6 overflow-hidden rounded-lg border border-border/60 bg-card/50 py-4 pr-4 pl-5">
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-px bg-linear-to-b from-transparent via-primary/60 to-transparent"
      />
      <p className="font-mono text-[10px] tracking-[0.16em] text-primary/80 uppercase">
        Note
      </p>
      <div className="mt-2 text-[14.5px] leading-[1.75] text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

export function Table({
  head,
  rows,
}: {
  head: [string, string];
  rows: [string, string][];
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-lg border-collapse text-left text-[14.5px]">
          <thead>
            <tr className="bg-muted">
              {head.map((cell, index) => (
                <th
                  key={cell}
                  className={
                    "border-b border-border px-5 py-3.5 font-mono text-[10.5px] tracking-[0.14em] font-medium text-muted-foreground uppercase" +
                    (index === 0 ? " w-[34%] border-r border-border" : "")
                  }
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          {/* The frame draws the bottom edge, so the last row must not. */}
          <tbody className="[&>tr:last-child>td]:border-b-0">
            {rows.map(([term, meaning]) => (
              <tr
                key={term}
                className="transition-colors duration-200 hover:bg-muted/50"
              >
                <td className="border-r border-b border-border/70 px-5 py-3.5 align-top text-[14px] font-medium text-foreground">
                  {term}
                </td>
                <td className="border-b border-border/70 px-5 py-3.5 align-top leading-[1.7] text-muted-foreground">
                  {meaning}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * The contact block every policy closes with. The one place on a policy page
 * where the reader is invited to do something, so it gets the page's only
 * pill button.
 */
export function ContactSection({ subject }: { subject: string }) {
  return (
    <>
      <P>
        Questions about this policy can go to our team, who will answer within
        five working days.
      </P>

      <div className="relative mt-6 overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-6">
        <span
          aria-hidden
          className="bg-grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply dark:opacity-[0.07] dark:mix-blend-screen"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
              Write to us
            </p>
            <p className="mt-3 text-[15px] font-medium tracking-[-0.02em]">
              {COMPANY.legalName}
            </p>
            <p className="mt-2 text-[13.5px] leading-[1.8] text-muted-foreground">
              {COMPANY.address.street}
              <br />
              {COMPANY.address.locality}
            </p>
          </div>

          <a
            href={`mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}`}
            className="group inline-flex h-10 shrink-0 items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-4 text-[13.5px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5"
          >
            {COMPANY.email}
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
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
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  BACKDROP                                  */
/* -------------------------------------------------------------------------- */

function LegalBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute inset-0 isolate opacity-[0.22] dark:opacity-[0.11] dark:brightness-75"
        style={{
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 42%, rgb(0 0 0 / 0.55) 72%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 42%, rgb(0 0 0 / 0.55) 72%, transparent 100%)",
        }}
      >
        <Image
          src="/herobg2.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className=" object-bottom"
        />

        <div className="absolute inset-0 bg-background mix-blend-color" />
      </div>

      <div className="bg-grain absolute inset-0 opacity-[0.045] mix-blend-multiply dark:opacity-[0.07] dark:mix-blend-screen" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    SHELL                                   */
/* -------------------------------------------------------------------------- */

/** The circled arrow the cross-links carry, borrowed from the feature tiles. */
function Corner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={
        "grid size-7 shrink-0 place-items-center rounded-full border border-border bg-background/60 text-muted-foreground transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary " +
        (className ?? "")
      }
    >
      <svg
        viewBox="0 0 24 24"
        className="size-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 17 17 7" />
        <path d="M8 7h9v9" />
      </svg>
    </span>
  );
}

export function LegalShell({
  title,
  summary,
  sections,
  currentHref,
}: {
  title: string;
  summary: string;
  sections: LegalSection[];
  currentHref: string;
}) {
  const others = LEGAL_PAGES.filter((page) => page.href !== currentHref);

  return (
    <div>
      {/* The picture is scoped to this band, so it has to bleed the full width
          of the viewport while the max-w-7xl rules stay drawn over it — the
          same move the closing section on the marketing page makes. */}
      <div className="relative isolate overflow-hidden">
        <LegalBackdrop />

        <div className="mx-auto max-w-7xl border-x border-border/50">
          {/* ----------------------------------------------------- header */}
          <header className={`pt-16 pb-14 ${CELL}`}>
            <Reveal>
              <p className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card/30 py-1.5 pr-3.5 pl-2.5 font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase backdrop-blur-sm">
                <BeamBorder />
                <span className="relative flex size-1.5 shrink-0">
                  <span className="relative size-1.5 rounded-full bg-primary" />
                </span>
                Legal
              </p>
            </Reveal>

            {/* Title and summary share a baseline on wide screens, and the
                summary is given a real column rather than being pushed to the
                far edge — the gap between them is a gutter, not a void. */}
            <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-14">
              <Reveal delay={0.06}>
                <h1 className="bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[38px] leading-[1.02] font-medium tracking-[-0.045em] text-transparent sm:text-[56px]">
                  {title}
                </h1>
              </Reveal>

              <Reveal delay={0.12}>
                <p className="text-[15px] leading-[1.75] text-muted-foreground lg:pb-2">
                  {summary}
                </p>
              </Reveal>
            </div>
          </header>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-x border-t border-border/50">
        {/* A meta strip under the title: what version this is, and how long it
            takes to read. Both are questions a reader asks before starting. */}
        <Reveal
          as="div"
          className={`flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-border/50 py-4 ${CELL}`}
        >
          <span className="flex items-center gap-2.5 font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
            <span className="size-1 rounded-full bg-primary/70" />
            Effective {POLICY_EFFECTIVE_DATE}
          </span>
          <span className="flex items-center gap-2.5 font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
            <span className="size-1 rounded-full bg-border" />
            {sections.length} sections
          </span>
          <span className="flex items-center gap-2.5 font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
            <span className="size-1 rounded-full bg-border" />
            {COMPANY.legalName}
          </span>
        </Reveal>

        {/* ------------------------------------------- contents + document */}
        <div className="grid lg:grid-cols-[17rem_minmax(0,1fr)]">
          <nav
            aria-label="On this page"
            className="border-b border-border/50 lg:border-r lg:border-b-0"
          >
            {/* The sticky box carries no padding of its own: each group inside
                it is padded instead, so the rule between them runs the full
                width of the column and meets the frame on one side and the
                document's column rule on the other. */}
            <div className="lg:sticky lg:top-16">
              <div className={`pt-11 pb-8 lg:pt-8 ${CELL}`}>
                <p className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
                  On this page
                </p>

                {/* Ordinary anchors, so the page stays useful without JS and
                    deep links keep working when a section is shared. Only the
                    highlight needs the client, so only the list crosses over —
                    the section bodies stay on the server. */}
                <LegalContents
                  sections={sections.map(({ id, title }) => ({ id, title }))}
                />
              </div>

              {/* The rule closes the sidebar under the last link rather than
                  dividing the two lists — the gap between them says enough,
                  and a bottom edge is what makes the column read as a box. */}
              <div
                className={`border-b border-border/50 pt-7 pb-11 lg:pb-8 ${CELL}`}
              >
                <p className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
                  Other policies
                </p>
                <ul className="mt-4 space-y-1">
                  {others.map((page) => (
                    <li key={page.href}>
                      <Link
                        href={page.href}
                        className="group -mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-[12.5px] text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                      >
                        {page.label}
                        <span
                          aria-hidden
                          className="translate-x-0 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                        >
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>

          <div className="min-w-0">
            {sections.map((section, index) => (
              <Reveal
                as="section"
                key={section.id}
                y={12}
                className={`scroll-mt-24 border-t border-border/50 py-11 first:border-t-0 ${CELL}`}
              >
                <div id={section.id} className="scroll-mt-24">
                  <h2 className="flex gap-3.5 text-[21px] leading-[1.3] font-medium tracking-[-0.03em]">
                    <span className="pt-1 font-mono text-[11px] tabular-nums text-primary/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </h2>
                  <div className="mt-5">{section.body}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------- cross-links */}
        <div className="border-t border-border/50">
          <Reveal
            className={`flex items-center justify-between gap-5 border-b border-border/50 py-8 ${CELL}`}
          >
            <h2 className="max-w-[18ch] text-[24px] leading-[1.1] font-medium tracking-[-0.04em] sm:text-[30px]">
              The rest of the fine print
            </h2>
            <p className="hidden max-w-[38ch] text-[13.5px] leading-[1.65] text-muted-foreground sm:block">
              Each policy stands on its own, and together they describe
              everything we do with your account, your catalogue and your
              customers&rsquo; messages.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3">
            {others.map((page, index) => (
              <Reveal
                as="div"
                key={page.href}
                delay={index * 0.05}
                y={12}
                className="border-border/50 max-lg:nth-[-n+4]:border-b lg:nth-[-n+3]:border-b sm:max-lg:odd:border-r lg:not-nth-[3n]:border-r"
              >
                <Link
                  href={page.href}
                  className={`group flex h-full items-start justify-between gap-4 py-7 transition-colors duration-300 hover:bg-card/40 ${CELL}`}
                >
                  <span>
                    <span className="block font-mono text-[10.5px] tabular-nums text-muted-foreground/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-2.5 block text-[16px] font-medium tracking-[-0.02em] transition-colors duration-200 group-hover:text-primary">
                      {page.label}
                    </span>
                  </span>
                  <Corner />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
