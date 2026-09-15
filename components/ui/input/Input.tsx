"use client";

import type React from "react";
import { forwardRef, type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onValueChange?: (value: string) => void;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      helperText,
      error,
      fullWidth = false,
      startIcon,
      endIcon,
      onValueChange,
      onChange,
      disabled = false,
      required = false,
      id,
      size = "md",
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const uniqueId = useId();

    const inputId =
      id ||
      `input-${label?.replace(/\s+/g, "-").toLowerCase() || "field"}-${uniqueId}`;

    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const describedBy = error ? errorId : helperText ? helperId : undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    const sizeClasses = {
      sm: "h-8 text-xs",
      md: "h-10 text-sm",
      lg: "h-12 text-base",
    };

    const variantClasses = {
      default: "ring ring-border bg-background",
      filled: "bg-muted ring ring-transparent",
    };

    const inputClasses = cn(
      // Base
      "flex w-full rounded-md px-3 transition-colors",

      // Typography
      "text-foreground placeholder:text-muted-foreground",

      // Variant
      variantClasses[variant],

      // Size
      sizeClasses[size],

      // Focus
      "focus-visible:outline-none",
      "focus-visible:ring",
      "focus-visible:ring-ring",

      // Disabled
      "disabled:cursor-not-allowed",
      "disabled:opacity-60",

      // Icon spacing
      startIcon && "pl-10",
      endIcon && "pr-10",

      // Error
      error && "ring-danger focus-visible:ring-danger/20",

      className,
    );

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={inputId}
            className="cursor-pointer text-sm font-medium dark:font-normal text-foreground"
          >
            {label}

            {required && (
              <span aria-hidden="true" className="ml-1 text-danger">
                *
              </span>
            )}
          </label>
        )}

        <div
          className="relative flex items-center"
          data-invalid={!!error}
          data-disabled={disabled}
        >
          {startIcon && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-2.5 text-muted-foreground"
            >
              {startIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            required={required}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            onChange={handleChange}
            className={inputClasses}
            {...props}
          />

          {/* Not aria-hidden: endIcon is commonly an interactive control
              (password reveal, clear button) and must stay reachable. */}
          {endIcon && (
            <div className="absolute right-2.5 text-muted-foreground">
              {endIcon}
            </div>
          )}
        </div>

        {!error && helperText && (
          <p id={helperId} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}

        {error && (
          <p id={errorId} role="alert" className="text-xs text-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
