"use client";

/**
 * One plate on the board.
 *
 * Drawn as the home page's `Plate` is — photograph on top, name and price on
 * one baseline, a line of description underneath — so the menu and the home
 * page read as one set of cards.
 *
 * Ordering is one of exactly two things, so a customer never has to learn a
 * third: a plain dish says "Add to cart" and goes straight on; a dish with
 * anything to decide — a size, an option group — says "Choose options" and
 * opens the builder, where every choice (sizes included) is made.
 */

import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { ShoppingBagIcon } from "@/components/icons/Icons";
import SafeImage from "@/components/ui/SafeImage";
import { WishlistButton } from "@/components/food/WishlistButton";
import { useFoodOrder } from "@/components/food/useFoodOrder";
import { staggerChild } from "@/app/(restaurant)/_components/home/Reveal";
import { pricedVariants } from "@/lib/cart/rules";
import { payableOf } from "@/lib/price";
import { cn } from "@/lib/utils";
import { Price } from "./price";
import { FoodItem } from "../_type";

/** The board only has room for so many flags before they stop meaning much. */
const MAX_TAGS = 2;

/** The home page's own chip: a frosted lozenge sitting on the photograph. */
const CHIP =
  "rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-foreground backdrop-blur-sm";

export const FoodCard = ({ item }: { item: FoodItem }) => {
  const variants = pricedVariants(item);

  // True for a dish with several sizes or any option group: the button then
  // opens the builder instead of adding at once.
  const { order, opensBuilder, pending, inCart, builder } = useFoodOrder(item);

  const soleVariant = variants.length === 1 ? variants[0] : null;

  const addable =
    variants.length > 1 ||
    payableOf(
      soleVariant ? soleVariant.price : item.price,
      soleVariant ? soleVariant.offerPrice : item.offerPrice,
    ).payable !== null;

  const tags = (item.tags ?? []).slice(0, MAX_TAGS);

  return (
    // The variants are inert on their own — they only play when a parent
    // orchestrates them, which the board does each time the counter changes.
    <motion.li
      variants={staggerChild}
      className={cn(
        "group flex h-full list-none flex-col rounded-2xl border border-border/60 bg-card/30 p-2",
        "transition-[border-color,box-shadow] duration-300 ease-out",
        "hover:border-primary/30 hover:shadow-[0_28px_60px_-40px_rgba(0,0,0,0.5)]",
      )}
    >
      {/* Square: the photographs are landscape, so a taller frame crops the
          plate rather than showing more of it. */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <SafeImage
          src={item.image?.url}
          alt={item.name}
          fill
          fallbackClassName="flex h-full w-full items-center justify-center bg-muted text-muted-foreground"
          className="ani5 object-cover group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
        />

        {/* The rating, then the kitchen's own flags — chef's pick, new,
            vegetarian — down the left; the heart has the right corner. */}
        {(item.rating || tags.length > 0) && (
          <ul
            role="list"
            className="absolute top-3 left-3 flex max-w-[70%] flex-wrap gap-1"
          >
            {item.rating ? (
              <li
                className={cn(
                  CHIP,
                  "inline-flex items-center gap-1 tabular-nums",
                )}
              >
                <Star className="size-3.5 fill-primary text-primary" />
                {item.rating.toFixed(1)}
              </li>
            ) : null}
            {tags.map((tag) => (
              <li key={tag} className={CHIP}>
                {tag}
              </li>
            ))}
          </ul>
        )}

        <WishlistButton
          foodId={item._id}
          foodName={item.name}
          className="absolute top-3 right-3"
        />
      </div>

      <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="min-w-0 truncate text-[17px] leading-tight font-semibold tracking-[-0.02em]">
            {item.name}
          </h3>

          <Price
            price={item.price}
            offerPrice={item.offerPrice}
            variants={item.variants}
          />
        </div>

        <p className="mt-2 line-clamp-2 min-h-11 text-[13px] leading-[1.7] text-muted-foreground">
          {item.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="min-w-0 truncate font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
            {item.category?.name}
            {typeof item.calories === "number" && (
              <>
                <span aria-hidden className="mx-1.5">
                  &middot;
                </span>
                {item.calories} cal
              </>
            )}
          </span>

          {addable && (
            <button
              type="button"
              // Anything to decide opens the builder; a plain dish (or one
              // with a single size) goes straight on the docket.
              onClick={() => order()}
              disabled={pending}
              aria-haspopup={opensBuilder ? "dialog" : undefined}
              aria-label={`${
                opensBuilder
                  ? `Choose options for ${item.name}`
                  : `Add ${item.name} to cart`
              }${inCart > 0 ? `, ${inCart} already in your cart` : ""}`}
              className={cn(
                "relative inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border bg-card px-4 text-[13px] font-medium transition-colors duration-200 hover:border-transparent hover:bg-primary hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60",
                inCart > 0 ? "border-primary/60" : "border-border",
              )}
            >
              <ShoppingBagIcon aria-hidden className="size-4" />
              {opensBuilder ? "Choose options" : "Add to cart"}

              {/* Already on the docket — how many, so the card says so. */}
              {inCart > 0 && (
                <span
                  aria-hidden
                  className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-background ring-2 ring-background tabular-nums"
                >
                  {inCart > 99 ? "99+" : inCart}
                </span>
              )}
            </button>
          )}
          {builder}
        </div>
      </div>
    </motion.li>
  );
};
