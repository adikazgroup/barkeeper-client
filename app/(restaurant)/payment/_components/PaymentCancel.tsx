"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { ChevronRightIcon } from "@/components/icons/Icons";
import {
  cancelMyOrder,
  fetchMyOrder,
  retryMyPayment,
} from "@/lib/orders/client";
import { pickupLabel } from "@/lib/orders/format";
import { isCancellable, type Order } from "@/lib/orders/types";
import { formatMoney } from "@/lib/price";

/**
 * Where Stripe sends a customer who backed out.
 *
 * The order exists and is `pending` — leaving the payment page does not undo
 * it — so there are exactly two honest things to offer: pay it after all, or
 * call it off. Both are the backend's to decide: a checkout that expired has
 * already cancelled the order, and a retry is refused once the pickup time has
 * gone by, so its refusal is what the screen prints.
 */
export function PaymentCancel({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // A link with no order on it is answered in the render below, not here.
    if (!orderId) return;

    let cancelled = false;

    void fetchMyOrder(orderId).then((answer) => {
      if (cancelled) return;

      setLoading(false);
      if (answer.ok && answer.data) setOrder(answer.data);
      else setError(answer.message);
    });

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const handleRetry = async () => {
    setBusy(true);

    const answer = await retryMyPayment(orderId);

    if (!answer.ok || !answer.data) {
      setBusy(false);
      toast.error(answer.message || "Payment could not be restarted.");
      return;
    }

    const { order: fresh, checkout } = answer.data;

    // No link back means it had been paid all along — so the customer goes to
    // the order rather than to a payment page for money already taken.
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

    const answer = await cancelMyOrder(orderId, "Changed my mind at checkout");

    setBusy(false);

    if (!answer.ok || !answer.data) {
      toast.error(answer.message || "The order could not be cancelled.");
      return;
    }

    setOrder(answer.data);
    toast.success(answer.message || "Order cancelled.");
  };

  if (loading && orderId) {
    return (
      <div>
        <Loader2
          aria-hidden
          className="mx-auto size-6 animate-spin text-primary"
        />
        <Heading>Finding your order</Heading>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <span className="mx-auto grid size-11 place-items-center rounded-full border border-danger/30 bg-danger/5 text-danger">
          <TriangleAlert className="size-4.5" />
        </span>
        <Heading>Payment was not completed</Heading>
        <Lede>
          {error ??
            (orderId
              ? "We could not find that order. Your orders page has them."
              : "This link is missing its order. Your orders page has them all.")}
        </Lede>
        <div className="mt-9 flex justify-center">
          <Primary href="/profile/orders">See your orders</Primary>
        </div>
      </div>
    );
  }

  const cancelled = order.status === "cancelled";
  const paid = order.payment?.status === "paid";

  return (
    <div>
      <span className="mx-auto grid size-11 place-items-center rounded-full border border-border bg-card text-muted-foreground">
        <TriangleAlert className="size-4.5" />
      </span>

      <Heading>
        {cancelled
          ? "This order was cancelled"
          : paid
            ? "This one is already paid"
            : "Nothing was charged"}
      </Heading>

      <Lede>
        {cancelled
          ? "Nothing was taken, and the kitchen was never told about it. Your plates are still on the board."
          : paid
            ? "The payment went through after all — the kitchen has this one."
            : "You left the payment page, so the order is sitting unpaid. Pay it now and it goes to the kitchen, or call it off."}
      </Lede>

      <dl className="mt-9 space-y-3.5 rounded-2xl border border-border bg-card/40 px-5 py-5 text-left text-[13.5px] backdrop-blur-sm">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-muted-foreground">Order</dt>
          <dd className="font-mono tracking-[0.04em] tabular-nums">
            {order.orderNumber || order._id}
          </dd>
        </div>

        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-muted-foreground">Collection</dt>
          <dd className="text-right">{pickupLabel(order)}</dd>
        </div>

        <div className="flex items-baseline justify-between gap-4 border-t border-border/50 pt-3.5">
          <dt className="font-medium">Owed</dt>
          <dd className="font-mono text-[18px] tracking-[-0.02em] tabular-nums text-primary">
            {formatMoney(order.pricing.total)}
          </dd>
        </div>
      </dl>

      <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {!cancelled && !paid && (
          <button
            type="button"
            onClick={() => void handleRetry()}
            disabled={busy}
            className="group inline-flex h-11 w-full cursor-pointer items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-5 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
          >
            {busy ? "One moment…" : "Pay for this order"}
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
              <ChevronRightIcon className="size-4" />
            </span>
          </button>
        )}

        {isCancellable(order) && (
          <button
            type="button"
            onClick={() => void handleCancel()}
            disabled={busy}
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-full border border-border bg-card/60 px-5 text-[14px] font-medium transition-colors duration-200 hover:border-danger/40 hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            Cancel the order
          </button>
        )}

        <Link
          href={`/profile/orders/${order._id}`}
          className="inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-card/60 px-5 text-[14px] font-medium transition-colors duration-200 hover:bg-foreground hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
        >
          View the order
        </Link>
      </div>
    </div>
  );
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

function Primary({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex h-11 items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-5 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {children}
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
        <ChevronRightIcon className="size-4" />
      </span>
    </Link>
  );
}
