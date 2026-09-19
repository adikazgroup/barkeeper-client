import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

  // `href={null}` is how a caller says the mark leads nowhere — and returning
  // here is also what narrows `href` to a string for the link below.
  if (!href) return mark;

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 cursor-pointer items-center"
    >
      {mark}
    </Link>
  );
}
