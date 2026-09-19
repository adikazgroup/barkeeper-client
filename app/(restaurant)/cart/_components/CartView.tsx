"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Info, Loader2, TriangleAlert } from "lucide-react";
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
import { useCart, type CartItem, type CartResult } from "@/hooks/useCart";
import { useCoupon } from "@/hooks/useCoupon";
import { AUTH_ROUTES } from "@/lib/auth/constants";
import { formatMoney } from "@/lib/price";
import { cn } from "@/lib/utils";
import foodPlaceholder from "@/public/food/RedChili_DoubleSmashBurger2.png";

import {
  Reveal,
  staggerChild,
  staggerParent,
} from "../../_components/home/Reveal";
import { CouponField } from "./CouponField";

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
 * Everything here is the kitchen's own priced docket, read back over the cart
 * API, so the whole panel waits on `hydrated` rather than painting an empty
 * cart the customer then watches fill itself in. No figure on this page is
 * worked out here: the line totals, the subtotal and whether the docket can be
 * sent are all the backend's, because it is the side that knows what a plate
 * costs once its options are on it.
 */
export function CartView() {
  const router = useRouter();

  const {
    items,
    count,
    subtotal,
    issues,
    isOrderable,
    hydrated,
    pending,
    signedOut,
    setQuantity,
    removeItem,
    clear,
  } = useCart();

  // The code is quoted against the docket by the kitchen, never worked out
  // here, and it is re-quoted whenever a line changes — so this figure always
  // belongs to the subtotal printed beside it.
  const { applied, discount } = useCoupon();
  const total = Math.max(0, subtotal - discount);

  // Which control is working, so the one that was pressed spins rather than
  // the whole docket going quiet. `pending` from the store says *a* mutation
  // is in flight, which is what keeps the others disabled; this says which.
  const [busy, setBusy] = useState<string | null>(null);

  if (!hydrated) return <CartSkeleton />;
  // The docket belongs to an account, so there is nothing to show a visitor
  // who has not signed in — and nothing they could send if there were.
  if (signedOut) return <SignedOutCart />;
  if (items.length === 0) return <EmptyCart />;

  /**
   * Every change to the docket goes through here.
   *
   * The cart API answers each mutation with the kitchen's own verdict, and
   * that answer used to be dropped on the floor — a refused change looked
   * exactly like one that worked. The toast is keyed on the control, so a
   * reader leaning on the plus button replaces one message rather than
   * stacking six.
   */
  const run = async (
    key: string,
    action: () => CartResult,
    success: string,
  ) => {
    setBusy(key);

    try {
      const { ok, message } = await action();
      if (ok) toast.success(success, { id: key });
      else toast.error(message, { id: key });
    } finally {
      setBusy(null);
    }
  };

  const handleQuantity = (line: CartItem, quantity: number) => {
    void run(
      `qty:${line._id}`,
      () => setQuantity(line._id, quantity),
      // Stepping the last one off a line is how a line is removed, so the
      // message has to say what actually happened.
      quantity < 1
        ? `${line.name} removed from the docket`
        : `${line.name} — ${quantity} on the docket`,
    );
  };

  const handleRemove = (line: CartItem) => {
    void run(
      `remove:${line._id}`,
      () => removeItem(line._id),
      `${line.name} removed from the docket`,
    );
  };

  const handleClear = () => {
    void run("clear", clear, "Docket cleared");
  };

  const handleCheckout = () => {
    // A dish can sell out after it was added, so the backend's own verdict is
    // what decides whether this goes anywhere.
    if (!isOrderable) {
      toast.error(
        issues[0]?.message ??
          "Something on the docket is unavailable. Check the lines above.",
      );
      return;
    }

    // Checkout prices the docket properly — tax, tip and the pickup time are
    // all decided there, which is why this page stops at the subtotal.
    router.push("/checkout");
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
                  onClick={handleClear}
                  disabled={pending}
                  aria-busy={busy === "clear"}
                  className="inline-flex cursor-pointer items-center gap-2 font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase transition-colors duration-200 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy === "clear" && (
                    <Loader2 aria-hidden className="size-3 animate-spin" />
                  )}
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
                    key={line._id}
                    line={line}
                    pending={pending}
                    busy={busy}
                    onQuantity={handleQuantity}
                    onRemove={handleRemove}
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

                  {applied && discount > 0 && (
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="min-w-0 truncate text-muted-foreground">
                        Discount
                        <span className="ml-1.5 font-mono text-[11px] tracking-widest text-primary uppercase">
                          {applied.code}
                        </span>
                      </dt>
                      <dd className="font-mono tabular-nums text-primary">
                        &minus;{formatMoney(discount)}
                      </dd>
                    </div>
                  )}

                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-muted-foreground">Tax &amp; fees</dt>
                    <dd className="text-[12px] text-muted-foreground">
                      Calculated at checkout
                    </dd>
                  </div>

                  <div className="flex items-baseline justify-between gap-4 border-t border-border/50 pt-4">
                    <dt className="font-medium">Total</dt>
                    <dd className="font-mono text-[22px] tracking-[-0.02em] tabular-nums text-primary">
                      {formatMoney(total)}
                    </dd>
                  </div>
                </dl>

                <CouponField />

                {/* Whatever is blocking the whole docket, in the backend's own
                    words — it is the only side that knows which of a dozen
                    reasons it was. */}
                {issues.length > 0 && (
                  <ul
                    role="list"
                    className="mt-6 space-y-2 rounded-xl border border-danger/30 bg-danger/5 px-3.5 py-3"
                  >
                    {issues.map((issue) => (
                      <li
                        key={`${issue.code}-${issue.message}`}
                        className="flex items-start gap-2 text-[12.5px] leading-[1.6] text-foreground"
                      >
                        <TriangleAlert
                          aria-hidden
                          className="mt-0.5 size-3.5 shrink-0 text-danger"
                        />
                        {issue.message}
                      </li>
                    ))}
                  </ul>
                )}

                {/* The hero's pill button, so the one thing left to do looks
                    like every other primary ask on the site. */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={pending || !isOrderable}
                  className="group mt-7 flex h-11 w-full cursor-pointer items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-5 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
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
  pending,
  busy,
  onQuantity,
  onRemove,
}: {
  line: CartItem;
  pending: boolean;
  /** Which control on the page is working, if any. */
  busy: string | null;
  onQuantity: (line: CartItem, quantity: number) => void;
  onRemove: (line: CartItem) => void;
}) {
  const stepping = busy === `qty:${line._id}`;
  const removing = busy === `remove:${line._id}`;

  // The kitchen prices the line, options and all, so the figure is read off
  // the docket rather than multiplied here.
  const blocked = line.isOrderable === false;

  return (
    <motion.li
      variants={staggerChild}
      className={cn("flex gap-4 py-6", CELL, blocked && "bg-danger/4")}
    >
      {/* Square, framed and padded like the board's cards: the photographs are
          landscape, so a taller frame crops the plate rather than showing more
          of it. */}
      <div className="size-20 shrink-0 rounded-2xl border border-border/60 bg-card p-1.5 sm:size-24">
        <div className="relative size-full overflow-hidden rounded-xl bg-muted">
          <SafeImage
            src={line.image?.url || foodPlaceholder}
            alt={line.image?.alt || line.name}
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
                {line.variantLabel ?? "Regular"}
              </span>

              <span className="truncate">
                <span className="tabular-nums">
                  {formatMoney(line.unitPrice)}
                </span>{" "}
                each
              </span>
            </p>

            {/* How this one was built. Two lines of the same dish differ only
                here, so it is what tells them apart on the docket. */}
            {line.modifiers && line.modifiers.length > 0 && (
              <ul
                role="list"
                className="mt-2 space-y-0.5 text-[12px] leading-[1.6] text-muted-foreground"
              >
                {line.modifiers.map((modifier) => (
                  <li
                    key={`${modifier.groupId}-${modifier.optionName}`}
                    className="truncate"
                  >
                    {modifier.quantity > 1 && `${modifier.quantity}× `}
                    {modifier.optionName}
                    {modifier.lineTotal > 0 && (
                      <span className="ml-1 tabular-nums">
                        +{formatMoney(modifier.lineTotal)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {line.specialInstructions && (
              <p className="mt-2 text-[12px] leading-[1.6] text-muted-foreground italic">
                &ldquo;{line.specialInstructions}&rdquo;
              </p>
            )}

            {/* Why this line cannot be sent — sold out, off the window. The
                backend's words, because it is the side that knows. */}
            {line.issues?.map((issue) => (
              <p
                key={`${issue.code}-${issue.message}`}
                className="mt-2 flex items-start gap-1.5 text-[12px] leading-[1.6] text-danger"
              >
                <TriangleAlert
                  aria-hidden
                  className="mt-0.5 size-3.5 shrink-0"
                />
                {issue.message}
              </p>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onRemove(line)}
            disabled={pending}
            aria-busy={removing}
            aria-label={`Remove ${line.name} from cart`}
            className="shrink-0 cursor-pointer rounded-full border border-transparent p-1.5 text-muted-foreground transition-colors duration-200 hover:border-border hover:bg-card hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {removing ? (
              <Loader2 aria-hidden className="size-4 animate-spin" />
            ) : (
              <XIcon className="size-4" />
            )}
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div className="inline-flex items-center rounded-full border border-border bg-card/60 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => onQuantity(line, line.quantity - 1)}
              disabled={pending}
              aria-label={
                line.quantity === 1
                  ? `Remove ${line.name} from cart`
                  : `Decrease quantity of ${line.name}`
              }
              className="cursor-pointer rounded-l-full px-2.5 py-1.5 transition-colors duration-200 hover:bg-primary hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MinusIcon className="size-3.5" />
            </button>

            <span
              aria-live="polite"
              aria-busy={stepping}
              className="grid min-w-8 place-items-center text-center font-mono text-[13px] tabular-nums"
            >
              {stepping ? (
                <Loader2 aria-hidden className="size-3.5 animate-spin" />
              ) : (
                line.quantity
              )}
            </span>

            <button
              type="button"
              onClick={() => onQuantity(line, line.quantity + 1)}
              disabled={pending}
              aria-label={`Increase quantity of ${line.name}`}
              className="cursor-pointer rounded-r-full px-2.5 py-1.5 transition-colors duration-200 hover:bg-primary hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PlusIcon className="size-3.5" />
            </button>
          </div>

          <span className="font-mono text-[15px] tabular-nums">
            {formatMoney(line.lineTotal)}
          </span>
        </div>
      </div>
    </motion.li>
  );
}

/**
 * The docket is kept by the kitchen, against an account — that is what lets it
 * be priced live and survive a change of device. So a signed-out visitor is
 * not shown an empty cart, which would suggest theirs had been lost; they are
 * shown the one thing that gets them one.
 */
function SignedOutCart() {
  return (
    <section>
      <div className="mx-auto max-w-7xl">
        <div className="border-x border-border/50 px-5 py-20 text-center sm:px-8 sm:py-28">
          <Reveal className="mx-auto max-w-[46ch]">
            <span className="mx-auto grid size-11 place-items-center rounded-full border border-border bg-card text-muted-foreground">
              <ShoppingBagIcon className="size-4.5" />
            </span>

            <h2 className="mx-auto mt-7 max-w-[20ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[30px] leading-[1.05] font-medium tracking-[-0.04em] text-transparent sm:text-[40px]">
              Sign in to start an order
            </h2>

            <p className="mt-5 text-[14px] leading-[1.7] text-muted-foreground">
              The kitchen keeps your docket, so it is priced as you build it and
              it is still there on your phone at the table.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href={AUTH_ROUTES.login}
                className="group inline-flex h-11 w-full items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-5 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
              >
                Sign in
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
                  <ChevronRightIcon className="size-4" />
                </span>
              </Link>

              <Link
                href={MENU_HREF}
                className="inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-card/60 px-5 text-[14px] font-medium transition-colors duration-200 hover:bg-foreground hover:text-background sm:w-auto"
              >
                Browse the board
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
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
