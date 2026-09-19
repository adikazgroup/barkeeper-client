"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, Loader2, TriangleAlert } from "lucide-react";

import { CheckCircleIcon, ChevronRightIcon } from "@/components/icons/Icons";
import { refresh as refreshCart } from "@/lib/cart/store";
import { clearCoupon } from "@/lib/coupons/store";
import { syncMyPayment } from "@/lib/orders/client";
import { pickupLabel, statusMeta } from "@/lib/orders/format";
import type { Order } from "@/lib/orders/types";
import { formatMoney } from "@/lib/price";
import { cn } from "@/lib/utils";

/**
 * Where Stripe sends a customer who paid.
 *
 * The webhook is the real record of the payment, but it may be a second or two
 * behind the redirect — so the first thing this does is ask Stripe directly
 * through `/orders/my/:id/sync-payment`, rather than reading an order that
 * still says "pending" and telling somebody holding a receipt that they have
 * not paid.
 *
 * The backend empties the docket once payment lands, so the cart is re-read
 * afterwards: without it the navbar badge would sit there counting plates that
 * have already been ordered.
 */
export function PaymentSuccess({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // A link with no order on it is answered in the render below, not here —
    // there is nothing to ask Stripe about.
    if (!orderId) return;

    let cancelled = false;

    void syncMyPayment(orderId).then((answer) => {
      if (cancelled) return;

      setChecking(false);

      if (answer.ok && answer.data) {
        setOrder(answer.data);

        if (answer.data.payment?.status === "paid") {
          // The docket has been emptied server-side and the code spent with
          // it, so both are dropped here — otherwise the badge keeps counting
          // plates that are already cooking and the next cart opens with a
          // code that has been used.
          void refreshCart();
          clearCoupon();
        }
      } else {
        setError(answer.message);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (checking && orderId) {
    return (
      <Panel>
        <Loader2
          aria-hidden
          className="mx-auto size-6 animate-spin text-primary"
        />
        <Heading>Checking with the bank</Heading>
        <Lede>
          One moment — we are confirming the payment before we tell the kitchen
          anything.
        </Lede>
      </Panel>
    );
  }

  if (!order) {
    return (
      <Panel>
        <span className="mx-auto grid size-11 place-items-center rounded-full border border-danger/30 bg-danger/5 text-danger">
          <TriangleAlert className="size-4.5" />
        </span>
        <Heading>We could not confirm it</Heading>
        <Lede>
          {error ??
            (orderId
              ? "The payment could not be checked just now. Your orders page has the last word on it."
              : "This link is missing its order, so there is nothing to look up. Your orders page has them all.")}
        </Lede>
        <Actions>
          <Primary href="/profile/orders">See your orders</Primary>
        </Actions>
      </Panel>
    );
  }

  const paid = order.payment?.status === "paid";
  const meta = statusMeta(order.status);

  return (
    <Panel>
      <span
        className={cn(
          "mx-auto grid size-11 place-items-center rounded-full border",
          paid
            ? "border-primary/30 bg-primary/5 text-primary"
            : "border-border bg-card text-muted-foreground",
        )}
      >
        {paid ? (
          <CheckCircleIcon className="size-4.5" />
        ) : (
          <Clock className="size-4.5" />
        )}
      </span>

      <Heading>
        {paid ? "Paid — the kitchen has it" : "Not settled yet"}
      </Heading>

      <Lede>
        {paid
          ? "Your order is with the counter. We will have it ready at the time below."
          : "Stripe has not confirmed this one. Nothing is lost — your orders page tracks it and you can pay again from there."}
      </Lede>

      {/* The docket's own line, so the customer has a reference without
          opening another screen. */}
      <dl className="mt-9 space-y-3.5 rounded-2xl border border-border bg-card/40 px-5 py-5 text-left text-[13.5px] backdrop-blur-sm">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-muted-foreground">Order</dt>
          <dd className="font-mono tracking-[0.04em] tabular-nums">
            {order.orderNumber || order._id}
          </dd>
        </div>

        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-muted-foreground">Status</dt>
          <dd>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset",
                meta.className,
              )}
            >
              <span aria-hidden className={cn("size-1.5 rounded-full", meta.dot)} />
              {meta.label}
            </span>
          </dd>
        </div>

        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-muted-foreground">Collection</dt>
          <dd className="text-right">{pickupLabel(order)}</dd>
        </div>

        <div className="flex items-baseline justify-between gap-4 border-t border-border/50 pt-3.5">
          <dt className="font-medium">Paid</dt>
          <dd className="font-mono text-[18px] tracking-[-0.02em] tabular-nums text-primary">
            {formatMoney(order.pricing.total)}
          </dd>
        </div>
      </dl>

      <Actions>
        <Primary href={`/profile/orders/${order._id}`}>Track this order</Primary>
        <Secondary href="/menu">Back to the board</Secondary>
      </Actions>
    </Panel>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  // A seam, not a box: the three states share nothing but their stacking.
  return <div>{children}</div>;
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="mx-auto mt-7 max-w-[20ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[30px] leading-[1.05] font-medium tracking-[-0.04em] text-transparent sm:text-[40px]">
      {children}
    </h1>
  );
}

function Lede({ children }: { children: React.ReactNode }) {
  return (
    <p className="mx-auto mt-5 max-w-[46ch] text-[14px] leading-[1.7] text-muted-foreground">
      {children}
    </p>
  );
}

function Actions({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      {children}
    </div>
  );
}

function Primary({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex h-11 w-full items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-5 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
    >
      {children}
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
        <ChevronRightIcon className="size-4" />
      </span>
    </Link>
  );
}

function Secondary({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-card/60 px-5 text-[14px] font-medium transition-colors duration-200 hover:bg-foreground hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
    >
      {children}
    </Link>
  );
}
