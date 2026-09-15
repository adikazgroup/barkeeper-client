"use client";

import { useChartStable } from "./line-chart";

interface GridProps {
  horizontal?: boolean;
  vertical?: boolean;
}

export default function Grid({
  horizontal = false,
  vertical = false,
}: GridProps) {
  const { yTicks, xScale, width, height, margin, data } = useChartStable();

  return (
    <g>
      {horizontal &&
        yTicks.map((tick, i) => (
          <line
            key={`h-${i}`}
            x1={margin.left}
            x2={width - margin.right}
            y1={tick.y}
            y2={tick.y}
            stroke="var(--color-border)"
            strokeWidth={1}
          />
        ))}

      {vertical &&
        data.map((_, i) => (
          <line
            key={`v-${i}`}
            x1={xScale(i)}
            x2={xScale(i)}
            y1={margin.top}
            y2={height - margin.bottom}
            stroke="var(--color-border)"
            strokeWidth={1}
          />
        ))}
    </g>
  );
}
