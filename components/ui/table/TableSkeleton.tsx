"use client";

import { cn } from "@/lib/utils";
import { Column } from "./Table";

interface TableSkeletonProps<T extends object> {
  columns: Column<T>[];
  rowCount?: number;
  className?: string;
  tableClassName?: string;
  headerColor?: string;
  bordered?: boolean;
}

const TableSkeleton = <T extends object>({
  columns = [],
  rowCount = 5,
  className,
  tableClassName,
  headerColor = "",
  bordered = false,
}: TableSkeletonProps<T>) => {
  const rows = rowCount ?? 5;

  const columnStyle = (column: Column<T>) => ({
    ...(column.width != null ? { width: column.width } : {}),
    ...(column.minWidth != null ? { minWidth: column.minWidth } : {}),
    ...(column.maxWidth != null ? { maxWidth: column.maxWidth } : {}),
  });

  return (
    <div
      className={cn(
        "w-full rounded-md border border-border/80 overflow-hidden",
        className,
      )}
    >
      <div className="w-full overflow-x-auto">
        <table
          className={cn(
            "w-full border-separate border-spacing-0",
            tableClassName,
          )}
        >
          <thead className={cn("bg-muted text-muted-foreground", headerColor)}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`skeleton-header-${index}`}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-left text-sm font-medium whitespace-nowrap",
                    bordered && "border-r border-border last:border-r-0",
                    column.className,
                  )}
                  style={columnStyle(column)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={`skeleton-row-${rowIndex}`} className="animate-pulse">
                {columns.map((column, colIndex) => (
                  <td
                    key={`skeleton-cell-${rowIndex}-${colIndex}`}
                    className={cn(
                      "px-4 py-4 whitespace-nowrap",
                      rowIndex !== rows - 1 && "border-b border-border/60",
                      bordered && "border-r border-border/60 last:border-r-0",
                    )}
                    style={columnStyle(column)}
                  >
                    <div
                      className={cn(
                        "h-5 bg-muted rounded",
                        column.id === "actions"
                          ? "w-20 ml-auto"
                          : "w-full max-w-30",
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { TableSkeleton };
