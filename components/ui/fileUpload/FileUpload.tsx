"use client";

import {
  ChangeEvent,
  DragEvent,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";

import { cn } from "@/lib/utils";
import { FileCard } from "./FileCard";
import { FileDropzone } from "./FileDropzone";
import type { CustomFile, FileUploadChangeEvent } from "./types";
import { generateFileId, revokeFileUrl } from "./utils";
import { ImagePreviewGrid } from "./ImagePreviewGrid";

export interface FileUploadProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "value" | "defaultValue" | "onChange"
> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  maxSize?: number;
  maxFiles?: number;
  value?: string | string[] | CustomFile[];
  defaultValue?: string | string[] | CustomFile[];
  onValueChange?: (files: CustomFile[]) => void;
  onChange?: (e: FileUploadChangeEvent) => void;
  showPreview?: boolean;
  previewMaxHeight?: number;
  allowDownload?: boolean;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  function FileUpload(
    {
      className,
      label,
      helperText,
      error,
      fullWidth = false,
      disabled = false,
      multiple = false,
      accept,
      maxSize = 5 * 1024 * 1024,
      maxFiles = 5,
      value,
      defaultValue,
      onValueChange,
      onChange,
      showPreview = true,
      previewMaxHeight = 220,
      allowDownload = true,
      ...props
    },
    ref,
  ) {
    const inputId = useId();
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragCounterRef = useRef(0);
    const isControlled = value !== undefined;
    const [files, setFiles] = useState<CustomFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadErrors, setUploadErrors] = useState<string[]>([]);

    const emitChange = useCallback(
      (nextFiles: CustomFile[]) => {
        onValueChange?.(nextFiles);

        onChange?.({
          target: {
            value: nextFiles,
          },
        });
      },
      [onValueChange, onChange],
    );

    const createServerFile = useCallback((url: string) => {
      const fileName = url.split("/").pop() || "server-file";

      const ext = fileName.split(".").pop()?.toLowerCase() || "";

      let type = "application/octet-stream";

      if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
        type = `image/${ext === "jpg" ? "jpeg" : ext}`;
      }

      if (ext === "pdf") {
        type = "application/pdf";
      }

      return {
        id: generateFileId(),
        name: fileName,
        size: 0,
        type,
        url,
        uploadProgress: 100,
        uploaded: true,
        error: null,
        isServerFile: true,
      } satisfies CustomFile;
    }, []);

    const normalizeValue = useCallback(
      (data?: string | string[] | CustomFile[]): CustomFile[] => {
        if (!data) {
          return [];
        }

        if (
          Array.isArray(data) &&
          data.length > 0 &&
          typeof data[0] === "object" &&
          "id" in data[0]
        ) {
          return data as CustomFile[];
        }

        if (typeof data === "string") {
          return [createServerFile(data)];
        }

        if (Array.isArray(data)) {
          return data.map((item) =>
            typeof item === "string" ? createServerFile(item) : item,
          );
        }

        return [];
      },
      [createServerFile],
    );

    const normalizedValue = useMemo(
      () => normalizeValue(value),
      [value, normalizeValue],
    );

    const normalizedDefaultValue = useMemo(
      () => normalizeValue(defaultValue),
      [defaultValue, normalizeValue],
    );

    useEffect(() => {
      if (!isControlled) {
        setFiles(normalizedDefaultValue);
        return;
      }

      setFiles(normalizedValue);
    }, [isControlled, normalizedValue, normalizedDefaultValue]);

    const updateFiles = useCallback(
      (updater: CustomFile[] | ((prev: CustomFile[]) => CustomFile[])) => {
        const next = typeof updater === "function" ? updater(files) : updater;

        if (!isControlled) {
          setFiles(next);
        }
        emitChange(next);
      },
      [files, emitChange, isControlled],
    );

    const isAcceptedFile = useCallback((file: File, acceptString: string) => {
      const accepted = acceptString.split(",").map((x) => x.trim());

      return accepted.some((rule) => {
        if (rule.startsWith(".")) {
          return file.name.toLowerCase().endsWith(rule.toLowerCase());
        }

        if (rule.endsWith("/*")) {
          const category = rule.split("/")[0];
          return file.type.startsWith(`${category}/`);
        }

        return file.type === rule;
      });
    }, []);

    const processFiles = useCallback(
      (selectedFiles: FileList) => {
        const nextErrors: string[] = [];
        const incoming = Array.from(selectedFiles);
        const currentFiles = multiple ? [...files] : [];

        if (multiple && currentFiles.length + incoming.length > maxFiles) {
          nextErrors.push(`Maximum ${maxFiles} files allowed.`);
          setUploadErrors(nextErrors);
          return;
        }

        incoming.forEach((file) => {
          if (file.size > maxSize) {
            nextErrors.push(`${file.name} exceeds maximum size.`);
            return;
          }

          if (accept && !isAcceptedFile(file, accept)) {
            nextErrors.push(`${file.name} is not an accepted file type.`);
            return;
          }

          currentFiles.push({
            id: generateFileId(),
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
            uploaded: true,
            uploadProgress: 100,
            error: null,
            isServerFile: false,
          });
        });

        setUploadErrors(nextErrors);
        updateFiles(currentFiles);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      [files, accept, maxFiles, maxSize, multiple, updateFiles, isAcceptedFile],
    );

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;

      if (!selectedFiles?.length) {
        return;
      }

      processFiles(selectedFiles);
    };

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;
      dragCounterRef.current += 1;
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;
      dragCounterRef.current -= 1;

      if (dragCounterRef.current <= 0) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;
      setIsDragging(true);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current = 0;
      setIsDragging(false);

      if (disabled) {
        return;
      }

      const droppedFiles = e.dataTransfer.files;

      if (!droppedFiles?.length) {
        return;
      }

      processFiles(droppedFiles);
    };

    const handleRemoveFile = useCallback(
      (file: CustomFile) => {
        revokeFileUrl(file);
        const nextFiles = files.filter((item) => item.id !== file.id);
        updateFiles(nextFiles);
      },
      [files, updateFiles],
    );

    const handlePreviewFile = useCallback((file: CustomFile) => {
      window.open(file.url, "_blank", "noopener,noreferrer");
    }, []);

    const handleDownloadFile = useCallback((file: CustomFile) => {
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name;

      if (file.isServerFile) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, []);

    useEffect(() => {
      return () => {
        files.forEach(revokeFileUrl);
      };
    }, [files]);

    // With previews disabled every file is listed as a card instead of a thumbnail grid.
    const imageFiles = showPreview
      ? files.filter((file) => file.type.startsWith("image/"))
      : [];

    const otherFiles = showPreview
      ? files.filter((file) => !file.type.startsWith("image/"))
      : files;

    return (
      <div
        className={cn("flex flex-col gap-2", fullWidth && "w-full", className)}
      >
        {label && (
          <label
            htmlFor={inputId}
            className={cn("text-sm font-medium", "text-foreground")}
          >
            {label}
          </label>
        )}

        {files.length === 0 ? (
          <FileDropzone
            inputRef={fileInputRef}
            isDragging={isDragging}
            disabled={disabled}
            multiple={multiple}
            accept={accept}
            maxSize={maxSize}
            maxFiles={maxFiles}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ) : (
          <div className="space-y-3">
            {/* Images */}

            {imageFiles.length > 0 && (
              <div>
                <ImagePreviewGrid
                  files={imageFiles}
                  onRemove={handleRemoveFile}
                  maxHeight={previewMaxHeight}
                />
              </div>
            )}

            {/* Other Files */}

            {otherFiles.length > 0 && (
              <div className="mt-4 space-y-3">
                {otherFiles.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    showPreview={false}
                    allowDownload={allowDownload}
                    onPreview={handlePreviewFile}
                    onDownload={handleDownloadFile}
                    onRemove={handleRemoveFile}
                  />
                ))}
              </div>
            )}

            {multiple && files.length < maxFiles && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className={cn(
                  "w-full center gap-2",
                  "rounded-lg border border-dashed",
                  "border-border",
                  "bg-card",
                  "px-4 py-3",
                  "text-sm font-medium",
                  "text-muted-foreground",
                  "transition-colors",
                  "hover:border-primary",
                  "hover:text-primary",
                  "focus-visible:outline-none",
                  "focus-visible:ring",
                  "focus-visible:ring-ring",
                  disabled && "pointer-events-none opacity-50",
                )}
              >
                Add more files
              </button>
            )}
          </div>
        )}

        <input
          {...props}
          id={inputId}
          ref={(node) => {
            fileInputRef.current = node;

            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          type="file"
          hidden
          multiple={multiple}
          accept={accept}
          disabled={disabled}
          onChange={handleInputChange}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
        />

        {uploadErrors.length > 0 && (
          <div className="space-y-1" role="alert">
            {uploadErrors.map((item, index) => (
              <p
                key={`${item}-${index}`}
                className={cn("text-sm", "text-danger")}
              >
                {item}
              </p>
            ))}
          </div>
        )}

        {!error && helperText && (
          <p id={helperId} className={cn("text-xs", "text-muted-foreground")}>
            {helperText}
          </p>
        )}

        {error && (
          <p id={errorId} role="alert" className={cn("text-sm", "text-danger")}>
            {error}
          </p>
        )}
      </div>
    );
  },
);

FileUpload.displayName = "FileUpload";
