"use client";

/**
 * The question list, shared by the home page, the pricing page and /faq.
 *
 * One answer is open at a time. Six or eight expanded answers make a section
 * nobody can scan, and the closed rows are the index.
 *
 * Each list keeps its own open row, so opening a billing question does not
 * quietly close one somewhere else on the page.
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/lib/dummyData";
import { EASE } from "./home/Reveal";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

function Row({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "border-b border-border/50 transition-colors duration-300 last:border-b-0",
        isOpen && "bg-card/40",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          "group flex w-full items-center justify-between gap-6 py-5 text-left",
          CELL,
        )}
      >
        <span
          className={cn(
            "text-[14.5px] font-medium transition-colors duration-200",
            isOpen ? "text-foreground" : "group-hover:text-foreground",
          )}
        >
          {item.question}
        </span>

        <span
          aria-hidden
          className={cn(
            "relative grid size-7 shrink-0 place-items-center rounded-full border transition-colors duration-300",
            isOpen
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-border text-muted-foreground group-hover:border-primary/30 group-hover:text-foreground",
          )}
        >
          <span className="absolute h-px w-3 bg-current" />
          <span
            className={cn(
              "absolute h-px w-3 bg-current transition-transform duration-300",
              isOpen ? "rotate-0" : "rotate-90",
            )}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <p
              className={cn(
                "max-w-[68ch] pb-6 text-[13.5px] leading-[1.75] text-muted-foreground",
                CELL,
              )}
            >
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqAccordion({
  items,
  /** Which row starts open. `null` opens none. */
  defaultOpen = 0,
}: {
  items: FaqItem[];
  defaultOpen?: number | null;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  return (
    <div>
      {items.map((item, index) => (
        <Row
          key={item.question}
          item={item}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}
