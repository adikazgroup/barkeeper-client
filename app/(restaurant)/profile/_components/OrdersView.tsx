"use client";

import Link from "next/link";
import { useEffect, useState, type ComponentType } from "react";
import { Clock, Loader2, Receipt } from "lucide-react";
import { toast } from "sonner";

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/icons/Icons";
import SafeImage from "@/components/ui/SafeImage";
import { adoptCart } from "@/lib/cart/store";
import type { ApiMeta } from "@/lib/api";
import {
  cancelMyOrder,
  fetchMyOrders,
  reorder as reorderApi,
  retryMyPayment,
} from "@/lib/orders/client";
import {
  formatDateTime,
  paymentLabel,
  pickupLabel,
  statusHint,
  statusMeta,
} from "@/lib/orders/format";
import { isCancellable, type Order } from "@/lib/orders/types";
import { formatMoney } from "@/lib/price";
import { cn } from "@/lib/utils";

import { OrderReview } from "./OrderReview";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

/** Rows per page. The backend's own default, said out loud. */
const PAGE_SIZE = 10;

/**
 * The filters.
 *
 * The values are the backend's statuses verbatim, because they are sent to it
 * as `?status=` — a label of our own here would only have to be translated back
 * on the way out, and would drift the first time the kitchen adds a state.
 */
const FILTERS: { id: string; label: string; status?: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Unpaid", status: "pending" },
  { id: "confirmed", label: "Confirmed", status: "confirmed" },
  { id: "preparing", label: "In the kitchen", status: "preparing" },
  { id: "ready", label: "Ready", status: "ready" },
  { id: "completed", label: "Collected", status: "completed" },
  { id: "cancelled", label: "Cancelled", status: "cancelled" },
];

/**
 * Every docket on the account.
 *
 * Drawn as rows of the page's frame rather than a stack of floating cards: the
 * filters are the board's counter rail and a docket opens in place instead of
 * moving the reader to another screen — though there is a screen of its own for
 * one that is still being cooked, because that one wants watching.
 *
 * The filter and the page are the backend's to apply, not this component's:
 * `/orders/my` answers one page at a time, so filtering in here would only
 * search the ten rows that happened to be on screen.
 */
export function OrdersView() {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<ApiMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Bumped to ask the same page again after a failure.
   *
   * The read is driven by what the reader chose — the filter, the page — so a
   * retry is another turn of the same handle rather than a second code path
   * that could answer differently.
   */
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const status = FILTERS.find((entry) => entry.id === filter)?.status;
      const answer = await fetchMyOrders({ page, limit: PAGE_SIZE, status });

      if (cancelled) return;

      setLoading(false);

      if (!answer.ok || !answer.data) {
        setError(answer.message || "Your orders could not be read.");
        setOrders([]);
        return;
      }

      setError(null);
      setOrders(answer.data.orders);
      setMeta(answer.data.meta);
    })();

    return () => {
      cancelled = true;
    };
  }, [filter, page, attempt]);

  /** Every way of asking again: put the skeleton up, then turn the handle. */
  const reload = () => {
    setLoading(true);
    setAttempt((current) => current + 1);
  };

  /** One row changed under us — swap it rather than re-reading the page. */
  const replace = (updated: Order) =>
    setOrders((current) =>
      current.map((order) => (order._id === updated._id ? updated : order)),
    );

  const totalPages = meta?.totalPage ?? 1;

  return (
    <div>
      {/* Filter rail. Changing it always starts at page one — page three of
          "all" is rarely page three of "cancelled". */}
      <div className={cn("border-b border-border/50 py-5", CELL)}>
        <div
          role="tablist"
          aria-label="Filter orders by status"
          className="scrollbar-hide flex items-center gap-1 overflow-x-auto rounded-full border border-border bg-card/60 p-1 backdrop-blur-sm"
        >
          {FILTERS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={filter === entry.id}
              onClick={() => {
                setLoading(true);
                setFilter(entry.id);
                setPage(1);
              }}
              className={cn(
                "shrink-0 cursor-pointer rounded-full px-4 py-2 text-[13px] font-medium tracking-[-0.01em] whitespace-nowrap transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                filter === entry.id
                  ? "bg-primary text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <OrdersSkeleton />
      ) : error ? (
        <Blank
          title="Your orders could not be read"
          body={error}
          action={
            <button
              type="button"
              onClick={reload}
              className="mt-8 inline-flex h-11 cursor-pointer items-center rounded-full border border-border bg-card/60 px-5 text-[14px] font-medium transition-colors duration-200 hover:bg-foreground hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Try again
            </button>
          }
        />
      ) : orders.length === 0 ? (
        <Blank
          title={filter === "all" ? "No orders yet" : "Nothing under that"}
          body={
            filter === "all"
              ? "Pick a counter on the board and your first docket will show up here."
              : "No order on the account is at that stage right now."
          }
          action={
            filter === "all" ? (
              <Link
                href="/menu"
                className="group mt-8 inline-flex h-11 items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-5 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Browse the board
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
                  <ChevronRightIcon className="size-4" />
                </span>
              </Link>
            ) : null
          }
        />
      ) : (
        <>
          <ul role="list" className="divide-y divide-border/50">
            {orders.map((order) => (
              <OrderRow key={order._id} order={order} onChange={replace} />
            ))}
          </ul>

          {totalPages > 1 && (
            <div
              className={cn(
                "flex items-center justify-between gap-4 border-t border-border/50 py-5",
                CELL,
              )}
            >
              <Pager
                onClick={() => {
                  setLoading(true);
                  setPage((current) => Math.max(1, current - 1));
                }}
                disabled={page <= 1}
              >
                <ChevronLeftIcon className="size-3.5" />
                Newer
              </Pager>

              <p className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
                Page {page} of {totalPages}
              </p>

              <Pager
                onClick={() => {
                  setLoading(true);
                  setPage((current) => Math.min(totalPages, current + 1));
                }}
                disabled={page >= totalPages}
              >
                Older
                <ChevronRightIcon className="size-3.5" />
              </Pager>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function OrderRow({
  order,
  onChange,
}: {
  order: Order;
  onChange: (order: Order) => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const meta = statusMeta(order.status);
  const hint = statusHint(order.status);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const unpaid = order.status === "pending" && order.payment?.status !== "paid";

  const handleReorder = async () => {
    setBusy(true);

    const answer = await reorderApi(order._id);

    setBusy(false);

    if (!answer.ok || !answer.data) {
      toast.error(answer.message || "Those plates could not be added.");
      return;
    }

    // The answer carries the whole priced cart, so the store takes it as it is
    // rather than asking `/carts` for what is already in hand.
    adoptCart(answer.data.cart);

    const { added, skipped } = answer.data;

    if (skipped.length > 0) {
      // Naming what did not come with matters more than the count that did:
      // a customer who is not told finds out at the counter.
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

  const handlePay = async () => {
    setBusy(true);

    const answer = await retryMyPayment(order._id);

    if (!answer.ok || !answer.data) {
      setBusy(false);
      toast.error(answer.message || "Payment could not be restarted.");
      return;
    }

    const { order: fresh, checkout } = answer.data;

    if (!checkout?.checkoutUrl) {
      setBusy(false);
      onChange(fresh);
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

    onChange(answer.data);
    toast.success(answer.message || "Order cancelled.");
  };

  return (
    <li>
      <div className={cn("py-6", CELL)}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="font-mono text-[14px] tracking-[0.04em] tabular-nums">
              {order.orderNumber || order._id.slice(-8).toUpperCase()}
            </h3>

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

          <p className="font-mono text-[18px] tracking-[-0.02em] tabular-nums text-primary">
            {formatMoney(order.pricing.total)}
          </p>
        </div>

        {hint && (
          <p className="mt-2.5 text-[13px] leading-[1.6] text-muted-foreground">
            {hint}
          </p>
        )}

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          <Fact icon={Clock} label="Placed">
            {formatDateTime(order.createdAt)}
          </Fact>

          <Fact icon={Receipt} label="Pickup">
            {pickupLabel(order)}
          </Fact>

          <Fact label="Plates">
            {itemCount} {itemCount === 1 ? "plate" : "plates"}
          </Fact>

          <Fact label="Payment">
            {order.payment?.status === "paid"
              ? "Paid"
              : unpaid
                ? "Not paid yet"
                : paymentLabel(order)}
          </Fact>
        </dl>
      </div>

      {/* Its own row of the frame, so the rule above it reaches both edges
          rather than stopping at the text. */}
      <div
        className={cn(
          "flex items-center gap-2 border-t border-border/50 bg-card/20 py-4",
          CELL,
        )}
      >
        {order.items.slice(0, 4).map((item, index) => (
          <div
            key={`${order._id}-thumb-${index}`}
            className="size-12 shrink-0 rounded-xl border border-border/60 bg-card p-1"
          >
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
        ))}

        {order.items.length > 4 && (
          <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
            +{order.items.length - 4}
          </span>
        )}

        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card/60 px-3.5 py-2 font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase backdrop-blur-sm transition-colors duration-200 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {open ? "Hide details" : "See details"}
            <ChevronDownIcon
              className={cn(
                "size-3.5 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </button>

          {/* The one thing this order is waiting for, out where it can be
                seen. Buried with the rest, an unpaid order looks like it is
                simply sitting there rather than asking to be paid. */}
          {unpaid ? (
            <button
              type="button"
              onClick={() => void handlePay()}
              disabled={busy}
              className="inline-flex h-9 cursor-pointer items-center rounded-full bg-primary px-4 text-[13px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "One moment…" : "Pay now"}
            </button>
          ) : meta.live ? (
            <Link
              href={`/profile/orders/${order._id}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-[13px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Receipt className="size-3.5" />
              Track order
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => void handleReorder()}
              disabled={busy}
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-border bg-card/60 px-4 text-[13px] font-medium backdrop-blur-sm transition-colors duration-200 hover:bg-foreground hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy && (
                <Loader2 aria-hidden className="size-3.5 animate-spin" />
              )}
              Order again
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className={cn("border-t border-border/50 bg-card/20 py-6", CELL)}>
          <ul role="list" className="divide-y divide-border/50">
            {order.items.map((item, index) => (
              <li
                key={`${order._id}-line-${index}`}
                className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
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
                </div>

                <span className="shrink-0 font-mono text-[13.5px] tabular-nums">
                  {formatMoney(item.lineTotal)}
                </span>
              </li>
            ))}
          </ul>

          <PricingList order={order} />

          {/* A review is only possible once the order has been collected, and
              the block reads its own state — so it is mounted on exactly the
              orders that can have one, and only while the row is open. */}
          {order.status === "completed" && <OrderReview orderId={order._id} />}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handleReorder()}
              disabled={busy}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-card/60 px-5 text-[14px] font-medium backdrop-blur-sm transition-colors duration-200 hover:bg-foreground hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy && <Loader2 aria-hidden className="size-4 animate-spin" />}
              Order this again
            </button>

            <Link
              href={`/profile/orders/${order._id}`}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card/60 px-5 text-[14px] font-medium backdrop-blur-sm transition-colors duration-200 hover:bg-foreground hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Receipt className="size-4" />
              Full receipt
            </Link>

            {isCancellable(order) && (
              <button
                type="button"
                onClick={() => void handleCancel()}
                disabled={busy}
                className="inline-flex h-11 cursor-pointer items-center rounded-full border border-border bg-card/60 px-5 text-[14px] font-medium backdrop-blur-sm transition-colors duration-200 hover:border-danger/40 hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

/**
 * What it came to, as the kitchen priced it.
 *
 * Tax and tip are printed only when there were any: a zero tip row on an order
 * nobody tipped is noise, and the customer knows what they chose.
 */
/** One labelled figure off a docket. */
function Fact({
  icon: Icon,
  label,
  children,
}: {
  icon?: ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1.5 flex items-start gap-1.5 text-[13px] leading-[1.55]">
        {Icon && (
          <Icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
        )}
        <span>{children}</span>
      </dd>
    </div>
  );
}

export function PricingList({ order }: { order: Order }) {
  const { pricing } = order;

  return (
    <dl className="mt-5 space-y-2.5 border-t border-border/50 pt-5 text-[13.5px]">
      <div className="flex justify-between gap-4">
        <dt className="text-muted-foreground">Subtotal</dt>
        <dd className="font-mono tabular-nums">
          {formatMoney(pricing.subtotal)}
        </dd>
      </div>

      {pricing.discount > 0 && (
        <div className="flex justify-between gap-4">
          <dt className="min-w-0 truncate text-muted-foreground">
            Discount
            {pricing.couponCode && (
              <span className="ml-1.5 font-mono text-[11px] tracking-widest text-primary uppercase">
                {pricing.couponCode}
              </span>
            )}
          </dt>
          <dd className="font-mono tabular-nums text-primary">
            &minus;{formatMoney(pricing.discount)}
          </dd>
        </div>
      )}

      {pricing.tax > 0 && (
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">
            Tax{pricing.taxPercentage ? ` (${pricing.taxPercentage}%)` : ""}
          </dt>
          <dd className="font-mono tabular-nums">{formatMoney(pricing.tax)}</dd>
        </div>
      )}

      {pricing.tip > 0 && (
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">
            Tip{pricing.tipPercentage ? ` (${pricing.tipPercentage}%)` : ""}
          </dt>
          <dd className="font-mono tabular-nums">{formatMoney(pricing.tip)}</dd>
        </div>
      )}

      <div className="flex items-baseline justify-between gap-4 border-t border-border/50 pt-3">
        <dt className="font-medium">Total</dt>
        <dd className="font-mono text-[18px] tracking-[-0.02em] tabular-nums text-primary">
          {formatMoney(pricing.total)}
        </dd>
      </div>
    </dl>
  );
}

function Pager({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-card/60 px-4 text-[13px] font-medium backdrop-blur-sm transition-colors duration-200 hover:bg-foreground hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-card/60 disabled:hover:text-foreground"
    >
      {children}
    </button>
  );
}

function Blank({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="px-5 py-20 text-center sm:px-8 sm:py-24">
      <span className="mx-auto grid size-11 place-items-center rounded-full border border-border bg-card text-muted-foreground">
        <Receipt className="size-4.5" />
      </span>

      <h3 className="mx-auto mt-7 max-w-[20ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[26px] leading-[1.05] font-medium tracking-[-0.04em] text-transparent sm:text-[32px]">
        {title}
      </h3>

      <p className="mx-auto mt-4 max-w-[46ch] text-[13.5px] leading-[1.7] text-muted-foreground">
        {body}
      </p>

      {action}
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <ul aria-hidden role="list" className="divide-y divide-border/50">
      {[0, 1, 2].map((row) => (
        <li key={row} className={cn("space-y-4 py-6", CELL)}>
          <div className="flex justify-between gap-4">
            <div className="h-4 w-40 animate-pulse rounded bg-muted-foreground/10" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted-foreground/10" />
          </div>
          <div className="h-3 w-56 animate-pulse rounded bg-muted-foreground/10" />
          <div className="flex gap-2">
            {[0, 1, 2].map((thumb) => (
              <div
                key={thumb}
                className="size-12 animate-pulse rounded-xl bg-muted-foreground/10"
              />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
