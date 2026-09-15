"use client";

import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const DEFAULT_MARGIN: Margin = { top: 16, right: 16, bottom: 32, left: 40 };
const FALLBACK_WIDTH = 640;
const FALLBACK_HEIGHT = 240;

export interface LineConfig {
  dataKey: string;
  stroke: string;
  label?: string;
}

/**
 * Split into a stable slice (data/scales/dimensions) and a volatile hover slice so
 * `Line`/`Grid`/`LineArea` — which only read the stable slice — don't re-render on
 * every pointer move. Only the crosshair and `ChartTooltip` read the hover slice.
 */
interface ChartStableValue {
  data: Record<string, unknown>[];
  xKey: string;
  width: number;
  height: number;
  margin: Margin;
  xScale: (index: number) => number;
  yScale: (value: number) => number;
  yTicks: { value: number; y: number }[];
  lines: LineConfig[];
  formatValue: (n: number) => string;
  formatLabel: (value: unknown) => string;
}

interface ChartHoverValue {
  hoverIndex: number | null;
  setHoverIndex: (i: number | null) => void;
}

const ChartStableContext = createContext<ChartStableValue | null>(null);
const ChartHoverContext = createContext<ChartHoverValue | null>(null);

export function useChartStable(): ChartStableValue {
  const ctx = useContext(ChartStableContext);
  if (!ctx)
    throw new Error("Chart components must be rendered inside <LineChart>");
  return ctx;
}

export function useChartHover(): ChartHoverValue {
  const ctx = useContext(ChartHoverContext);
  if (!ctx)
    throw new Error("Chart components must be rendered inside <LineChart>");
  return ctx;
}

function niceMax(value: number): number {
  const magnitude = Math.pow(10, Math.floor(Math.log10(value || 1)));
  const normalized = value / magnitude;
  const step =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * magnitude;
}

/** Catmull-Rom → cubic-Bezier conversion so lines read as a smooth curve instead of straight segments. */
export function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length < 3) {
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
      .join(" ");
  }

  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

const defaultFormatValue = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `${n}`;
const defaultFormatLabel = (v: unknown) => String(v);

/** Measures the container so the SVG uses real pixel dimensions instead of a stretched fixed viewBox. */
function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((prev) =>
        prev.width === width && prev.height === height
          ? prev
          : { width, height },
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}

function getChildComponentName(child: ReactElement): string {
  const childType = child.type as { displayName?: string; name?: string };
  return typeof child.type === "function"
    ? childType.displayName || childType.name || ""
    : "";
}

/** Recurses into nested children (e.g. a wrapper fragment) so `<Line>` is found wherever it's composed. */
function extractLineConfigs(children: ReactNode): LineConfig[] {
  const configs: LineConfig[] = [];

  const visit = (node: ReactNode) => {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return;

      const props = child.props as {
        dataKey?: unknown;
        stroke?: string;
        label?: string;
      };
      const isLine =
        child.type === Line || getChildComponentName(child) === "Line";

      if (isLine && typeof props.dataKey === "string") {
        configs.push({
          dataKey: props.dataKey,
          stroke: props.stroke ?? "var(--color-primary)",
          label: props.label,
        });
        return;
      }

      const childProps = child.props as { children?: ReactNode };
      if (childProps?.children) visit(childProps.children);
    });
  };

  visit(children);
  return configs;
}

interface LineChartProps {
  data: Record<string, unknown>[];
  xKey?: string;
  margin?: Partial<Margin>;
  className?: string;
  formatValue?: (n: number) => string;
  formatLabel?: (value: unknown) => string;
  children: ReactNode;
}

export default function LineChart({
  data,
  xKey = "date",
  margin: marginProp,
  className,
  formatValue = defaultFormatValue,
  formatLabel = defaultFormatLabel,
  children,
}: LineChartProps) {
  const [containerRef, measured] = useElementSize<HTMLDivElement>();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const width = measured.width || FALLBACK_WIDTH;
  const height = measured.height || FALLBACK_HEIGHT;

  const margin = useMemo<Margin>(
    () => ({ ...DEFAULT_MARGIN, ...marginProp }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [marginProp?.top, marginProp?.right, marginProp?.bottom, marginProp?.left],
  );

  const childArray = useMemo(() => Children.toArray(children), [children]);
  const lines = useMemo(() => extractLineConfigs(children), [children]);

  const svgChildren = useMemo(
    () =>
      childArray.filter(
        (child) =>
          !(
            isValidElement(child) &&
            (child.type as { isChartOverlay?: boolean }).isChartOverlay
          ),
      ),
    [childArray],
  );
  const overlayChildren = useMemo(
    () =>
      childArray.filter(
        (child) =>
          isValidElement(child) &&
          (child.type as { isChartOverlay?: boolean }).isChartOverlay,
      ),
    [childArray],
  );

  const { xScale, yScale, yTicks } = useMemo(() => {
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const allValues = data.flatMap((row) =>
      lines.map((line) => Number(row[line.dataKey]) || 0),
    );
    const rawMax = Math.max(...allValues, 0);
    const rawMin = Math.min(...allValues, 0);

    // The domain spans [minValue, maxValue] rather than [0, maxValue], so negative values land
    // inside the plot box instead of being drawn below it. Both ends stay 0 when the data is
    // wholly positive/negative, which keeps zero on the axis.
    const maxValue = niceMax(rawMax * 1.15);
    const minValue = rawMin < 0 ? -niceMax(Math.abs(rawMin) * 1.15) : 0;
    const span = maxValue - minValue || 1;

    const xScale = (i: number) =>
      margin.left +
      (data.length <= 1 ? 0 : (i / (data.length - 1)) * plotWidth);
    const yScale = (value: number) =>
      margin.top + (1 - (value - minValue) / span) * plotHeight;

    const tickCount = 4;
    const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => {
      const value = minValue + (span / tickCount) * i;
      return { value, y: yScale(value) };
    });

    return { xScale, yScale, yTicks };
  }, [data, lines, width, height, margin]);

  const handleMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (data.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * width;
    let nearest = 0;
    let nearestDist = Infinity;
    data.forEach((_, i) => {
      const dist = Math.abs(xScale(i) - relX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  };

  const stableValue = useMemo<ChartStableValue>(
    () => ({
      data,
      xKey,
      width,
      height,
      margin,
      xScale,
      yScale,
      yTicks,
      lines,
      formatValue,
      formatLabel,
    }),
    [
      data,
      xKey,
      width,
      height,
      margin,
      xScale,
      yScale,
      yTicks,
      lines,
      formatValue,
      formatLabel,
    ],
  );

  const hoverValue = useMemo<ChartHoverValue>(
    () => ({ hoverIndex, setHoverIndex }),
    [hoverIndex],
  );

  return (
    <ChartStableContext.Provider value={stableValue}>
      <ChartHoverContext.Provider value={hoverValue}>
        <div
          ref={containerRef}
          className={cn("relative w-full aspect-2/1 md:aspect-3/1", className)}
        >
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full touch-none block"
            onPointerMove={handleMove}
            onPointerLeave={() => setHoverIndex(null)}
          >
            {svgChildren}
            <ChartCrosshair />
          </svg>

          {overlayChildren}
        </div>
      </ChartHoverContext.Provider>
    </ChartStableContext.Provider>
  );
}

const springTransition = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
};

/** Isolated so hover updates only re-render this subtree, not the sibling `Line`/`Grid` elements. */
function ChartCrosshair() {
  const { data, margin, height, xScale, yScale, lines } = useChartStable();
  const { hoverIndex } = useChartHover();

  if (hoverIndex === null) return null;
  const row = data[hoverIndex];
  if (!row) return null;

  const hoveredX = xScale(hoverIndex);

  return (
    <g>
      <line
        x1={hoveredX}
        x2={hoveredX}
        y1={margin.top}
        y2={height - margin.bottom}
        stroke="var(--color-border)"
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      {lines.map((line) => {
        const cy = yScale(Number(row[line.dataKey]) || 0);
        return (
          <g key={line.dataKey}>
            <motion.circle
              r={5}
              fill={line.stroke}
              animate={{ cx: hoveredX, cy }}
              transition={springTransition}
            />
            <motion.circle
              r={5}
              fill="none"
              stroke="var(--color-card)"
              strokeWidth={2}
              animate={{ cx: hoveredX, cy }}
              transition={springTransition}
            />
          </g>
        );
      })}
    </g>
  );
}

interface LineProps {
  dataKey: string;
  stroke?: string;
  strokeWidth?: number;
  label?: string;
  dashed?: boolean;
}

const HIGHLIGHT_WIDTH = 100;
const DIMMED_OPACITY = 0.35;

export function Line({
  dataKey,
  stroke = "var(--color-primary)",
  strokeWidth = 2,
  dashed,
}: LineProps) {
  const { data, xScale, yScale, margin, height } = useChartStable();
  const { hoverIndex } = useChartHover();
  const clipId = useId();

  const points = useMemo(
    () =>
      data.map((row, i) => ({
        x: xScale(i),
        y: yScale(Number(row[dataKey]) || 0),
      })),
    [data, dataKey, xScale, yScale],
  );

  const path = smoothPath(points);
  const pathKey = `${dataKey}-${data.length}-${String(data[0]?.[dataKey] ?? "")}`;
  const hoveredX = hoverIndex !== null ? xScale(hoverIndex) : null;

  return (
    <>
      <motion.path
        key={pathKey}
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray={dashed ? "5 4" : undefined}
        initial={{ pathLength: 0, opacity: 1 }}
        animate={{
          pathLength: 1,
          opacity: hoveredX !== null ? DIMMED_OPACITY : 1,
        }}
        transition={{
          pathLength: { duration: 0.9, ease: "easeInOut" },
          opacity: { duration: 0.2, ease: "easeOut" },
        }}
      />

      {hoveredX !== null && (
        <g clipPath={`url(#${clipId})`}>
          <clipPath id={clipId}>
            <motion.rect
              y={margin.top}
              height={Math.max(height - margin.top - margin.bottom, 0)}
              width={HIGHLIGHT_WIDTH}
              initial={{ x: hoveredX - HIGHLIGHT_WIDTH / 2 }}
              animate={{ x: hoveredX - HIGHLIGHT_WIDTH / 2 }}
              transition={springTransition}
            />
          </clipPath>
          <path
            d={path}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={dashed ? "5 4" : undefined}
          />
        </g>
      )}
    </>
  );
}
Line.displayName = "Line";

/** Filled wash under a `Line`, drawn separately so it can be layered under multiple lines. */
export function LineArea({
  dataKey,
  fill = "var(--color-primary)",
}: {
  dataKey: string;
  fill?: string;
}) {
  const gradientId = useId();
  const { data, xScale, yScale } = useChartStable();

  const points = useMemo(
    () =>
      data.map((row, i) => ({
        x: xScale(i),
        y: yScale(Number(row[dataKey]) || 0),
      })),
    [data, dataKey, xScale, yScale],
  );

  const linePath = smoothPath(points);
  const baseline = yScale(0);
  const areaPath = `${linePath} L${points[points.length - 1]?.x ?? 0},${baseline} L${points[0]?.x ?? 0},${baseline} Z`;

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.16" />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        key={`area-${dataKey}-${data.length}`}
        d={areaPath}
        fill={`url(#${gradientId})`}
        stroke="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </>
  );
}
