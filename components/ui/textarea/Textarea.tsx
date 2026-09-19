"use client";

import { cn } from "@/lib/utils";
import { Loader2Icon, CircleXIcon } from "@/components/icons/Icons";
import {
  useState,
  forwardRef,
  useRef,
  type ReactNode,
  type ChangeEvent,
  type TextareaHTMLAttributes,
  useEffect,
  useCallback,
  useImperativeHandle,
  useId,
} from "react";

export type TextareaSize = "sm" | "md" | "lg";
export type TextareaVariant = "default" | "filled" | "outline" | "ghost";

export interface TextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange"
> {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onValueChange?: (value: string) => void;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  requiredSign?: boolean;
  minRows?: number;
  maxRows?: number;
  autoResize?: boolean;
  maxLength?: number;
  showCount?: boolean;
  clearable?: boolean;
  loading?: boolean;
  size?: TextareaSize;
  variant?: TextareaVariant;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      fullWidth = false,
      startIcon,
      endIcon,
      onValueChange,
      onChange,
      value,
      defaultValue,
      requiredSign = false,
      required = false,
      minRows = 3,
      maxRows = 10,
      autoResize = false,
      maxLength,
      showCount = false,
      clearable = false,
      loading = false,
      size = "md",
      variant = "default",
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    // -----------------------------
    // Controlled / Uncontrolled
    // -----------------------------
    const isControlled = value !== undefined;

    const [internalValue, setInternalValue] = useState(
      (defaultValue as string) || "",
    );

    const currentValue = isControlled ? String(value ?? "") : internalValue;

    // -----------------------------
    // Refs
    // -----------------------------
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    // -----------------------------
    // Accessibility IDs
    // -----------------------------
    const generatedId = useId();

    const textareaId = id || `textarea-${generatedId}`;

    const helperId = `${textareaId}-helper`;
    const errorId = `${textareaId}-error`;
    const counterId = `${textareaId}-counter`;

    const describedBy = [
      helperText && !error ? helperId : null,
      error ? errorId : null,
      showCount ? counterId : null,
    ]
      .filter(Boolean)
      .join(" ");

    // -----------------------------
    // Auto Resize
    // -----------------------------
    const adjustHeight = useCallback(() => {
      if (!autoResize || !textareaRef.current) return;

      const element = textareaRef.current;

      element.style.height = "auto";

      const computed = getComputedStyle(element);

      const lineHeight = parseFloat(computed.lineHeight) || 24;

      const paddingTop = parseFloat(computed.paddingTop) || 0;

      const paddingBottom = parseFloat(computed.paddingBottom) || 0;

      const minHeight = minRows * lineHeight + paddingTop + paddingBottom;

      const maxHeight = maxRows * lineHeight + paddingTop + paddingBottom;

      const nextHeight = Math.min(
        Math.max(element.scrollHeight, minHeight),
        maxHeight,
      );

      element.style.height = `${nextHeight}px`;
    }, [autoResize, minRows, maxRows]);

    useEffect(() => {
      adjustHeight();
    }, [currentValue, adjustHeight]);

    // -----------------------------
    // Change Handler
    // -----------------------------
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const nextValue = e.target.value;

      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onChange?.(e);
      onValueChange?.(nextValue);
    };

    // -----------------------------
    // Clear Handler
    // -----------------------------
    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }

      onValueChange?.("");

      textareaRef.current?.focus();
    };

    // -----------------------------
    // Character Count
    // -----------------------------
    const characterCount = currentValue.length;

    const isOverLimit =
      typeof maxLength === "number" && characterCount > maxLength;

    // -----------------------------
    // Size Variants
    // -----------------------------
    const sizeClasses = {
      sm: "min-h-[72px] px-3 py-2 text-xs",
      md: "min-h-[96px] px-3 py-2 text-sm",
      lg: "min-h-[120px] px-4 py-3 text-base",
    };

    // -----------------------------
    // Visual Variants
    // -----------------------------
    const variantClasses = {
      default: "bg-transparent ring-1 ring-border",

      filled: "bg-muted ring-1 ring-transparent",

      outline: "bg-background ring-2 ring-border",

      ghost: "bg-transparent ring-0",
    };

    const textareaClasses = cn(
      // Layout
      "flex w-full rounded-md",

      // Typography
      "text-foreground",
      "placeholder:text-muted-foreground",

      // Animation
      "transition-all duration-200",

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

      // Resize
      autoResize ? "resize-none overflow-hidden" : "resize-y",

      // Icons
      startIcon && "pl-10",

      (endIcon || clearable || loading) && "pr-10",

      // Error
      error && "ring-danger focus-visible:ring-danger/30",
    );

    return (
      <div
        className={cn(
          "flex flex-col gap-1.5",
          fullWidth && "w-full",
          className,
        )}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className="cursor-pointer text-sm font-medium text-foreground"
          >
            {label}

            {(required || requiredSign) && (
              <span aria-hidden="true" className="ml-1 text-danger">
                *
              </span>
            )}
          </label>
        )}

        {/* Field */}
        <div className="relative">
          {/* Start Icon */}
          {startIcon && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-3 z-10 text-muted-foreground"
            >
              {startIcon}
            </div>
          )}

          {/* Textarea */}
          <textarea
            id={textareaId}
            ref={textareaRef}
            className={textareaClasses}
            value={currentValue}
            onChange={handleChange}
            rows={minRows}
            maxLength={maxLength}
            disabled={disabled || loading}
            required={required}
            aria-required={required}
            aria-invalid={!!error}
            aria-busy={loading}
            aria-describedby={describedBy.length > 0 ? describedBy : undefined}
            {...props}
          />

          {/* Right Actions */}
          <div className="absolute right-3 top-3 flex items-center gap-2">
            {loading ? (
              <Loader2Icon
                aria-hidden="true"
                className="h-4 w-4 animate-spin text-muted-foreground"
              />
            ) : clearable && currentValue && !disabled ? (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear textarea"
                className={cn(
                  "rounded-sm text-muted-foreground",
                  "transition-colors",
                  "hover:text-foreground",
                  "focus-visible:outline-none",
                  "focus-visible:ring",
                  "focus-visible:ring-ring",
                )}
              >
                <CircleXIcon className="h-4 w-4" />
              </button>
            ) : endIcon ? (
              <div aria-hidden="true" className="text-muted-foreground">
                {endIcon}
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {error ? (
              <p
                id={errorId}
                role="alert"
                className="mt-0.5 text-xs font-medium text-danger"
              >
                {error}
              </p>
            ) : helperText ? (
              <p id={helperId} className="mt-0.5 text-xs text-muted-foreground">
                {helperText}
              </p>
            ) : null}
          </div>

          {showCount && (
            <p
              id={counterId}
              aria-live="polite"
              className={cn(
                "mt-0.5 whitespace-nowrap text-xs tabular-nums text-muted-foreground",
                isOverLimit && "font-medium text-danger",
              )}
            >
              {characterCount}
              {maxLength && ` / ${maxLength}`}
            </p>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
