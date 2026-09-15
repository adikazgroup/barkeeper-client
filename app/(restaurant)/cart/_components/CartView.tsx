"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { toast } from "sonner";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  XIcon,
} from "@/components/icons/Icons";
import SafeImage from "@/components/ui/SafeImage";
import { type CartLine } from "@/hooks/useCart";
import { formatMoney } from "@/lib/price";
import { cn } from "@/lib/utils";
import foodPlaceholder from "@/public/food/RedChili_DoubleSmashBurger2.png";

import {
  Reveal,
  staggerChild,
  staggerParent,
} from "../../_components/home/Reveal";
import { useCartOrDemo } from "./demoCart";

/** The board the reader came from, and where an empty cart sends them back. */
const MENU_HREF = "/menu";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

/**
 * The docket, drawn in the page's own frame.
 *
 * The home page's sections are boxes: `max-w-7xl`, a rule down each side, and
 * everything inside divided by more rules rather than floated as separate
 * cards. The docket follows that — the lines and the total are two columns of
 * one box, split by a single rule, so the cart reads as the last section of the
 * site rather than a checkout bolted onto it.
 *
 * Everything here is read out of the browser's stored cart, so the whole panel
 * waits on `hydrated` rather than painting an empty cart the customer then
 * watches fill itself in.
 */
export function CartView() {
  const { items, count, subtotal, hydrated, setQuantity, removeItem, clear } =
    useCartOrDemo();

  if (!hydrated) return <CartSkeleton />;
  if (items.length === 0) return <EmptyCart />;

  const handleCheckout = () => {
    // Nothing takes payment yet. Saying so is better than a button that looks
    // like it worked.
    toast(
      "Online checkout is on the way — ring the counter to place this order.",
      { icon: "🍀" },
    );
  };

  return (
    <section aria-labelledby="cart-lines-heading">
      <div className="mx-auto max-w-7xl">
        <div className="border-x border-border/50">
          <div className="grid lg:grid-cols-[1fr_24rem]">
            {/* The lines */}
            <div className="min-w-0">
              <Reveal
                className={cn(
                  "flex flex-wrap items-baseline justify-between gap-4 border-b border-border/50 py-7",
                  CELL,
                )}
              >
                <h2
                  id="cart-lines-heading"
                  className="text-[24px] leading-[1.1] font-medium tracking-[-0.035em] sm:text-[28px]"
                >
                  {count} {count === 1 ? "plate" : "plates"} on the docket
                </h2>

                <button
                  type="button"
                  onClick={clear}
                  className="cursor-pointer font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase transition-colors duration-200 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Clear docket
                </button>
              </Reveal>

              <motion.ul
                role="list"
                variants={staggerParent}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="divide-y divide-border/50"
              >
                {items.map((line) => (
                  <CartRow
                    key={line.id}
                    line={line}
                    onQuantity={setQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </motion.ul>

              <div className={cn("border-t border-border/50 py-7", CELL)}>
                <Link
                  href={MENU_HREF}
                  className="group inline-flex items-center gap-2 text-[13.5px] font-medium transition-colors duration-200 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <ChevronLeftIcon className="size-3.5 text-primary transition-transform duration-200 group-hover:-translate-x-0.5" />
                  Back to the board
                </Link>
              </div>
            </div>

            {/* The total, kept in view while the lines scroll past it */}
            <aside
              aria-labelledby="cart-summary-heading"
              className="border-t border-border/50 bg-card/20 backdrop-blur-sm lg:border-t-0 lg:border-l"
            >
              <div className={cn("py-7 lg:sticky lg:top-20", CELL)}>
                <h2
                  id="cart-summary-heading"
                  className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase"
                >
                  Order summary
                </h2>

                <dl className="mt-6 space-y-3.5 text-[13.5px]">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="font-mono tabular-nums">
                      {formatMoney(subtotal)}
                    </dd>
                  </div>

                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-muted-foreground">Tax &amp; fees</dt>
                    <dd className="text-[12px] text-muted-foreground">
                      Calculated at checkout
                    </dd>
                  </div>

                  <div className="flex items-baseline justify-between gap-4 border-t border-border/50 pt-4">
                    <dt className="font-medium">Total</dt>
                    <dd className="font-mono text-[22px] tracking-[-0.02em] tabular-nums text-primary">
                      {formatMoney(subtotal)}
                    </dd>
                  </div>
                </dl>

                {/* The hero's pill button, so the one thing left to do looks
                    like every other primary ask on the site. */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="group mt-7 flex h-11 w-full cursor-pointer items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-5 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Send to the kitchen
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
                    <ChevronRightIcon className="size-4" />
                  </span>
                </button>

                <p className="mt-5 flex items-start gap-2 text-[12px] leading-[1.7] text-muted-foreground">
                  <Info
                    aria-hidden
                    className="mt-0.5 size-3.5 shrink-0 text-primary"
                  />
                  Prices are as listed on the board, and what the kitchen has on
                  can change with the day&rsquo;s delivery.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

function CartRow({
  line,
  onQuantity,
  onRemove,
}: {
  line: CartLine;
  onQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  const lineTotal = Math.round(line.unitPrice * line.quantity * 100) / 100;

  return (
    <motion.li variants={staggerChild} className={cn("flex gap-4 py-6", CELL)}>
      {/* Square, framed and padded like the board's cards: the photographs are
          landscape, so a taller frame crops the plate rather than showing more
          of it. */}
      <div className="size-20 shrink-0 rounded-2xl border border-border/60 bg-card p-1.5 sm:size-24">
        <div className="relative size-full overflow-hidden rounded-xl bg-muted">
          <SafeImage
            src={line.image || foodPlaceholder}
            alt={line.name}
            fill
            fallbackClassName="flex h-full w-full items-center justify-center bg-primary/5"
            className="object-cover"
            sizes="96px"
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[16px] leading-tight font-semibold tracking-[-0.02em]">
              {line.name}
            </h3>

            <p className="mt-2 flex items-center gap-2 text-[13px] text-muted-foreground">
              <span className="rounded-full border border-border bg-card/60 px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] whitespace-nowrap uppercase">
                {line.variantLabel ?? line.categoryName ?? "Regular"}
              </span>

              <span className="truncate">
                {line.listPrice != null && (
                  <span className="mr-1.5 tabular-nums line-through opacity-60">
                    {formatMoney(line.listPrice)}
                  </span>
                )}
                <span className="tabular-nums">
                  {formatMoney(line.unitPrice)}
                </span>{" "}
                each
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(line.id)}
            aria-label={`Remove ${line.name} from cart`}
            className="shrink-0 cursor-pointer rounded-full border border-transparent p-1.5 text-muted-foreground transition-colors duration-200 hover:border-border hover:bg-card hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div className="inline-flex items-center rounded-full border border-border bg-card/60 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => onQuantity(line.id, line.quantity - 1)}
              aria-label={
                line.quantity === 1
                  ? `Remove ${line.name} from cart`
                  : `Decrease quantity of ${line.name}`
              }
              className="cursor-pointer rounded-l-full px-2.5 py-1.5 transition-colors duration-200 hover:bg-primary hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <MinusIcon className="size-3.5" />
            </button>

            <span
              aria-live="polite"
              className="min-w-8 text-center font-mono text-[13px] tabular-nums"
            >
              {line.quantity}
            </span>

            <button
              type="button"
              onClick={() => onQuantity(line.id, line.quantity + 1)}
              aria-label={`Increase quantity of ${line.name}`}
              className="cursor-pointer rounded-r-full px-2.5 py-1.5 transition-colors duration-200 hover:bg-primary hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <PlusIcon className="size-3.5" />
            </button>
          </div>

          <span className="font-mono text-[15px] tabular-nums">
            {formatMoney(lineTotal)}
          </span>
        </div>
      </div>
    </motion.li>
  );
}

function EmptyCart() {
  return (
    <section>
      <div className="mx-auto max-w-7xl">
        <div className="border-x border-border/50 px-5 py-20 text-center sm:px-8 sm:py-28">
          <Reveal className="mx-auto max-w-[46ch]">
            <span className="mx-auto grid size-11 place-items-center rounded-full border border-border bg-card text-muted-foreground">
              <ShoppingBagIcon className="size-4.5" />
            </span>

            <h2 className="mx-auto mt-7 max-w-[20ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[30px] leading-[1.05] font-medium tracking-[-0.04em] text-transparent sm:text-[40px]">
              Nothing on the docket yet
            </h2>

            <p className="mt-5 text-[14px] leading-[1.7] text-muted-foreground">
              Pick a counter on the board and add a plate — it will be waiting
              here when you come back.
            </p>

            <Link
              href={MENU_HREF}
              className="group mt-9 inline-flex h-11 items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-5 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Browse the board
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
                <ChevronRightIcon className="size-4" />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * Holds the page's shape for the one frame it takes to read storage back.
 * Traces the box the docket settles into — rails, rule and all — so nothing
 * shifts when the real lines arrive.
 */
function CartSkeleton() {
  return (
    <div aria-hidden className="mx-auto max-w-7xl">
      <div className="border-x border-border/50">
        <div className="grid lg:grid-cols-[1fr_24rem]">
          <div className="min-w-0">
            <div className={cn("border-b border-border/50 py-7", CELL)}>
              <div className="h-8 w-64 max-w-full animate-pulse rounded-lg bg-muted-foreground/10" />
            </div>

            <div className="divide-y divide-border/50">
              {[0, 1, 2].map((row) => (
                <div key={row} className={cn("flex gap-4 py-6", CELL)}>
                  <div className="size-20 shrink-0 animate-pulse rounded-2xl bg-muted-foreground/10 sm:size-24" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 w-1/2 animate-pulse rounded bg-muted-foreground/10" />
                    <div className="h-3 w-1/3 animate-pulse rounded bg-muted-foreground/10" />
                    <div className="h-8 w-28 animate-pulse rounded-full bg-muted-foreground/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border/50 bg-card/20 lg:border-t-0 lg:border-l">
            <div className={cn("space-y-4 py-7", CELL)}>
              <div className="h-3 w-28 animate-pulse rounded bg-muted-foreground/10" />
              <div className="h-4 w-full animate-pulse rounded bg-muted-foreground/10" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted-foreground/10" />
              <div className="h-11 w-full animate-pulse rounded-full bg-primary/15" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
