"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Positioning and dismissal for a dropdown, with the panel's own markup left
 * to the caller.
 *
 * The children are a trigger followed by the panel; this only owns the
 * relative box they sit in and the three ways a dropdown should close —
 * clicking outside it, pressing Escape, and moving focus away.
 *
 * `clickMenu` distinguishes "opened by click" from "opened by hover", so a
 * menu the user clicked stays put when the pointer leaves. Callers that only
 * ever click can pass a state pair and ignore it.
 */
export default function DropdownLayout({
  dropdownOpen,
  setDropdownOpen,
  clickMenu,
  setClickMenu,
  className,
  children,
}: {
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  clickMenu: boolean;
  setClickMenu: (clicked: boolean) => void;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setClickMenu(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setDropdownOpen(false);
      setClickMenu(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [dropdownOpen, setDropdownOpen, setClickMenu]);

  return (
    <div
      ref={ref}
      className={className ? `relative ${className}` : "relative"}
      onClick={() => {
        // A click always wins over hover: it both opens the menu and pins it.
        const next = !dropdownOpen;
        setDropdownOpen(next);
        setClickMenu(next);
      }}
      onMouseLeave={() => {
        if (clickMenu) return;
        setDropdownOpen(false);
      }}
    >
      {children}
    </div>
  );
}
