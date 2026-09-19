"use client";

import { useState } from "react";
import { Star } from "lucide-react";

import { MAX_RATING } from "@/lib/reviews/types";
import { cn } from "@/lib/utils";

/**
 * A score, read and written.
 *
 * Two components rather than one switched by a prop: a row of stars that is
 * only being read is a figure, and a row that is being set is a control with
 * five hit targets, a keyboard order and a label each. Folding them together
 * would leave the reading half carrying the writing half's semantics.
 */

const SCALE = Array.from({ length: MAX_RATING }, (_, index) => index + 1);

/** The score as written. Printed, not editable. */
export function Stars({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${rating} out of ${MAX_RATING}`}
    >
      {SCALE.map((step) => (
        <Star
          key={step}
          aria-hidden
          className={cn(
            "size-3.5",
            step <= rating
              ? "fill-primary text-primary"
              : "text-muted-foreground/35",
          )}
        />
      ))}
    </span>
  );
}

/**
 * The score being chosen.
 *
 * A radio group, because that is what it is: five values, one answer, and
 * arrow keys that work without anything being wired up for them. The hover
 * preview is only paint — what is actually checked never moves until the
 * customer picks.
 */
export function StarPicker({
  value,
  onChange,
  disabled,
  name = "rating",
}: {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
  name?: string;
}) {
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;

  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      className="inline-flex items-center gap-1"
      onMouseLeave={() => setHovered(0)}
    >
      {SCALE.map((step) => (
        <label
          key={step}
          onMouseEnter={() => setHovered(step)}
          className={cn(
            "cursor-pointer rounded-full p-1 transition-transform duration-200",
            !disabled && "hover:scale-110",
            disabled && "cursor-not-allowed",
          )}
        >
          <input
            type="radio"
            name={name}
            value={step}
            checked={value === step}
            disabled={disabled}
            onChange={() => onChange(step)}
            className="peer sr-only"
          />

          <Star
            aria-hidden
            className={cn(
              "size-7 transition-colors duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:rounded-sm",
              step <= shown
                ? "fill-primary text-primary"
                : "text-muted-foreground/35",
            )}
          />

          <span className="sr-only">
            {step} {step === 1 ? "star" : "stars"}
          </span>
        </label>
      ))}
    </div>
  );
}
