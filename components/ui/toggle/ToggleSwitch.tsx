"use client";

import React, {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { Loader2Icon } from "@/components/icons/Icons";

export type ToggleSize = "sm" | "md" | "lg";
export type ToggleVariant =
  "primary" | "secondary" | "success" | "warning" | "destructive" | "neutral";
export type ToggleLabelPosition = "left" | "right" | "top";

export interface ToggleSwitchProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> {
  /** The controlled checked state of the toggle */
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (checked: boolean) => void;
  size?: ToggleSize;
  variant?: ToggleVariant;
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  fullWidth?: boolean;
  labelPosition?: ToggleLabelPosition;
  thumbIcon?: string | ReactNode;
  onIcon?: string | ReactNode;
  offIcon?: string | ReactNode;
  loading?: boolean;
  required?: boolean;
}

const ToggleSwitch = forwardRef<HTMLButtonElement, ToggleSwitchProps>(
  (
    {
      className,
      checked,
      defaultChecked = false,
      onCheckedChange,
      onChange,
      disabled = false,
      loading = false,
      size = "md",
      variant = "primary",
      label,
      helperText,
      error,
      fullWidth = false,
      labelPosition = "right",
      thumbIcon,
      onIcon,
      offIcon,
      required,
      id,
      ...props
    },
    ref,
  ) => {
    // State for uncontrolled mode
    const [internalChecked, setInternalChecked] =
      React.useState<boolean>(defaultChecked);

    // Derived state
    const isChecked = checked !== undefined ? checked : internalChecked;

    const generatedId = React.useId();
    const toggleId = id || generatedId;
    const labelId = `${toggleId}-label`;
    const descriptionId = `${toggleId}-description`;
    const errorId = `${toggleId}-error`;

    const handleToggle = () => {
      // Prevent default to avoid double firing if inside a label
      // e.preventDefault();
      // Actually standard button type=button doesn't need preventDefault usually unless inside form submit

      if (disabled || loading) return;

      const newValue = !isChecked;

      // Update internal state if uncontrolled
      if (checked === undefined) {
        setInternalChecked(newValue);
      }

      // Trigger callbacks
      onCheckedChange?.(newValue);
      onChange?.(newValue);
    };

    // Size Configurations
    const sizeConfig = {
      sm: {
        switch: "w-8 h-4",
        thumb: "h-3 w-3",
        translate: "translate-x-4",
        icon: 10,
      },
      md: {
        switch: "w-11 h-6",
        thumb: "h-5 w-5",
        translate: "translate-x-5",
        icon: 14,
      },
      lg: {
        switch: "w-14 h-7",
        thumb: "h-6 w-6",
        translate: "translate-x-7",
        icon: 16,
      },
    };

    const currentSize = sizeConfig[size];

    // Variant Configurations
    const variantConfig = {
      primary: isChecked
        ? "bg-primary border-primary"
        : "bg-input border-transparent",

      secondary: isChecked
        ? "bg-secondary border-secondary"
        : "bg-input border-transparent",

      success: isChecked
        ? "bg-success border-success"
        : "bg-input border-transparent",

      warning: isChecked
        ? "bg-warning border-warning"
        : "bg-input border-transparent",

      destructive: isChecked
        ? "bg-danger border-danger"
        : "bg-input border-transparent",

      neutral: isChecked
        ? "bg-reverse border-reverse"
        : "bg-input border-transparent",
    };

    const thumbVariantConfig = {
      primary: isChecked
        ? "bg-primary-foreground text-primary"
        : "bg-background text-foreground",

      secondary: isChecked
        ? "bg-secondary-foreground text-secondary"
        : "bg-background text-muted-foreground",

      success: isChecked
        ? "bg-white text-success"
        : "bg-background text-muted-foreground",

      warning: isChecked
        ? "bg-white text-warning"
        : "bg-background text-muted-foreground",

      destructive: isChecked
        ? "bg-white text-danger"
        : "bg-background text-muted-foreground",

      neutral: isChecked
        ? "bg-background text-reverse"
        : "bg-background text-muted-foreground",
    };

    // Render Logic
    const renderIcon = (icon: string | ReactNode, wrapperClass = "") => {
      if (!icon) return null;
      return <div className={wrapperClass}>{icon}</div>;
    };

    return (
      <div
        className={cn(
          "inline-flex flex-col gap-1.5",
          fullWidth ? "w-full" : "w-fit",
          disabled && "opacity-60",
          className,
        )}
      >
        <div
          className={cn(
            "relative flex items-center min-h-fit",
            labelPosition === "left" && "flex-row gap-3",
            labelPosition === "right" && "flex-row gap-3",
            labelPosition === "top" && "flex-col items-start gap-2",
          )}
        >
          {/* Label (Top or Side - Left) */}
          {label && (labelPosition === "top" || labelPosition === "left") && (
            <LabelContent
              label={label}
              required={required}
              id={labelId}
              toggleId={toggleId}
              onClick={() => !disabled && !loading && handleToggle()}
            />
          )}

          {/* Switch Button */}
          <button
            ref={ref}
            id={toggleId}
            type="button"
            role="switch"

            aria-checked={isChecked}

            aria-labelledby={label ? labelId : undefined}

            aria-describedby={
              error ? errorId : helperText ? descriptionId : undefined
            }

            aria-invalid={!!error}

            aria-required={required}

            aria-disabled={disabled || loading}

            aria-busy={loading}

            disabled={disabled || loading}
            className={cn(
              "peer relative shrink-0 inline-flex items-center",
              "rounded-full border-2",
              "transition-all duration-200 ease-out",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-ring",
              "focus-visible:ring-offset-2",
              "disabled:pointer-events-none",
              "disabled:cursor-not-allowed",
              currentSize.switch,
              variantConfig[variant],
              error && "ring-2 ring-danger/40 ring-offset-1",
            )}
            {...props}
          >
            {/* Track Icons (Optional) */}
            <span
              className={cn(
                "absolute inset-0 between px-1.5 opacity-100 transition-opacity duration-200",
                size === "sm" && "px-0.5",
              )}
            >
              {/* On Icon (Left side when checked) */}
              <span
                className={cn(
                  "center transition-opacity duration-200",
                  isChecked ? "opacity-100 delay-75" : "opacity-0",
                )}
              >
                {renderIcon(onIcon, "text-primary-foreground")}
              </span>

              {/* Off Icon (Right side when unchecked) */}
              <span
                className={cn(
                  "center transition-opacity duration-200",
                  !isChecked ? "opacity-100 delay-75" : "opacity-0",
                )}
              >
                {renderIcon(offIcon, "text-muted-foreground")}
              </span>
            </span>

            {/* Thumb */}
            <span
              className={cn(
                "pointer-events-none",
                "flex items-center justify-center",
                "rounded-full",
                "shadow-sm",
                "transition-all duration-200 ease-out",
                currentSize.thumb,
                thumbVariantConfig[variant],
                isChecked ? currentSize.translate : "translate-x-0",
              )}
            >
              {loading ? (
                <Loader2Icon className="h-3 w-3 animate-spin" />
              ) : (
                thumbIcon &&
                renderIcon(
                  thumbIcon,
                  isChecked ? "text-primary" : "text-foreground",
                )
              )}
            </span>
          </button>

          {/* Label (Right) */}
          {label && labelPosition === "right" && (
            <LabelContent
              label={label}
              required={required}
              id={labelId}
              toggleId={toggleId}
              onClick={() => !disabled && !loading && handleToggle()}
            />
          )}
        </div>

        {/* Helper Text or Error */}
        {(helperText || error) && (
          <div
            id={error ? errorId : descriptionId}
            className={cn(
              "text-xs ml-0.5",
              error ? "text-danger" : "text-muted-foreground",
            )}
          >
            {error || helperText}
          </div>
        )}
      </div>
    );
  },
);

ToggleSwitch.displayName = "ToggleSwitch";

// Sub-component for Label to reduce duplication
const LabelContent = ({
  label,
  required,
  id,
  toggleId,
  onClick,
}: {
  label: ReactNode;
  required?: boolean;
  id: string;
  toggleId: string;
  onClick: () => void;
}) => (
  <label
    id={id}
    htmlFor={toggleId}
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={cn(
      "text-sm font-medium",
      "leading-none",
      "text-foreground",
      "cursor-pointer",
      "select-none",
    )}
  >
    {label}
    {required && (
      <span className="text-danger ml-1" aria-hidden="true">
        *
      </span>
    )}
  </label>
);

export { ToggleSwitch };
