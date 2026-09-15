import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The brand mark, for the app chrome.
 *
 * One file for both themes: the wordmark is gold on transparent, so it holds
 * up on either ground. The dark-only variant this used to swap in belonged to
 * the previous brand and is no longer shipped.
 *
 * Wrapped in a link to the dashboard root by default — in the sidebar and the
 * mobile navbar the logo is the way home, and a bare image there is a dead
 * spot people keep clicking. Pass `href={null}` where it is decorative.
 */

/** The file's own pixels, so Next can reserve the right box. */
const WIDTH = 2159;
const HEIGHT = 728;

export default function Logo({
  className = "h-7 w-auto",
  href = "/dashboard",
  priority = false,
}: {
  className?: string;
  href?: string | null;
  priority?: boolean;
}) {
  const mark = (
    <div className="relative flex shrink-0 items-center text-xl font-medium">
      <Image
        src="/logo/logo.png"
        alt="Barkeeper"
        width={WIDTH}
        height={HEIGHT}
        priority={priority}
        className={cn("object-contain select-none", className)}
      />
    </div>
  );

  if (!href) return mark;

  return (
    <Link href={href} className="inline-flex shrink-0 items-center">
      {mark}
    </Link>
  );
}
