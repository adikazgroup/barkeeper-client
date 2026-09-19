import { cn } from "@/lib/utils";

export function RayBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >

      <div
        className="absolute inset-x-[-20%] top-0 h-[150%] text-foreground/5.5 dark:text-foreground/9"
        style={{
          backgroundImage:
            "repeating-conic-gradient(from 168deg at 50% -8%, currentColor 0deg 1.2deg, transparent 1.2deg 7deg)",
          maskImage:
            "radial-gradient(75% 85% at 50% 0%, #000 0%, rgba(0,0,0,0.45) 45%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(75% 85% at 50% 0%, #000 0%, rgba(0,0,0,0.45) 45%, transparent 78%)",
        }}
      />

      <div className="absolute -top-24 left-1/2 h-56 w-[70%] -translate-x-1/2 rounded-[50%] bg-foreground/4 blur-[90px] dark:bg-foreground/[0.07]" />

      <div className="bg-grain absolute inset-0 opacity-[0.05] mix-blend-multiply dark:opacity-[0.07] dark:mix-blend-screen" />
    </div>
  );
}
