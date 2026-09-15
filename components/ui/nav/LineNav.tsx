"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FileIcon } from "@/components/icons/Icons";

export interface LineNavItem {
  /** Must match the `id` of the section element on the page. */
  id: string;
  label: string;
  /** Indent level. 0 = top-level, 1 = nested. Default 0. */
  depth?: 0 | 1;
}

interface LineNavProps {
  items: LineNavItem[];
  title?: string;
  icon?: ReactNode;
  /** px of clearance above the target section (e.g. a sticky header). Default 96. */
  offset?: number;
  /**
   * `"dot"` — a traveling circular marker (default).
   * `"segment"` — no dot; a short colored length of the line itself highlights
   * the active position instead.
   */
  indicator?: "dot" | "segment";
  /** Length in px of the highlighted segment when `indicator="segment"`. Defaults to one row's height, so the primary color covers exactly the active item — not the whole line. */
  segmentLength?: number;
  className?: string;
}

const ROW_HEIGHT = 32;
const DOT_X = [4, 16] as const; // px, indexed by depth
const TEXT_INDENT = 14; // px gap from a row's dot to its label
const INDICATOR_SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Single source of truth for both "which item is active" and "how far toward the next
 * one" — driven by each section's real position, not a fixed-width IntersectionObserver
 * band (which can miss short sections entirely) or the whole-page scroll fraction (which
 * doesn't line up with uneven section heights). The dot and the bolded label read the
 * same `activeIndex`, so they can't drift apart.
 */
function useScrollSpy(ids: string[], offset: number) {
  const [state, setState] = useState({ activeIndex: 0, progress: 0 });
  const key = ids.join("|");

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    let ticking = false;

    const recalc = () => {
      ticking = false;
      const scrollY = window.scrollY;
      const tops = elements.map(
        (el) => el.getBoundingClientRect().top + scrollY - offset,
      );

      // The last section whose top we've scrolled past.
      let index = 0;
      for (let i = 0; i < tops.length; i++) {
        if (scrollY >= tops[i]) index = i;
      }

      // Short last sections can end well before the viewport bottom — snap to it
      // once there's no more page left to scroll, instead of leaving an earlier
      // item stuck as "active".
      const atBottom =
        scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) index = tops.length - 1;

      let progress = 0;
      if (index < tops.length - 1) {
        const span = tops[index + 1] - tops[index];
        progress =
          span > 0
            ? Math.min(1, Math.max(0, (scrollY - tops[index]) / span))
            : 0;
      }

      setState((prev) =>
        prev.activeIndex === index && prev.progress === progress
          ? prev
          : { activeIndex: index, progress },
      );
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(recalc);
    };

    recalc();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, offset]);

  return state;
}

/** Builds a smooth S-curve connector through each row's dot anchor (straight where depth is unchanged). */
function buildPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const midY = (p1.y + p2.y) / 2;
    d += ` C${p1.x},${midY} ${p2.x},${midY} ${p2.x},${p2.y}`;
  }
  return d;
}

/**
 * Measures the *real* rendered SVG path and returns, for each anchor point, how far
 * along that path (in px) it sits — found via binary search on `getPointAtLength`
 * since the path's `y` only ever increases as it runs through the rows. This is what
 * lets the segment indicator travel along the actual curve (bending through the S
 * where depth changes) instead of just floating at an (x, y) coordinate.
 */
function usePathLengths(
  pathRef: React.RefObject<SVGPathElement | null>,
  points: { y: number }[],
  pathD: string,
) {
  const [lengths, setLengths] = useState<number[]>([]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path || points.length === 0) {
      setLengths([]);
      return;
    }

    const total = path.getTotalLength();
    const next = points.map(({ y }) => {
      let lo = 0;
      let hi = total;
      for (let i = 0; i < 20; i++) {
        const mid = (lo + hi) / 2;
        if (path.getPointAtLength(mid).y < y) lo = mid;
        else hi = mid;
      }
      return (lo + hi) / 2;
    });
    setLengths(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathD]);

  return lengths;
}

export function LineNav({
  items,
  title = "On this page",
  icon = <FileIcon className="size-3.5" />,
  offset = 96,
  indicator = "dot",
  segmentLength = ROW_HEIGHT,
  className,
}: LineNavProps) {
  const ids = items.map((item) => item.id);
  const { activeIndex, progress } = useScrollSpy(ids, offset);
  const prefersReducedMotion = usePrefersReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);

  const points = items.map((item, i) => ({
    x: DOT_X[item.depth ?? 0],
    y: i * ROW_HEIGHT + ROW_HEIGHT / 2,
  }));
  const pathD = buildPath(points);
  const pathLengths = usePathLengths(pathRef, points, pathD);

  // Fallback: if pathLengths not ready, estimate based on linear y-positions
  // (not perfect for curves, but prevents the "top when scrolled to bottom" bug)
  const effectivePathLengths =
    pathLengths.length > 0 ? pathLengths : points.map((p) => p.y);

  const current = points[activeIndex];
  const next = points[activeIndex + 1];
  const dotX = next ? current.x + (next.x - current.x) * progress : current.x;
  const dotY = next ? current.y + (next.y - current.y) * progress : current.y;

  // Segment position using pathLengths (or fallback y-based estimate)
  const totalLength =
    effectivePathLengths[effectivePathLengths.length - 1] ?? 0;
  const currentLength = effectivePathLengths[activeIndex] ?? 0;
  const nextLength = effectivePathLengths[activeIndex + 1];
  const targetLength =
    nextLength !== undefined
      ? currentLength + (nextLength - currentLength) * progress
      : currentLength;

  // Center a one-row window on the active position, clamped so it never runs
  // past either end of the line. `dashStart` is where the highlight begins, in
  // path-length units — so its center (`dashStart + segmentLength/2`) lands on
  // the active row's dot, keeping the segment aligned with the bolded label.
  const dashStart = Math.max(
    0,
    Math.min(targetLength - segmentLength / 2, totalLength - segmentLength),
  );

  // The dash pattern must be longer than the whole path so exactly ONE dash is
  // ever drawn. With gap = totalLength the pattern's period is only a hair
  // longer than the line, so it repeats and a sliver of the next dash bleeds in
  // at the top when the active item is at the bottom. gap = totalLength +
  // segmentLength removes that repeat entirely.
  const dashPeriod = totalLength + 2 * segmentLength;
  const strokeDasharray = `${segmentLength} ${totalLength + segmentLength}`;

  // In SVG a length L is painted when (L + offset) mod period ∈ [0, dash). To
  // start the single dash at `dashStart` we need offset = period - dashStart.
  const strokeDashoffset = dashPeriod - dashStart;

  const handleNavigate = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    },
    [offset, prefersReducedMotion],
  );

  if (items.length < 2) return null;

  const svgWidth = Math.max(...DOT_X) + 8;

  return (
    <nav aria-label="Table of contents" className={cn("text-sm", className)}>
      <div className="mb-4 flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-semibold tracking-wide uppercase">
          {title}
        </span>
      </div>

      <div className="relative" style={{ height: items.length * ROW_HEIGHT }}>
        <svg
          aria-hidden="true"
          width={svgWidth}
          height={items.length * ROW_HEIGHT}
          className="absolute left-0 top-0 overflow-visible"
        >
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={1.5}
          />

          {indicator === "dot" ? (
            <>
              {/* Start / end caps */}
              <circle
                cx={points[0].x}
                cy={points[0].y}
                r={3}
                className="fill-muted-foreground/60"
              />
              <circle
                cx={points[points.length - 1].x}
                cy={points[points.length - 1].y}
                r={3}
                className="fill-muted-foreground/20"
              />

              {/* Active-item dot — glides between the active row and the next as `progress` moves */}
              <motion.circle
                r={4.5}
                className="fill-foreground"
                animate={{ cx: dotX, cy: dotY }}
                transition={INDICATOR_SPRING}
              />
            </>
          ) : (
            totalLength > 0 && (
              /* Active-item segment — travels along the real path via a moving dash window */
              <motion.path
                d={pathD}
                fill="none"
                strokeWidth={3}
                strokeLinecap="round"
                className="stroke-primary"
                strokeDasharray={strokeDasharray}
                animate={{
                  strokeDashoffset,
                }}
                transition={INDICATOR_SPRING}
              />
            )
          )}
        </svg>

        <ul className="relative">
          {items.map((item, i) => {
            const isActive = i === activeIndex;
            const isPast = i < activeIndex;

            return (
              <li key={item.id} style={{ height: ROW_HEIGHT }}>
                <button
                  type="button"
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => handleNavigate(item.id)}
                  style={{ paddingLeft: DOT_X[item.depth ?? 0] + TEXT_INDENT }}
                  className={cn(
                    "flex h-full w-full cursor-pointer items-center text-left transition-colors duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive && "font-semibold text-foreground",
                    !isActive &&
                      isPast &&
                      "text-muted-foreground hover:text-foreground",
                    !isActive &&
                      !isPast &&
                      "text-muted-foreground/40 hover:text-muted-foreground",
                  )}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
