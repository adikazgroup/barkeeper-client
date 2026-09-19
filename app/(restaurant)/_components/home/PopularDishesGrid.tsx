"use client";

/**
 * The grid the plates are laid out on.
 *
 * Client-side only because the cards stagger in; the fetch that decides what
 * is on it happens on the server, in `PopularDishes`.
 */

import Link from "next/link";
import { motion } from "framer-motion";

import type { FoodItem } from "@/app/(restaurant)/menu/_type";
import { Price } from "@/app/(restaurant)/menu/_components/price";
import SafeImage from "@/components/ui/SafeImage";
import { cn } from "@/lib/utils";

import { staggerChild, staggerParent } from "./Reveal";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

function Plate({ food }: { food: FoodItem }) {
  // The board anchors on category slugs, so a plate with no category still
  // links somewhere useful rather than to a fragment that resolves nowhere.
  const href = food.category?.slug ? `/menu#${food.category.slug}` : "/menu";

  const badge = food.tags?.[0];

  return (
    <motion.li variants={staggerChild}>
      <Link
        href={href}
        className={cn(
          "group flex h-full flex-col rounded-2xl border border-border/60 bg-card/40 p-2",
          "transition-[border-color,box-shadow] duration-300 ease-out",
          "hover:border-primary/30 hover:shadow-[0_28px_60px_-40px_rgba(0,0,0,0.5)]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        )}
      >

        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          <SafeImage
            src={food.image?.url}
            alt={food.image?.alt || food.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            fallbackClassName="flex h-full w-full items-center justify-center text-muted-foreground"
            className="ani5 object-cover group-hover:scale-[1.04]"
          />

          {badge && (
            <span className="absolute top-3 left-3 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-foreground capitalize backdrop-blur-sm">
              {badge}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-[17px] leading-tight font-semibold tracking-[-0.02em]">
              {food.name}
            </h3>

            {/* One price component for the whole site, so a variant plate
                prints "from $10" here exactly as it does on the menu. */}
            <Price
              price={food.price}
              offerPrice={food.offerPrice}
              variants={food.variants}
            />
          </div>

          <p className="mt-2 line-clamp-3 text-[13px] leading-[1.7] text-muted-foreground">
            {food.description}
          </p>
        </div>
      </Link>
    </motion.li>
  );
}

export function PopularDishesGrid({ foods }: { foods: FoodItem[] }) {
  return (
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
      {foods.map((food) => (
        <Plate key={food._id} food={food} />
      ))}
    </motion.ul>
  );
}
