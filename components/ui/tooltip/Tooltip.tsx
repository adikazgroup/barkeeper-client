"use client";

import React, {
  useState,
  useRef,
  useLayoutEffect,
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
  useId,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatePresence, HTMLMotionProps } from "framer-motion";

// ── Types

export type TooltipSide = "top" | "bottom" | "left" | "right";
export type TooltipAlign = "start" | "center" | "end";
export type TooltipSize = "sm" | "md" | "lg";
export type TooltipTriggerType = "hover" | "click" | "focus" | "contextMenu";

const escHandlers = new Set<() => void>();

function onGlobalEscape(e: KeyboardEvent) {
  if (e.key === "Escape") [...escHandlers].forEach((h) => h());
}

function registerEscape(handler: () => void) {
  if (escHandlers.size === 0)
    document.addEventListener("keydown", onGlobalEscape);
  escHandlers.add(handler);
  return () => {
    escHandlers.delete(handler);
    if (escHandlers.size === 0)
      document.removeEventListener("keydown", onGlobalEscape);
  };
}

// ── Context

interface TooltipContextType {
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  color?: string;
  showArrow: boolean;
  tooltipId: string;
}

const TooltipContext = createContext<TooltipContextType | null>(null);

function useTooltip() {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error("Must be used within <Tooltip>");
  return ctx;
}

// ── Position math

const FLIP: Record<TooltipSide, TooltipSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

// Extracted to module scope â€” no closure allocation on every scroll/resize event.
function computePosition(
  r: DOMRect,
  cW: number,
  cH: number,
  s: TooltipSide,
  align: TooltipAlign,
  offset: number,
): { top: number; left: number; ox: string; oy: string } {
  const top =
    s === "top"
      ? r.top - cH - offset
      : s === "bottom"
        ? r.bottom + offset
        : align === "start"
          ? r.top
          : align === "end"
            ? r.bottom - cH
            : r.top + (r.height - cH) / 2;

  const left =
    s === "left"
      ? r.left - cW - offset
      : s === "right"
        ? r.right + offset
        : align === "start"
          ? r.left
          : align === "end"
            ? r.right - cW
            : r.left + (r.width - cW) / 2;

  const ox =
    s === "left"
      ? "right"
      : s === "right"
        ? "left"
        : align === "start"
          ? "left"
          : align === "end"
            ? "right"
            : "50%";

  const oy = s === "top" ? "bottom" : s === "bottom" ? "top" : "50%";

  return { top, left, ox, oy };
}

function isOffScreen(
  c: { top: number; left: number },
  s: TooltipSide,
  cW: number,
  cH: number,
  vw: number,
  vh: number,
): boolean {
  return (
    (s === "top" && c.top < 0) ||
    (s === "bottom" && c.top + cH > vh) ||
    (s === "left" && c.left < 0) ||
    (s === "right" && c.left + cW > vw)
  );
}

function getCoords(
  r: DOMRect,
  cW: number,
  cH: number,
  side: TooltipSide,
  align: TooltipAlign,
  offset: number,
): {
  top: number;
  left: number;
  ox: string;
  oy: string;
  activeSide: TooltipSide;
} {
  const primary = computePosition(r, cW, cH, side, align, offset);
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const needsFlip = isOffScreen(primary, side, cW, cH, vw, vh);
  const activeSide = needsFlip ? FLIP[side] : side;
  const flipped = needsFlip
    ? computePosition(r, cW, cH, activeSide, align, offset)
    : primary;
  const { top, left, ox, oy } = isOffScreen(flipped, activeSide, cW, cH, vw, vh)
    ? primary
    : flipped;

  return {
    top: Math.max(4, Math.min(top, vh - cH - 4)),
    left: Math.max(4, Math.min(left, vw - cW - 4)),
    ox,
    oy,
    activeSide,
  };
}

// ── Tooltip

interface TooltipProps {
  children: ReactNode;
  delayDuration?: number;
  trigger?: TooltipTriggerType;
  color?: string;
  showArrow?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Tooltip({
  children,
  delayDuration = 3000,
  trigger = "hover",
  color,
  showArrow = true,
  defaultOpen = false,
  open,
  onOpenChange,
}: TooltipProps) {
  const isControlled = open !== undefined;
  const [internal, setInternal] = useState(() =>
    !isControlled && defaultOpen ? true : false,
  );
  const isOpen = isControlled ? open : internal;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternal(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const tooltipId = useId();

  const show = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(true), delayDuration);
  }, [delayDuration, setOpen]);

  const hide = useCallback(() => {
    clearTimeout(timerRef.current);
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    if (!isOpen) return;
    return registerEscape(() => setOpen(false));
  }, [isOpen, setOpen]);

  useEffect(() => {
    if (!isOpen || (trigger !== "click" && trigger !== "contextMenu")) return;
    const onPointerDown = (e: PointerEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !contentRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen, trigger, setOpen, triggerRef, contentRef]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  // Only react to genuine keyboard focus, not a programmatic `.focus()` call
  // (e.g. a Modal restoring focus to its trigger button on close) — otherwise
  // closing a modal opened from a tooltip-wrapped button re-shows the tooltip.
  const onFocusVisible = useCallback(
    (e: React.FocusEvent) => {
      const target = e.target as Element;
      let visible = true;
      try {
        visible = target.matches(":focus-visible");
      } catch {
        visible = true;
      }
      if (visible) show();
    },
    [show],
  );

  const handlers = {
    onMouseEnter: trigger === "hover" ? show : undefined,
    onMouseLeave: trigger === "hover" ? hide : undefined,
    onClick: trigger === "click" ? () => setOpen(!isOpen) : undefined,
    onFocus:
      trigger === "hover" || trigger === "focus" ? onFocusVisible : undefined,
    onBlur: trigger === "hover" || trigger === "focus" ? hide : undefined,
    onContextMenu:
      trigger === "contextMenu"
        ? (e: React.MouseEvent) => {
            e.preventDefault();
            setOpen(!isOpen);
          }
        : undefined,
  };

  const ctxValue = useMemo(
    () => ({
      isOpen,
      setOpen,
      triggerRef,
      contentRef,
      color,
      showArrow,
      tooltipId,
    }),
    [isOpen, setOpen, color, showArrow, tooltipId],
  );

  return (
    <TooltipContext.Provider value={ctxValue}>
      <div
        ref={triggerRef as React.RefObject<HTMLDivElement>}
        className="inline-flex w-fit"
        aria-describedby={isOpen ? tooltipId : undefined}
        {...handlers}
      >
        {children}
      </div>
    </TooltipContext.Provider>
  );
}

// ── TooltipTrigger

interface TooltipTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

function TooltipTrigger({ children }: TooltipTriggerProps) {
  return <>{children}</>;
}
TooltipTrigger.displayName = "TooltipTrigger";

// ── TooltipContent

// Enter: tooltip starts offset toward the trigger, then springs to final position
const ENTER_OFFSET: Record<TooltipSide, { x?: number; y?: number }> = {
  top: { y: 6 },
  bottom: { y: -6 },
  left: { x: 6 },
  right: { x: -6 },
};

// Exit: tooltip retreats back toward the trigger (reverse of enter)
const EXIT_OFFSET: Record<TooltipSide, { x?: number; y?: number }> = {
  top: { y: 6 },
  bottom: { y: -6 },
  left: { x: 6 },
  right: { x: -6 },
};

const ARROW: Record<TooltipSide, { pos: string; border: string }> = {
  top: { pos: "bottom-[-4px]", border: "border-b border-r" },
  bottom: { pos: "top-[-4px]", border: "border-t border-l" },
  left: { pos: "right-[-4px]", border: "border-t border-r" },
  right: { pos: "left-[-4px]", border: "border-b border-l" },
};

interface TooltipContentProps extends Omit<HTMLMotionProps<"div">, "children"> {
  side?: TooltipSide;
  align?: TooltipAlign;
  sideOffset?: number;
  children?: React.ReactNode;
}

function TooltipContent({
  side = "top",
  align = "center",
  sideOffset = 8,
  children,
  className,
  style,
  ...props
}: TooltipContentProps) {
  const { isOpen, contentRef, triggerRef, color, showArrow, tooltipId } =
    useTooltip();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [pos, setPos] = useState({
    top: 0,
    left: 0,
    ox: "50%",
    oy: "50%",
    activeSide: side,
  });

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current || !contentRef.current) return;

    let raf = 0;
    let retries = 0;
    const MAX_RETRIES = 8;

    const calc = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const tr = triggerRef.current;
        const ct = contentRef.current;
        if (!tr || !ct) return;
        if (!ct.offsetWidth) {
          if (retries < MAX_RETRIES) {
            retries++;
            calc();
          }
          return;
        }
        retries = 0;
        setPos(
          getCoords(
            tr.getBoundingClientRect(),
            ct.offsetWidth,
            ct.offsetHeight,
            side,
            align,
            sideOffset,
          ),
        );
      });
    };

    calc();

    const onResize = () => calc();
    const onScroll = () => calc();

    const ro = new ResizeObserver(onResize);
    ro.observe(triggerRef.current);
    ro.observe(contentRef.current);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, [isOpen, side, align, sideOffset, triggerRef, contentRef]);

  const { activeSide } = pos;
  const isVert = activeSide === "top" || activeSide === "bottom";
  const arrowAlign =
    align === "center"
      ? isVert
        ? "left-1/2 -translate-x-1/2"
        : "top-1/2 -translate-y-1/2"
      : align === "start"
        ? isVert
          ? "left-4"
          : "top-3"
        : isVert
          ? "right-4"
          : "bottom-3";

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        // Outer layer: owns position + fade + slide. It does NOT scale, so the
        // arrow anchored here stays glued to the trigger throughout the animation.
        <motion.div
          key={tooltipId}
          initial={{ opacity: 0, ...ENTER_OFFSET[side] }}
          animate={{
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
              default: {
                type: "spring",
                stiffness: 480,
                damping: 30,
                mass: 0.5,
              },
              opacity: {
                type: "tween",
                duration: 0.16,
                ease: [0.23, 1, 0.32, 1],
              },
            },
          }}
          exit={{
            opacity: 0,
            ...EXIT_OFFSET[activeSide],
            transition: {
              duration: 0.12,
              ease: [0.4, 0, 1, 1],
            },
          }}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          {/* Inner bubble: only this scales, pivoting from the arrow-side edge
              (transformOrigin), so it grows out of the fixed arrow. */}
          <motion.div
            id={tooltipId}
            ref={contentRef}
            role="tooltip"
            initial={{ scale: 0.86 }}
            animate={{
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 480,
                damping: 30,
                mass: 0.5,
              },
            }}
            exit={{
              scale: 0.9,
              transition: {
                duration: 0.12,
                ease: [0.4, 0, 1, 1],
              },
            }}
            style={{
              transformOrigin: `${pos.ox} ${pos.oy}`,
              backgroundColor: color || undefined,
              ...style,
            }}
            className={cn(
              "bg-muted text-popover-foreground max-w-xs wrap-break-word rounded-sm border border-border px-3 py-1.5 text-xs font-medium shadow-md select-none",
              className,
            )}
            {...props}
          >
            {children}
          </motion.div>
          {showArrow && (
            <div
              className={cn(
                "bg-muted border-border absolute h-2 w-2 rotate-45",
                ARROW[activeSide].pos,
                ARROW[activeSide].border,
                arrowAlign,
              )}
              style={{
                backgroundColor: color || undefined,
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function TooltipProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
