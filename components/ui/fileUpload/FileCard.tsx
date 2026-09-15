"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import type { CustomFile } from "./types";

import {
  BadgeAlertIcon,
  CameraIcon,
  DownloadIcon,
  EyeIcon,
  FileCodeIcon,
  FileIcon,
  ImageIcon,
  MusicIcon,
  PackageIcon,
  TrashIcon,
} from "@/components/icons/Icons";
import Image from "next/image";

interface FileCardProps {
  file: CustomFile;
  previewMaxHeight?: number;
  allowDownload?: boolean;
  showPreview?: boolean;
  onPreview?: (file: CustomFile) => void;
  onDownload?: (file: CustomFile) => void;
  onRemove?: (file: CustomFile) => void;
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) {
    return <ImageIcon className="h-5 w-5" />;
  }

  if (type.startsWith("video/")) {
    return <CameraIcon className="h-5 w-5" />;
  }

  if (type.startsWith("audio/")) {
    return <MusicIcon className="h-5 w-5" />;
  }

  if (type === "application/pdf") {
    return <FileIcon className="h-5 w-5" />;
  }

  if (
    type.includes("javascript") ||
    type.includes("json") ||
    type.includes("html") ||
    type.includes("typescript")
  ) {
    return <FileCodeIcon className="h-5 w-5" />;
  }

  if (
    type.includes("zip") ||
    type.includes("compressed") ||
    type.includes("archive")
  ) {
    return <PackageIcon className="h-5 w-5" />;
  }

  return <FileIcon className="h-5 w-5" />;
}

function canPreview(type: string) {
  return type.startsWith("image/") || type === "application/pdf";
}

function FileCardComponent({
  file,
  previewMaxHeight = 240,
  allowDownload = true,
  showPreview = true,
  onPreview,
  onDownload,
  onRemove,
}: FileCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border",
        "border-border",
        "text-card-foreground",
      )}
    >
      {/* Preview */}
      {showPreview && file.type.startsWith("image/") && (
        <div
          className={cn(
            "flex justify-center",
            "border-b border-border",
            "bg-muted/30 p-3",
          )}
        >
          <Image
            src={file.url}
            alt={file.name}
            loading="lazy"
            className="object-contain"
            style={{
              maxHeight: `${previewMaxHeight}px`,
            }}
            width={1000}
            height={1000}
            // blob: object URLs (freshly-selected local files) can't be
            // fetched by Next's image optimizer, which runs server-side.
            unoptimized={file.url.startsWith("blob:")}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

      <div className="flex items-center gap-3 p-3">
        {/* File Icon */}
        <div
          className={cn("shrink-0", "text-muted-foreground")}
          aria-hidden="true"
        >
          {getFileIcon(file.type)}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-medium" title={file.name}>
              {file.name}
            </p>

            {file.isServerFile && (
              <span
                className={cn(
                  "rounded-md px-2 py-0.5",
                  "bg-primary/10",
                  "text-primary",
                  "text-xs font-medium",
                )}
              >
                Server
              </span>
            )}
          </div>

          {/* Upload Progress */}
          {!file.error && file.uploadProgress < 100 && (
            <div className="mt-2">
              <div
                className={cn(
                  "h-1.5 w-full overflow-hidden rounded-full",
                  "bg-muted",
                )}
              >
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: `${file.uploadProgress}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {file.error && (
            <p
              role="alert"
              className={cn(
                "mt-2 flex items-center gap-1",
                "text-sm text-danger",
              )}
            >
              <BadgeAlertIcon className="h-3 w-3" />
              <span>{file.error}</span>
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {file.uploaded && canPreview(file.type) && onPreview && (
            <button
              type="button"
              aria-label={`Preview ${file.name}`}
              title={`Preview ${file.name}`}
              onClick={() => onPreview(file)}
              className={cn(
                "center size-8 cursor-pointer rounded-md",
                "text-muted-foreground",
                "hover:bg-accent",
                "hover:text-accent-foreground",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-ring",
              )}
            >
              <EyeIcon className="h-4 w-4" />
            </button>
          )}

          {file.uploaded && allowDownload && onDownload && (
            <button
              type="button"
              aria-label={`Download ${file.name}`}
              title={`Download ${file.name}`}
              onClick={() => onDownload(file)}
              className={cn(
                "center size-8 cursor-pointer rounded-md",
                "text-muted-foreground",
                "hover:bg-accent",
                "hover:text-accent-foreground",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-ring",
              )}
            >
              <DownloadIcon className="h-4 w-4" />
            </button>
          )}

          {onRemove && (
            <button
              type="button"
              aria-label={`Remove ${file.name}`}
              title={`Remove ${file.name}`}
              onClick={() => onRemove(file)}
              className={cn(
                "center size-8 cursor-pointer rounded-md",
                "text-muted-foreground",
                "hover:bg-accent",
                "hover:text-accent-foreground",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-ring",
              )}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export const FileCard = memo(FileCardComponent);
