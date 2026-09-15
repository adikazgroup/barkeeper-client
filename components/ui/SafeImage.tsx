"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { ImageIcon } from "../icons/Icons";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src?: ImageProps["src"];
  fallbackClassName?: string;
}

export default function SafeImage({
  src,
  alt,
  fallbackClassName,
  className,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={fallbackClassName}>
        <ImageIcon className="size-10 opacity-40 " />
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
