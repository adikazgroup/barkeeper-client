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
 * A timestamp in the reader's own locale.
 *
 * `undefined` for the locale rather than a fixed one: the kitchen is one
 * timezone, but the person reading it may not be, and a date printed in a
 * format they do not use is a date they have to decode.
 */
export function formatDateTime(value?: string | null): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatTime(value?: string | null): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * When the food is to be collected, in one line.
 *
 * The kitchen sends its own `label` and that wins whenever it is there — it
 * knows about closing times and prep windows that nothing on this side does.
 * The rest is only a fallback for an older answer that carries just the times.
 */
export function pickupLabel(order: Pick<Order, "pickupDetails">): string {
  const pickup = order.pickupDetails;
  if (!pickup) return "—";
  if (pickup.label) return pickup.label;

  if (pickup.slotStartAt) {
    const start = formatDateTime(pickup.slotStartAt);
    return pickup.slotEndAt
      ? `${start} – ${formatTime(pickup.slotEndAt)}`
      : start;
  }

  if (pickup.estimatedReadyAt) {
    return `Ready around ${formatDateTime(pickup.estimatedReadyAt)}`;
  }

  return pickup.scheduleType === "scheduled" ? "Scheduled" : "As soon as possible";
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

/**
 * A datetime-local field's value, as an ISO instant.
 *
 * The field hands back wall-clock time with no zone on it; `new Date` reads
 * that in the reader's own zone, which is the one they typed it in. Returns
 * empty for a half-typed value rather than an `Invalid Date`.
 */
export function toIsoInstant(localValue: string): string {
  if (!localValue) return "";

  const date = new Date(localValue);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

/** Now, in the shape a `datetime-local` field wants, for its `min`. */
export function localNow(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}
