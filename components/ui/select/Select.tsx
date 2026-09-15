"use client";

import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import type React from "react";
import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  forwardRef,
  type KeyboardEvent,
  type ReactNode,
  useId,
  useCallback,
} from "react";
import { CheckIcon, CaretUpOutlineIcon } from "@/components/icons/Icons";
import { getActualScrollY } from "@/hooks/useDropdownPosition";

type Option = {
  value: string;
  label: string;
  description?: string;
};

interface SelectProps {
  className?: string;
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  options?: Option[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
  onChange?: (event: { target: { value: string } }) => void;
  value?: string;
  defaultValue?: string | null;
  requiredSign?: boolean;
  required?: boolean;
  optionRenderer?: (
    option: Option,
    isSelected: boolean,
    isHighlighted: boolean,
  ) => ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  tabIndex?: number;
  id?: string;
  name?: string;
  autoFocus?: boolean;
  style?: React.CSSProperties;
  title?: string;
  fieldClass?: string;
  portalTarget?: HTMLElement | null;
}

type Placement = "bottom" | "top";

interface DropdownStyle {
  top: number;
  left: number;
  width: number;
  position: "absolute" | "fixed";
  zIndex: number;
  transform?: string;
  transition?: string;
}

const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      className = "w-70",
      label,
      helperText,
      error,
      fullWidth = false,
      startIcon,
      endIcon,
      options = [],
      placeholder = "Select an option",
      onValueChange,
      onChange,
      value,
      defaultValue,
      requiredSign = false,
      optionRenderer,
      disabled,
      required,
      fieldClass = "",
      portalTarget,
      id,
      ...props
    },
    ref,
  ) => {
    // Refs
    const triggerRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const listboxRef = useRef<HTMLDivElement | null>(null);
    const portalRef = useRef<HTMLDivElement | null>(null);

    /* -------------------------------------------------------------------------- */
    /* Accessibility */
    /* -------------------------------------------------------------------------- */

    const generatedId = useId();

    const selectId = id ?? `select-${generatedId}`;
    const labelId = `${selectId}-label`;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;
    const popupId = `${selectId}-popup`;

    // State
    const resolvedPortalTarget =
      portalTarget ?? (typeof document !== "undefined" ? document.body : null);

    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [IsSelectVisible, setIsSelectVisible] = useState(false);
    const [placement, setPlacement] = useState<Placement>("bottom");
    const [hasCoords, setHasCoords] = useState(false);

    const [dropdownStyle, setDropdownStyle] = useState<DropdownStyle>({
      top: 0,
      left: 0,
      width: 0,
      position: "absolute",
      zIndex: 9999,
    });

    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [selectedValue, setSelectedValue] = useState<string>(
      value ?? defaultValue ?? "",
    );

    const selectedOption = options.find((o) => o.value === selectedValue);
    const displayValue = selectedOption ? selectedOption.label : "";

    // Position helpers (mirrors Calendar)
    const calculatePositionBase = useCallback(() => {
      if (!triggerRef.current)
        return null as unknown as {
          rect: DOMRect;
          top: number;
          left: number;
          position: "absolute" | "fixed";
          isInModal: boolean;
        } | null;

      const rect = triggerRef.current.getBoundingClientRect();
      const isInModal = !!triggerRef.current.closest('[role="dialog"]');

      let top: number, left: number, position: "absolute" | "fixed";
      if (isInModal) {
        top = rect.bottom; // spacing added later
        left = rect.left;
        position = "fixed";
      } else {
        const scrollY = getActualScrollY();
        top = rect.bottom + scrollY;
        left = rect.left + window.scrollX;
        position = "absolute";
      }

      return { rect, top, left, position, isInModal };
    }, []);

    const calculatePosition = useCallback(
      (estimatedHeight = 240) => {
        const base = calculatePositionBase();
        if (!base) return;

        const { rect, left, position, isInModal } = base;
        const spacing = 5;
        const viewportHeight = window.innerHeight;
        const minTopPadding = 5; // Prevent dropdown from going too far above viewport

        let topPosition: number;
        let decided: Placement = "bottom";
        let adjustedHeight = estimatedHeight;

        if (position === "fixed") {
          const bottomPosition = rect.bottom + spacing;
          const spaceBelow = viewportHeight - bottomPosition;
          const spaceAbove = rect.top - spacing;

          adjustedHeight = Math.min(
            estimatedHeight,
            Math.max(spaceBelow, spaceAbove) - spacing,
          );

          if (spaceBelow < adjustedHeight && spaceAbove >= adjustedHeight) {
            topPosition = Math.max(
              minTopPadding,
              rect.top - adjustedHeight - spacing,
            );
            decided = "top";
          } else {
            topPosition = bottomPosition;
            decided = "bottom";
          }
        } else {
          const scrollY = getActualScrollY();
          const bottomPosition = rect.bottom + scrollY + spacing;
          const spaceBelow = viewportHeight - (rect.bottom + spacing);
          const spaceAbove = rect.top - spacing;

          adjustedHeight = Math.min(
            estimatedHeight,
            Math.max(spaceBelow, spaceAbove) - spacing,
          );

          if (spaceBelow < adjustedHeight && spaceAbove >= adjustedHeight) {
            topPosition = Math.max(
              scrollY + minTopPadding,
              rect.top + scrollY - adjustedHeight - spacing - 14,
            );
            decided = "top";
          } else {
            topPosition = bottomPosition;
            decided = "bottom";
          }
        }

        setDropdownStyle({
          top: topPosition,
          left,
          width: rect.width || 280,
          position,
          zIndex: isInModal ? 100000 : 9999,
        });
        setPlacement(decided);
        setHasCoords(true);
      },
      [calculatePositionBase],
    );

    // Recompute with actual height once rendered
    useLayoutEffect(() => {
      if (!isSelectOpen || !portalRef.current || !triggerRef.current) return;

      const popupEl = portalRef.current;
      const base = calculatePositionBase();
      if (!base) return;

      const { rect, left, position, isInModal } = base;
      const popupH = popupEl.offsetHeight;
      const spacing = 5;
      const viewportHeight = window.innerHeight;
      const minTopPadding = 5;

      let topPosition: number;
      let decided = placement;

      if (position === "fixed") {
        const bottomPosition = rect.bottom + spacing;
        const spaceBelow = viewportHeight - bottomPosition;
        const spaceAbove = rect.top - spacing;

        if (spaceBelow < popupH && spaceAbove >= popupH) {
          topPosition = Math.max(minTopPadding, rect.top - popupH - spacing);
          decided = "top";
        } else {
          topPosition = bottomPosition;
          decided = "bottom";
        }
      } else {
        const scrollY = getActualScrollY();
        const bottomPosition = rect.bottom + scrollY + spacing;
        const spaceBelow = viewportHeight - (rect.bottom + spacing);
        const spaceAbove = rect.top - spacing;

        if (spaceBelow < popupH && spaceAbove >= popupH) {
          topPosition = Math.max(
            scrollY + minTopPadding,
            rect.top + scrollY - popupH - spacing,
          );
          decided = "top";
        } else {
          topPosition = bottomPosition;
          decided = "bottom";
        }
      }
      const newStyle: DropdownStyle = {
        top: topPosition,
        left,
        width: rect.width || popupEl.offsetWidth || 280,
        position,
        zIndex: isInModal ? 100000 : 9999,
      };

      setDropdownStyle((prev) => {
        if (
          prev.top === newStyle.top &&
          prev.left === newStyle.left &&
          prev.width === newStyle.width &&
          prev.position === newStyle.position &&
          prev.zIndex === newStyle.zIndex
        ) {
          return prev;
        }
        return newStyle;
      });

      if (placement !== decided) {
        setPlacement(decided);
      }
    }, [isSelectOpen, IsSelectVisible, calculatePositionBase, placement]);

    // Scroll/resize listeners while open
    useEffect(() => {
      if (!isSelectOpen) return;
      const handler = () =>
        calculatePosition(listboxRef.current?.offsetHeight || 240);
      window.addEventListener("scroll", handler, {
        capture: true,
        passive: true,
      });
      window.addEventListener("resize", handler);
      return () => {
        window.removeEventListener("scroll", handler, { capture: true });
        window.removeEventListener("resize", handler);
      };
    }, [isSelectOpen, calculatePosition]);

    const openDropdown = () => {
      if (disabled) return;

      // Calculate a better estimated height to avoid flip-flops between top/bottom
      const itemHeight = 36;
      const padding = 12;
      const estimatedHeight = Math.min(
        240,
        (options?.length || 0) * itemHeight + padding,
      );

      calculatePosition(estimatedHeight);
      setIsSelectOpen(true);
      requestAnimationFrame(() => setIsSelectVisible(true));
    };

    const closeDropdown = () => {
      setIsSelectVisible(false);
      setTimeout(() => {
        setIsSelectOpen(false);
        setHasCoords(false);
        setDropdownStyle((s) => ({ ...s, top: 0, left: 0, width: 0 }));
      }, 150);
    };

    // Outside click
    useEffect(() => {
      if (!isSelectOpen) return; // Prevent interaction if dropdown is not open
      const handleOutside = (e: globalThis.MouseEvent) => {
        // Close dropdown only if clicking outside of dropdown, not the calendar
        if (
          portalRef.current &&
          !portalRef.current.contains(e.target as Node) &&
          !triggerRef.current?.contains(e.target as Node)
        ) {
          closeDropdown();
        }
      };
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }, [isSelectOpen]);

    // Keyboard
    const onButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!isSelectOpen) openDropdown();
        return;
      }

      if (!isSelectOpen) return;

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          closeDropdown();
          break;
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) => {
            const next = prev < options.length - 1 ? prev + 1 : 0;
            (
              listboxRef.current?.children?.[next] as HTMLElement | undefined
            )?.scrollIntoView({
              block: "nearest",
            });
            return next;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : options.length - 1;
            (
              listboxRef.current?.children?.[next] as HTMLElement | undefined
            )?.scrollIntoView({
              block: "nearest",
            });
            return next;
          });
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (highlightedIndex >= 0 && options[highlightedIndex]) {
            handleOptionSelect(options[highlightedIndex].value);
          }
          break;
      }
    };

    // Selection
    const handleOptionSelect = (optionValue: string) => {
      setSelectedValue(optionValue);
      const syntheticEvent = { target: { value: optionValue } };
      onChange?.(syntheticEvent);
      onValueChange?.(optionValue);
      closeDropdown();
    };

    // Option renderer
    const defaultOptionRenderer = (
      option: Option,
      isSelected: boolean,
      isHighlighted: boolean,
    ) => (
      <div
        className={cn(
          "w-full between",
          "rounded px-3 py-2 text-sm",
          "transition-colors cursor-pointer",
          isSelected && ["bg-reverse/7", "text-reverse"],
          !isSelected && isHighlighted && ["bg-reverse/7", "text-reverse"],
          !isSelected && !isHighlighted && ["text-foreground/90"],
        )}
      >
        <div className="flex items-center truncate">
          <span>{option.label}</span>
          {option.description && (
            <span className="ml-2 text-xs text-muted-foreground">
              {option.description}
            </span>
          )}
        </div>
        {isSelected && <CheckIcon className="size-4 shrink-0 ml-2" />}
      </div>
    );

    const renderOption = optionRenderer || defaultOptionRenderer;

    const validDropdownStyle =
      hasCoords && dropdownStyle.width > 0 ? dropdownStyle : undefined;

    // Render
    return (
      <div
        className={cn(
          "flex flex-col gap-1.5",
          fullWidth ? "w-full" : "",
          className,
        )}
      >
        {label && (
          <label
            id={labelId}
            htmlFor={selectId}
            className={cn(
              "text-sm font-medium",
              "text-foreground",
              "cursor-pointer",
            )}
          >
            {label}
            {(requiredSign || required) && (
              <span className="ml-1 text-danger" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div ref={triggerRef} className="relative">
          <button
            id={selectId}
            type="button"
            role="combobox"
            aria-labelledby={label ? labelId : undefined}
            aria-controls={isSelectOpen ? popupId : undefined}
            aria-expanded={isSelectOpen}
            aria-haspopup="listbox"
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            disabled={disabled}
            onClick={() => (isSelectOpen ? closeDropdown() : openDropdown())}
            onKeyDown={onButtonKeyDown}
            ref={(node) => {
              buttonRef.current = node;

              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            className={cn(
              "flex h-10 w-full items-center justify-between",
              "rounded-md border",
              "bg-background",
              "pl-3 pr-1 py-2",
              "text-sm",
              "transition-colors",
              "cursor-pointer",

              "border-border",
              "text-foreground",

              "focus:outline-none",
              "focus-visible:ring",
              "focus-visible:ring-ring",

              "disabled:cursor-not-allowed",
              "disabled:opacity-50",

              error && "border-danger focus-visible:ring-danger",

              startIcon && "pl-10",

              fieldClass,
            )}
            {...props}
          >
            <div className="flex items-center">
              {startIcon && (
                <span
                  className={cn(
                    "absolute left-3",
                    "pointer-events-none",
                    "text-muted-foreground",
                  )}
                >
                  {startIcon}
                </span>
              )}
              <span
                className={cn(
                  "truncate",
                  selectedOption ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {displayValue || placeholder}
              </span>
            </div>

            {endIcon ? (
              <span
                className={cn(
                  "flex items-center",
                  "text-muted-foreground",
                  "transition-transform duration-200",
                  isSelectOpen && "rotate-180",
                )}
              >
                {endIcon}
              </span>
            ) : (
              <CaretUpOutlineIcon
                className={cn(
                  "size-5 shrink-0",
                  "text-muted-foreground",
                  "transition-transform duration-200",
                  !isSelectOpen && "rotate-180",
                )}
              />
            )}
          </button>
        </div>

        {helperText && !error && (
          <p id={helperId} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-medium text-danger"
          >
            {error}
          </p>
        )}

        {resolvedPortalTarget &&
          isSelectOpen &&
          validDropdownStyle &&
          createPortal(
            <div
              ref={portalRef}
              id={popupId}
              role="listbox"
              aria-labelledby={label ? labelId : undefined}
              aria-activedescendant={
                highlightedIndex >= 0
                  ? `${popupId}-option-${highlightedIndex}`
                  : undefined
              }
              data-placement={placement}
              style={{
                ...validDropdownStyle,
                transformOrigin:
                  placement === "top" ? "bottom left" : "top left",
              }}
              className={cn(
                "rounded-lg border",
                "border-border",
                "bg-background",
                "text-card-foreground",
                "shadow-lg",
                "p-1.5",
                "transition-all duration-150 ease-out",
                "will-change-transform",
                IsSelectVisible
                  ? "translate-y-0 scale-100 opacity-100"
                  : placement === "top"
                    ? "-translate-y-2 scale-95 opacity-0"
                    : "translate-y-2 scale-95 opacity-0",
              )}
            >
              <div
                ref={listboxRef}
                className={cn(
                  "max-h-60 overflow-y-auto sideBar",
                  "rounded-md",
                  "space-y-0.5",
                )}
              >
                {options.length === 0 ? (
                  <div
                    className={cn(
                      "px-3 py-2",
                      "text-sm",
                      "text-muted-foreground",
                    )}
                  >
                    No options available
                  </div>
                ) : (
                  options.map((option, index) => (
                    <div
                      id={`${popupId}-opt-${index}`}
                      key={option.value}
                      role="option"
                      aria-selected={selectedValue === option.value}
                      tabIndex={-1}
                      onClick={() => handleOptionSelect(option.value)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onMouseLeave={() => setHighlightedIndex(-1)}
                    >
                      {renderOption(
                        option,
                        selectedValue === option.value,
                        highlightedIndex === index,
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>,
            document.body,
          )}
      </div>
    );
  },
);

Select.displayName = "Select";

export { Select };
