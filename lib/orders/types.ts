import type { ApiImage } from "@/lib/types";
import type { Cart } from "@/lib/cart/types";

/**
 * Orders, as the backend keeps them.
 *
 * The docket becomes an order in three moves and each one answers with a
 * different slice of the same record:
 *
 *  - `/orders/quote` prices the cart exactly as placing it would — tip, coupon,
 *    tax, pickup time — and creates nothing. It is what the checkout screen
 *    shows, re-asked every time the customer changes one of those four.
 *  - `/orders` creates the order `pending` and a Stripe session with it. The
 *    only thing to do with the answer is send the customer to `checkoutUrl`.
 *  - everything under `/orders/my/*` reads or nudges an order that exists.
 *
 * `status` and `payment.status` are the backend's words. They are compared
 * where a decision hangs on them and otherwise printed, so a status nobody here
 * has heard of shows up as itself rather than as a blank.
 */

/** Where an order can be. The backend's list, in the order it walks it. */
export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** The stops a docket passes on its way to the counter — `cancelled` is not one. */
export const ORDER_PROGRESS: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
];

export interface OrderCustomer {
  name?: string;
  email?: string;
  phone?: string;
}

/** One chosen option on an ordered line, priced as it was at the time. */
export interface OrderModifier {
  groupId: string;
  groupName: string;
  optionName: string;
  unitPrice: number;
  quantity: number;
  freeQuantity?: number;
  lineTotal: number;
}

/**
 * One line of an order.
 *
 * Close to a `CartItem` but not the same shape: an order line has no `_id`,
 * because nothing can be edited once the order exists, and no `issues`, because
 * whatever was wrong was settled before it was taken.
 */
export interface OrderItem {
  foodId: string;
  name: string;
  slug?: string;
  image?: ApiImage | null;
  variantLabel?: string | null;
  basePrice: number;
  modifiers?: OrderModifier[];
  modifiersTotal?: number;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  calories?: number | null;
  specialInstructions?: string | null;
}

/**
 * What it comes to.
 *
 * Every figure here is the kitchen's. Nothing in this app adds tax to a
 * subtotal or takes a coupon off a total — a quote is asked for instead, which
 * is the whole reason `/orders/quote` exists.
 */
export interface OrderPricing {
  subtotal: number;
  discount: number;
  couponCode?: string | null;
  taxPercentage: number;
  tax: number;
  tipPercentage: number;
  tip: number;
  total: number;
  currency?: string | null;
}

/** When the food is to be collected. */
export interface PickupDetails {
  /** `asap` or `scheduled`. */
  scheduleType?: string | null;
  slotStartAt?: string | null;
  slotEndAt?: string | null;
  estimatedReadyAt?: string | null;
  timezone?: string | null;
  /** The kitchen's own phrasing of the time — printed rather than re-worded. */
  label?: string | null;
}

export interface OrderPayment {
  /** `unpaid`, `paid`, `refunded`… the backend's word. */
  status?: string | null;
  provider?: string | null;
  checkoutSessionId?: string | null;
  checkoutExpiresAt?: string | null;
  paymentIntentId?: string | null;
  chargeId?: string | null;
  method?: string | null;
  paidAt?: string | null;
  refundedAmount?: number | null;
  refundedAt?: string | null;
}

/** One move in the order's history, newest last. */
export interface OrderStatusEvent {
  status: string;
  note?: string | null;
  changedByRole?: string | null;
  changedBy?: string | null;
  changedAt?: string | null;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string;
  customer?: OrderCustomer;
  orderType?: string | null;
  items: OrderItem[];
  pickupDetails?: PickupDetails | null;
  pricing: OrderPricing;
  payment?: OrderPayment | null;
  status: string;
  statusHistory?: OrderStatusEvent[];
  customerNote?: string | null;
  adminNote?: string | null;
  cancelReason?: string | null;
  cancelledByRole?: string | null;
  cancelledAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

/** The Stripe session to send the customer to. No key is needed on this side. */
export interface CheckoutSession {
  checkoutUrl: string;
  checkoutSessionId?: string;
  expiresAt?: string | null;
  amount?: number;
  currency?: string | null;
}

/** A price for the cart as it would be ordered. Creates nothing. */
export interface OrderQuote {
  items: OrderItem[];
  pricing: OrderPricing;
  pickupDetails?: PickupDetails | null;
  minimumOrderAmount?: number | null;
  isOrderable: boolean;
  issues: { code: string; message: string }[];
}

/** A line a past order had that the kitchen can no longer put back in the cart. */
export interface SkippedLine {
  name: string;
  reason: string;
}

export interface ReorderResult {
  cart: Cart;
  added: number;
  skipped: SkippedLine[];
}

/**
 * What the checkout screen sends.
 *
 * Quote and place take the same body, which is the point: the figure on screen
 * was produced by the very fields that then create the order. A tip goes as a
 * percentage *or* an amount — never both, which the backend refuses.
 */
export interface OrderInput {
  scheduleType?: "asap" | "scheduled";
  /** ISO start of a slot. Required when `scheduled`. */
  slotStartAt?: string;
  couponCode?: string;
  tipPercentage?: number;
  tipAmount?: number;
  customerNote?: string;
  phone?: string;
}

/**
 * Trust nothing off the wire.
 *
 * Same reasoning as `toCart`: these figures are printed as money, so a missing
 * `total` must read as `0`, not as `undefined` leaking into `toFixed`.
 */
const money = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

export function toPricing(data: unknown): OrderPricing {
  const raw = (typeof data === "object" && data !== null ? data : {}) as
    Partial<OrderPricing>;

  return {
    subtotal: money(raw.subtotal),
    discount: money(raw.discount),
    couponCode: raw.couponCode ?? null,
    taxPercentage: money(raw.taxPercentage),
    tax: money(raw.tax),
    tipPercentage: money(raw.tipPercentage),
    tip: money(raw.tip),
    total: money(raw.total),
    currency: raw.currency ?? null,
  };
}

const toItems = (data: unknown): OrderItem[] =>
  Array.isArray(data)
    ? data.filter(
        (entry): entry is OrderItem =>
          typeof entry === "object" && entry !== null,
      )
    : [];

export function toOrder(data: unknown): Order | null {
  if (typeof data !== "object" || data === null) return null;

  const raw = data as Partial<Order>;
  if (typeof raw._id !== "string" || !raw._id) return null;

  return {
    ...raw,
    _id: raw._id,
    orderNumber: typeof raw.orderNumber === "string" ? raw.orderNumber : "",
    items: toItems(raw.items),
    pricing: toPricing(raw.pricing),
    status: typeof raw.status === "string" ? raw.status : "pending",
    statusHistory: Array.isArray(raw.statusHistory) ? raw.statusHistory : [],
  };
}

export function toOrders(data: unknown): Order[] {
  if (!Array.isArray(data)) return [];

  return data.flatMap((entry) => {
    const order = toOrder(entry);
    return order ? [order] : [];
  });
}

export function toQuote(data: unknown): OrderQuote | null {
  if (typeof data !== "object" || data === null) return null;

  const raw = data as Partial<OrderQuote>;

  return {
    items: toItems(raw.items),
    pricing: toPricing(raw.pricing),
    pickupDetails: raw.pickupDetails ?? null,
    minimumOrderAmount:
      typeof raw.minimumOrderAmount === "number"
        ? raw.minimumOrderAmount
        : null,
    // Only an explicit `false` blocks the order, as the cart does it.
    isOrderable: raw.isOrderable !== false,
    issues: Array.isArray(raw.issues) ? raw.issues : [],
  };
}

/**
 * The Stripe session, or `null`.
 *
 * `null` is meaningful on a retry: it is how the backend says the order had
 * actually been paid all along, so there is nothing to send the customer to.
 */
export function toCheckout(data: unknown): CheckoutSession | null {
  if (typeof data !== "object" || data === null) return null;

  const raw = data as Partial<CheckoutSession>;
  if (typeof raw.checkoutUrl !== "string" || !raw.checkoutUrl) return null;

  return {
    checkoutUrl: raw.checkoutUrl,
    checkoutSessionId: raw.checkoutSessionId,
    expiresAt: raw.expiresAt ?? null,
    amount: money(raw.amount),
    currency: raw.currency ?? null,
  };
}

/** True while the customer can still call the order off themselves. */
export function isCancellable(order: Order): boolean {
  return order.status === "pending" && order.payment?.status !== "paid";
}

/** True while there is money still owed on it. */
export function isUnpaid(order: Order): boolean {
  return order.payment?.status !== "paid" && order.status !== "cancelled";
}
