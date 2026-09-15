"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@/components/icons/Icons";

type AMPM = "AM" | "PM";

/* ---------------- NumberInput ---------------- */

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  min: number;
  max: number;
  placeholder?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  placeholder,
}) => {
  const handleInputChange = (v: string) => {
    if (v === "") {
      onChange("");
      return;
    }

    const num = Number.parseInt(v);

    if (Number.isNaN(num)) return;
    if (num < min || num > max) return;

    onChange(String(num).padStart(2, "0"));
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        aria-label={placeholder}
        value={value}
        maxLength={2}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "size-6 sm:size-8",
          "bg-transparent",
          "text-center",
          "text-[10px] sm:text-sm",
          "font-bold",
          "text-foreground",
          "placeholder:text-muted-foreground",
          "border-none",
          "sm:border sm:border-border",
          "sm:rounded-lg",
          "transition-colors",
          "focus:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-ring",
        )}
      />
    </div>
  );
};

/* ---------------- AMPM Toggle ---------------- */

interface AMPMToggleProps {
  value: AMPM;
  onChange: (value: AMPM) => void;
}

export const AMPMToggle: React.FC<AMPMToggleProps> = ({ value, onChange }) => {
  return (
    <div
      role="radiogroup"
      aria-label="Select AM or PM"
      className={cn(
        "h-6 sm:h-8",
        "flex gap-0.5 sm:gap-1",
        "px-1",
        "rounded",
        "border border-border",
        "bg-muted",
        "center",
      )}
    >
      <button
        type="button"
        role="radio"
        aria-checked={value === "AM"}
        tabIndex={value === "AM" ? 0 : -1}
        onClick={() => onChange("AM")}
        className={cn(
          "h-4.5 w-5.5 sm:h-6 sm:w-7",
          "center",
          "rounded-xs",
          "text-[8px] sm:text-xs",
          "font-bold",
          "cursor-pointer",
          "transition-colors",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-ring",
          value === "AM"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        AM
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={value === "PM"}
        tabIndex={value === "PM" ? 0 : -1}
        onClick={() => onChange("PM")}
        className={cn(
          "h-4.5 w-5.5 sm:h-6 sm:w-7",
          "center",
          "rounded-xs",
          "text-[8px] sm:text-xs",
          "font-bold",
          "cursor-pointer",
          "transition-colors",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-ring",
          value === "PM"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        PM
      </button>
    </div>
  );
};

/* ---------------- TimeRangePicker ---------------- */

interface TimeRangePickerProps {
  startHour: string;
  startMin: string;
  startPeriod: AMPM;

  endHour: string;
  endMin: string;
  endPeriod: AMPM;

  onChangeStartHour: (v: string) => void;
  onChangeStartMin: (v: string) => void;
  onChangeStartPeriod: (v: AMPM) => void;

  onChangeEndHour: (v: string) => void;
  onChangeEndMin: (v: string) => void;
  onChangeEndPeriod: (v: AMPM) => void;

  variant?: "professional" | "minimal";
}

export const TimeRangePicker: React.FC<TimeRangePickerProps> = ({
  startHour,
  startMin,
  startPeriod,

  endHour,
  endMin,
  endPeriod,

  onChangeStartHour,
  onChangeStartMin,
  onChangeStartPeriod,

  onChangeEndHour,
  onChangeEndMin,
  onChangeEndPeriod,

  variant = "professional",
}) => {
  return (
    <div
      className={cn(
        "border-b border-border",
        "bg-muted/5 sm:bg-muted/10",
        "px-1 sm:px-4",
        "py-1.5 sm:py-2",
        variant === "minimal" && "space-y-4",
      )}
    >
      <div className="flex items-center justify-between gap-0.5 sm:gap-2">
        {/* Start Time */}

        <div
          role="group"
          aria-label="Start time"
          className="flex items-center gap-0.5 sm:gap-1.5 shrink-0"
        >
          <span className="hidden sm:inline text-[10px] font-bold uppercase text-muted-foreground">
            From
          </span>

          <div
            className={cn(
              "flex items-center gap-0.5 sm:gap-1",
              "rounded",
              "border border-border",
              "bg-card",
              "p-0.5",
              "text-card-foreground",
              "shadow-sm",
            )}
          >
            <NumberInput
              value={startHour}
              onChange={onChangeStartHour}
              min={1}
              max={12}
              placeholder="HH"
            />

            <span className="text-[10px] font-bold text-muted-foreground/60 sm:text-xs">
              :
            </span>

            <NumberInput
              value={startMin}
              onChange={onChangeStartMin}
              min={0}
              max={59}
              placeholder="MM"
            />

            <AMPMToggle value={startPeriod} onChange={onChangeStartPeriod} />
          </div>
        </div>

        <ArrowRightIcon
          className={cn(
            "h-3 w-3 shrink-0",
            "text-muted-foreground",
            "opacity-40",
          )}
        />

        {/* End Time */}

        <div
          role="group"
          aria-label="End time"
          className="flex items-center gap-0.5 sm:gap-1.5 shrink-0"
        >
          <span className="hidden sm:inline text-[10px] font-bold uppercase text-muted-foreground">
            To
          </span>

          <div
            className={cn(
              "flex items-center gap-0.5 sm:gap-1",
              "rounded",
              "border border-border",
              "bg-card",
              "p-0.5",
              "text-card-foreground",
              "shadow-sm",
            )}
          >
            <NumberInput
              value={endHour}
              onChange={onChangeEndHour}
              min={1}
              max={12}
              placeholder="HH"
            />

            <span className="text-[10px] font-bold text-muted-foreground/60 sm:text-xs">
              :
            </span>

            <NumberInput
              value={endMin}
              onChange={onChangeEndMin}
              min={0}
              max={59}
              placeholder="MM"
            />

            <AMPMToggle value={endPeriod} onChange={onChangeEndPeriod} />
          </div>
        </div>
      </div>
    </div>
  );
};
