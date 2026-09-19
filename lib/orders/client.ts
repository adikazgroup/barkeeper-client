"use client";

import type { ApiMeta } from "@/lib/api";
import type { Cart } from "@/lib/cart/types";

import type {
  CheckoutSession,
  Order,
  OrderInput,
  OrderQuote,
  SkippedLine,
} from "./types";

/**
 * The orders API, as the browser sees it.
 *
 * Every call goes to this app's own `/api/orders/*`, which attaches the bearer
 * on the server — nothing here ever holds a token. There is no store: unlike
 * the cart, an order is not a thing every screen has an opinion about, so each
 * page fetches what it needs and keeps it in its own state.
 *
 * All eight answer in the same shape, `ok` plus the backend's message, because
 * the message is the useful part of a refusal and every caller shows it.
 */

export interface Answer<T> {
  ok: boolean;
  /** The backend's words — a refusal worth reading, or a confirmation. */
  message: string;
  data: T | null;
}

const OFFLINE = "Could not reach the kitchen. Check your connection.";

async function call<T>(
  path: string,
  init?: RequestInit,
  /** Pulls the useful part out of a 200 body. */
  pick: (payload: Record<string, unknown>) => T | null = (payload) =>
    payload as T,
): Promise<Answer<T>> {
  let response: Response;

  try {
    response = await fetch(`/api/orders${path}`, {
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

/** Price the docket as placing it would, without creating anything. */
export const quoteOrder = (input: OrderInput) =>
  call<OrderQuote>(
    "/quote",
    { method: "POST", body: JSON.stringify(input) },
    (payload) => (payload.quote as OrderQuote) ?? null,
  );

/**
 * Create the order and its Stripe session.
 *
 * `checkout` can be absent even on success, so a caller sends the customer on
 * only when there is somewhere to send them.
 */
export const placeOrder = (input: OrderInput) =>
  call<{ order: Order; checkout: CheckoutSession | null }>(
    "",
    { method: "POST", body: JSON.stringify(input) },
    (payload) =>
      payload.order
        ? {
            order: payload.order as Order,
            checkout: (payload.checkout as CheckoutSession) ?? null,
          }
        : null,
  );

export interface OrdersQuery {
  page?: number;
  limit?: number;
  status?: string;
}

/** The account's orders, newest first. */
export const fetchMyOrders = ({ page, limit, status }: OrdersQuery = {}) => {
  const query = new URLSearchParams();
  if (page) query.set("page", String(page));
  if (limit) query.set("limit", String(limit));
  if (status) query.set("status", status);

  const search = query.toString();

  return call<{ orders: Order[]; meta: ApiMeta | null }>(
    search ? `?${search}` : "",
    undefined,
    (payload) => ({
      orders: Array.isArray(payload.orders) ? (payload.orders as Order[]) : [],
      meta: (payload.meta as ApiMeta) ?? null,
    }),
  );
};

/** One order with its history — the read a tracking screen polls. */
export const fetchMyOrder = (id: string) =>
  call<Order>(`/${id}`, undefined, (payload) => (payload.order as Order) ?? null);

export const cancelMyOrder = (id: string, reason: string) =>
  call<Order>(
    `/${id}/cancel`,
    { method: "PATCH", body: JSON.stringify({ reason }) },
    (payload) => (payload.order as Order) ?? null,
  );

/** Ask Stripe directly, for when the webhook is late. */
export const syncMyPayment = (id: string) =>
  call<Order>(`/${id}/sync-payment`, { method: "POST" }, (payload) =>
    (payload.order as Order) ?? null,
  );

/** Another go at paying. A `null` checkout means it had been paid already. */
export const retryMyPayment = (id: string) =>
  call<{ order: Order; checkout: CheckoutSession | null }>(
    `/${id}/retry-payment`,
    { method: "POST" },
    (payload) =>
      payload.order
        ? {
            order: payload.order as Order,
            checkout: (payload.checkout as CheckoutSession) ?? null,
          }
        : null,
  );

/** Copy a past order's lines back into the cart. */
export const reorder = (id: string) =>
  call<{ cart: Cart; added: number; skipped: SkippedLine[] }>(
    `/${id}/reorder`,
    { method: "POST" },
    (payload) => ({
      cart: payload.cart as Cart,
      added: typeof payload.added === "number" ? payload.added : 0,
      skipped: Array.isArray(payload.skipped)
        ? (payload.skipped as SkippedLine[])
        : [],
    }),
  );
