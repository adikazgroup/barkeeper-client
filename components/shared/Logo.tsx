import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The brand mark, for the app chrome.
 *
 * Two files rather than one recoloured by CSS: the wordmark is a raster with
 * its own ink, so the dark variant is a different picture, not a filter.
 *
 * Wrapped in a link to the dashboard root by default — in the sidebar and the
 * mobile navbar the logo is the way home, and a bare image there is a dead
 * spot people keep clicking. Pass `href={null}` where it is decorative.
 */

const WIDTH = 5198;
const HEIGHT = 1329;

export default function Logo({
  className = "h-7 w-auto",
  href = "/dashboard",
  priority = false,
}: {
  className?: string;
  href?: string | null;
  priority?: boolean;
}) {
  const shared = cn("object-contain select-none", className);

  const mark = (
    <div className="relative flex shrink-0 items-center text-xl font-medium">
      <Image
        src="/logo/logo.png"
        alt="Barkeeper"
        width={WIDTH}
        height={HEIGHT}
        priority={priority}
        className={cn(shared, "dark:hidden")}
      />
      {/* <Image
        src="/logo/logo-dark.png"
        alt="Barkeeper"
        width={WIDTH}
        height={HEIGHT}
        priority={priority}
        aria-hidden
        className={cn(shared, "hidden dark:block")}
      /> */}


    </div>
  );

  if (!href) return mark;

  return (
    <Link href={href} className="inline-flex shrink-0 items-center">
      {mark}
    </Link>
  );
}
