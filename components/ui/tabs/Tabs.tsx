"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export type TabsVariant = "default" | "underline" | "pills" | "boxed";
export type TabsSize = "sm" | "md" | "lg";
export type TabsColor =
  "primary" | "secondary" | "success" | "warning" | "danger";
export type TabsOrientation = "horizontal" | "vertical";

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
  baseId: string;
  variant: TabsVariant;
  size: TabsSize;
  color: TabsColor;
  orientation: TabsOrientation;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <Tabs>`);
  return ctx;
}

/* Static class maps — Tailwind can't see interpolated class names, so spell them out. */

const LIST: Record<TabsVariant, string> = {
  default: "gap-1",
  underline: "gap-4",
  pills: "gap-1.5",
  boxed: "gap-1 rounded-lg bg-muted p-1",
};

const TRIGGER_SIZE: Record<TabsSize, string> = {
  sm: "h-7 px-2.5 text-xs",
  md: "h-9 px-3.5 text-sm",
  lg: "h-10 px-4 text-base",
};

const COLOR: Record<
  TabsColor,
  {
    active: string;
    soft: string;
    solid: string;
    solidText: string;
    bar: string;
    ring: string;
  }
> = {
  primary: {
    active: "text-primary",
    soft: "bg-primary/10",
    solid: "bg-primary",
    solidText: "text-primary-foreground",
    bar: "bg-primary",
    ring: "focus-visible:ring-primary/50",
  },
  secondary: {
    active: "text-foreground",
    soft: "bg-muted",
    solid: "bg-foreground",
    solidText: "text-background",
    bar: "bg-foreground",
    ring: "focus-visible:ring-ring",
  },
  success: {
    active: "text-success",
    soft: "bg-success/10",
    solid: "bg-success",
    solidText: "text-white",
    bar: "bg-success",
    ring: "focus-visible:ring-success/50",
  },
  warning: {
    active: "text-warning",
    soft: "bg-warning/10",
    solid: "bg-warning",
    solidText: "text-white",
    bar: "bg-warning",
    ring: "focus-visible:ring-warning/50",
  },
  danger: {
    active: "text-danger",
    soft: "bg-danger/10",
    solid: "bg-danger",
    solidText: "text-white",
    bar: "bg-danger",
    ring: "focus-visible:ring-danger/50",
  },
};

/* -------------------------------- Tabs root ------------------------------- */

interface TabsProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue"
> {
  value?: string;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  color?: TabsColor;
  orientation?: TabsOrientation;
}

function Tabs({
  className,
  value,
  defaultValue,
  onValueChange,
  variant = "default",
  size = "md",
  color = "primary",
  orientation = "horizontal",
  ...props
}: TabsProps) {
  const baseId = useId();
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const current = isControlled ? value : internal;

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  return (
    <TabsContext.Provider
      value={{
        value: current,
        setValue,
        baseId,
        variant,
        size,
        color,
        orientation,
      }}
    >
      <div
        className={cn(
          "flex w-full gap-3",
          orientation === "vertical" ? "flex-row" : "flex-col",
          className,
        )}
        {...props}
      />
    </TabsContext.Provider>
  );
}

/* -------------------------------- TabsList -------------------------------- */

function TabsList({
  className,
  onKeyDown,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { variant, orientation } = useTabs("TabsList");
  const listRef = useRef<HTMLDivElement>(null);
  const vertical = orientation === "vertical";

  // Roving focus: arrows/Home/End move and activate the tabs.
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    const tabs = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not(:disabled)',
      ) ?? [],
    );
    if (!tabs.length) return;
    const i = tabs.indexOf(document.activeElement as HTMLButtonElement);
    const nextKey = vertical ? "ArrowDown" : "ArrowRight";
    const prevKey = vertical ? "ArrowUp" : "ArrowLeft";
    let next = -1;
    if (e.key === nextKey) next = (i + 1) % tabs.length;
    else if (e.key === prevKey) next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next >= 0) {
      e.preventDefault();
      tabs[next].focus();
      tabs[next].click();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative flex w-fit max-w-full",
        vertical ? "flex-col" : "items-center overflow-x-auto",
        variant === "underline" &&
          (vertical ? "border-r border-border" : "border-b border-border"),
        LIST[variant],
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------ TabsTrigger ------------------------------- */

interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

function TabsTrigger({
  className,
  value,
  onClick,
  children,
  ...props
}: TabsTriggerProps) {
  const {
    value: current,
    setValue,
    baseId,
    variant,
    size,
    color,
    orientation,
  } = useTabs("TabsTrigger");
  const selected = current === value;
  const c = COLOR[color];

  // Underline bar hugs the list's edge — bottom when horizontal, right when vertical.
  const underlineBar =
    orientation === "vertical"
      ? "inset-y-1 -right-px w-0.5 rounded-full"
      : "inset-x-1 -bottom-px h-0.5 rounded-full";

  const indicator =
    variant === "pills"
      ? cn("inset-0 rounded-full", c.solid)
      : variant === "boxed"
        ? "inset-0 rounded-md bg-background shadow-sm"
        : variant === "underline"
          ? cn(underlineBar, c.bar)
          : cn("inset-0 rounded-md", c.soft); // default

  const activeText =
    variant === "pills"
      ? c.solidText
      : variant === "boxed"
        ? "text-foreground"
        : c.active;

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      onClick={(e) => {
        setValue(value);
        onClick?.(e);
      }}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5",
        "whitespace-nowrap rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        TRIGGER_SIZE[size],
        c.ring,
        selected ? activeText : "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      {selected && (
        <motion.span
          layoutId={`${baseId}-indicator`}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          aria-hidden="true"
          className={cn("absolute", indicator)}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

/* ------------------------------ TabsContents ------------------------------ */
/* Wraps the panels and animates its height to whichever one is active. */

function TabsContents({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div
      animate={{ height }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
      className={cn("relative", className)}
    >
      <div ref={innerRef}>{children}</div>
    </motion.div>
  );
}

/* ------------------------------ TabsContent ------------------------------- */

interface TabsContentProps extends HTMLMotionProps<"div"> {
  value: string;
}

function TabsContent({
  className,
  value,
  children,
  ...props
}: TabsContentProps) {
  const { value: current, baseId } = useTabs("TabsContent");
  if (current !== value) return null;

  // Only the active panel is mounted, so entering panels never overlap the
  // outgoing one — no layout jump. It just fades + blurs in on mount.
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(4px)", y: 4 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      className={cn(
        "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContents, TabsContent };
