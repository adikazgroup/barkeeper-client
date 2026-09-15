"use client";

import { motion } from "framer-motion";
import type { ComponentType } from "react";
import {
  CatalogueIcon,
  OrderReceiptIcon,
  StockIcon,
  ThreadsIcon,
} from "@/components/icons/Icons";
import { staggerChild, staggerParent } from "./Reveal";

interface Card {
  tag: string;
  lead: string;
  tail: string;
  body: string;
  Art: ComponentType<{ className?: string }>;
}

const CARDS: Card[] = [
  {
    tag: "Every channel",
    lead: "One inbox,",
    tail: "every channel",
    body: "Instagram, Messenger, WhatsApp and TikTok, in one thread per customer.",
    Art: ThreadsIcon,
  },
  {
    tag: "Catalogue",
    lead: "Trained on",
    tail: "your prices",
    body: "Quotes only the stock you gave it, in the customer’s own language.",
    Art: CatalogueIcon,
  },
  {
    tag: "Checkout",
    lead: "Chat becomes",
    tail: "an order",
    body: "Size, address and payment are settled in the thread, then written into your store.",
    Art: OrderReceiptIcon,
  },
  {
    tag: "Live sync",
    lead: "Stock stays",
    tail: "honest",
    body: "Variants stop being offered the moment the last one sells, so refunds stop.",
    Art: StockIcon,
  },
];

export function HeroCards() {
  return (
    <section className="relative z-10  px-2 mt-12 sm:px-3 ">
      <motion.ul
        variants={staggerParent}
        initial="hidden"
        animate="visible"
        className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {CARDS.map(({ tag, lead, tail, body, Art }, index) => (
          <motion.li
            key={lead}
            variants={staggerChild}
            className="group flex flex-col rounded-2xl border border-border/70 bg-card p-5 transition-colors duration-300 hover:border-border"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="flex items-baseline gap-1.5">
                <span className="text-[15px] font-semibold tracking-[-0.03em]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Feature
                </span>
              </p>

              <span className="rounded-full border border-border px-2.5 py-1 text-[10.5px] whitespace-nowrap text-muted-foreground">
                {tag}
              </span>
            </div>

            <div className="flex justify-center py-14">
              <span className="flex h-24 w-20 items-center justify-center rounded-[26px] border border-border/50 bg-secondary/5 text-foreground/70 transition-colors duration-300 group-hover:bg-primary group-hover:text-white dark:border-border">
                <Art className="size-11" />
              </span>
            </div>

            <h3 className="text-[17px] leading-tight font-medium tracking-[-0.03em]">
              {lead} <span className="text-muted-foreground">{tail}</span>
            </h3>

            <p className="mt-2.5 text-[12.5px] text-muted-foreground">{body}</p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
