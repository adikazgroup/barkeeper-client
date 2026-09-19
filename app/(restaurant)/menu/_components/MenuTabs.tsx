"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Info } from "lucide-react";

import { EASE } from "@/app/(restaurant)/_components/home/Reveal";
import { cn } from "@/lib/utils";
import type { MenuGroup } from "../_type";
import { MenuHero } from "./MenuHero";
import { FoodCard } from "./FoodCard";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

/**
 * How a counter arrives when it is switched to.
 *
 * Tighter than the home page's stagger: a board can hold a dozen plates, and
 * at the marketing pace the last one would still be landing a second after the
 * tap. Short enough to read as one movement, long enough to see.
 */
const PLATES: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.08 } },
};

export function MenuTabs({ groups }: { groups: MenuGroup[] }) {
  // Which counter the board opens at, named by its slug so the link that sent
  // them here reads as what it does. An unknown or missing slug opens the
  // first counter, which is what the board does on its own anyway.
  const requested = useSearchParams().get("category");

  const [activeKey, setActiveKey] = useState(
    () =>
      groups.find((group) => group.slug === requested)?.key ?? groups[0].key,
  );

  // Tapping a second card on the home board changes the query without
  // remounting this component, so the counter follows the URL when it moves
  // rather than only when it is first read.
  useEffect(() => {
    if (!requested) return;
    const match = groups.find((group) => group.slug === requested);
    if (match) setActiveKey(match.key);
  }, [requested, groups]);

  const active = groups.find((group) => group.key === activeKey) ?? groups[0];
  const panelId = `${active.slug}-panel`;

  const railRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());

  const [pill, setPill] = useState<{ left: number; width: number } | null>(
    null,
  );
  const [overflowing, setOverflowing] = useState(false);

  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const measure = () => {
      const el = tabRefs.current.get(active.key);
      if (!el) return;
      setPill({ left: el.offsetLeft, width: el.offsetWidth });
      setOverflowing(rail.scrollWidth > rail.clientWidth + 1);
    };

    measure();

    // Widths move with the viewport, and again when the display face swaps in.
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    for (const el of tabRefs.current.values()) observer.observe(el);
    return () => observer.disconnect();
  }, [active.key]);

  useLayoutEffect(() => {
    const rail = railRef.current;
    const el = tabRefs.current.get(active.key);
    if (!rail || !el || rail.scrollWidth <= rail.clientWidth + 1) return;

    rail.scrollTo({
      left: el.offsetLeft - (rail.clientWidth - el.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [active.key]);

  return (
    <>
      <MenuHero>
        {groups.length > 1 && (
          <div className="relative mx-auto w-fit max-w-full">
            <div
              ref={railRef}
              role="tablist"
              aria-label="Menu categories"
              className="relative flex items-center gap-1 overflow-x-auto rounded-full border border-border bg-card/60 p-1 backdrop-blur-sm scrollbar-hide"
            >
              {/* The active counter's ground, drawn once and moved, so the
                selection slides between counters instead of blinking. */}
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute top-1 bottom-1 left-0 rounded-full bg-primary transition-[transform,width,opacity] duration-300 ease-out",
                  pill ? "opacity-100" : "opacity-0",
                )}
                style={{
                  width: pill?.width ?? 0,
                  transform: `translateX(${pill?.left ?? 0}px)`,
                }}
              />

              {groups.map((group) => {
                const isActive = group.key === active.key;

                return (
                  <button
                    key={group.key}
                    ref={(el) => {
                      if (el) tabRefs.current.set(group.key, el);
                      else tabRefs.current.delete(group.key);
                    }}
                    type="button"
                    role="tab"
                    id={`${group.slug}-tab`}
                    aria-selected={isActive}
                    aria-controls={isActive ? panelId : undefined}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveKey(group.key)}
                    className={cn(
                      "relative z-10 shrink-0 cursor-pointer rounded-full px-4 py-2 text-[13px] font-medium tracking-[-0.01em] whitespace-nowrap transition-colors duration-300",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isActive
                        ? "text-background"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {group.title}
                  </button>
                );
              })}
            </div>

            {overflowing && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 w-12 rounded-r-full bg-linear-to-l from-card to-transparent"
              />
            )}
          </div>
        )}
      </MenuHero>

      <section className="min-h-125">
        <div className="mx-auto max-w-7xl">
          <div className="border-x border-border/50">
            <div
              key={active.key}
              role={groups.length > 1 ? "tabpanel" : undefined}
              id={groups.length > 1 ? panelId : active.slug}
              aria-labelledby={
                groups.length > 1 ? `${active.slug}-tab` : undefined
              }
              aria-label={groups.length > 1 ? undefined : active.title}
              tabIndex={groups.length > 1 ? 0 : undefined}
              className="scroll-mt-24 focus:outline-none"
            >
              {/* The counter's own name, so the board still says what is being
                  read once the rail has scrolled out of view. */}
              <div
                className={cn(
                  "flex flex-wrap items-center justify-between gap-4 border-b border-border/50 py-8",
                  CELL,
                )}
              >
                <motion.h2
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="text-[26px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[32px]"
                >
                  {active.title}
                </motion.h2>

                {/* A beat behind the name, so the pair reads left to right
                    rather than as one block appearing at once. */}
                <motion.span
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.07, ease: EASE }}
                  className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase tabular-nums"
                >
                  {active.items.length}{" "}
                  {active.items.length === 1 ? "plate" : "plates"}
                </motion.span>
              </div>

              {/* Under reduced motion `initial={false}` stops the children
                  ever entering their hidden state, so nothing moves and the
                  card itself needs no gating of its own. */}
              <motion.ul
                role="list"
                variants={PLATES}
                initial={reduced ? false : "hidden"}
                animate="visible"
                className={cn(
                  "grid gap-4 py-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3",
                  CELL,
                )}
              >
                {active.items.map((item) => (
                  <FoodCard key={item._id} item={item} />
                ))}
              </motion.ul>
            </div>

            <p
              className={cn(
                "flex items-start gap-2.5 border-t border-border/50 py-6 text-[13px] leading-[1.7] text-muted-foreground",
                CELL,
              )}
            >
              <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
              Prices are as listed on the board, and what the kitchen has on can
              change with the day&rsquo;s delivery.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
