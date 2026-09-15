"use client";
import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ForwardedRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { XIcon } from "@/components/icons/Icons";
import { Button } from "@/components/ui/button/Button";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/scroll-lock";

const ANIM_MS = 200 as const; // Matches duration-200

type ModalSize = "small" | "medium" | "large" | "xlarge" | "xxlarge" | "full";
export type ModalVariant = "default" | "destructive" | "warning" | "success";

export interface ModalProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  /** Controlled open state */
  open?: boolean;
  onClose?: () => void;
  size?: ModalSize;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  preventScroll?: boolean;
  initialFocus?: React.RefObject<HTMLElement>;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  variant?: ModalVariant;
  zIndex?: string;
  overlayClassName?: string;
  /** Overrides the body padding — pass `p-0` for a full-bleed panel. */
  bodyClassName?: string;
  children?: React.ReactNode;
}

const Modal = forwardRef(function Modal(
  {
    className,
    children,
    open = false,
    onClose,
    size = "medium",
    closeOnBackdropClick = true,
    closeOnEsc = true,
    showCloseButton = true,
    preventScroll = true,
    initialFocus,
    title,
    description,
    footer,
    variant = "default",
    zIndex = "z-[10000]",
    overlayClassName,
    bodyClassName,
    ...props
  }: ModalProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Avoid synchronous setState in effect body to prevent cascading renders warning
    const raf = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Consolidate states to avoid multiple re-renders and cascading updates
  const [modalState, setModalState] = useState({
    isVisible: false,
    isExiting: false,
    animIn: false,
  });

  const { isVisible, isExiting, animIn } = modalState;

  const modalRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Sync the 'open' prop with internal state
  useEffect(() => {
    if (!mounted) return;

    if (open) {
      // Opening: Break render cascade for linter
      let t2: NodeJS.Timeout;
      const t1 = setTimeout(() => {
        setModalState((prev) => ({
          ...prev,
          isVisible: true,
          isExiting: false,
        }));
        t2 = setTimeout(() => {
          setModalState((prev) => ({ ...prev, animIn: true }));
        }, 10);
      }, 0);
      return () => {
        clearTimeout(t1);
        if (t2) clearTimeout(t2);
      };
    } else {
      // Start closing: Trigger the exit animation
      if (isVisible) {
        const t = setTimeout(() => {
          setModalState((prev) => ({
            ...prev,
            animIn: false,
            isExiting: true,
          }));
        }, 0);
        return () => clearTimeout(t);
      }
    }
  }, [open, mounted, isVisible]);

  // Finish the closing sequence after the animation duration (ANIM_MS)
  useEffect(() => {
    // When we've started exiting but animations are off, start the unmount timer
    if (isExiting && !animIn) {
      const closeT = setTimeout(() => {
        setModalState({ isVisible: false, isExiting: false, animIn: false });
      }, ANIM_MS);
      return () => clearTimeout(closeT);
    }
  }, [isExiting, animIn]);

  // Handle Scroll Lock
  useEffect(() => {
    if (!mounted) return;
    // We lock when visible.
    if (isVisible && preventScroll) {
      lockBodyScroll();
      return () => unlockBodyScroll();
    }
  }, [isVisible, preventScroll, mounted]);

  // Focus management
  useEffect(() => {
    if (!mounted) return;
    if (isVisible) {
      previousActiveElement.current =
        document.activeElement as HTMLElement | null;
      const t = window.setTimeout(() => {
        if (initialFocus?.current) {
          initialFocus.current.focus();
        } else if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 50);
      return () => window.clearTimeout(t);
    } else if (previousActiveElement.current) {
      const t = window.setTimeout(() => {
        previousActiveElement.current?.focus?.();
      }, 50);
      return () => window.clearTimeout(t);
    }
  }, [isVisible, initialFocus, mounted]);

  // ESC to close
  useEffect(() => {
    if (!mounted) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((open || isExiting) && e.key === "Escape" && closeOnEsc) {
        onClose?.();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, isExiting, closeOnEsc, onClose, mounted]);

  const handleBackdropClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose?.();
    }
  };

  const handleTabKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!modalRef.current) return;
    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]',
    );
    if (!focusableElements.length) {
      e.preventDefault();
      return;
    }

    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (
        document.activeElement === firstEl ||
        document.activeElement === modalRef.current
      ) {
        lastEl.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastEl) {
        firstEl.focus();
        e.preventDefault();
      }
    }
  };

  const sizeClasses: Record<ModalSize, string> = {
    small: "max-w-sm",
    medium: "max-w-md",
    large: "max-w-lg",
    xlarge: "max-w-xl",
    xxlarge: "max-w-2xl",
    full: "max-w-[calc(100vw-2rem)]",
  };

  const variantClasses: Record<ModalVariant, string> = {
    default: "bg-background text-card-foreground border-border/50 shadow-xl",
    destructive: "bg-danger text-card-foreground border-danger/20 shadow-xl",
    warning: "bg-warning text-card-foreground border-warning/20 shadow-xl",
    success: "bg-success text-card-foreground border-success/20 shadow-xl",
  };

  const accentBarClasses: Record<ModalVariant, string> = {
    default: "hidden",
    destructive: "bg-danger",
    warning: "bg-warning",
    success: "bg-success",
  };

  // Render while visible (open OR playing exit animation)
  if (!mounted || !isVisible) return null;

  return createPortal(
    <div
      data-modal-container="true"
      className={cn(
        "fixed inset-0 ",
        "flex items-center justify-center",
        "p-3 sm:p-4",
        "bg-background/30 backdrop-blur-xs",
        "transition-all duration-200 ease-out",
        animIn ? "opacity-100" : "opacity-0 pointer-events-none",
        overlayClassName,
        zIndex,
      )}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
    >
      <div
        ref={(node) => {
          (modalRef as React.MutableRefObject<HTMLDivElement | null>).current =
            node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
        }}
        className={cn(
          "relative w-full",
          "overflow-hidden",
          "rounded-xl",
          "border",
          "focus:outline-none",
          "transition-all duration-200 ease-out",
          animIn
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-6 scale-95 opacity-0",

          className && /max-w-/.test(className)
            ? ""
            : (sizeClasses[size] ?? sizeClasses.medium),

          variantClasses[variant] ?? variantClasses.default,

          className,
        )}
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === "Tab") handleTabKey(e);
        }}
        {...props}
      >
        {/* Accent Bar for status variants */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-1",
            accentBarClasses[variant] ?? accentBarClasses.default,
          )}
        />

        {showCloseButton && (
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label="Close"
            onClick={onClose}
            type="button"
            className="absolute right-3 top-3 z-10 sm:right-5 sm:top-5"
          >
            <XIcon className="size-5" />
          </Button>
        )}

        <div className={cn("sm:p-5 p-3", bodyClassName)}>
          {title && (
            <div className={cn("mb-5", showCloseButton && "pr-12")}>
              <h2
                id="modal-title"
                className="text-lg sm:text-xl font-semibold leading-tight tracking-tight text-card-foreground"
              >
                {title}
              </h2>
              {description && (
                <p
                  id="modal-description"
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  {description}
                </p>
              )}
            </div>
          )}

          <div
            data-modal-scrollable
            className={cn(
              "flex flex-col p-1",
              "overflow-y-auto",
              "max-h-[65vh] sm:max-h-[70vh]",
              "text-foreground",
              !title && "mt-0",
            )}
            // style={{
            //   overflowY: "auto",
            //   display: "flex",
            //   flexDirection: "column",
            // }}
          >
            {children}
          </div>

          {footer && (
            <div
              className="
                  mt-4
                  sm:mt-5
                  flex
                  flex-wrap
                  items-center
                  justify-end
                  gap-2 
                  sm:gap-3
                  font-medium
                "
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
});

Modal.displayName = "Modal";
export { Modal };
