"use client";

/**
 * The grid the plates are laid out on.
 *
 * Client-side only because the cards stagger in; the fetch that decides what
 * is on it happens on the server, in `PopularDishes`.
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";

import type { FoodItem } from "@/app/(restaurant)/menu/_type";
import { Price } from "@/app/(restaurant)/menu/_components/price";
import { ShoppingBagIcon } from "@/components/icons/Icons";
import SafeImage from "@/components/ui/SafeImage";
import { useCart } from "@/hooks/useCart";
import { payableOf } from "@/lib/price";
import { cn } from "@/lib/utils";

import { staggerChild, staggerParent } from "./Reveal";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

/** The add control, shared by the button and the link it becomes. */
const ADD_BUTTON = cn(
  "absolute right-3 bottom-3 z-10 grid size-10 place-items-center rounded-full",
  "border border-border/60 bg-background/90 text-foreground shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-sm",
  "transition-[background-color,color,border-color,transform] duration-200 ease-out",
  "hover:border-transparent hover:bg-primary hover:text-background active:scale-95",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
  "disabled:cursor-not-allowed disabled:opacity-60",
);

function Plate({ food }: { food: FoodItem }) {
  // The board opens at the counter named on the query string, so a plate with
  // no category still links somewhere useful rather than to a counter that
  // resolves nowhere.
  const href = food.category?.slug
    ? `/menu?category=${food.category.slug}`
    : "/menu";

  const badge = food.tags?.[0];

  const { addItem, pending } = useCart();

  const variants = (food.variants ?? []).filter(
    (variant) => typeof variant.price === "number",
  );

  // A plate with exactly one priced size has no choice to offer, so it adds
  // like a single-price plate — but it is still that size that goes on the
  // docket, since the plate itself carries no figure.
  const soleVariant = variants.length === 1 ? variants[0] : null;

  // More than one size cannot be ordered blind. The home page has no size pad
  // — that lives on the menu — so the control sends them there to pick.
  const needsChoice = variants.length > 1;

  const addable =
    needsChoice ||
    payableOf(
      soleVariant ? soleVariant.price : food.price,
      soleVariant ? soleVariant.offerPrice : food.offerPrice,
    ).payable !== null;

  /**
   * Put a plate on the docket.
   *
   * Only the dish and its tier travel: the kitchen prices the line, so nothing
   * here sends a figure it read off the card. It can also refuse — a tier sold
   * out, a dish outside its serving window — and when it does, its own words
   * are what the customer sees.
   */
  const addToCart = async () => {
    const label = soleVariant
      ? `${food.name} (${soleVariant.label})`
      : food.name;

    const { ok, message } = await addItem({
      foodId: food._id,
      variantLabel: soleVariant?.label ?? null,
      quantity: 1,
    });

    if (ok) toast.success(`${label} added to cart`);
    else toast.error(message);
  };

  return (
    <motion.li
      variants={staggerChild}
      className={cn(
        // `relative` is what the title's stretched link spans, and what the
        // add control is positioned against.
        "group relative flex h-full flex-col rounded-2xl border border-border/60 bg-card/40 p-2",
        "transition-[border-color,box-shadow] duration-300 ease-out",
        "hover:border-primary/30 hover:shadow-[0_28px_60px_-40px_rgba(0,0,0,0.5)]",
        "focus-within:border-primary/30",
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

        {/* Sits above the title's stretched link, so the card still opens the
            menu everywhere except on this one control. */}
        {addable &&
          (needsChoice ? (
            <Link
              href={href}
              aria-label={`Choose a size for ${food.name}`}
              className={ADD_BUTTON}
            >
              <ShoppingBagIcon aria-hidden className="size-4.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={addToCart}
              disabled={pending}
              aria-label={`Add ${food.name} to cart`}
              className={cn(ADD_BUTTON, "cursor-pointer")}
            >
              <ShoppingBagIcon aria-hidden className="size-4.5" />
            </button>
          ))}
      </div>

      <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-[17px] leading-tight font-semibold tracking-[-0.02em]">
            {/* Stretched rather than wrapping the card: an <a> may not contain
                a <button>, and the whole plate should still be one click. */}
            <Link
              href={href}
              className="rounded-sm after:absolute after:inset-0 after:content-[''] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {food.name}
            </Link>
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
