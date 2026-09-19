"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";

import { EyeIcon, EyeOffIcon } from "@/components/icons/Icons";
import { cn } from "@/lib/utils";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
  /** Renders the show/hide toggle and flips `type` between password and text. */
  revealable?: boolean;
  /** Sits on the label row, right-aligned — used for "Forgot password?". */
  action?: ReactNode;
}


export function AuthField({
  label,
  error,
  icon,
  revealable = false,
  action,
  className,
  type = "text",
  id,
  ...props
}: AuthFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? `field-${generatedId}`;
  const [revealed, setRevealed] = useState(false);

  const resolvedType = revealable ? (revealed ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={fieldId}
          className="text-[13px] font-medium tracking-[-0.01em] text-foreground"
        >
          {label}
        </label>
        {action}
      </div>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground z-10">
            {icon}
          </span>
        )}

        <input
          id={fieldId}
          type={resolvedType}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={cn(
            "h-11 w-full rounded-lg border bg-card/60 px-3.5 text-[14px] text-foreground backdrop-blur-sm transition-colors",
            "placeholder:text-muted-foreground/70",
            "focus:border-primary/40 focus:ring-2 focus:ring-primary/15 focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-60",
            icon && "pl-10.5",
            revealable && "pr-10.5",
            error ? "border-danger/60" : "border-border",
            className,
          )}
          {...props}
        />

        {revealable && (
          <button
            type="button"
            onClick={() => setRevealed((shown) => !shown)}
            aria-label={revealed ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none z-10 cursor-pointer"
          >
            {revealed ? (
              <EyeOffIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p id={`${fieldId}-error`} className="text-[12px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Live chips under a new-password field. Only the length rule blocks submit —
 * the rest are encouragement, so they read as met/unmet rather than pass/fail.
 */
export function PasswordHints({
  value,
  hints,
}: {
  value: string;
  hints: { label: string; test: (v: string) => boolean }[];
}) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-live="polite">
      {hints.map(({ label, test }) => {
        const met = test(value);
        return (
          <li
            key={label}
            className={cn(
              "rounded-full border px-2.5 py-1 font-mono text-[10.5px] tracking-[0.04em] transition-colors",
              met
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border text-muted-foreground",
            )}
          >
            {met ? "✓ " : ""}
            {label}
          </li>
        );
      })}
    </ul>
  );
}
