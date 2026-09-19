"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, Loader2, Receipt, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons/Icons";
import SafeImage from "@/components/ui/SafeImage";
import { adoptCart } from "@/lib/cart/store";
import {
  cancelMyOrder,
  fetchMyOrder,
  reorder as reorderApi,
  retryMyPayment,
} from "@/lib/orders/client";
import {
  formatDateTime,
  isLive,
  paymentLabel,
  pickupLabel,
  progressIndex,
  statusMeta,
} from "@/lib/orders/format";
import { ORDER_PROGRESS, isCancellable, type Order } from "@/lib/orders/types";
import { formatMoney } from "@/lib/price";
import { cn } from "@/lib/utils";

import { OrderReview } from "./OrderReview";
import { PricingList } from "./OrdersView";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

/**
 * How often a live order is re-read.
 *
 * Twenty seconds is slower than a kitchen changes its mind and fast enough
 * that a customer standing outside sees "ready" without reaching for the
 * refresh — and it is one read, not a socket to keep alive.
 */
const POLL_MS = 20_000;

/**
 * One order, watched.
 *
 * `/orders/my/:id` is the tracking read and carries the status history with it,
 * so this is the screen for an order that is still moving: it polls while the
 * kitchen has it and stops the moment it is collected or called off, because
 * nothing about a finished order changes again.
 *
 * Every figure and every state is the backend's. The buttons are offered on the
 * same rules it enforces — unpaid and pending to cancel, unpaid to pay — but it
 * has the last word, and its refusal is what the customer reads.
 */
export function OrderTracker({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const answer = await fetchMyOrder(orderId);
      if (cancelled) return;

      setLoading(false);

      if (answer.ok && answer.data) {
        setOrder(answer.data);
        setError(null);
      } else {
        setError(answer.message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const live = order ? isLive(order) : false;

  useEffect(() => {
    if (!live) return;

    let cancelled = false;

    const timer = setInterval(() => {
      void (async () => {
        const answer = await fetchMyOrder(orderId);
        if (cancelled) return;

        // A poll that fails changes nothing on screen: the order already in
        // hand is still the last thing the kitchen said, and an error banner
        // over a perfectly good docket would only alarm the reader.
        if (answer.ok && answer.data) setOrder(answer.data);
      })();
    }, POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [live, orderId]);

  if (loading) return <TrackerSkeleton />;

  if (!order) {
    return (
      <div className="px-5 py-20 text-center sm:px-8 sm:py-24">
        <span className="mx-auto grid size-11 place-items-center rounded-full border border-danger/30 bg-danger/5 text-danger">
          <TriangleAlert className="size-4.5" />
        </span>

        <h1 className="mx-auto mt-7 max-w-[20ch] text-[26px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[32px]">
          That order is not here
        </h1>

        <p className="mx-auto mt-4 max-w-[46ch] text-[13.5px] leading-[1.7] text-muted-foreground">
          {error ?? "It may belong to another account."}
        </p>

        <Link
          href="/profile/orders"
          className="mt-8 inline-flex h-11 items-center rounded-full border border-border bg-card/60 px-5 text-[14px] font-medium transition-colors duration-200 hover:bg-foreground hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          All your orders
        </Link>
      </div>
    );
  }

  const meta = statusMeta(order.status);
  const cancelled = order.status === "cancelled";
  const unpaid =
    order.status === "pending" && order.payment?.status !== "paid";

  const handlePay = async () => {
    setBusy(true);

    const answer = await retryMyPayment(order._id);

    if (!answer.ok || !answer.data) {
      setBusy(false);
      toast.error(answer.message || "Payment could not be restarted.");
      return;
    }

    const { order: fresh, checkout } = answer.data;

    // No link back means it had been paid all along.
    if (!checkout?.checkoutUrl) {
      setOrder(fresh);
      setBusy(false);
      toast.success(answer.message || "This one is already paid.");
      return;
    }

    window.location.href = checkout.checkoutUrl;
  };

  const handleCancel = async () => {
    setBusy(true);
    const answer = await cancelMyOrder(order._id, "Changed my mind");
    setBusy(false);

    if (!answer.ok || !answer.data) {
      toast.error(answer.message || "The order could not be cancelled.");
      return;
    }

    setOrder(answer.data);
    toast.success(answer.message || "Order cancelled.");
  };

  const handleReorder = async () => {
    setBusy(true);
    const answer = await reorderApi(order._id);
    setBusy(false);

    if (!answer.ok || !answer.data) {
      toast.error(answer.message || "Those plates could not be added.");
      return;
    }

    adoptCart(answer.data.cart);

    const { added, skipped } = answer.data;

    if (skipped.length > 0) {
      toast(
        `${added} back on the docket. Not available: ${skipped
          .map((line) => line.name)
          .join(", ")}.`,
        { icon: "🍀" },
      );
    } else {
      toast.success(answer.message || `${added} back on the docket.`);
    }
  };

  return (
    <div>
      <header className={cn("border-b border-border/50 py-8", CELL)}>
        <Link
          href="/profile/orders"
          className="group inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground transition-colors duration-200 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ChevronLeftIcon className="size-3.5 text-primary transition-transform duration-200 group-hover:-translate-x-0.5" />
          All your orders
        </Link>

        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-mono text-[22px] tracking-[0.04em] tabular-nums">
                {order.orderNumber || order._id.slice(-8).toUpperCase()}
              </h1>

              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset",
                  meta.className,
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 rounded-full",
                    meta.dot,
                    meta.live && "animate-pulse",
                  )}
                />
                {meta.label}
              </span>
            </div>

            <p className="mt-2.5 text-[12.5px] text-muted-foreground">
              Placed {formatDateTime(order.createdAt)}
              {live && " · this page keeps itself up to date"}
            </p>
          </div>

          <p className="font-mono text-[22px] tracking-[-0.02em] tabular-nums text-primary">
            {formatMoney(order.pricing.total)}
          </p>
        </div>
      </header>

      {/* Where it is. A cancelled order never joined the rail, so it says so
          in words instead of showing a journey that stopped. */}
      <div className={cn("border-b border-border/50 py-7", CELL)}>
        {cancelled ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3.5 text-[13px] leading-[1.7]">
            <TriangleAlert
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-danger"
            />
            <span>
              This order was cancelled
              {order.cancelledAt ? ` on ${formatDateTime(order.cancelledAt)}` : ""}
              {order.cancelReason ? ` — ${order.cancelReason}` : "."}
            </span>
          </div>
        ) : (
          <ProgressRail status={order.status} />
        )}
      </div>

      {/* The two facts a customer standing in the street wants. */}
      <div className={cn("grid gap-5 border-b border-border/50 py-7 sm:grid-cols-2", CELL)}>
        <Fact label="Collection" icon={<Clock className="size-3.5" />}>
          {pickupLabel(order)}
        </Fact>

        <Fact label="Payment" icon={<Receipt className="size-3.5" />}>
          {paymentLabel(order)}
          {order.payment?.method ? ` · ${order.payment.method}` : ""}
        </Fact>
      </div>

      {/* The plates */}
      <div className={cn("border-b border-border/50 py-7", CELL)}>
        <h2 className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
          On this docket
        </h2>

        <ul role="list" className="mt-5 divide-y divide-border/50">
          {order.items.map((item, index) => (
            <li
              key={`line-${index}`}
              className="flex items-start gap-4 py-3.5 first:pt-0 last:pb-0"
            >
              <div className="size-12 shrink-0 rounded-xl border border-border/60 bg-card p-1">
                <div className="relative size-full overflow-hidden rounded-lg bg-muted">
                  <SafeImage
                    src={item.image?.url}
                    alt={item.image?.alt || item.name}
                    fill
                    sizes="48px"
                    fallbackClassName="flex h-full w-full items-center justify-center bg-muted"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium tracking-[-0.01em]">
                  {item.name}
                </p>
                <p className="mt-1 truncate font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                  {item.variantLabel ?? "Regular"} · ×{item.quantity}
                </p>

                {/* How this one was built — two lines of the same dish differ
                    only here. */}
                {item.modifiers && item.modifiers.length > 0 && (
                  <ul
                    role="list"
                    className="mt-2 space-y-0.5 text-[12px] leading-[1.6] text-muted-foreground"
                  >
                    {item.modifiers.map((modifier) => (
                      <li
                        key={`${modifier.groupId}-${modifier.optionName}`}
                        className="truncate"
                      >
                        {modifier.quantity > 1 && `${modifier.quantity}× `}
                        {modifier.optionName}
                      </li>
                    ))}
                  </ul>
                )}

                {item.specialInstructions && (
                  <p className="mt-2 text-[12px] leading-[1.6] text-muted-foreground italic">
                    &ldquo;{item.specialInstructions}&rdquo;
                  </p>
                )}
              </div>

              <span className="shrink-0 font-mono text-[13.5px] tabular-nums">
                {formatMoney(item.lineTotal)}
              </span>
            </li>
          ))}
        </ul>

        <PricingList order={order} />

        {order.customerNote && (
          <p className="mt-5 rounded-xl border border-border/60 bg-card/40 px-4 py-3 text-[12.5px] leading-[1.7] text-muted-foreground">
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase">
              Your note
            </span>
            <span className="mt-1.5 block text-foreground italic">
              &ldquo;{order.customerNote}&rdquo;
            </span>
          </p>
        )}
      </div>

      {/* Only a collected order can be reviewed, and this is where a customer
          lands from the "rate your order" prompt — so the block sits with the
          docket it is about rather than on a screen of its own. */}
      {order.status === "completed" && (
        <div className={cn("border-b border-border/50 py-7", CELL)}>
          <OrderReview orderId={order._id} />
        </div>
      )}

      {/* What has happened to it, in the kitchen's own words. */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className={cn("border-b border-border/50 py-7", CELL)}>
          <h2 className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
            History
          </h2>

          <ol role="list" className="mt-5 space-y-4">
            {order.statusHistory.map((event, index) => {
              const eventMeta = statusMeta(event.status);

              return (
                <li key={`event-${index}`} className="flex gap-3">
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1.5 size-1.5 shrink-0 rounded-full",
                      eventMeta.dot,
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium">
                      {eventMeta.label}
                    </p>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">
                      {formatDateTime(event.changedAt)}
                      {event.note ? ` · ${event.note}` : ""}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <div className={cn("flex flex-wrap gap-3 py-7", CELL)}>
        {unpaid && (
          <button
            type="button"
            onClick={() => void handlePay()}
            disabled={busy}
            className="group inline-flex h-11 cursor-pointer items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-5 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "One moment…" : "Pay for this order"}
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
              <ChevronRightIcon className="size-4" />
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => void handleReorder()}
          disabled={busy}
          className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-card/60 px-5 text-[14px] font-medium backdrop-blur-sm transition-colors duration-200 hover:bg-foreground hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy && <Loader2 aria-hidden className="size-4 animate-spin" />}
          Order this again
        </button>

        {isCancellable(order) && (
          <button
            type="button"
            onClick={() => void handleCancel()}
            disabled={busy}
            className="inline-flex h-11 cursor-pointer items-center rounded-full border border-border bg-card/60 px-5 text-[14px] font-medium backdrop-blur-sm transition-colors duration-200 hover:border-danger/40 hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel this order
          </button>
        )}
      </div>
    </div>
  );
}

/** The stops between paying and collecting. */
function ProgressRail({ status }: { status: string }) {
  const reached = progressIndex(status);

  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        {ORDER_PROGRESS.map((step, index) => (
          <div key={step} className="flex flex-1 items-center gap-2">
            <span
              aria-hidden
              className={cn(
                "size-2 shrink-0 rounded-full transition-colors",
                index <= reached ? "bg-primary" : "bg-muted-foreground/25",
              )}
            />
            {index < ORDER_PROGRESS.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "h-px flex-1 rounded-full",
                  index < reached ? "bg-primary" : "bg-muted-foreground/25",
                )}
              />
            )}
          </div>
        ))}
      </div>

      <ol
        role="list"
        className="mt-3 flex items-baseline justify-between gap-2 font-mono text-[9.5px] tracking-[0.14em] uppercase"
      >
        {ORDER_PROGRESS.map((step, index) => (
          <li
            key={step}
            className={cn(
              "truncate",
              index <= reached ? "text-primary" : "text-muted-foreground/70",
            )}
          >
            {statusMeta(step).label}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Fact({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-2 flex items-center gap-2 text-[13.5px]">
        <span aria-hidden className="text-primary">
          {icon}
        </span>
        {children}
      </p>
    </div>
  );
}

function TrackerSkeleton() {
  return (
    <div aria-hidden className="divide-y divide-border/50">
      {[0, 1, 2].map((row) => (
        <div key={row} className={cn("space-y-4 py-8", CELL)}>
          <div className="h-4 w-48 animate-pulse rounded bg-muted-foreground/10" />
          <div className="h-3 w-64 animate-pulse rounded bg-muted-foreground/10" />
          <div className="h-16 w-full animate-pulse rounded-xl bg-muted-foreground/10" />
        </div>
      ))}
    </div>
  );
}
