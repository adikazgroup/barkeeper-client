"use client";

/**
 * The four things a hungry visitor checks before reading anything else: how
 * long, how much to start, when the kitchen is open, and what they can pay
 * with.
 *
 * Deliberately slim. It sits between two heavy visual blocks — the hero's fan
 * and the offers below — and its job is to answer, not to impress. Anything
 * taller here would read as a third billboard and push the offers under the
 * fold.
 */

import type { ComponentType } from "react";
import { Clock, CreditCard, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { SERVICE_FACTS, type FactIcon } from "@/lib/dummyData";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

const FACT_ICONS: Record<FactIcon, ComponentType<{ className?: string }>> = {
  clock: Clock,
  bag: ShoppingBag,
  kitchen: UtensilsCrossed,
  payment: CreditCard,
};

export function ServiceStrip() {
  return (
    <section className="border-t border-border/50">
      <div className="mx-auto max-w-7xl">
        <div className="border-x border-border/50 bg-card/20">
          <Reveal
            as="ul"
            y={12}
            // The dividers are drawn per item rather than with `divide-x`: at
            // two columns the rule belongs between the pair, and `divide-x`
            // would also draw one down the left of every second row.
            className="grid grid-cols-2 px-5 sm:px-8 lg:grid-cols-4"
          >
            {SERVICE_FACTS.map((fact, index) => {
              const Icon = FACT_ICONS[fact.icon];

              return (
                <li
                  key={fact.id}
                  className={cn(
                    "flex items-center gap-3 py-5",
                    index % 2 === 1 && "border-l border-border/50 pl-5",
                    "lg:border-l lg:border-border/50 lg:pl-6 lg:first:border-l-0 lg:first:pl-0",
                  )}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-background text-muted-foreground">
                    <Icon className="size-4" />
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate text-[13.5px] font-semibold text-foreground">
                      {fact.value}
                    </span>
                    <span className="block truncate text-[12px] text-muted-foreground">
                      {fact.label}
                    </span>
                  </span>
                </li>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
