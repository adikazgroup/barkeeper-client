"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ARC = 0.12;
const INSET = 0.5;
function perimeterOf(width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  return 2 * (width - 2 * r) + 2 * (height - 2 * r) + 2 * Math.PI * r;
}

export function BeamBorder({
  radius,
  className,
}: {
  radius?: number;
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [box, setBox] = useState<{ width: number; height: number } | null>(
    null,
  );

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox({ width, height });
    });
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  if (!box || box.width < 2 || box.height < 2) {
    return <svg ref={ref} aria-hidden="true" className={svgClass(className)} />;
  }

  const width = box.width - INSET * 2;
  const height = box.height - INSET * 2;
  const corner = radius ?? height / 2;
  const perimeter = perimeterOf(width, height, corner);
  const arc = perimeter * ARC;

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      className={svgClass(className)}
      style={{ "--beam-length": `${perimeter}px` } as React.CSSProperties}
    >
      <rect
        rx={corner}
        ry={corner}
        strokeDasharray={`${arc} ${perimeter - arc}`}
      />
    </svg>
  );
}

function svgClass(className?: string) {
  return cn(
    "beam pointer-events-none absolute inset-0 size-full overflow-visible",
    className,
  );
}
