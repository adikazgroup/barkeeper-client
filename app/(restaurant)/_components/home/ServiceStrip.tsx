"use client";



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
        <div className="border-x border-border/50 ">
          <Reveal
            as="ul"
            y={12}
            className="grid grid-cols-2 lg:grid-cols-4 lg:px-8"
          >
            {SERVICE_FACTS.map((fact, index) => {
              const Icon = FACT_ICONS[fact.icon];

              return (
                <li
                  key={fact.id}
                  className={cn(
                    "flex min-w-0 items-center gap-3 py-5",
                    index % 2 === 0
                      ? "px-5 sm:px-8"
                      : "border-l border-border/50 pr-5 pl-5 sm:pr-8",
                    index >= 2 && "border-t border-border/50 lg:border-t-0",
                    "lg:border-l lg:border-border/50 lg:pr-0 lg:pl-6 lg:first:border-l-0 lg:first:pl-0",
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
