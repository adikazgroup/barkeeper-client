"use client";

import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { getActualScrollY } from "@/hooks/useDropdownPosition";
import {
    CheckIcon,
    PlusIcon,
    XIcon,
    ChevronUpIcon,
    SearchIcon,
} from "@/components/icons/Icons";
import {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
    useRef,
    forwardRef,
    ChangeEvent,
    MouseEvent as ReactMouseEvent,
    KeyboardEvent as ReactKeyboardEvent,
    JSX,
} from "react";

// --- Type Definitions ---

interface Option {
    value: string | number;
    label: string;
    description?: string;
}

interface MultipleSearchSelectProps {
    className?: string;
    label?: string;
    helperText?: string;
    error?: string;
    fullWidth?: boolean;
    startIcon?: JSX.Element;
    endIcon?: JSX.Element;
    options: Option[];
    placeholder?: string;
    searchPlaceholder?: string;
    value?: (string | number)[];
    onValueChange?: (value: (string | number)[]) => void;
    onChange?: (event: { target: { value: (string | number)[] } }) => void;
    defaultValue?: (string | number)[];
    optionRenderer?: (
        option: Option,
        isSelected: boolean,
        isHighlighted: boolean,
    ) => JSX.Element;
    maxItems?: number;
    requiredSign?: boolean;
}

type Placement = "bottom" | "top";

interface DropdownStyle {
    top: number;
    left: number;
    width: number;
    position: "absolute" | "fixed";
    zIndex: number;
}

// --- Component ---

const MultipleSearchSelect = forwardRef<
    HTMLDivElement,
    MultipleSearchSelectProps
>(
    (
        {
            className = "w-[280px]",
            label,
            helperText,
            error,
            fullWidth = false,
            startIcon,
            endIcon,
            options = [],
            placeholder = "Select options",
            searchPlaceholder = "Search...",
            onValueChange,
            onChange,
            value, // Controlled value
            defaultValue = [], // Uncontrolled value
            optionRenderer,
            maxItems = Number.POSITIVE_INFINITY,
            requiredSign = false,
            ...props
        },
        ref,
    ) => {
        // 1. Initialize State with Controlled/Uncontrolled Logic
        const initialValue =
            value !== undefined
                ? (value as (string | number)[])
                : Array.isArray(defaultValue)
                    ? defaultValue
                    : [];

        const [selectedValues, setSelectedValues] =
            useState<(string | number)[]>(initialValue);
        const [isOpen, setIsOpen] = useState<boolean>(false);
        const [isVisible, setIsVisible] = useState<boolean>(false);
        const [placement, setPlacement] = useState<Placement>("bottom");
        const [hasCoords, setHasCoords] = useState<boolean>(false);
        const [dropdownStyle, setDropdownStyle] = useState<DropdownStyle>({
            top: 0,
            left: 0,
            width: 0,
            position: "absolute",
            zIndex: 9999,
        });
        const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
        const [searchQuery, setSearchQuery] = useState<string>("");

        // 2. Refs (Typed)
        const dropdownRef = useRef<HTMLDivElement | null>(null);
        const portalRef = useRef<HTMLDivElement | null>(null);
        const optionsRef = useRef<HTMLDivElement | null>(null);
        const searchInputRef = useRef<HTMLInputElement | null>(null);
        const triggerRef = useRef<HTMLButtonElement | null>(null);

        // 3. Derived/Computed Values
        // Determine which set of values to use for display/logic (Controlled vs. Uncontrolled)
        const currentSelectedValues = value !== undefined ? value : selectedValues;
        const isMaxItemsSelected = currentSelectedValues.length >= maxItems;

        const selectedOptions: Option[] = options.filter((option) =>
            currentSelectedValues.includes(option.value),
        );

        const filteredOptions: Option[] = options.filter(
            (option) =>
                option.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (currentSelectedValues.length < maxItems ||
                    currentSelectedValues.includes(option.value)),
        );

        // 4. Positioning (mirrors Select.tsx / SearchSelect.tsx)
        const calculatePositionBase = useCallback(() => {
            if (!triggerRef.current) return null;

            const rect = triggerRef.current.getBoundingClientRect();
            const isInModal = !!triggerRef.current.closest('[role="dialog"]');

            let top: number, left: number, position: "absolute" | "fixed";
            if (isInModal) {
                top = rect.bottom;
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
            (estimatedHeight = 280) => {
                const base = calculatePositionBase();
                if (!base) return;

                const { rect, left, position, isInModal } = base;
                const spacing = 5;
                const viewportHeight = window.innerHeight;
                const minTopPadding = 5;

                let topPosition: number;
                let decided: Placement = "bottom";

                if (position === "fixed") {
                    const bottomPosition = rect.bottom + spacing;
                    const spaceBelow = viewportHeight - bottomPosition;
                    const spaceAbove = rect.top - spacing;

                    if (spaceBelow < estimatedHeight && spaceAbove >= estimatedHeight) {
                        topPosition = Math.max(
                            minTopPadding,
                            rect.top - estimatedHeight - spacing,
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

                    if (spaceBelow < estimatedHeight && spaceAbove >= estimatedHeight) {
                        topPosition = Math.max(
                            scrollY + minTopPadding,
                            rect.top + scrollY - estimatedHeight - spacing,
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

        // Recompute with the panel's actual height once it has rendered
        useLayoutEffect(() => {
            if (!isOpen || !portalRef.current || !triggerRef.current) return;

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
        }, [isOpen, isVisible, calculatePositionBase, placement]);

        // Scroll/resize listeners while open
        useEffect(() => {
            if (!isOpen) return;
            const handler = () =>
                calculatePosition(optionsRef.current?.offsetHeight || 280);
            window.addEventListener("scroll", handler, {
                capture: true,
                passive: true,
            });
            window.addEventListener("resize", handler);
            return () => {
                window.removeEventListener("scroll", handler, { capture: true });
                window.removeEventListener("resize", handler);
            };
        }, [isOpen, calculatePosition]);

        const openDropdown = useCallback(() => {
            calculatePosition();
            setIsOpen(true);
            requestAnimationFrame(() => setIsVisible(true));
        }, [calculatePosition]);

        const closeDropdown = useCallback(() => {
            setIsVisible(false);
            setSearchQuery("");
            setTimeout(() => {
                setIsOpen(false);
                setHasCoords(false);
            }, 150);
        }, []);

        // 5. Effects
        // Synchronize controlled 'value' prop with internal state (The only use case where setState in useEffect is typically acceptable for controlled components)
        useEffect(() => {
            if (
                value !== undefined &&
                JSON.stringify(value) !== JSON.stringify(selectedValues)
            ) {
                setSelectedValues(Array.isArray(value) ? value : []);
            }
        }, [value, selectedValues]); // Added selectedValues to dependency array for comparison

        // Handle click outside — the panel now lives in a portal, so it's checked
        // separately from the trigger rather than relying on DOM containment.
        useEffect(() => {
            if (!isOpen) return;
            const handleClickOutside = (event: MouseEvent) => {
                const target = event.target as Node;
                if (
                    portalRef.current &&
                    !portalRef.current.contains(target) &&
                    !triggerRef.current?.contains(target)
                ) {
                    closeDropdown();
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [isOpen, closeDropdown]);

        // Focus search input when dropdown opens
        useEffect(() => {
            if (isOpen && searchInputRef.current) {
                setTimeout(() => {
                    searchInputRef.current?.focus();
                }, 10);
            }
        }, [isOpen]);

        // 6. Handlers
        const updateSelectedValues = (newSelectedValues: (string | number)[]) => {
            // Update local state if the component is uncontrolled (value === undefined)
            if (value === undefined) {
                setSelectedValues(newSelectedValues);
            }

            // Call external handlers
            if (onChange) {
                const syntheticEvent = { target: { value: newSelectedValues } };
                onChange(syntheticEvent);
            }

            if (onValueChange) {
                onValueChange(newSelectedValues);
            }
        };

        const handleOptionToggle = (optionValue: string | number) => {
            let newSelectedValues: (string | number)[];

            if (currentSelectedValues.includes(optionValue)) {
                newSelectedValues = currentSelectedValues.filter(
                    (v) => v !== optionValue,
                );
            } else if (currentSelectedValues.length < maxItems) {
                newSelectedValues = [...currentSelectedValues, optionValue];
            } else {
                return; // Max items reached
            }

            updateSelectedValues(newSelectedValues);
        };

        const handleRemoveValue = (
            optionValue: string | number,
            e: ReactMouseEvent<HTMLButtonElement>,
        ) => {
            e.stopPropagation();

            const newSelectedValues = currentSelectedValues.filter(
                (v) => v !== optionValue,
            );

            updateSelectedValues(newSelectedValues);
        };

        const handleKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
            // Prevent handling navigation keys if search input is active and not escape/enter
            if (
                document.activeElement === searchInputRef.current &&
                e.key !== "Escape" &&
                e.key !== "Enter"
            ) {
                return;
            }

            if (
                !isOpen &&
                (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")
            ) {
                openDropdown();
                e.preventDefault();
                return;
            }

            if (!isOpen) return;

            switch (e.key) {
                case "Escape":
                    closeDropdown();
                    // Refocus the trigger button after closing
                    triggerRef.current?.focus();
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    setHighlightedIndex((prevIndex) => {
                        const newIndex =
                            prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0;
                        scrollOptionIntoView(newIndex);
                        return newIndex;
                    });
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setHighlightedIndex((prevIndex) => {
                        const newIndex =
                            prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1;
                        scrollOptionIntoView(newIndex);
                        return newIndex;
                    });
                    break;
                case "Enter":
                    e.preventDefault();
                    if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
                        handleOptionToggle(filteredOptions[highlightedIndex].value);
                    }
                    break;
                default:
                    break;
            }
        };

        const scrollOptionIntoView = (index: number) => {
            const optionsContainer = optionsRef.current;
            // Index + 1 because the search bar is the first element
            const optionElement = optionsContainer?.children[index + 1] as
                HTMLDivElement | undefined;

            if (optionsContainer && optionElement) {
                optionElement.scrollIntoView({
                    block: "nearest",
                    inline: "start",
                });
            }
        };

        // Default option renderer if none provided
        const defaultOptionRenderer = (
            option: Option,
            isSelected: boolean,
            isHighlighted: boolean,
        ): JSX.Element => (
            <div
                className={cn(
                    "flex items-center text-sm px-3 py-2 cursor-pointer rounded transition-colors",
                    isSelected
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50 text-foreground",
                    isHighlighted && !isSelected && "bg-accent/30",
                )}
            >
                <div className="flex-1">{option.label}</div>
                {isSelected ? (
                    <CheckIcon className="h-4 w-4 text-current" />
                ) : currentSelectedValues.length < maxItems ? (
                    <PlusIcon className="h-4 w-4 text-muted-foreground" />
                ) : null}
                {option.description && (
                    <span className="ml-2 text-xs text-muted-foreground">
                        {option.description}
                    </span>
                )}
            </div>
        );

        // Use custom renderer or default
        const renderOption = optionRenderer || defaultOptionRenderer;

        const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value);
            setHighlightedIndex(-1);
        };

        const clearSearch = () => {
            setSearchQuery("");
            searchInputRef.current?.focus();
        };

        const clearAll = (e: ReactMouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            updateSelectedValues([]);
        };

        const resolvedPortalTarget =
            typeof document !== "undefined" ? document.body : null;
        const validDropdownStyle =
            hasCoords && dropdownStyle.width > 0 ? dropdownStyle : undefined;

        return (
            <div
                className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}
                ref={ref}
            >
                {label && (
                    <label className="text-sm font-medium text-foreground">
                        {label}
                        {requiredSign && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        className={cn(
                            "flex min-h-11 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:border-muted-foreground/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer transition-all",
                            startIcon && "pl-10",
                            error && "border-destructive",
                            className,
                        )}
                        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
                        onKeyDown={handleKeyDown}
                        aria-haspopup="listbox"
                        aria-expanded={isOpen}
                        ref={triggerRef}
                        {...props}
                    >
                        <div className="flex flex-wrap items-center gap-1 pr-2">
                            {startIcon && (
                                <span className="absolute left-3 flex items-center pointer-events-none text-muted-foreground ">
                                    {startIcon}
                                </span>
                            )}

                            {currentSelectedValues.length === 0 ? (
                                <span className="text-muted-foreground">{placeholder}</span>
                            ) : (
                                <div className="flex flex-wrap gap-1 max-w-full">
                                    {selectedOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            className="flex items-center bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs"
                                        >
                                            <span className="truncate max-w-[150px]">
                                                {option.label}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={(e) => handleRemoveValue(option.value, e)}
                                                className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                                            >
                                                <XIcon className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-1">
                            {currentSelectedValues.length > 0 && (
                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                                    aria-label="Clear all selections"
                                >
                                    <XIcon className="h-4 w-4" />
                                </button>
                            )}
                            {endIcon ? (
                                <span className="flex items-center text-gray-500 dark:text-gray-200">
                                    {endIcon}
                                </span>
                            ) : (
                                <span className="flex items-center text-gray-500 dark:text-gray-200">
                                    <ChevronUpIcon
                                        className={cn(
                                            "h-4 w-4 transition-transform duration-300",
                                            isOpen ? "rotate-0" : "rotate-180",
                                        )}
                                    />
                                </span>
                            )}
                        </div>
                    </button>
                </div>

                {helperText && !error && (
                    <p className="text-xs text-muted-foreground">{helperText}</p>
                )}

                {error && (
                    <p className="text-xs text-destructive font-medium">{error}</p>
                )}

                {resolvedPortalTarget &&
                    isOpen &&
                    validDropdownStyle &&
                    createPortal(
                        <div
                            ref={portalRef}
                            role="listbox"
                            aria-multiselectable="true"
                            data-placement={placement}
                            className={cn(
                                "rounded-md border border-border bg-popover text-popover-foreground shadow-md transition-opacity duration-150",
                                isVisible ? "opacity-100" : "opacity-0",
                            )}
                            style={{
                                position: validDropdownStyle.position,
                                top: validDropdownStyle.top,
                                left: validDropdownStyle.left,
                                width: validDropdownStyle.width,
                                zIndex: validDropdownStyle.zIndex,
                            }}
                        >
                            <div
                                className="max-h-60 overflow-auto sideBar bg-popover rounded-md p-1.5 pt-0 space-y-1"
                                ref={optionsRef}
                            >
                                {/* Search input */}
                                <div className="sticky top-0 bg-popover p-1 mb-1 border-b border-border">
                                    <div className="relative mt-1.5">
                                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            ref={searchInputRef}
                                            className="w-full h-9 pl-8 pr-8 rounded border border-input bg-background text-foreground text-sm focus:outline-none focus:border-muted-foreground/50 transition-all"
                                            placeholder={searchPlaceholder}
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            onKeyDown={(e) => e.stopPropagation()}
                                            onClick={(e) => e.stopPropagation()}
                                            aria-label="Search options"
                                        />
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                onClick={clearSearch}
                                                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                                                aria-label="Clear search"
                                            >
                                                <XIcon className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>

                                    {currentSelectedValues.length > 0 && (
                                        <div className="flex justify-between items-center mt-2 px-1 text-xs text-gray-500 dark:text-gray-300">
                                            <span>{currentSelectedValues.length} selected</span>
                                            {maxItems < Number.POSITIVE_INFINITY && (
                                                <span
                                                    className={cn(
                                                        isMaxItemsSelected
                                                            ? "text-amber-500"
                                                            : "text-muted-foreground",
                                                    )}
                                                >
                                                    {isMaxItemsSelected
                                                        ? "Maximum items selected"
                                                        : `${maxItems - currentSelectedValues.length} more available`}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {filteredOptions.length === 0 ? (
                                    <div className="px-3 py-2 text-sm text-muted-foreground">
                                        No options found
                                    </div>
                                ) : (
                                    filteredOptions.map((option, index) => (
                                        <div
                                            key={option.value}
                                            role="option"
                                            aria-selected={currentSelectedValues.includes(
                                                option.value,
                                            )}
                                            tabIndex={-1}
                                            onClick={() => handleOptionToggle(option.value)}
                                            onMouseEnter={() => setHighlightedIndex(index)}
                                            onMouseLeave={() => setHighlightedIndex(-1)}
                                        >
                                            {renderOption(
                                                option,
                                                currentSelectedValues.includes(option.value),
                                                highlightedIndex === index,
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>,
                        resolvedPortalTarget,
                    )}
            </div>
        );
    },
);

MultipleSearchSelect.displayName = "MultipleSearchSelect";

export { MultipleSearchSelect };