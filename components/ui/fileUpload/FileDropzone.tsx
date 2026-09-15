"use client";

import { KeyboardEvent, RefObject } from "react";
import { cn } from "@/lib/utils";
import { UploadIcon } from "@/components/icons/Icons";
import { formatBytes } from "./utils";

interface FileDropzoneProps {
  isDragging: boolean;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  maxSize: number;
  maxFiles: number;
  onClick: () => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

export function FileDropzone({
  isDragging,
  disabled = false,
  multiple = false,
  accept,
  maxSize,
  maxFiles,
  onClick,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  inputRef,
}: FileDropzoneProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label={multiple ? "Upload files" : "Upload file"}
      onClick={() => {
        if (!disabled) {
          onClick();
        }
      }}
      onKeyDown={handleKeyDown}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        "relative rounded-lg cursor-pointer",
        "bg-transparent text-card-foreground",
        "border border-border",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:border-ring",

        isDragging && "border-reverse/10 bg-reverse/4 border-dashed",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <div className="flex-col center px-6 py-10 text-center">
        <div
          className={cn(
            "mb-4 h-14 w-14 center rounded-full",
            "bg-reverse/4 text-reverse",
          )}
        >
          <UploadIcon className="h-7 w-7" />
        </div>

        <p className="font-medium">
          Upload your {multiple ? "files" : "a file"} here
        </p>

        <p className="mt-2 text-xs text-muted-foreground">
          Drag and drop files here or click to browse
        </p>

        <div className="mt-0.5 space-y-1 text-xs text-muted-foreground">
          <p>Maximum file size: {formatBytes(maxSize)}</p>

          {multiple && <p>Maximum files: {maxFiles}</p>}

          {accept && <p className="break-all">Accepted: {accept}</p>}
        </div>
      </div>
    </div>
  );
}
