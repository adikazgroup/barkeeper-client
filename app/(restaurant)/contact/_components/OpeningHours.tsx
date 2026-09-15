/* eslint-disable react-hooks/set-state-in-effect */
"use client";

/**
 * The week, laid out a day to a column.
 *
 * Today's column is filled rather than outlined, so the one row a visitor
 * actually wants — are they open now — is found without reading the other six.
 */

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "../../_components/home/Reveal";
import { week } from "../_data";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

export function OpeningHours() {
  // Resolved after mount: the server has no idea what day or hour it is where
  // the guest is standing, and rendering a guess would hydrate wrong.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const todayIndex = now ? (now.getDay() + 6) % 7 : null;

  return (
    <section
      id="hours"
      aria-labelledby="hours-heading"
      className="scroll-mt-24 border-t border-border/50"
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
              id="hours-heading"
              className="max-w-[18ch] text-[30px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[40px]"
            >
              The week, at a glance
            </h2>
            <p className="max-w-[44ch] text-[14px] leading-[1.65] text-muted-foreground">
              Seven days. Later on a Thursday and Friday, earlier at the
              weekend, and the fryers go on an hour before any of it.
            </p>
          </Reveal>

          <Reveal
            as="ol"
            className={cn(
              "grid grid-cols-2 gap-3 py-10 sm:grid-cols-4 sm:gap-4 lg:grid-cols-7",
              CELL,
            )}
          >
            {week.map((d, i) => {
              const isToday = todayIndex === i;

              return (
                <li
                  key={d.day}
                  aria-current={isToday ? "date" : undefined}
                  className={cn(
                    "flex flex-col items-center rounded-2xl border px-3 py-6 text-center transition-colors duration-300",
                    isToday
                      ? "border-primary/40 bg-primary/5"
                      : "border-border/60 bg-card hover:border-primary/30",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[10.5px] tracking-[0.16em] uppercase",
                      isToday ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {d.short}
                    <span className="sr-only">{d.day}</span>
                  </span>

                  <span className="mt-4 flex flex-col items-center">
                    <span className="font-mono text-[15px] tabular-nums">
                      {d.open}
                    </span>
                    <span
                      aria-hidden
                      className="my-1.5 block h-px w-4 bg-border"
                    />
                    <span className="font-mono text-[15px] tabular-nums">
                      {d.close}
                    </span>
                  </span>

                  {/* The label only appears on today's, so the row has one
                      thing standing out rather than seven. */}
                  <span
                    className={cn(
                      "mt-4 font-mono text-[9.5px] tracking-[0.18em] uppercase transition-opacity duration-300",
                      isToday ? "text-primary opacity-100" : "opacity-0",
                    )}
                  >
                    Today
                  </span>
                </li>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
