/**
 * The four ways to reach the counter, as cards.
 *
 * Same plate as the home page's dishes — `rounded-2xl`, `border-border/60`,
 * `bg-card`, the hover lift on the border — so a visitor who came from the
 * home page recognises them as the same kind of object.
 */

import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@/components/icons/Icons";
import { cards } from "../_data";

export function ContactCards() {
  return (
    <ul role="list" className="grid h-full gap-4 sm:grid-cols-2 sm:gap-5">
      {cards.map((item) => {
        const Icon = item.icon;
        const external = item.link.startsWith("http");

        return (
          <li
            key={item.label}
            className={cn(
              "group flex flex-col rounded-lg border border-border/60 bg-card p-6",
              "transition-[border-color,box-shadow] duration-300 ease-out",
              "hover:border-primary/30 hover:shadow-[0_28px_60px_-40px_rgba(0,0,0,0.5)]",
            )}
          >

            <span className=" block font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
              {item.label}
            </span>

            <p className="mt-2 flex-1 text-[14px] leading-[1.6] font-medium wrap-break-word">
              {item.content}
            </p>

            <span className="grid size-10 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-colors duration-300 group-hover:border-primary/40 group-hover:text-primary">
              <Icon aria-hidden className="size-4.5" />
            </span>


            <a
              href={item.link}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="mt-6 inline-flex items-center justify-between gap-3 border-t border-border/50 pt-5 text-[13px] font-medium transition-colors duration-200 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {item.linkLabel}
              <span className="grid size-7 shrink-0 place-items-center rounded-full border border-border transition-transform duration-200 group-hover:translate-x-0.5">
                <ArrowRightIcon className="size-3.5" />
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
