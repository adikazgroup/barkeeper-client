"use client";

import { useEffect, useRef, useCallback } from "react";

export function useScrollReveal() {
  const ref = useRef<HTMLElement | null>(null);

  const observe = useCallback(() => {
    const elements = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return observer;
  }, []);

  useEffect(() => {
    const observer = observe();
    return () => observer.disconnect();
  }, [observe]);

  return ref;
}
