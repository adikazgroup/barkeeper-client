"use client";

import { LoaderIcon } from "@/components/icons/Icons";
import { cn } from "@/lib/utils";
import React, {
  forwardRef,
  useRef,
  useState,
  MouseEvent,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type Variant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "light"
  | "dark"
  | "link";

type Size = "sm" | "default" | "lg" | "xl" | "icon" | "icon-sm" | "icon-lg";

type Rounded = "none" | "sm" | "default" | "lg" | "xl" | "full";

type Elevation = "none" | "sm" | "default" | "md" | "lg" | "xl";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loadingText?: string;
  ripple?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  size?: Size;
  elevation?: Elevation;
  rounded?: Rounded;
  variant?: Variant;
}

/* -------------------------------------------------------------------------- */
/*                                 COMPONENT                                  */
/* -------------------------------------------------------------------------- */

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      startIcon,
      endIcon,
      loadingText,
      ripple = true,
      loading = false,
      disabled = false,
      fullWidth = false,
      variant = "default",
      size = "default",
      rounded = "default",
      elevation = "none",
      type = "button",
      onClick,
      ...props
    },
    ref,
  ) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const isDisabled = disabled || loading;

    /* ---------------------------------------------------------------------- */
    /*                                RIPPLE                                  */
    /* ---------------------------------------------------------------------- */

    const createRipple = (e: MouseEvent<HTMLButtonElement>) => {
      if (!ripple || isDisabled) return;

      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();

      const size = Math.max(rect.width, rect.height) * 2;

      const x = e.clientX - rect.left - size / 2;

      const y = e.clientY - rect.top - size / 2;

      const id = Date.now();

      setRipples((prev) => [...prev, { id, x, y, size }]);

      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    };

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      createRipple(e);
      onClick?.(e);
    };

    /* ---------------------------------------------------------------------- */
    /*                              DESIGN TOKENS                             */
    /* ---------------------------------------------------------------------- */

    const variantStyles: Record<Variant, string> = {
      default:
        "bg-primary text-white border border-primary hover:bg-primary/90 hover:border-primary/90 dark:text-black",

      secondary:
        "bg-secondary text-foreground border border-border hover:bg-secondary/80",

      outline:
        "bg-background text-foreground border border-border hover:bg-muted",

      ghost: "bg-transparent text-foreground border-transparent hover:bg-muted",

      destructive:
        "bg-danger text-white border border-danger hover:bg-danger/90",

      success:
        "bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700",

      warning:
        "bg-amber-500 text-black border border-amber-500 hover:bg-amber-600 hover:border-amber-600",

      info: "bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 hover:border-blue-700",

      light: "bg-muted text-foreground border border-border hover:bg-muted/80",

      dark: "bg-foreground text-background border border-foreground hover:opacity-90",

      link: "bg-transparent border-transparent text-primary underline-offset-4 hover:underline p-0 h-auto shadow-none",
    };

    const sizeStyles: Record<Size, string> = {
      sm: "h-8 px-3 text-xs",
      default: "h-9 px-4 text-sm",
      lg: "h-11 px-5 text-base",
      xl: "h-14 px-8 text-lg",

      icon: "size-9 p-0",
      "icon-sm": "size-8 p-0",
      "icon-lg": "size-12 p-0",
    };

    const roundedStyles: Record<Rounded, string> = {
      none: "rounded-none",
      sm: "rounded-sm",
      default: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
    };

    const elevationStyles: Record<Elevation, string> = {
      none: "",

      sm: "shadow-sm shadow-black/10 dark:shadow-black/30",

      default: "shadow shadow-black/10 dark:shadow-black/30",

      md: "shadow-md shadow-black/15 dark:shadow-black/40",

      lg: "shadow-lg shadow-black/20 dark:shadow-black/50",

      xl: "shadow-xl shadow-black/25 dark:shadow-black/60",
    };

    /* ---------------------------------------------------------------------- */
    /*                                  JSX                                   */
    /* ---------------------------------------------------------------------- */

    return (
      <button
        ref={(node) => {
          buttonRef.current = node;

          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading || undefined}
        data-loading={loading ? "true" : undefined}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 overflow-hidden",
          "whitespace-nowrap font-medium select-none",
          "transition-all duration-200",
          "cursor-pointer",

          /* Accessibility */
          "focus-visible:outline-none",
          "focus-visible:ring",
          "focus-visible:ring-ring",
          // "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-background",

          /* Disabled */
          "disabled:pointer-events-none",
          "disabled:opacity-50",

          variantStyles[variant],
          sizeStyles[size],
          roundedStyles[rounded],
          elevationStyles[elevation],

          fullWidth && "w-full",

          className,
        )}
        onClick={handleClick}
        {...props}
      >
        {/* ------------------------------------------------------------------ */}
        {/* Ripple Layer                                                       */}
        {/* ------------------------------------------------------------------ */}

        {ripple && variant !== "link" && (
          <span
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ borderRadius: "inherit" }}
          >
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                className={cn(
                  "absolute rounded-full animate-ripple",
                  variant === "default" ||
                    variant === "destructive" ||
                    variant === "success" ||
                    variant === "warning" ||
                    variant === "info" ||
                    variant === "dark"
                    ? "bg-white/20"
                    : "bg-black/10 dark:bg-white/20",
                )}
                style={{
                  width: ripple.size,
                  height: ripple.size,
                  left: ripple.x,
                  top: ripple.y,
                }}
              />
            ))}
          </span>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Loading                                                            */}
        {/* ------------------------------------------------------------------ */}

        {loading && (
          <>
            <LoaderIcon
              className={cn(
                "animate-spin shrink-0",
                size === "sm" ? "size-3.5" : "size-4",
              )}
              aria-hidden="true"
            />

            <span className="sr-only">Loading...</span>
          </>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Start Icon                                                         */}
        {/* ------------------------------------------------------------------ */}

        {!loading && startIcon && (
          <span aria-hidden="true" className="inline-flex shrink-0">
            {startIcon}
          </span>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Content                                                            */}
        {/* ------------------------------------------------------------------ */}

        <span className="inline-flex items-center">
          {loading && loadingText ? loadingText : children}
        </span>

        {/* ------------------------------------------------------------------ */}
        {/* End Icon                                                           */}
        {/* ------------------------------------------------------------------ */}

        {!loading && endIcon && (
          <span aria-hidden="true" className="inline-flex shrink-0">
            {endIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
