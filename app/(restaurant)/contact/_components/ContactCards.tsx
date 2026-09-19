/**
 * The left-hand column: the ways to reach the counter, stacked.
 *
 * A column rather than the grid of tall plates it used to be. The four ways in
 * are short facts — an address, a number, an address again — and a stack reads
 * them in one pass, which leaves the width for the form beside it. The rule
 * between the two is drawn by the page, not here, so this column stays a list
 * of cards and nothing else.
 */

import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { cards, socials } from "../_data";

/** The small mono headings that name each block in the column. */
const LABEL =
  "font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase";

export function ContactCards() {
  return (
    <div className="flex h-full flex-col">
      <p className={LABEL}>Straight to us</p>

      <ul role="list" className="mt-5 space-y-3">
        {cards.map((item) => {
          const external = item.link.startsWith("http");

          return (
            <li key={item.label}>
              <a
                href={item.link}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className={cn(
                  "group flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-card/30 p-5",
                  "transition-[border-color,background-color] duration-300 ease-out",
                  "hover:border-primary/30 hover:bg-card",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                )}
              >
                <span className="min-w-0">
                  <span className={cn("block", LABEL)}>{item.label}</span>
                  <span className="mt-1.5 block text-[14px] leading-[1.6] font-medium wrap-break-word">
                    {item.content}
                  </span>
                </span>

                {/* The whole card is the link, so the mark is decorative and
                    the label it replaces is carried on the card instead. */}
                <span
                  aria-hidden
                  className="grid size-8 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors duration-300 group-hover:border-primary/40 group-hover:text-primary"
                >
                  <ArrowUpRight className="size-4" />
                </span>

                <span className="sr-only">{item.linkLabel}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <p className={cn("mt-10", LABEL)}>Or message us</p>

      <ul role="list" className="mt-4 flex items-center gap-2.5">
        {socials.map(({ Icon, label, href }) => (
          <li key={label}>
            <a
              href={href}
              aria-label={label}
              className="grid size-10 place-items-center rounded-full border border-border bg-card/40 text-muted-foreground transition-colors duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Icon className="size-4.5" />
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-8 max-w-[34ch] text-[13px] leading-[1.7] text-muted-foreground">
        For a table tonight, ring us — the phone is quicker than the post.
      </p>
    </div>
  );
}
