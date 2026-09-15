"use client";

/**
 * One plate on the board.
 *
 * Drawn as the home page's `Plate` is — photograph on top, name and price on
 * one baseline, a line of description underneath — so the menu and the home
 * page read as one set of cards. What the home page does not have is the order
 * controls: the size pad that slides up over the photograph, and the add
 * button on the bottom rail.
 */

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

import {
  ChevronDownIcon,
  PlusIcon,
  ShoppingBagIcon,
} from "@/components/icons/Icons";
import SafeImage from "@/components/ui/SafeImage";
import { useCart } from "@/hooks/useCart";
import { payableOf } from "@/lib/price";
import { cn } from "@/lib/utils";
import foodPlaceholder from "@/public/food/RedChili_DoubleSmashBurger2.png";
import { Price } from "./price";
import { FoodItem, FoodVariant } from "../_type";

/** The board only has room for so many flags before they stop meaning much. */
const MAX_TAGS = 2;

/** The home page's own chip: a frosted lozenge sitting on the photograph. */
const CHIP =
  "rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-foreground backdrop-blur-sm";

export const FoodCard = ({ item }: { item: FoodItem }) => {
  const variants = (item.variants ?? [])
    .filter((variant) => typeof variant.price === "number")
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const priced = variants.length > 1;
  const [open, setOpen] = useState(false);

  const { addItem } = useCart();

  // A plate with exactly one priced size has no choice to offer, so it adds
  // like a single-price plate — but it is still that size that goes on the
  // docket, since the plate itself carries no figure.
  const soleVariant = variants.length === 1 ? variants[0] : null;

  /**
   * Put a plate on the docket at the figure the card is printing — the offer
   * when one is live, the list price otherwise. A plate the kitchen has left
   * unpriced cannot be ordered from here at all; the add control is not drawn.
   */
  const addToCart = (variant?: FoodVariant) => {
    const { payable, struck } = payableOf(
      variant ? variant.price : item.price,
      variant ? variant.offerPrice : item.offerPrice,
    );
    if (payable === null) return;

    addItem({
      foodId: item._id,
      name: item.name,
      slug: item.slug,
      image: item.image?.url ?? null,
      variantLabel: variant?.label ?? null,
      categoryName: item.category?.name ?? null,
      unitPrice: payable,
      listPrice: struck,
    });

    setOpen(false);
    toast.success(
      variant
        ? `${item.name} (${variant.label}) added to cart`
        : `${item.name} added to cart`,
    );
  };

  // Multi-size plates are ordered from the size panel, so they are addable as
  // long as any size is priced at all.
  const addable =
    priced ||
    payableOf(
      soleVariant ? soleVariant.price : item.price,
      soleVariant ? soleVariant.offerPrice : item.offerPrice,
    ).payable !== null;

  const tags = (item.tags ?? []).slice(0, MAX_TAGS);

  return (
    <li
      className={cn(
        "group flex h-full list-none flex-col rounded-2xl border border-border/60 bg-card p-2",
        "transition-[border-color,box-shadow] duration-300 ease-out",
        "hover:border-primary/30 hover:shadow-[0_28px_60px_-40px_rgba(0,0,0,0.5)]",
      )}
    >
      {/* Square: the photographs are landscape, so a taller frame crops the
          plate rather than showing more of it. */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <SafeImage
          src={item.image?.url || foodPlaceholder}
          alt={item.name}
          fill
          fallbackClassName="flex h-full w-full items-center justify-center bg-muted"
          className="ani5 object-cover group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
        />

        {item.rating ? (
          <span
            className={cn(
              CHIP,
              "absolute top-3 left-3 inline-flex items-center gap-1 tabular-nums",
            )}
          >
            <Star className="size-3.5 fill-primary text-primary" />
            {item.rating.toFixed(1)}
          </span>
        ) : null}

        {/* The kitchen's own flags — chef's pick, new, vegetarian. */}
        {tags.length > 0 && (
          <ul
            role="list"
            className="absolute top-3 right-3 flex max-w-[60%] flex-wrap justify-end gap-1"
          >
            {tags.map((tag) => (
              <li key={tag} className={CHIP}>
                {tag}
              </li>
            ))}
          </ul>
        )}

        {priced && (
          <div
            id={`${item.slug}-sizes`}
            className={cn(
              "pointer-events-none absolute inset-x-2 bottom-2 rounded-xl border border-border bg-card/95 px-3 pt-2.5 pb-2 shadow-[0_24px_50px_-28px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-all duration-300 ease-out",
              "group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100",
              open
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "translate-y-2 opacity-0",
            )}
          >
            <p className="mb-1.5 font-mono text-[9.5px] tracking-[0.18em] text-muted-foreground uppercase">
              {variants.length} sizes &middot; tap to add
            </p>

            <ul role="list">
              {variants.map((variant) => (
                <li
                  key={variant.label}
                  className="border-t border-border/60 first:border-t-0"
                >
                  <button
                    type="button"
                    onClick={() => addToCart(variant)}
                    aria-label={`Add ${item.name}, ${variant.label}, to cart`}
                    className="-mx-1.5 flex w-[calc(100%+0.75rem)] cursor-pointer items-baseline gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className="truncate text-[12.5px] font-medium">
                      {variant.label}
                      {typeof variant.calories === "number" && (
                        <span className="ml-1.5 text-[10.5px] font-normal text-muted-foreground">
                          {variant.calories} cal
                        </span>
                      )}
                    </span>
                    <span
                      aria-hidden
                      className="mb-0.5 h-0 flex-1 border-b border-dotted border-border"
                    />
                    <Price
                      price={variant.price}
                      offerPrice={variant.offerPrice}
                      size="sm"
                    />
                    <PlusIcon
                      aria-hidden
                      className="size-3 shrink-0 self-center text-primary"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="min-w-0 truncate text-[17px] leading-tight font-semibold tracking-[-0.02em]">
            {item.name}
          </h3>

          {priced ? (
            <button
              type="button"
              onClick={() => setOpen((wasOpen) => !wasOpen)}
              aria-expanded={open}
              aria-controls={`${item.slug}-sizes`}
              className="-mx-1 -my-0.5 flex shrink-0 cursor-pointer items-baseline gap-1 rounded-md px-1 py-0.5 transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Price
                price={item.price}
                offerPrice={item.offerPrice}
                variants={item.variants}
              />
              <ChevronDownIcon
                className={cn(
                  "size-3.5 self-center text-muted-foreground transition-transform duration-300 group-hover:rotate-180",
                  open && "rotate-180",
                )}
              />
            </button>
          ) : (
            <Price
              price={item.price}
              offerPrice={item.offerPrice}
              variants={item.variants}
            />
          )}
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
              // A plate with sizes cannot be ordered blind — the button opens
              // the pad and the reader picks one there.
              onClick={() =>
                priced ? setOpen(true) : addToCart(soleVariant ?? undefined)
              }
              aria-expanded={priced ? open : undefined}
              aria-controls={priced ? `${item.slug}-sizes` : undefined}
              aria-label={
                priced
                  ? `Choose a size for ${item.name}`
                  : `Add ${item.name} to cart`
              }
              className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 text-[13px] font-medium transition-colors duration-200 hover:border-transparent hover:bg-primary hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ShoppingBagIcon aria-hidden className="size-4" />
              {priced ? "Choose size" : "Add to cart"}
            </button>
          )}
        </div>
      </div>
    </li>
  );
};
