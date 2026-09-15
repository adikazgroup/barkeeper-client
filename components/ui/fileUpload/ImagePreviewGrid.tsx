"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { TrashIcon } from "@/components/icons/Icons";

import type { CustomFile } from "./types";
import Image from "next/image";

interface ImagePreviewGridProps {
  files: CustomFile[];
  onRemove: (file: CustomFile) => void;
  maxVisible?: number;
  maxHeight?: number;
}

function ImagePreviewGridComponent({
  files,
  onRemove,
  maxVisible,
  maxHeight,
}: ImagePreviewGridProps) {
  const visibleFiles = maxVisible ? files.slice(0, maxVisible) : files;

  const remainingCount = maxVisible
    ? Math.max(files.length - maxVisible, 0)
    : 0;

  return (
    <div
      className={cn(
        "grid gap-3",
        "grid-cols-2",
        "sm:grid-cols-3",
        "md:grid-cols-4",
        "lg:grid-cols-5",
      )}
    >
      {visibleFiles.map((file, index) => {
        const isLastVisible =
          maxVisible && index === visibleFiles.length - 1 && remainingCount > 0;

        return (
          <div
            key={file.id}
            style={maxHeight ? { maxHeight } : undefined}
            className={cn(
              "group relative overflow-hidden",
              "aspect-square rounded-xl",
              "border border-border",
              "bg-card",
            )}
          >
            <Image
              src={file.url}
              alt={file.name}
              loading="lazy"
              width={1000}
              height={1000}
              // blob: object URLs (freshly-selected local files) can't be
              // fetched by Next's image optimizer, which runs server-side.
              unoptimized={file.url.startsWith("blob:")}
              className={cn(
                "h-full w-full object-cover",
                "transition-transform duration-300",
                "group-hover:scale-105",
              )}
            />

            {/* Overlay */}
            <div
              className={cn(
                "absolute inset-0",
                "bg-black/0",
                "transition-colors duration-200",
                "group-hover:bg-black/20",
              )}
            />

            {/* More Count */}
            {isLastVisible && (
              <div
                className={cn(
                  "absolute inset-0 center",
                  "bg-black/60 text-white",
                )}
              >
                <span className="text-xl font-semibold">+{remainingCount}</span>
              </div>
            )}

            {/* Remove Button */}
            <button
              type="button"
              aria-label={`Remove ${file.name}`}
              title={`Remove ${file.name}`}
              onClick={() => onRemove(file)}
              className={cn(
                "absolute right-2 top-2",
                "size-8 center",
                "cursor-pointer",
                "rounded-full",
                "bg-background/95",
                "text-muted-foreground",
                "shadow-sm backdrop-blur",
                "opacity-0 transition-all",
                "group-hover:opacity-100",
                "hover:bg-accent",
                "hover:text-accent-foreground",
                "focus-visible:opacity-100",
                "focus-visible:outline-none",
                "focus-visible:ring-1",
                "focus-visible:ring-ring",
              )}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export const ImagePreviewGrid = memo(ImagePreviewGridComponent);
