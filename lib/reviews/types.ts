import type { ApiImage } from "@/lib/types";

/**
 * Reviews, as the backend keeps them.
 *
 * A review hangs off an order, not off a dish: it can only be written for the
 * customer's own order, only once that order is `completed`, and only once —
 * a second attempt is refused with a 409. That single rule is what shapes the
 * whole screen. There is no "write a review" button on the board, because
 * there is nothing to attach one to until an order has been collected; the
 * prompt lives with the orders instead.
 *
 * `foodIds` is the backend's doing: it spreads the order's rating across the
 * dishes that were on it, which is where a dish's own score comes from.
 */

/** The restaurant's answer, when it has made one. */
export interface AdminReply {
  message: string;
  repliedAt?: string | null;
}

export interface Review {
  _id: string;
  userId?: string;
  orderId: string;
  orderNumber?: string;
  /** How the customer is named on the public list. The backend decides it. */
  displayName?: string | null;
  foodIds?: string[];
  /** 1–5. */
  rating: number;
  comment?: string | null;
  /** `published`, `pending`… the backend's word, printed rather than mapped. */
  status?: string | null;
  adminReply?: AdminReply | null;
  /** True once it has been changed, which the backend marks on every edit. */
  isEdited?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

/** One line of an order that is waiting to be rated. */
export interface PendingReviewItem {
  foodId: string;
  name: string;
  image?: ApiImage | null;
  quantity: number;
}

/**
 * A completed order with no review on it yet.
 *
 * A thin slice of the order — just enough to recognise which meal is being
 * asked about — so the prompt does not have to read the orders list as well.
 */
export interface PendingReviewOrder {
  _id: string;
  orderNumber?: string;
  items: PendingReviewItem[];
  pricing?: { total?: number } | null;
  pickupDetails?: { label?: string | null } | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

/** What the customer writes. */
export interface ReviewInput {
  orderId: string;
  rating: number;
  comment?: string;
}

/** What an edit changes. Either field alone is a valid change. */
export interface ReviewEdit {
  rating?: number;
  comment?: string;
}

/** The backend's own bounds, said out loud so the form can hold to them. */
export const MIN_RATING = 1;
export const MAX_RATING = 5;
export const MAX_COMMENT_LENGTH = 1000;

/**
 * Trust nothing off the wire.
 *
 * A rating drives a row of stars, so one that arrived as `undefined` would
 * render as an empty row that looks like a deliberate nought — a score nobody
 * gave. It is clamped into the range the backend itself enforces.
 */
export function toReview(data: unknown): Review | null {
  if (typeof data !== "object" || data === null) return null;

  const raw = data as Partial<Review>;
  if (typeof raw._id !== "string" || !raw._id) return null;

  const rating =
    typeof raw.rating === "number" && Number.isFinite(raw.rating)
      ? Math.min(MAX_RATING, Math.max(MIN_RATING, Math.round(raw.rating)))
      : MIN_RATING;

  return {
    ...raw,
    _id: raw._id,
    orderId: typeof raw.orderId === "string" ? raw.orderId : "",
    rating,
    foodIds: Array.isArray(raw.foodIds) ? raw.foodIds : [],
    adminReply: raw.adminReply?.message ? raw.adminReply : null,
  };
}

export function toReviews(data: unknown): Review[] {
  if (!Array.isArray(data)) return [];

  return data.flatMap((entry) => {
    const review = toReview(entry);
    return review ? [review] : [];
  });
}

export function toPendingOrders(data: unknown): PendingReviewOrder[] {
  if (!Array.isArray(data)) return [];

  return data.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return [];

    const raw = entry as Partial<PendingReviewOrder>;
    if (typeof raw._id !== "string" || !raw._id) return [];

    return [
      {
        ...raw,
        _id: raw._id,
        items: Array.isArray(raw.items) ? raw.items : [],
      },
    ];
  });
}
