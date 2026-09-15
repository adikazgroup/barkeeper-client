"use client";

import {
  useEffect,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

import { OTP_LENGTH } from "@/lib/auth/constants";
import { cn } from "@/lib/utils";

/**
 * A code is only sendable once every box holds a digit.
 *
 * Written as a length check plus a plain regex literal rather than a
 * `new RegExp` built from a template string: in a template literal `\d` is an
 * unknown escape that collapses to a bare `d`, which quietly turns the pattern
 * into "six letter d's" and rejects every real code.
 */
export const isCompleteOtp = (value: string) =>
  value.length === OTP_LENGTH && /^\d+$/.test(value);

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Fired the moment the last box is filled, so the form can submit itself. */
  onComplete?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
}

/**
 * Six boxes behaving as one field.
 *
 * The value is one string and each box is a view onto one character, so a
 * pasted code — or one the phone autofills, which drops the whole thing into
 * the first box — spreads across the boxes instead of losing all but its first
 * digit. A cleared box in the middle is held as a space so the digits after it
 * keep their positions; `isCompleteOtp` is what decides the code is sendable.
 */
export function OtpInput({
  value,
  onChange,
  onComplete,
  disabled = false,
  invalid = false,
  autoFocus = false,
}: OtpInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus) inputs.current[0]?.focus();
  }, [autoFocus]);

  const commit = (next: string) => {
    onChange(next);
    if (isCompleteOtp(next)) onComplete?.(next);
  };

  const focusBox = (index: number) => {
    const box = inputs.current[Math.min(Math.max(index, 0), OTP_LENGTH - 1)];
    box?.focus();
    box?.select();
  };

  /** Writes `digits` from `index` onwards, leaving every other box untouched. */
  const writeAt = (index: number, digits: string) => {
    const chars = value.padEnd(OTP_LENGTH, " ").split("");
    for (let offset = 0; offset < digits.length; offset += 1) {
      if (index + offset >= OTP_LENGTH) break;
      chars[index + offset] = digits[offset];
    }
    return chars.join("").replace(/\s+$/, "");
  };

  const clearAt = (index: number) => {
    const chars = value.padEnd(OTP_LENGTH, " ").split("");
    chars[index] = " ";
    return chars.join("").replace(/\s+$/, "");
  };

  const handleInput = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return;

    commit(writeAt(index, digits));
    focusBox(index + digits.length);
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();

      if (value[index] && value[index] !== " ") {
        // This box has a digit — clear it and stay put.
        commit(clearAt(index));
      } else if (index > 0) {
        // Already empty — step back and clear that one instead.
        commit(clearAt(index - 1));
        focusBox(index - 1);
      }
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusBox(index - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const digits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!digits) return;

    commit(digits);
    focusBox(digits.length);
  };

  return (
    <div
      className="flex justify-between gap-2"
      role="group"
      aria-label={`${OTP_LENGTH}-digit code`}
    >
      {Array.from({ length: OTP_LENGTH }).map((_, index) => (
        <input
          // Position is the identity here — the boxes never reorder.
          key={index}
          ref={(node) => {
            inputs.current[index] = node;
          }}
          value={(value[index] ?? "").trim()}
          onChange={(event) => handleInput(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.target.select()}
          disabled={disabled}
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label={`Digit ${index + 1}`}
          className={cn(
            "h-13 min-w-0 flex-1 rounded-lg border bg-card/60 text-center font-mono text-[19px] tabular-nums text-foreground backdrop-blur-sm transition-colors",
            "focus:border-primary/40 focus:ring-2 focus:ring-primary/15 focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-60",
            invalid ? "border-danger/60" : "border-border",
          )}
        />
      ))}
    </div>
  );
}
