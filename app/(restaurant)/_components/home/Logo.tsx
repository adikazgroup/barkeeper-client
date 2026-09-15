import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The brand mark.
 *
 * One file, not two: the wordmark is gold on transparent, so it reads on the
 * light ground and the dark one alike. The theme-swapped pair this used to
 * render is gone — the dark file went with the old brand, and keeping the
 * `dark:` branch meant the header asked for a picture that no longer exists.
 */

/** The file's own pixels, so Next can reserve the right box. */
const WIDTH = 2159;
const HEIGHT = 728;

export function Logo({
  className = "h-7 w-auto",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo/logo.png"
      alt=""
      aria-hidden
      width={WIDTH}
      height={HEIGHT}
      priority={priority}
      className={cn("object-contain select-none", className)}
    />
  );
}
