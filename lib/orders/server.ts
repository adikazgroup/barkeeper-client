import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { BACKEND_URL } from "@/lib/auth/api";
import type { ApiMeta } from "@/lib/api";

/**
 * The orders' half of the BFF.
 *
 * Same arrangement as the cart and the coupons: every `/orders*` route is a
 * `[User]` route, the access token lives in the NextAuth cookie and never
 * reaches the browser, so the browser calls our own `/api/orders/*` and this
 * attaches the bearer on the server.
 *
 * Orders differ from the cart in that no two endpoints answer with the same
 * shape — a quote, an order, an order plus a Stripe session, a page of orders
 * with `meta`. So this returns the envelope's `data` and `meta` as they came
 * and each route shapes its own.
 */

export interface OrderCallResult {
  data: unknown;
  meta: ApiMeta | null;
  ok: boolean;
  status: number;
  message: string;
}

export async function orderFetch(
  path: string,
  {
    method = "GET",
    body,
  }: { method?: "GET" | "POST" | "PATCH"; body?: unknown } = {},
): Promise<OrderCallResult> {
  const session = await auth();

  if (!session?.accessToken || session.error) {
    return {
      data: null,
      meta: null,
      ok: false,
      status: 401,
      message: "Sign in to place an order.",
    };
  }

  let response: Response;

  try {
    response = await fetch(`${BACKEND_URL}/orders${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      // A price, a slot and a payment status are all live. None of this is
      // ever worth a cached answer.
      cache: "no-store",
    });
  } catch (error) {
    console.error(`Order request failed (${method} ${path}):`, error);
    return {
      data: null,
      meta: null,
      ok: false,
      status: 503,
      message: "Could not reach the kitchen. Check your connection.",
    };
  }

  const payload = (await response.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
    data?: unknown;
    meta?: ApiMeta | null;
  } | null;

  if (!response.ok || !payload?.success) {
    // Every refusal here is worth reading: a minimum not met, a slot gone, a
    // paid order that only the restaurant can now cancel, ordering paused. The
    // backend's own wording travels back rather than one flat failure line.
    return {
      data: null,
      meta: null,
      ok: false,
      status: response.status,
      message: payload?.message || "That could not be done. Please try again.",
    };
  }

  return {
    data: payload.data ?? null,
    meta: payload.meta ?? null,
    ok: true,
    status: 200,
    message: payload.message || "",
  };
}

/** The refusal, passed straight through. Saves every route repeating it. */
export function orderError(result: OrderCallResult) {
  return NextResponse.json(
    { message: result.message },
    { status: result.status },
  );
}
