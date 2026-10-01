import { ORDER_PROGRESS, type Order } from "./types";

/**
 * How an order reads on screen.
 *
 * Kept out of the components because three screens print the same things — the
 * checkout, the orders list, the tracking page — and a status that wore one
 * colour in the list and another on the docket would read as two states.
 */

export interface StatusMeta {
  label: string;
  /** Ring and ground for the pill. */
  className: string;
  dot: string;
  /** True while the kitchen still has it in hand, so the dot pulses. */
  live?: boolean;
}

/**
 * The six statuses, plus a fallback.
 *
 * A status the backend adds later falls through to the neutral one and prints
 * its own name, which is a great deal better than a blank pill.
 */
const META: Record<string, StatusMeta> = {
  pending: {
    label: "Awaiting payment",
    className:
      "bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-sky-500/10 text-sky-700 ring-sky-500/25 dark:text-sky-300",
    dot: "bg-sky-500",
    live: true,
  },
  preparing: {
    label: "In the kitchen",
    className:
      "bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-300",
    dot: "bg-amber-500",
    live: true,
  },
  ready: {
    label: "Ready to collect",
    className: "bg-primary/10 text-primary ring-primary/25",
    dot: "bg-primary",
    live: true,
  },
  completed: {
    label: "Collected",
    className: "bg-primary/10 text-primary ring-primary/25",
    dot: "bg-primary",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-rose-500/10 text-rose-700 ring-rose-500/25 dark:text-rose-300",
    dot: "bg-rose-500",
  },
};

const NEUTRAL: StatusMeta = {
  label: "",
  className: "bg-muted text-muted-foreground ring-border",
  dot: "bg-muted-foreground",
};

/**
 * What the status means for the customer, in a sentence.
 *
 * The pill names a state; this says what is happening and whether anything is
 * being waited on from them. A row that only says "Pending" leaves the reader
 * to work out that nothing reaches the kitchen until they pay.
 */
const NEXT: Record<string, string> = {
  pending: "Not paid yet — the kitchen starts once the payment goes through.",
  confirmed: "Paid and with the kitchen. They will start on it shortly.",
  preparing: "Being cooked now. We will say when it is ready to collect.",
  ready: "Ready to collect at the counter.",
  completed: "Collected. Thanks — tell us how it was.",
  cancelled: "Cancelled. Nothing was charged, or it has been refunded.",
};

export function statusHint(status: string): string | null {
  return NEXT[status] ?? null;
}

export function statusMeta(status: string): StatusMeta {
  return META[status] ?? { ...NEUTRAL, label: titleCase(status) };
}

/** How far along the rail an order is; `-1` for one that never joined it. */
export function progressIndex(status: string): number {
  return ORDER_PROGRESS.indexOf(status as (typeof ORDER_PROGRESS)[number]);
}

/** True while an order is worth polling — it is still moving. */
export function isLive(order: Order): boolean {
  return ["pending", "confirmed", "preparing", "ready"].includes(order.status);
}

const titleCase = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "—";

/**
 * Where the restaurant is — Virginia. Every time on screen is printed in this
 * zone rather than the reader's, so "ready at 6:45 PM" means the kitchen's
 * 6:45 whichever timezone the customer happens to be browsing from.
 */
export const RESTAURANT_TIMEZONE = "America/New_York";

/** A timestamp as the restaurant's clock reads it. */
export function formatDateTime(value?: string | null): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-US", {
    timeZone: RESTAURANT_TIMEZONE,
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** "Refunded" / "1 of 2 refunded" — or null for a line that was not. */
export function refundedLabel(item: {
  quantity: number;
  refundedQuantity?: number;
}): string | null {
  const refunded = Math.min(item.refundedQuantity || 0, item.quantity);
  if (refunded <= 0) return null;
  return refunded >= item.quantity
    ? "Refunded"
    : `${refunded} of ${item.quantity} refunded`;
}

/**
 * When the food is to be collected, in one line.
 *
 * The kitchen sends its own `label` and that wins whenever it is there. The
 * rest is only a fallback for an answer that carries just the time.
 */
export function pickupLabel(order: Pick<Order, "pickupDetails">): string {
  const pickup = order.pickupDetails;
  if (!pickup) return "—";

  // Worked out against today rather than printed as stored: the kitchen's
  // "Today, 7:30 PM" is only true on the day the order was placed.
  const at = pickup.estimatedReadyAt ? new Date(pickup.estimatedReadyAt) : null;

  if (at && !Number.isNaN(at.getTime())) {
    const zone = pickup.timezone || RESTAURANT_TIMEZONE;
    const dayOf = (date: Date) =>
      date.toLocaleDateString("en-CA", { timeZone: zone });
    const time = at.toLocaleTimeString("en-US", {
      timeZone: zone,
      hour: "numeric",
      minute: "2-digit",
    });

    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    if (dayOf(at) === dayOf(today)) return `Today, ${time}`;
    if (dayOf(at) === dayOf(tomorrow)) return `Tomorrow, ${time}`;

    return `${at.toLocaleDateString("en-US", {
      timeZone: zone,
      month: "short",
      day: "numeric",
    })}, ${time}`;
  }

  return pickup.label || "—";
}

/** How the payment stands, for the pill beside the status. */
export function paymentLabel(order: Order): string {
  const status = order.payment?.status;
  if (!status) return "—";

  if (status === "paid") return "Paid";
  if (status === "unpaid") return "Unpaid";
  if (status === "refunded") return "Refunded";

  return titleCase(status);
}
