"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { ImageIcon } from "../icons/Icons";
import { cn } from "@/lib/utils";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src?: ImageProps["src"];
  fallbackClassName?: string;
  /** Overrides the placeholder mark's size where a caller wants its own. */
  fallbackIconClassName?: string;
}

export default function SafeImage({
  src,
  alt,
  fallbackClassName,
  fallbackIconClassName,
  className,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={fallbackClassName}>
        {/* Capped against the box as well as in pixels: 40px alone fills a
            48px thumbnail edge to edge, which reads as a broken icon rather
            than as a missing photograph. */}
        <ImageIcon
          className={cn(
            "size-10 max-h-[38%] max-w-[38%] opacity-40",
            fallbackIconClassName,
          )}
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={className}
      {...props}
    />
  );
}
