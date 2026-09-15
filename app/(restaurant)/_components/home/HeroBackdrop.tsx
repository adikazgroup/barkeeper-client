import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * @param className Dial the whole backdrop down where it sits behind copy
 *   rather than behind the hero — `opacity-60`, say. Set here rather than on
 *   the picture so the glow and the grain come down with it.
 */
export function HeroBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div
        className="absolute inset-0 isolate opacity-[0.18] dark:opacity-[0.09] dark:brightness-75"
        style={{
          maskImage:
            "linear-gradient(180deg, transparent 6%, #000 52%, #000 76%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 6%, #000 52%, #000 76%, transparent 100%)",
        }}
      >
        <Image
          src="/herobg2.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />

        <div className="absolute inset-0 bg-background mix-blend-color" />
      </div>

      <div className="absolute -bottom-56 left-1/2 h-120 w-340 -translate-x-1/2 rounded-[50%] bg-background/9 blur-[160px] dark:bg-background/16" />

      <div className="bg-grain absolute inset-0 opacity-[0.045] mix-blend-multiply dark:opacity-[0.07] dark:mix-blend-screen" />
    </div>
  );
}
