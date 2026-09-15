"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChartHover, useChartStable } from "./line-chart";

const springTransition = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
};

/** Gap between the hovered point and the tooltip box. */
const GAP = 12;
/** Minimum breathing room between the tooltip and the chart's edges. */
const EDGE = 8;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

export function ChartTooltip() {
  const {
    data,
    xKey,
    xScale,
    yScale,
    width,
    height,
    lines,
    formatValue,
    formatLabel,
  } = useChartStable();
  const { hoverIndex } = useChartHover();

  const tipRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState({ w: 0, h: 0 });

  const hoveredRow = hoverIndex !== null ? data[hoverIndex] : null;

  // Anchor: the hovered point itself. Vertically we track the topmost series so the
  // tooltip clears every line at this index, not just the first one.
  const pointX = hoverIndex !== null ? xScale(hoverIndex) : 0;
  const pointY =
    hoverIndex !== null && hoveredRow
      ? Math.min(
          ...lines.map((l) => yScale(Number(hoveredRow[l.dataKey]) || 0)),
        )
      : 0;

  // offsetWidth/Height ignore the scale transform, so measuring mid-animation is safe.
  useLayoutEffect(() => {
    const el = tipRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    setTip((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
  }, [hoverIndex, lines, data, formatValue, formatLabel]);

  // Flip to the left of the point only when the tooltip would otherwise overflow the right
  // edge. No hysteresis needed: hover snaps to discrete data indices, so pointX can only
  // take a fixed set of values and the decision can't oscillate mid-hover.
  const flip = tip.w > 0 && pointX + GAP + tip.w > width - EDGE;

  const left = flip
    ? clamp(pointX - GAP - tip.w, EDGE, width - tip.w - EDGE)
    : clamp(pointX + GAP, EDGE, width - tip.w - EDGE);
  const top = clamp(pointY - tip.h - GAP, EDGE, height - tip.h - EDGE);

  return (
    <>
      <AnimatePresence>
        {hoveredRow && (
          <motion.div
            ref={tipRef}
            className="absolute top-0 left-0 pointer-events-none rounded-lg border border-border bg-muted px-3 py-2 shadow-lg min-w-32"
            initial={{ opacity: 0, scale: 0.96, x: left, y: top }}
            animate={{ opacity: 1, scale: 1, x: left, y: top }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={springTransition}
          >
            <p className="text-[11px] font-medium text-foreground mb-1.5">
              {formatLabel(hoveredRow[xKey])}
            </p>
            {lines.length === 1 ? (
              <p className="text-sm font-semibold text-foreground tabular-nums">
                {formatValue(Number(hoveredRow[lines[0].dataKey]) || 0)}
              </p>
            ) : (
              <div className="space-y-1">
                {lines.map((line) => (
                  <div
                    key={line.dataKey}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span
                        className="size-1.5 rounded-full shrink-0"
                        style={{ background: line.stroke }}
                      />
                      {line.label ?? line.dataKey}
                    </span>
                    <span className="text-xs font-semibold text-foreground tabular-nums">
                      {formatValue(Number(hoveredRow[line.dataKey]) || 0)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hoveredRow && (
          <motion.div
            className="absolute bottom-0 -translate-x-1/2 translate-y-full mt-1.5 pointer-events-none rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, left: `${(pointX / width) * 100}%` }}
            exit={{ opacity: 0 }}
            transition={springTransition}
          >
            {formatLabel(hoveredRow[xKey])}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

ChartTooltip.isChartOverlay = true;
