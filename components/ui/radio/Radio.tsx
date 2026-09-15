"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ReactNode, type ChangeEvent, useId } from "react";

export type RadioSize = "sm" | "md" | "lg";
export type RadioColor =
  "primary" | "secondary" | "success" | "warning" | "destructive" | "neutral";
/**
 * Each variant is a visually distinct treatment, not just a recolor:
 * - default : hollow ring → colored dot
 * - solid   : control fills with the color, white dot punched out
 * - outline : bold 2px ring + soft tint, colored dot
 * - check   : control fills with the color, white checkmark
 * - card    : the whole option becomes a selectable bordered tile
 */
export type RadioVariant = "default" | "solid" | "outline" | "check" | "card";

interface RadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "size"
> {
  name?: string;
  label?: ReactNode;
  error?: ReactNode;
  value?: string | number;
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  className?: string;
  helperText?: ReactNode;
  onValueChange?: (value: string | number) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: RadioSize;
  color?: RadioColor;
  variant?: RadioVariant;
}

/* Static class maps — Tailwind can't see interpolated names, so spell them out. */

const SIZE: Record<
  RadioSize,
  { box: string; dot: string; check: string; text: string; gap: string }
> = {
  sm: {
    box: "size-4",
    dot: "size-1.5",
    check: "size-3",
    text: "text-xs",
    gap: "gap-2",
  },
  md: {
    box: "size-5",
    dot: "size-2",
    check: "size-3.5",
    text: "text-sm",
    gap: "gap-2.5",
  },
  lg: {
    box: "size-6",
    dot: "size-2.5",
    check: "size-4",
    text: "text-base",
    gap: "gap-3",
  },
};

const ACCENT: Record<
  RadioColor,
  { border: string; fill: string; soft: string; ring: string }
> = {
  primary: {
    border: "border-primary",
    fill: "bg-primary",
    soft: "bg-primary/10",
    ring: "peer-focus-visible:ring-primary/40",
  },
  secondary: {
    border: "border-secondary-foreground",
    fill: "bg-secondary-foreground",
    soft: "bg-muted",
    ring: "peer-focus-visible:ring-ring/40",
  },
  success: {
    border: "border-success",
    fill: "bg-success",
    soft: "bg-success/10",
    ring: "peer-focus-visible:ring-success/40",
  },
  warning: {
    border: "border-warning",
    fill: "bg-warning",
    soft: "bg-warning/10",
    ring: "peer-focus-visible:ring-warning/40",
  },
  destructive: {
    border: "border-danger",
    fill: "bg-danger",
    soft: "bg-danger/10",
    ring: "peer-focus-visible:ring-danger/40",
  },
  neutral: {
    border: "border-foreground",
    fill: "bg-foreground",
    soft: "bg-muted",
    ring: "peer-focus-visible:ring-ring/40",
  },
};

const CheckMark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="m9.55 15.15l8.475-8.475q.3-.3.7-.3t.7.3t.3.713t-.3.712l-9.175 9.2q-.3.3-.7.3t-.7-.3L4.55 13q-.3-.3-.288-.712t.313-.713t.713-.3t.712.3z" />
  </svg>
);

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      name,
      label,
      error,
      value,
      checked,
      onChange,
      children,
      className,
      helperText,
      onValueChange,
      disabled = false,
      fullWidth = false,
      size = "md",
      color = "primary",
      variant = "default",
      id,
      ...props
    },
    ref,
  ) => {
    const uniqueId = useId();
    const radioId = id || `radio-${uniqueId}`;
    const descriptionId = `${radioId}-description`;
    const errorId = `${radioId}-error`;

    const s = SIZE[size];
    const a = ACCENT[color];
    const isCard = variant === "card";

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    const input = (
      <input
        id={radioId}
        type="radio"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        value={value}
        name={name}
        onChange={handleChange}
        ref={ref}
        aria-describedby={
          error ? errorId : helperText ? descriptionId : undefined
        }
        {...props}
      />
    );

    /* The circular control. `card` reuses the plain dot inside its tile. */
    const control = (
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-full border bg-background transition-all duration-200",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
          s.box,
          a.ring,
          checked
            ? cn(
                a.border,
                variant === "outline" && cn("border-2", a.soft),
                (variant === "solid" || variant === "check") &&
                  cn("border-transparent", a.fill),
              )
            : "border-input group-hover:border-muted-foreground/50",
          disabled && "opacity-50",
          error && "border-danger",
        )}
      >
        {/* dot — default / outline / card */}
        {variant !== "check" && (
          <span
            className={cn(
              "rounded-full transition-transform duration-200",
              s.dot,
              variant === "solid" ? "bg-background" : a.fill,
              checked ? "scale-100" : "scale-0",
            )}
          />
        )}
        {/* checkmark — check */}
        {variant === "check" && (
          <CheckMark
            className={cn(
              "text-background transition-transform duration-200",
              s.check,
              checked ? "scale-100" : "scale-0",
            )}
          />
        )}
      </span>
    );

    const textBlock = (label || children) && (
      <span className="flex flex-col">
        <span
          className={cn(
            "font-medium leading-tight select-none",
            s.text,
            disabled ? "opacity-50" : "text-foreground",
            error && "text-danger",
          )}
        >
          {children || label}
        </span>
        {helperText && !error && (
          <span
            className={cn(
              "mt-1 text-muted-foreground",
              size === "sm" ? "text-[10px]" : "text-xs",
            )}
          >
            {helperText}
          </span>
        )}
        {error && (
          <span
            className={cn(
              "mt-0.5 text-danger",
              size === "sm" ? "text-[10px]" : "text-xs",
            )}
          >
            {error}
          </span>
        )}
      </span>
    );

    /* ------------------------------- CARD ------------------------------- */
    if (isCard) {
      return (
        <label
          className={cn(
            "group relative flex items-start rounded-lg border p-3.5 transition-all duration-200",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
            s.gap,
            a.ring,
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
            checked
              ? cn(a.border, a.soft, "shadow-sm")
              : "border-border hover:border-muted-foreground/40",
            error && "border-danger",
            fullWidth && "w-full",
            className,
          )}
        >
          {input}
          <span className="pt-0.5">{control}</span>
          {textBlock}
        </label>
      );
    }

    /* ----------------------------- STANDARD ----------------------------- */
    return (
      <div className={cn("flex flex-col", fullWidth && "w-full", className)}>
        <label
          className={cn(
            "group flex items-start",
            s.gap,
            disabled ? "cursor-not-allowed" : "cursor-pointer",
          )}
        >
          <span className="relative flex h-fit items-center pt-0.5">
            {input}
            {control}
          </span>
          {textBlock}
        </label>
      </div>
    );
  },
);

Radio.displayName = "Radio";

export { Radio };
