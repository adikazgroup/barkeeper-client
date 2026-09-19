"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import { ChevronDownIcon } from "@/components/icons/Icons";
import SafeImage from "@/components/ui/SafeImage";
import { formatDateTime } from "@/lib/orders/format";
import { formatMoney } from "@/lib/price";
import { fetchPendingReviews } from "@/lib/reviews/client";
import type { PendingReviewOrder } from "@/lib/reviews/types";
import { cn } from "@/lib/utils";

import { OrderReview } from "./OrderReview";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

/**
 * "Rate your order."
 *
 * The backend keeps the list of collected orders nobody has reviewed yet, so
 * this asks for exactly that rather than reading every order and every review
 * and working out the gap between them.
 *
 * It draws nothing at all when there is nothing to ask about — an empty
 * prompt telling a customer they have no orders to rate is a row of the page
 * spent saying nothing. And an order leaves the list the moment it is rated,
 * so the prompt shortens as it is worked through.
 */
export function PendingReviewsPrompt() {
  const [orders, setOrders] = useState<PendingReviewOrder[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const answer = await fetchPendingReviews();
      if (cancelled) return;

      // A prompt is an extra: if it cannot be read, the orders below it are
      // still the page, so this says nothing rather than raising an error.
      if (answer.ok && answer.data) setOrders(answer.data);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (orders.length === 0) return null;

  return (
    <section
      aria-labelledby="rate-orders-heading"
      className="border-b border-border/50 bg-card/20"
    >
      <div className={cn("py-7", CELL)}>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2
            id="rate-orders-heading"
            className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.02em]"
          >
            <Star aria-hidden className="size-4 fill-primary text-primary" />
            Rate your order
          </h2>

          <p className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
            {orders.length} waiting
          </p>
        </div>

        <p className="mt-2 max-w-[56ch] text-[13px] leading-[1.7] text-muted-foreground">
          The kitchen reads every one of these, and it is how the board learns
          which plates are worth keeping on.
        </p>

        <ul role="list" className="mt-5 space-y-3">
          {orders.map((order) => {
            const open = openId === order._id;

            return (
              <li
                key={order._id}
                className="rounded-lg border border-border/60 bg-card/40 px-4 py-3.5 backdrop-blur-sm"
              >
                <div className="flex flex-wrap items-center gap-4">
                  {/* The plates, so the order is recognised by what was on it
                      rather than by a reference number nobody remembers. */}
                  <div className="flex shrink-0 items-center gap-1.5">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div
                        key={`${order._id}-thumb-${index}`}
                        className="size-10 shrink-0 rounded-lg border border-border/60 bg-card p-0.5"
                      >
                        <div className="relative size-full overflow-hidden rounded-md bg-muted">
                          <SafeImage
                            src={item.image?.url}
                            alt={item.image?.alt || item.name}
                            fill
                            sizes="40px"
                            fallbackClassName="flex h-full w-full items-center justify-center text-muted-foreground"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium tracking-[-0.01em]">
                      {order.items[0]?.name ?? "Your order"}
                      {order.items.length > 1 &&
                        ` and ${order.items.length - 1} more`}
                    </p>
                    <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                      {order.orderNumber ? `${order.orderNumber} · ` : ""}
                      {formatDateTime(order.createdAt)}
                      {typeof order.pricing?.total === "number" &&
                        ` · ${formatMoney(order.pricing.total)}`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : order._id)}
                    aria-expanded={open}
                    className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card/60 px-4 py-2 font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase backdrop-blur-sm transition-colors duration-200 hover:border-primary/40 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {open ? "Close" : "Rate it"}
                    <ChevronDownIcon
                      className={cn(
                        "size-3.5 transition-transform duration-200",
                        open && "rotate-180",
                      )}
                    />
                  </button>
                </div>

                {/* Mounted only once opened, so the prompt is one request and
                    not one per order sitting in it. */}
                {open && (
                  <OrderReview
                    orderId={order._id}
                    onChange={(review) => {
                      if (!review) return;

                      // Rated, so it is no longer waiting. Dropping the row is
                      // the acknowledgement — the list is the to-do list.
                      setOpenId(null);
                      setOrders((current) =>
                        current.filter((entry) => entry._id !== order._id),
                      );
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
