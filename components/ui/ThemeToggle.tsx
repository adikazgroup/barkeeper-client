"use client";

import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";
import { SunIcon, MoonIcon } from "@/components/icons/Icons";

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();

  const revealTheme = (nextTheme: "light" | "dark") => {
    if (typeof window === "undefined") {
      setTheme(nextTheme);
      return;
    }

    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => { ready: Promise<void> };
    };

    if (!doc.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    // The theme swap must land in the DOM *inside* the callback, otherwise the
    // browser snapshots the old and new frames identically and nothing animates.
    doc.startViewTransition(() => {
      flushSync(() => setTheme(nextTheme));
      // ThemeProvider toggles the class from an effect, which may not have run
      // yet when flushSync returns — set it here so the snapshot is correct.
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
    });
  };

  const cycleTheme = () => {
    // Simple toggle between light and dark only
    if (resolvedTheme === "light") {
      revealTheme("dark");
    } else {
      revealTheme("light");
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        "relative size-8 rounded-[11px] flex items-center justify-center cursor-pointer",
        "bg-secondary hover:bg-primary/25",
        "border border-border hover:border-muted-foreground/40",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className,
      )}
      title={`Current: ${resolvedTheme}`}
      aria-label="Toggle theme"
    >
      {/* Sun Icon */}
      <SunIcon
        className={cn(
          "size-4.5 absolute transition-all duration-300 text-foreground",
          resolvedTheme === "light"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-0",
        )}
      />

      {/* Moon Icon */}
      <MoonIcon
        className={cn(
          "size-4 absolute transition-all duration-300 text-foreground",
          resolvedTheme === "dark"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-0",
        )}
      />
    </button>
  );
}
