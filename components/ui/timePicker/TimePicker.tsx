"use client";

/**
 * A time of day, chosen from the slots that are actually offered.
 *
 * Deliberately not a free-form clock. Wherever a time is picked here somebody
 * downstream has to honour it — a kitchen, a counter, a delivery run — and a
 * field that accepts 04:17 when the doors open at eleven only moves the
 * refusal further down the line, after the customer has filled in the rest.
 *
 * So the caller states when it is open (`windows`) and how far apart the slots
 * sit (`step`), and this offers exactly those. `min` narrows it further for the
 * part of a window that has already gone by today.
 */

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Clock } from "lucide-react";

import { CaretDownOutlineIcon, CheckIcon } from "@/components/icons/Icons";
import { cn } from "@/lib/utils";

/** One stretch of the day, inclusive of both ends, as `"HH:mm"`. */
export interface TimeWindow {
  from: string;
  to: string;
}

interface TimePickerProps {
  /** `"HH:mm"`, or empty for nothing chosen yet. */
  value: string;
  onChange: (value: string) => void;
  /**
   * When slots are offered. Several windows because a day is not always one
   * stretch — a kitchen open 11:00 to 02:00 is open twice on any given date.
   * Defaults to the whole day.
   */
  windows?: TimeWindow[];
  /** Minutes between slots. */
  step?: number;
  /** Earliest slot to offer, as `"HH:mm"` — for when the date is today. */
  min?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
}

const DAY: TimeWindow[] = [{ from: "00:00", to: "23:59" }];

/** `"HH:mm"` as minutes past midnight, or `null` if it is not a time. */
function toMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  return hours * 60 + minutes;
}

const toClock = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
    minutes % 60,
  ).padStart(2, "0")}`;

/**
 * How the slot is read out — in the reader's own locale, so a visitor who
 * thinks in 24-hour time is not handed "1:30 PM" and vice versa.
 */
function toLabel(minutes: number): string {
  const date = new Date(2000, 0, 1, Math.floor(minutes / 60), minutes % 60);
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TimePicker({
  value,
  onChange,
  windows = DAY,
  step = 15,
  min,
  placeholder = "Pick a time",
  className,
  disabled = false,
  id,
  "aria-label": ariaLabel,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const generatedId = useId();
  const buttonId = id ?? generatedId;
  const listboxId = `${generatedId}-listbox`;

  const floor = min ? toMinutes(min) : null;

  const slots = useMemo(() => {
    const found: number[] = [];

    for (const window of windows) {
      const from = toMinutes(window.from);
      const to = toMinutes(window.to);
      if (from === null || to === null) continue;

      // Snapped up to the next whole step from midnight, so every window in
      // the day lands on the same grid — 11:05 to 14:00 at a 15-minute step
      // offers 11:15, not 11:05.
      const first = Math.ceil(from / step) * step;

      for (let at = first; at <= to; at += step) {
        if (floor !== null && at < floor) continue;
        found.push(at);
      }
    }

    // Windows may be given in any order and may overlap; the list the reader
    // scrolls should still run forwards, once each.
    return [...new Set(found)].sort((a, b) => a - b);
  }, [windows, step, floor]);

  const selected = toMinutes(value);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // A list of eighty slots opens at the top, which is no use when the chosen
  // one is at nine in the evening. Jump to it instead.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "center" });
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        id={buttonId}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        onClick={() => !disabled && setOpen((was) => !was)}
        className={cn(
          "flex h-9 w-full cursor-pointer items-center gap-2 rounded-full border border-border bg-card/60 px-4 text-[13px] backdrop-blur-sm transition-colors",
          "focus:border-primary/40 focus:ring-2 focus:ring-primary/15 focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        <Clock aria-hidden className="size-3.5 shrink-0 text-primary" />

        <span
          className={cn(
            "truncate text-left",
            selected === null && "text-muted-foreground",
          )}
        >
          {selected === null ? placeholder : toLabel(selected)}
        </span>

        <CaretDownOutlineIcon
          className={cn(
            "ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        ref={listRef}
        id={listboxId}
        role="listbox"
        aria-labelledby={buttonId}
        className={cn(
          "absolute right-0 left-0 z-50 mt-2 max-h-56 overflow-y-auto rounded-xl border border-border bg-card shadow-lg",
          "origin-top transition-all duration-200",
          open
            ? "visible scale-100 opacity-100"
            : "pointer-events-none invisible scale-95 opacity-0",
        )}
      >
        {slots.length > 0 ? (
          slots.map((at) => {
            const isSelected = at === selected;

            return (
              <button
                key={at}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(toClock(at));
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-[13px] transition-colors",
                  isSelected
                    ? "bg-primary text-background"
                    : "hover:bg-muted hover:text-foreground",
                )}
              >
                <span className="tabular-nums">{toLabel(at)}</span>
                {isSelected && <CheckIcon className="size-3.5 shrink-0" />}
              </button>
            );
          })
        ) : (
          <p className="px-4 py-3 text-[12.5px] text-muted-foreground">
            Nothing left today — try tomorrow.
          </p>
        )}
      </div>
    </div>
  );
}
