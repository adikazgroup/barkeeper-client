"use client";

/**
 * How an order actually happens, in four steps, with a pint that fills as the
 * reader works down them.
 *
 * Same frame as the sections above: the ruled max-w-7xl box, a header row,
 * then two halves split by a line rather than a gutter. The glass stays put
 * while the steps scroll — it is the progress bar, so pinning it is the whole
 * point.
 *
 * The pour is driven by the steps' own positions rather than by the section's
 * scroll offset, so the glass and the list can never disagree about which step
 * the reader is on.
 */

import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { BookOpen, ShoppingBag, Star, UtensilsCrossed } from "lucide-react";

import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

/** Horizontal padding lives on each cell so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

const STEPS: {
  title: string;
  aside: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  {
    title: "Have a look",
    aside: "The board",
    description:
      "Everything the kitchen has on, and everything behind the bar. Take your time over it.",
    icon: BookOpen,
  },
  {
    title: "Put the order in",
    aside: "The counter",
    description:
      "Online for collection or delivery, or walk up and tell us. Both end the same way.",
    icon: ShoppingBag,
  },
  {
    title: "Let it settle",
    aside: "The pass",
    description:
      "Cooked to order and sent out hot. Nothing sits under a lamp waiting for you.",
    icon: UtensilsCrossed,
  },
  {
    title: "Raise a glass",
    aside: "The table",
    description:
      "Eat in, take it home, then leave us a word. The good ones we frame, the bad ones we act on.",
    icon: Star,
  },
];

/* -------------------------------------------------------------------------- */
/*                                  THE POUR                                  */
/* -------------------------------------------------------------------------- */

/** Tulip pint, drawn once and reused for the outline and the interior clip. */
const GLASS_PATH =
  "M32 22 C 34 88, 43 118, 45 152 C 46 192, 43 232, 49 266 Q 49 274, 58 274 H 102 Q 111 274, 111 266 C 117 232, 114 192, 115 152 C 117 118, 126 88, 128 22 Z";

const LIQUID_TOP = 26;
const LIQUID_BOTTOM = 272;
const LIQUID_SPAN = LIQUID_BOTTOM - LIQUID_TOP;
const HEAD_H = 15;

/**
 * The pour is one tall rect translated up from below the base, so only
 * `transform` animates and the glass edges come free from the clip path.
 *
 * Both gradient ends are mixed from `--primary` rather than set to fixed
 * amber: the glass then follows the brand colour if it is ever changed,
 * including across the two themes.
 */
function Pint({ level }: { level: number }) {
  const surface = LIQUID_BOTTOM - level * LIQUID_SPAN;
  const poured = level > 0.015;

  return (
    <svg viewBox="0 0 200 300" className="h-full w-full" aria-hidden>
      <defs>
        <clipPath id="pint-inner">
          <path d={GLASS_PATH} />
        </clipPath>

        {/* Deeper at the base, brighter near the surface */}
        <linearGradient id="pint-pour" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="color-mix(in srgb, var(--primary) 78%, white)"
          />
          <stop offset="55%" stopColor="var(--primary)" />
          <stop
            offset="100%"
            stopColor="color-mix(in srgb, var(--primary) 72%, black)"
          />
        </linearGradient>
      </defs>

      <g clipPath="url(#pint-inner)">
        <g
          className="transition-transform duration-200 ease-out"
          style={{
            transformBox: "view-box",
            transform: `translateY(${surface}px)`,
          }}
        >
          <rect
            x="24"
            y="0"
            width="112"
            height={LIQUID_SPAN}
            fill="url(#pint-pour)"
          />

          {/* Head: a flat band closed by a curved meniscus */}
          <g
            className="transition-opacity duration-300"
            style={{ opacity: poured ? 1 : 0 }}
          >
            <rect
              x="24"
              y="0"
              width="112"
              height={HEAD_H}
              fill="var(--cream)"
            />
            <ellipse cx="80" cy="0" rx="56" ry="7" fill="var(--cream)" />
          </g>
        </g>

        {/* Light catching the near edge of the glass */}
        <path
          d="M50 40 C 53 100, 55 150, 57 210"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.28"
        />
      </g>

      {/* Glass */}
      <path
        d={GLASS_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <ellipse
        cx="80"
        cy="22"
        rx="48"
        ry="6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Measure marks — one per step, filling in as the pour passes them */}
      {STEPS.map((step, i) => {
        const fraction = (i + 1) / STEPS.length;
        const y = LIQUID_BOTTOM - fraction * LIQUID_SPAN;
        const passed = level >= fraction - 0.002;

        return (
          <g
            key={step.title}
            className="transition-opacity duration-300"
            style={{ opacity: passed ? 1 : 0.45 }}
          >
            <path
              d={`M138 ${y} h${passed ? 14 : 8}`}
              stroke={passed ? "var(--primary)" : "currentColor"}
              strokeWidth="1.5"
              strokeLinecap="round"
              className="transition-all duration-300"
            />
            <text
              x="160"
              y={y + 3.5}
              fontSize="10"
              fontWeight="600"
              letterSpacing="1"
              fill={passed ? "var(--primary)" : "currentColor"}
              className="transition-colors duration-300"
            >
              {String(i + 1).padStart(2, "0")}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  SECTION                                   */
/* -------------------------------------------------------------------------- */

export function HowItWorks() {
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [level, setLevel] = useState(0);

  // The pour tracks scroll in both directions, and is pinned to the steps
  // themselves: step i sits exactly on the (i+1)/n mark when its centre meets
  // the middle of the screen, so the glass and the list can never disagree.
  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const els = stepRefs.current.filter(Boolean) as HTMLLIElement[];
      if (!els.length) return;

      const middle = window.innerHeight / 2;
      const centres = els.map((el) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      const n = centres.length;
      const mark = (i: number) => (i + 1) / n;

      let next: number;

      if (middle <= centres[0]) {
        // Approaching the first step: ramp up over one step's worth of scroll.
        const lead = n > 1 ? centres[1] - centres[0] : window.innerHeight / 2;
        next = ((middle - (centres[0] - lead)) / lead) * mark(0);
      } else if (middle >= centres[n - 1]) {
        next = 1;
      } else {
        const i = centres.findIndex(
          (c, idx) => idx < n - 1 && middle >= c && middle < centres[idx + 1],
        );
        const span = centres[i + 1] - centres[i];
        const t = (middle - centres[i]) / span;
        next = mark(i) + t * (mark(i + 1) - mark(i));
      }

      setLevel(Math.min(1, Math.max(0, next)));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      id="how-it-works"
      aria-label="How ordering works"
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
            <h2 className="max-w-[18ch] text-[30px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[40px]">
              Four steps from the door to the table
            </h2>
            <p className="max-w-[44ch] text-[14px] leading-[1.65] text-muted-foreground">
              Nothing about it is complicated, which is rather the point. Read
              your way down and we&rsquo;ll pour as you go.
            </p>
          </Reveal>

          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            {/* ── The pour, pinned ──────────────────────────────────── */}
            {/* Hidden below lg: the glass only means anything while it can sit
                beside the steps, and stacked above them it is just a picture
                pushing the content it measures off the screen. */}
            <div className="hidden border-border/50 lg:block lg:border-r">
              {/* Kept short on purpose: a sticky block unpins once its bottom
                  meets the column's bottom, so anything taller would scroll
                  away before the last step reaches the middle of the screen. */}
              <div className={cn("py-10 lg:sticky lg:top-24", CELL)}>
                <div className="mx-auto h-72 w-56 text-foreground/25">
                  <Pint level={level} />
                </div>

                <div className="mt-6 text-center">
                  <span className="text-[34px] leading-none font-medium tracking-[-0.04em] text-primary tabular-nums">
                    {Math.round(level * 100)}
                    <span className="text-primary/45">%</span>
                  </span>
                  <p className="mx-auto mt-4 max-w-[30ch] text-[13px] leading-[1.7] text-muted-foreground">
                    A stout takes 119.5 seconds to pour properly. Your dinner
                    takes a little longer, and it&rsquo;s worth the same wait.
                  </p>
                </div>
              </div>
            </div>

            {/* ── The steps ─────────────────────────────────────────── */}
            <ol role="list" className="min-w-0">
              {STEPS.map((step, i) => {
                // Exactly the threshold the matching measure mark uses.
                const poured = level >= (i + 1) / STEPS.length - 0.002;

                return (
                  <li
                    key={step.title}
                    ref={(el) => {
                      stepRefs.current[i] = el;
                    }}
                    className={cn(
                      "flex gap-5 border-border/50 py-9 sm:gap-7 sm:py-11",
                      "[&:not(:last-child)]:border-b",
                      CELL,
                    )}
                  >
                    {/* Node */}
                    <span
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-full border transition-colors duration-700 sm:size-14",
                        poured
                          ? "border-transparent bg-primary text-background"
                          : "border-border bg-card text-muted-foreground",
                      )}
                    >
                      <step.icon className="size-5 sm:size-5.5" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[10.5px] tracking-[0.16em] uppercase">
                        <span
                          className={cn(
                            "tabular-nums transition-colors duration-500",
                            poured ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-muted-foreground">
                          {step.aside}
                        </span>
                      </div>

                      <h3
                        className={cn(
                          "mt-2.5 text-[20px] leading-[1.2] font-medium tracking-[-0.03em] transition-colors duration-500 sm:text-[23px]",
                          poured && "text-primary",
                        )}
                      >
                        {step.title}
                      </h3>

                      <p className="mt-3 max-w-[46ch] text-[14px] leading-[1.7] text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
