import Image from "next/image";
import { cn } from "@/lib/utils";

const WIDTH = 5198;
const HEIGHT = 1329;

export function Logo({
  className = "h-7 w-auto",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  const shared = cn("object-contain select-none", className);

  return (
    <>
      <Image
        src="/logo/logo.png"
        alt=""
        aria-hidden
        width={WIDTH}
        height={HEIGHT}
        priority={priority}
        className={cn(shared, "dark:hidden")}
      />
      <Image
        src="/logo/logo-dark.png"
        alt=""
        aria-hidden
        width={WIDTH}
        height={HEIGHT}
        priority={priority}
        className={cn(shared, "hidden dark:block")}
      />
    </>
  );
}
