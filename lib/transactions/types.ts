/**
 * The customer's own payments and refunds, as `GET /transactions/my` sends
 * them, and the shape the statement page draws.
 */

export type TransactionKind = "payment" | "refund";
export type TransactionStatus = "completed" | "pending" | "failed";

/** One row on the statement. */
export interface Transaction {
  id: string;
  /** ISO timestamp. */
  date: string;
  kind: TransactionKind;
  description: string;
  /** The order the money moved against — what the row links to. */
  orderId: string | null;
  orderNumber: string | null;
  method: string;
  /** Positive for a charge, negative for money coming back. */
  amount: number;
  status: TransactionStatus;
  /** The bank's own words when a card was declined. */
  failureMessage: string | null;
}

export interface TransactionsSummary {
  totalPaid: number;
  thisMonth: number;
  refunded: number;
  paidOrders: number;
  currency: string;
}

export const EMPTY_SUMMARY: TransactionsSummary = {
  totalPaid: 0,
  thisMonth: 0,
  refunded: 0,
  paidOrders: 0,
  currency: "usd",
};

interface RawTransaction {
  _id?: unknown;
  orderId?: unknown;
  orderNumber?: unknown;
  type?: unknown;
  status?: unknown;
  amount?: unknown;
  paymentMethod?: unknown;
  card?: { brand?: unknown; last4?: unknown } | null;
  failureMessage?: unknown;
  processedAt?: unknown;
  createdAt?: unknown;
}

const str = (value: unknown): string | null =>
  typeof value === "string" && value ? value : null;

const num = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

/** "visa" / "4242" → "Visa ···· 4242"; falls back to the method, then "Card". */
function methodOf(raw: RawTransaction): string {
  const brand = str(raw.card?.brand);
  const last4 = str(raw.card?.last4);

  if (brand || last4) {
    const label = brand
      ? brand.charAt(0).toUpperCase() + brand.slice(1)
      : "Card";
    return last4 ? `${label} ···· ${last4}` : label;
  }

  const method = str(raw.paymentMethod);
  return method ? method.charAt(0).toUpperCase() + method.slice(1) : "Card";
}

/** Trust nothing off the wire; a row missing its id or type is dropped. */
export function toTransactions(data: unknown): Transaction[] {
  if (!Array.isArray(data)) return [];

  return (data as RawTransaction[]).flatMap((raw): Transaction[] => {
    const id = str(raw._id);
    const kind =
      raw.type === "refund"
        ? "refund"
        : raw.type === "payment"
          ? "payment"
          : null;
    if (!id || !kind) return [];

    const orderNumber = str(raw.orderNumber);
    const amount = num(raw.amount);

    return [
      {
        id,
        date:
          str(raw.processedAt) ??
          str(raw.createdAt) ??
          new Date(0).toISOString(),
        kind,
        description:
          kind === "refund"
            ? `Refund${orderNumber ? ` · ${orderNumber}` : ""}`
            : `Order${orderNumber ? ` ${orderNumber}` : ""}`,
        orderId: str(raw.orderId),
        orderNumber,
        method: methodOf(raw),
        // The API sends both as positive; the statement signs money coming back.
        amount: kind === "refund" ? -amount : amount,
        status:
          raw.status === "succeeded"
            ? "completed"
            : raw.status === "failed"
              ? "failed"
              : "pending",
        failureMessage: str(raw.failureMessage),
      },
    ];
  });
}

export function toSummary(data: unknown): TransactionsSummary {
  if (typeof data !== "object" || data === null) return EMPTY_SUMMARY;
  const raw = data as Record<string, unknown>;

  return {
    totalPaid: num(raw.totalPaid),
    thisMonth: num(raw.thisMonth),
    refunded: num(raw.refunded),
    paidOrders: num(raw.paidOrders),
    currency: str(raw.currency) ?? "usd",
  };
}
