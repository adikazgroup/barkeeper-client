"use client";

/**
 * Six plates, photographed.
 *
 * The board above says what the kitchen has headings for; this says what it
 * actually cooks. The photograph is the whole argument, so it takes the top of
 * the card and the words underneath stay to one line of description and a
 * price — a visitor deciding whether to order is choosing between pictures,
 * not reading paragraphs.
 */

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { POPULAR_DISHES, type Dish } from "@/lib/dummyData";
import { cn } from "@/lib/utils";

import { Reveal, staggerChild, staggerParent } from "./Reveal";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

function Plate({ dish }: { dish: Dish }) {
  return (
    <motion.li variants={staggerChild}>
      <Link
        href={`/menu#${dish.category}`}
        className={cn(
          "group flex h-full flex-col rounded-2xl border border-border/60 bg-card p-2",
          "transition-[border-color,box-shadow] duration-300 ease-out",
          "hover:border-primary/30 hover:shadow-[0_28px_60px_-40px_rgba(0,0,0,0.5)]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        )}
      >
        {/* Square: the photographs are landscape, so a taller frame crops the
            plate rather than showing more of it. */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            className="ani5 object-cover group-hover:scale-[1.04]"
          />

          {dish.tag && (
            <span className="absolute top-3 left-3 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-foreground backdrop-blur-sm">
              {dish.tag}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-[17px] leading-tight font-semibold tracking-[-0.02em]">
              {dish.name}
            </h3>
            <span className="font-mono text-[14px] whitespace-nowrap tabular-nums">
              {dish.price}
            </span>
          </div>

          <p className="mt-2 text-[13px] leading-[1.7] text-muted-foreground">
            {dish.blurb}
          </p>
        </div>
      </Link>
    </motion.li>
  );
}

export function PopularDishes() {
  return (
    <section id="popular" className="border-t border-border/50">
      <div className="mx-auto max-w-7xl">
        <div className="border-x border-border/50">
          <Reveal
            className={cn(
              "flex flex-wrap items-center justify-between gap-5 border-b border-border/50 py-10",
              CELL,
            )}
          >
            <h2 className="max-w-[18ch] text-[30px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[40px]">
              What leaves the pass most
            </h2>
            <p className="max-w-[44ch] text-[14px] leading-[1.65] text-muted-foreground">
              Six plates that carry the place. Everything is cooked when you
              order it, so nothing here has been sitting under a lamp.
            </p>
          </Reveal>

          <motion.ul
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className={cn(
              "grid gap-4 py-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3",
              CELL,
            )}
          >
            {POPULAR_DISHES.map((dish) => (
              <Plate key={dish.id} dish={dish} />
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
