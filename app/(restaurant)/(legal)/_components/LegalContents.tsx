"use client";

/**
 * The contents list, with the section currently being read marked.
 *
 * A policy page is long enough that a reader loses their place in it, and the
 * contents list is the only thing on screen that can say where they are. The
 * links themselves stay ordinary anchors — deep links and no-JS both keep
 * working, and the highlight is the only thing this component adds.
 */

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Distance below the viewport top that counts as "being read". Sits just
 *  under the fixed header, matching the `scroll-mt` on the sections. */
const READING_LINE = 120;

export function LegalContents({
  sections,
}: {
  sections: { id: string; title: string }[];
}) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  // The ids are fixed for the life of the page; joining them keeps the effect
  // from re-subscribing when the parent hands down a fresh array.
  const key = sections.map((section) => section.id).join("|");

  useEffect(() => {
    const ids = key.split("|");
    let frame = 0;

    const update = () => {
      frame = 0;

      // The last heading to have crossed the reading line is the one being
      // read. Walking in order and stopping at the first that has not crossed
      // is enough — sections cannot overlap.
      let current = ids[0];
      for (const id of ids) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top > READING_LINE) break;
        current = id;
      }

      // The final sections are shorter than the viewport, so their headings
      // never reach the line and they could never be marked. At the foot of
      // the page, the last one is the one in view.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) current = ids[ids.length - 1];

      setActiveId(current);
    };

    // Coalesced into a frame: scroll fires far more often than the highlight
    // can meaningfully change.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [key]);

  return (
    <ol className="mt-5 space-y-1">
      {sections.map((section, index) => {
        const isActive = section.id === activeId;

        return (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "group relative -mx-2 flex gap-2.5 rounded-md px-2 py-1.5 text-[12.5px] leading-normal transition-colors duration-200",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {/* Marks the active row down its leading edge, so the eye can
                  find the place without reading the list. */}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-1 left-0 w-0.5 rounded-full bg-primary transition-opacity duration-200",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              />
              <span
                className={cn(
                  "font-mono tabular-nums transition-opacity duration-200",
                  isActive
                    ? "text-primary opacity-100"
                    : "opacity-40 group-hover:opacity-100",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              {section.title}
            </a>
          </li>
        );
      })}
    </ol>
  );
}
