"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisIcon,
} from "@/components/icons/Icons";
import { Select } from "../select/Select";

interface PaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  pageSizeOptions?: number[];
  showPageSizeOptions: boolean;
  showPageNumbers?: boolean;
  showPrevNextButtons?: boolean;
  showPageInfo?: boolean;

  showingLabel?: string;
  ofLabel?: string;

  variant?: "default" | "floating" | "gradient" | "pill";
  size?: "small" | "default" | "large";
  color?: "primary" | "secondary" | "accent" | "custom";

  align?: "start" | "center" | "end" | "between";
  siblingCount?: number;

  className?: string;
}

const Pagination = ({
  totalItems = 0,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  onPageSizeChange,

  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeOptions = false,
  showPageNumbers = true,
  showPrevNextButtons = true,
  showPageInfo = true,

  showingLabel = "Showing",
  ofLabel = "of",

  variant = "default",
  size = "default",
  color = "primary",

  align = "center",
  siblingCount = 1,

  className,
}: PaginationProps) => {
  // Fully controlled: the page and page size are owned by the parent. Mirroring them into
  // local state would only add a render pass and a chance to drift out of sync.
  const page = currentPage;
  const perPage = pageSize;

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / perPage)),
    [totalItems, perPage],
  );

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    onPageChange(newPage);
  };

  const handlePageSizeChange = (value: string) => {
    onPageSizeChange(Number(value));
  };

  const pages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const left = Math.max(2, page - siblingCount);
    const right = Math.min(totalPages - 1, page + siblingCount);

    const showLeftDots = left > 2;
    const showRightDots = right < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const range = Array.from(
        { length: 3 + 2 * siblingCount },
        (_, i) => i + 1,
      );
      return [...range, "dots", totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const range = Array.from(
        { length: 3 + 2 * siblingCount },
        (_, i) => totalPages - (3 + 2 * siblingCount) + i + 1,
      );
      return [1, "dots", ...range];
    }

    if (showLeftDots && showRightDots) {
      const middle = Array.from(
        { length: right - left + 1 },
        (_, i) => left + i,
      );
      return [1, "dots", ...middle, "dots", totalPages];
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [page, totalPages, siblingCount]);

  const startItem = totalItems === 0 ? 0 : (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, totalItems);

  const sizeMap = {
    small: "h-7 w-7 text-xs",
    default: "h-9 w-9 text-sm",
    large: "h-11 w-11 text-base",
  };

  const colorMap = {
    primary:
      "bg-primary text-primary-foreground border-primary hover:bg-primary/90",
    secondary:
      "bg-secondary text-secondary-foreground border-border hover:bg-secondary/80",
    accent: "bg-accent text-accent-foreground border-border hover:bg-accent/80",
    custom: "bg-blue-600 text-white border-blue-600 hover:bg-blue-500",
  };

  const variantMap = {
    default: "rounded-md border border-border",
    floating: "rounded-full shadow-md border border-border bg-card",
    gradient: "rounded-md border bg-gradient-to-r from-background to-muted",
    pill: "rounded-full border border-border bg-muted",
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 w-full",
        align === "start" && "items-start",
        align === "center" && "items-center",
        align === "end" && "items-end",
        align === "between" && "items-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center gap-x-3 gap-y-2 w-full",
          align === "start" && "justify-start",
          align === "center" && "justify-center",
          align === "end" && "justify-end",
          align === "between" && "justify-center sm:justify-between",
        )}
      >
        {/* Page Info */}
        {showPageInfo && (
          <div className="flex items-center gap-3 divide-x divide-border">
            {/* Page Info Right */}
            <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap pr-3">
              Page <span className="text-foreground font-medium">{page}</span> /{" "}
              {totalPages}
            </div>
            <div className="hidden sm:block text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
              {showingLabel}{" "}
              <span className="font-medium text-foreground ">
                {startItem} - {endItem}
              </span>{" "}
              {ofLabel}{" "}
              <span className="font-medium text-foreground">{totalItems}</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              role="navigation"
              aria-label="Pagination"
              className={cn("flex items-center gap-1")}
            >
              {/* Prev */}
              {showPrevNextButtons && (
                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  aria-label="Previous page"
                  className={cn(
                    sizeMap[size],
                    variantMap[variant],
                    "flex shrink-0 items-center justify-center transition",
                    page === 1 && "opacity-40 cursor-not-allowed",
                  )}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
              )}

              {/* Pages */}
              {showPageNumbers &&
                pages.map((p, i) => {
                  if (p === "dots") {
                    return (
                      <span
                        key={`dots-${i}`}
                        className="hidden sm:flex px-2 text-muted-foreground"
                        aria-hidden="true"
                      >
                        <EllipsisIcon className="h-4 w-4" />
                      </span>
                    );
                  }

                  const isActive = p === page;

                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePageChange(Number(p))}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={`Go to page ${p}`}
                      className={cn(
                        sizeMap[size],
                        variantMap[variant],
                        "shrink-0 items-center justify-center transition font-medium",
                        isActive ? "flex" : "hidden sm:flex",
                        isActive
                          ? colorMap[color]
                          : "bg-transparent hover:bg-muted text-muted-foreground",
                      )}
                    >
                      {p}
                    </button>
                  );
                })}

              {/* Next */}
              {showPrevNextButtons && (
                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  aria-label="Next page"
                  className={cn(
                    sizeMap[size],
                    variantMap[variant],
                    "flex shrink-0 items-center justify-center transition",
                    page === totalPages && "opacity-40 cursor-not-allowed",
                  )}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              )}
            </nav>
          )}

          {/* Page Size */}
          {showPageSizeOptions && (
            <Select
              value={String(perPage)}
              onValueChange={handlePageSizeChange}
              options={pageSizeOptions.map((n) => ({
                value: String(n),
                label: `${n}/page`,
              }))}
              className="w-[90px] shrink-0"
              fieldClass="!h-[30px] !py-1 text-xs !px-2"
              placeholder="Per Page"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export { Pagination };
