"use client";

import type { ApiMeta } from "@/lib/api";

import type {
  PendingReviewOrder,
  Review,
  ReviewEdit,
  ReviewInput,
} from "./types";

/**
 * The reviews API, as the browser sees it.
 *
 * Every call goes to this app's own `/api/reviews/*`, which attaches the
 * bearer on the server. No store: a review belongs to one order and is read by
 * whichever screen is showing that order, so each keeps its own.
 *
 * All five answer in the same shape as the orders client, `ok` plus the
 * backend's message, because the message is the useful part of a refusal —
 * "already reviewed", "not collected yet", "not your order".
 */

export interface Answer<T> {
  ok: boolean;
  message: string;
  data: T | null;
}

const OFFLINE = "Could not reach the kitchen. Check your connection.";

async function call<T>(
  path: string,
  init?: RequestInit,
  pick: (payload: Record<string, unknown>) => T | null = (payload) =>
    payload as T,
): Promise<Answer<T>> {
  let response: Response;

  try {
    response = await fetch(`/api/reviews${path}`, {
      ...init,
      headers: {
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    return { ok: false, message: OFFLINE, data: null };
  }

  const payload = (await response.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;

  const message = typeof payload?.message === "string" ? payload.message : "";

  if (!response.ok) {
    return {
      ok: false,
      message: message || "Something went wrong.",
      data: null,
    };
  }

  return { ok: true, message, data: payload ? pick(payload) : null };
}

/** Write a review for a collected order. Refused on a second attempt. */
export const writeReview = (input: ReviewInput) =>
  call<Review>(
    "",
    { method: "POST", body: JSON.stringify(input) },
    (payload) => (payload.review as Review) ?? null,
  );

export interface ReviewsQuery {
  page?: number;
  limit?: number;
  orderId?: string;
  rating?: number;
}

/** The account's reviews, or — with `orderId` — the one on a single order. */
export const fetchMyReviews = ({
  page,
  limit,
  orderId,
  rating,
}: ReviewsQuery = {}) => {
  const query = new URLSearchParams();
  if (page) query.set("page", String(page));
  if (limit) query.set("limit", String(limit));
  if (orderId) query.set("orderId", orderId);
  if (rating) query.set("rating", String(rating));

  const search = query.toString();

  return call<{ reviews: Review[]; meta: ApiMeta | null }>(
    search ? `?${search}` : "",
    undefined,
    (payload) => ({
      reviews: Array.isArray(payload.reviews)
        ? (payload.reviews as Review[])
        : [],
      meta: (payload.meta as ApiMeta) ?? null,
    }),
  );
};

/**
 * Has this order been reviewed?
 *
 * The narrow question the prompt and the order screens actually ask, so they
 * do not each have to know that it is a filtered list underneath.
 */
export async function fetchReviewForOrder(
  orderId: string,
): Promise<Answer<Review | null>> {
  const answer = await fetchMyReviews({ orderId, limit: 1 });

  return {
    ok: answer.ok,
    message: answer.message,
    data: answer.data?.reviews[0] ?? null,
  };
}

/** Collected orders with no review yet — at most twenty. */
export const fetchPendingReviews = () =>
  call<PendingReviewOrder[]>("/pending", undefined, (payload) =>
    Array.isArray(payload.orders)
      ? (payload.orders as PendingReviewOrder[])
      : [],
  );

export const editMyReview = (id: string, patch: ReviewEdit) =>
  call<Review>(
    `/${id}`,
    { method: "PATCH", body: JSON.stringify(patch) },
    (payload) => (payload.review as Review) ?? null,
  );

export const deleteMyReview = (id: string) =>
  call<Review | null>(`/${id}`, { method: "DELETE" }, (payload) =>
    (payload.review as Review) ?? null,
  );
