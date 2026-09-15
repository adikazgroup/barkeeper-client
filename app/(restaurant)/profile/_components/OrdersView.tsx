"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon,
  ShoppingBagIcon,
} from "@/components/icons/Icons";
import { Bike, Clock, MapPin, Receipt } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/price";
import {
  demoOrders,
  formatDateTime,
  orderProgress,
  orderStatusMeta,
  type Order,
  type OrderStatus,
} from "../_data";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

/** The filters, and which statuses each one lets through. */
const filters: { id: string; label: string; statuses: OrderStatus[] | null }[] =
  [
    { id: "all", label: "All", statuses: null },
    { id: "live", label: "Live", statuses: ["preparing", "on-the-way"] },
    { id: "delivered", label: "Completed", statuses: ["delivered"] },
    { id: "cancelled", label: "Cancelled", statuses: ["cancelled"] },
  ];

/**
 * Every docket on the account.
 *
 * Drawn as rows of the page's frame rather than a stack of floating cards: the
 * three figures up top are the home page's service strip, the filters are the
 * board's counter rail, and a docket opens in place instead of moving the
 * reader to another screen.
 */
export function OrdersView() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const allowed = filters.find((entry) => entry.id === filter)?.statuses;
    const needle = query.trim().toLowerCase();

    return demoOrders.filter((order) => {
      if (allowed && !allowed.includes(order.status)) return false;
      if (!needle) return true;

      // Searching the order number and the plates covers both ways a customer
      // goes looking: "what was that reference" and "when did I last get wings".
      return (
        order.id.toLowerCase().includes(needle) ||
        order.branch.toLowerCase().includes(needle) ||
        order.items.some((item) => item.name.toLowerCase().includes(needle))
      );
    });
  }, [filter, query]);

  const counts = useMemo(() => {
    const spent = demoOrders
      .filter((order) => order.status !== "cancelled")
      .reduce((total, order) => total + order.total, 0);

    return {
      total: demoOrders.length,
      live: demoOrders.filter((order) =>
        ["preparing", "on-the-way"].includes(order.status),
      ).length,
      spent,
    };
  }, []);

  return (
    <div>
      {/* The three figures, as a ruled strip — the same shape the home page
          answers its four questions in. */}
      <ul
        className={cn(
          "grid grid-cols-2 border-b border-border/50 bg-card/20 sm:grid-cols-3",
          CELL,
        )}
      >
        <StatCell label="Orders placed" value={String(counts.total)} />
        <StatCell label="Still live" value={String(counts.live)} accent ruled />
        <StatCell
          label="Spent with us"
          value={formatMoney(counts.spent)}
          className="col-span-2 border-t border-border/50 pt-5 sm:col-span-1 sm:border-t-0 sm:pt-0"
          ruledFrom="sm"
        />
      </ul>

      {/* Filter rail and search, on one line once there's room for both. */}
      <div
        className={cn(
          "flex flex-col gap-3 border-b border-border/50 py-5 sm:flex-row sm:items-center sm:justify-between",
          CELL,
        )}
      >
        <div
          role="tablist"
          aria-label="Filter orders by status"
          className="scrollbar-hide flex items-center gap-1 overflow-x-auto rounded-full border border-border bg-card/60 p-1 backdrop-blur-sm"
        >
          {filters.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={filter === entry.id}
              onClick={() => setFilter(entry.id)}
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

        <div className="relative sm:w-64">
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground/70"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search orders"
            aria-label="Search orders"
            className="h-11 w-full rounded-full border border-border bg-card/60 pr-4 pl-10 text-[13.5px] backdrop-blur-sm transition-colors placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/15 focus:outline-none"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyOrders cleared={Boolean(query) || filter !== "all"} />
      ) : (
        <ul role="list" className="divide-y divide-border/50">
          {visible.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * One figure of the strip. The rules are drawn per cell rather than with
 * `divide-x`: at two columns the rule belongs between the pair, and `divide-x`
 * would also draw one down the left of every second row.
 */
function StatCell({
  label,
  value,
  accent,
  ruled,
  ruledFrom,
  className,
}: {
  label: string;
  value: string;
  accent?: boolean;
  /** Draws the rule at every width. */
  ruled?: boolean;
  /** Draws it only from that breakpoint up. */
  ruledFrom?: "sm";
  className?: string;
}) {
  return (
    <li
      className={cn(
        "py-5",
        ruled && "border-l border-border/50 pl-5",
        ruledFrom === "sm" && "sm:border-l sm:border-border/50 sm:pl-5",
        className,
      )}
    >
      <p className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-mono text-[24px] tracking-[-0.02em] tabular-nums",
          accent && "text-primary",
        )}
      >
        {value}
      </p>
    </li>
  );
}

function OrderRow({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const status = orderStatusMeta[order.status];
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const live = order.status === "preparing" || order.status === "on-the-way";

  return (
    <li>
      <div className={cn("py-6", CELL)}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-mono text-[14px] tracking-[0.04em] tabular-nums">
                {order.id}
              </h3>

              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset",
                  status.className,
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 rounded-full",
                    status.dot,
                    live && "animate-pulse",
                  )}
                />
                {status.label}
              </span>
            </div>

            <p className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {formatDateTime(order.placedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                {order.type === "Delivery" ? (
                  <Bike className="size-3.5" />
                ) : (
                  <ShoppingBagIcon className="size-3.5" />
                )}
                {order.type}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {order.branch}
              </span>
            </p>
          </div>

          <div className="text-right">
            <p className="font-mono text-[18px] tracking-[-0.02em] tabular-nums text-primary">
              {formatMoney(order.total)}
            </p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              {itemCount} {itemCount === 1 ? "plate" : "plates"}
            </p>
          </div>
        </div>

        {/* Where the order is, for the ones still moving. */}
        {live && <ProgressRail status={order.status} eta={order.eta} />}

        {/* The plates, as a row of thumbnails until the docket is opened. */}
        <div className="mt-5 flex items-center gap-2">
          {order.items.slice(0, 4).map((item, index) => (
            <div
              key={`${order.id}-${item.name}-${index}`}
              className="size-12 shrink-0 rounded-xl border border-border/60 bg-card p-1"
            >
              <div className="relative size-full overflow-hidden rounded-lg bg-muted">
                <SafeImage
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="48px"
                  fallbackClassName="flex h-full w-full items-center justify-center bg-primary/5"
                  className="object-cover"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            className="ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card/60 px-3.5 py-2 font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase backdrop-blur-sm transition-colors duration-200 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {open ? "Hide" : "Details"}
            <ChevronDownIcon
              className={cn(
                "size-3.5 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className={cn("border-t border-border/50 bg-card/20 py-6", CELL)}>
          <ul role="list" className="divide-y divide-border/50">
            {order.items.map((item, index) => (
              <li
                key={`${order.id}-line-${index}`}
                className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
              >
                <div className="size-12 shrink-0 rounded-xl border border-border/60 bg-card p-1">
                  <div className="relative size-full overflow-hidden rounded-lg bg-muted">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="48px"
                      fallbackClassName="flex h-full w-full items-center justify-center bg-primary/5"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium tracking-[-0.01em]">
                    {item.name}
                  </p>
                  <p className="mt-1 truncate font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                    {item.variant} · ×{item.quantity}
                  </p>
                </div>

                <span className="shrink-0 font-mono text-[13.5px] tabular-nums">
                  {formatMoney(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2.5 border-t border-border/50 pt-5 text-[13.5px]">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-mono tabular-nums">
                {formatMoney(order.subtotal)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">
                {order.type === "Delivery" ? "Delivery" : "Collection"}
              </dt>
              <dd className="font-mono tabular-nums">
                {order.delivery > 0 ? formatMoney(order.delivery) : "Free"}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-border/50 pt-3">
              <dt className="font-medium">Total</dt>
              <dd className="font-mono text-[18px] tracking-[-0.02em] tabular-nums text-primary">
                {formatMoney(order.total)}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                toast("Re-ordering arrives with accounts — the board is live.", {
                  icon: "🍀",
                })
              }
              className="group inline-flex h-11 cursor-pointer items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-5 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Order this again
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
                <ChevronRightIcon className="size-4" />
              </span>
            </button>

            <Link
              href="/profile/transactions"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card/60 px-5 text-[14px] font-medium backdrop-blur-sm transition-colors duration-200 hover:bg-foreground hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Receipt className="size-4" />
              View payment
            </Link>
          </div>
        </div>
      )}
    </li>
  );
}

/** Three stops between the kitchen and the door. */
function ProgressRail({ status, eta }: { status: OrderStatus; eta?: string }) {
  const labels: Record<string, string> = {
    preparing: "In the kitchen",
    "on-the-way": "On the way",
    delivered: "Delivered",
  };
  const reached = orderProgress.indexOf(status);

  return (
    <div className="mt-5 rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        {orderProgress.map((step, index) => (
          <div key={step} className="flex flex-1 items-center gap-2">
            <span
              aria-hidden
              className={cn(
                "size-2 shrink-0 rounded-full transition-colors",
                index <= reached ? "bg-primary" : "bg-muted-foreground/25",
              )}
            />
            {index < orderProgress.length - 1 && (
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

      <div className="mt-3 flex items-baseline justify-between gap-4">
        <p className="font-mono text-[10.5px] tracking-[0.16em] text-primary uppercase">
          {labels[status]}
        </p>
        {eta && <p className="text-[12px] text-muted-foreground">{eta}</p>}
      </div>
    </div>
  );
}

function EmptyOrders({ cleared }: { cleared: boolean }) {
  return (
    <div className="px-5 py-20 text-center sm:px-8 sm:py-24">
      <span className="mx-auto grid size-11 place-items-center rounded-full border border-border bg-card text-muted-foreground">
        <Receipt className="size-4.5" />
      </span>

      <h3 className="mx-auto mt-7 max-w-[20ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[26px] leading-[1.05] font-medium tracking-[-0.04em] text-transparent sm:text-[32px]">
        {cleared ? "Nothing matches that" : "No orders yet"}
      </h3>

      <p className="mx-auto mt-4 max-w-[46ch] text-[13.5px] leading-[1.7] text-muted-foreground">
        {cleared
          ? "Try another search, or clear the filter to see everything on the account."
          : "Pick a counter on the board and your first docket will show up here."}
      </p>

      {!cleared && (
        <Link
          href="/menu"
          className="group mt-8 inline-flex h-11 items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-5 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Browse the board
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
            <ChevronRightIcon className="size-4" />
          </span>
        </Link>
      )}
    </div>
  );
}
