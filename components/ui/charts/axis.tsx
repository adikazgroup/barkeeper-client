"use client";

import { useChartStable } from "./line-chart";

interface AxisProps {
  /** Render Y-axis value labels on the left (from `yTicks`). */
  y?: boolean;
  /** Render X-axis labels along the bottom (from `data[xKey]`). */
  x?: boolean;
  /** Max number of X labels to show; extras are thinned out to avoid overlap. Defaults to 7. */
  maxXLabels?: number;
}

const LABEL_FILL = "var(--color-muted-foreground)";

export default function Axis({
  x = false,
  y = false,
  maxXLabels = 7,
}: AxisProps) {
  const {
    yTicks,
    data,
    xKey,
    xScale,
    height,
    margin,
    formatValue,
    formatLabel,
  } = useChartStable();

  const xStep = Math.max(1, Math.ceil(data.length / maxXLabels));

  return (
    <g>
      {y &&
        yTicks.map((tick, i) => (
          <text
            key={`y-${i}`}
            x={margin.left - 8}
            y={tick.y}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize={11}
            fill={LABEL_FILL}
            className="tabular-nums"
          >
            {formatValue(tick.value)}
          </text>
        ))}

      {x &&
        data.map((row, i) => {
          // Always keep the last point; thin the rest to `maxXLabels`.
          const isLast = i === data.length - 1;
          if (i % xStep !== 0 && !isLast) return null;

          const anchor = i === 0 ? "start" : isLast ? "end" : "middle";
          return (
            <text
              key={`x-${i}`}
              x={xScale(i)}
              y={height - margin.bottom + 18}
              textAnchor={anchor}
              fontSize={11}
              fill={LABEL_FILL}
            >
              {formatLabel(row[xKey])}
            </text>
          );
        })}
    </g>
  );
}
