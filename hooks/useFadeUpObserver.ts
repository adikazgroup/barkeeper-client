"use client";

import { useEffect, useRef } from "react";

export function useFadeUpObserver() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reveal once and stop watching. Toggling the class back off meant a
    // section taller than the viewport kept crossing the threshold as you
    // scrolled, re-running the fade and flickering the whole block.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("animate-in");
        observer.disconnect();
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
