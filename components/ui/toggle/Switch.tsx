"use client";

import React, { forwardRef, type ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  useAnimationControls,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2Icon } from "@/components/icons/Icons";

export type SwitchSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SwitchVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "destructive"
  | "neutral"
  | "outline";

export interface SwitchProps extends Omit<
  HTMLMotionProps<"button">,
  "onChange" | "value" | "children"
> {
  /** Controlled checked state. Omit for uncontrolled usage with `defaultChecked`. */
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: SwitchSize;
  variant?: SwitchVariant;
  /** Icon rendered inside the thumb regardless of state. */
  thumbIcon?: ReactNode;
  /** Icon shown in the track when checked (left side). */
  onIcon?: ReactNode;
  /** Icon shown in the track when unchecked (right side). */
  offIcon?: ReactNode;
  /**
   * Busy/pending state. Unlike `disabled`, this intentionally does NOT set
   * the native `disabled` attribute — that would pull focus away and drop
   * the control out of the tab order mid-interaction, which is jarring for
   * keyboard/screen-reader users waiting on an async toggle. Interaction is
   * still blocked (via `aria-disabled` + the click guard), focus just isn't.
   */
  loading?: boolean;
  invalid?: boolean;
  /**
   * Renders a visually-hidden native `<input type="checkbox">` in lockstep
   * with the switch so it participates in native `<form>` submission
   * (FormData, `required` validation, etc.) — the button itself is a
   * `role="switch"` `<div>`-like control and isn't natively form-associated.
   * Omit if you handle submission entirely through `onCheckedChange`.
   */
  name?: string;
  /** Form value submitted when checked. Defaults to `"on"`, matching native checkboxes. */
  value?: string;
  required?: boolean;
}

const SIZE_CONFIG: Record<
  SwitchSize,
  {
    track: string;
    thumb: string;
    translateX: number;
    iconWrap: string;
    icon: string;
  }
> = {
  xs: {
    track: "w-6 h-3.5",
    thumb: "size-2.5",
    translateX: 10,
    iconWrap: "px-0.5",
    icon: "size-2",
  },
  sm: {
    track: "w-7 h-4",
    thumb: "size-3",
    translateX: 12,
    iconWrap: "px-0.5",
    icon: "size-2",
  },
  md: {
    track: "w-9 h-5",
    thumb: "size-3.5",
    translateX: 16,
    iconWrap: "px-0.5",
    icon: "size-2.5",
  },
  lg: {
    track: "w-11 h-6",
    thumb: "size-4.5",
    translateX: 20,
    iconWrap: "px-1",
    icon: "size-3",
  },
  xl: {
    track: "w-14 h-7",
    thumb: "size-5.5",
    translateX: 28,
    iconWrap: "px-1.5",
    icon: "size-3.5",
  },
};

const TRACK_VARIANT: Record<SwitchVariant, { on: string; off: string }> = {
  default: {
    on: "bg-foreground border-foreground",
    off: "bg-input border-transparent",
  },
  primary: {
    on: "bg-primary border-primary",
    off: "bg-input border-transparent",
  },
  secondary: {
    on: "bg-secondary border-secondary",
    off: "bg-input border-transparent",
  },
  success: {
    on: "bg-success border-success",
    off: "bg-input border-transparent",
  },
  warning: {
    on: "bg-warning border-warning",
    off: "bg-input border-transparent",
  },
  destructive: {
    on: "bg-danger border-danger",
    off: "bg-input border-transparent",
  },
  neutral: {
    on: "bg-reverse border-reverse",
    off: "bg-input border-transparent",
  },
  outline: {
    on: "bg-primary/10 border-primary",
    off: "bg-transparent border-border",
  },
};

const THUMB_VARIANT: Record<SwitchVariant, { on: string; off: string }> = {
  default: {
    on: "bg-background text-foreground",
    off: "bg-background text-muted-foreground",
  },
  primary: {
    on: "bg-primary-foreground text-primary",
    off: "bg-background text-muted-foreground",
  },
  secondary: {
    on: "bg-secondary-foreground text-secondary",
    off: "bg-background text-muted-foreground",
  },
  success: {
    on: "bg-white text-success",
    off: "bg-background text-muted-foreground",
  },
  warning: {
    on: "bg-white text-warning",
    off: "bg-background text-muted-foreground",
  },
  destructive: {
    on: "bg-white text-danger",
    off: "bg-background text-muted-foreground",
  },
  neutral: {
    on: "bg-background text-reverse",
    off: "bg-background text-muted-foreground",
  },
  outline: {
    on: "bg-primary text-primary-foreground",
    off: "bg-foreground/40 text-background",
  },
};

const THUMB_SPRING = {
  type: "spring",
  stiffness: 550,
  damping: 32,
  mass: 0.6,
} as const;
const THUMB_SNAP = { type: "tween", duration: 0.15, ease: "easeOut" } as const;
const ICON_TRANSITION = { duration: 0.15, ease: "easeOut" } as const;

let devLabelWarned = false;

/**
 * Bare toggle primitive — shadcn-style, motion-driven. No built-in
 * label/helper/error; compose it with `Label` (or any element) yourself:
 *
 * ```tsx
 * <div className="flex items-center gap-2">
 *   <Switch id="airplane-mode" checked={on} onCheckedChange={setOn} />
 *   <Label htmlFor="airplane-mode">Airplane Mode</Label>
 * </div>
 * ```
 */
const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked,
      defaultChecked = false,
      onCheckedChange,
      disabled = false,
      loading = false,
      size = "md",
      variant = "primary",
      thumbIcon,
      onIcon,
      offIcon,
      invalid = false,
      name,
      value = "on",
      required,
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      ...props
    },
    ref,
  ) => {
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] =
      React.useState<boolean>(defaultChecked);
    const isChecked = isControlled ? checked : internalChecked;
    const generatedId = React.useId();
    const switchId = id || generatedId;
    const isInteractive = !disabled && !loading;
    const prefersReducedMotion = useReducedMotion();

    const handleToggle = () => {
      if (!isInteractive) return;
      const next = !isChecked;
      if (!isControlled) setInternalChecked(next);
      onCheckedChange?.(next);
    };

    const dims = SIZE_CONFIG[size];
    const track = TRACK_VARIANT[variant];
    const thumbColor = THUMB_VARIANT[variant];

    // Dev-time guard: catches the classic "switched between controlled and
    // uncontrolled" bug (e.g. `checked` starts `undefined` then later
    // becomes a boolean) the same way React warns for native <input>. Hooks
    // always run (Rules of Hooks) — only the warning itself is dev-gated.
    const wasControlledRef = React.useRef(isControlled);
    React.useEffect(() => {
      if (
        process.env.NODE_ENV !== "production" &&
        wasControlledRef.current !== isControlled
      ) {
        console.error(
          "Switch: component switched between controlled and uncontrolled `checked`. " +
            "Decide between either always passing `checked` (controlled) or never passing it " +
            "(use `defaultChecked` instead) — don't change between the two across renders.",
        );
      }
      wasControlledRef.current = isControlled;
    }, [isControlled]);

    const ariaDescribedby = props["aria-describedby"];
    React.useEffect(() => {
      if (process.env.NODE_ENV === "production" || devLabelWarned) return;
      const hasLabel = !!(ariaLabel || ariaLabelledby || ariaDescribedby);
      if (!hasLabel) {
        devLabelWarned = true;
        console.warn(
          `Switch (id="${switchId}"): no accessible name found. Pass \`aria-label\`, ` +
            "`aria-labelledby`, or pair it with a <Label htmlFor> — screen reader users " +
            "otherwise hear an unnamed 'switch'.",
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps -- only needs to fire once, on mount
    }, []);

    const thumbControls = useAnimationControls();
    const mountedRef = React.useRef(false);
    React.useEffect(() => {
      if (!mountedRef.current) {
        mountedRef.current = true;
        thumbControls.set({
          x: isChecked ? dims.translateX : 0,
          scaleX: 1,
          scaleY: 1,
        });
        return;
      }
      if (prefersReducedMotion) {
        thumbControls.start({
          x: isChecked ? dims.translateX : 0,
          scaleX: 1,
          scaleY: 1,
          transition: THUMB_SNAP,
        });
        return;
      }
      thumbControls.start({
        x: isChecked ? dims.translateX : 0,
        scaleX: [1, 1.28, 0.92, 1],
        scaleY: [1, 0.82, 1.05, 1],
        transition: {
          x: THUMB_SPRING,
          scaleX: { duration: 0.42, times: [0, 0.35, 0.7, 1], ease: "easeOut" },
          scaleY: { duration: 0.42, times: [0, 0.35, 0.7, 1], ease: "easeOut" },
        },
      });
    }, [isChecked, dims.translateX, thumbControls, prefersReducedMotion]);

    return (
      <>
        <motion.button
          ref={ref}
          id={switchId}
          type="button"
          role="switch"
          aria-checked={isChecked}
          aria-invalid={invalid}
          aria-disabled={disabled || loading}
          aria-busy={loading}
          aria-required={required}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          data-state={isChecked ? "checked" : "unchecked"}
          data-slot="switch"
          onClick={handleToggle}
          disabled={disabled}
          whileTap={isInteractive ? { scale: 0.92 } : undefined}
          transition={{ duration: 0.12 }}
          className={cn(
            "peer relative shrink-0 inline-flex items-center",
            "rounded-full border-2",
            "transition-colors duration-200 ease-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed",
            "aria-disabled:pointer-events-none aria-disabled:opacity-60 aria-disabled:cursor-not-allowed",
            dims.track,
            isChecked ? track.on : track.off,
            invalid && "ring-2 ring-danger/40 ring-offset-1",
            className,
          )}
          {...props}
        >
          {(onIcon || offIcon) && (
            <span className={cn("absolute inset-0 between", dims.iconWrap)}>
              <AnimatePresence initial={false}>
                {isChecked && onIcon && (
                  <motion.span
                    key="on"
                    className="center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={ICON_TRANSITION}
                  >
                    {onIcon}
                  </motion.span>
                )}
              </AnimatePresence>
              <AnimatePresence initial={false}>
                {!isChecked && offIcon && (
                  <motion.span
                    key="off"
                    className="center ml-auto"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={ICON_TRANSITION}
                  >
                    {offIcon}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          )}

          <motion.span
            data-slot="switch-thumb"
            initial={false}
            animate={thumbControls}
            className={cn(
              "pointer-events-none flex items-center justify-center rounded-full shadow-sm",
              "transition-colors duration-200 ease-out",
              dims.thumb,
              thumbColor.on && (isChecked ? thumbColor.on : thumbColor.off),
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {loading ? (
                <motion.span
                  key="loader"
                  initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                  transition={ICON_TRANSITION}
                >
                  <Loader2Icon className={cn("animate-spin", dims.icon)} />
                </motion.span>
              ) : thumbIcon ? (
                <motion.span
                  key="thumb-icon"
                  className={cn("center", dims.icon)}
                  initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                  transition={ICON_TRANSITION}
                >
                  {thumbIcon}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </motion.span>
        </motion.button>

        {name && (
          <input
            type="checkbox"
            aria-hidden="true"
            tabIndex={-1}
            name={name}
            value={value}
            checked={isChecked}
            required={required}
            readOnly
            className="sr-only"
          />
        )}
      </>
    );
  },
);
Switch.displayName = "Switch";

export { Switch };
