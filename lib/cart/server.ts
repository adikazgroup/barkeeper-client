import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { BACKEND_URL } from "@/lib/auth/api";

import { toCart, type Cart } from "./types";

/**
 * The cart's half of the BFF.
 *
 * Every cart endpoint is a `[User]` route: it wants a bearer token. In this
 * app the access token lives inside the NextAuth cookie and is never handed to
 * the browser — `app/api/logout` and `app/api/account/*` exist for the same
 * reason. So the browser calls our own `/api/cart/*`, this runs on the server,
 * attaches the token, and passes the backend's answer straight back.
 *
 * The five routes differ only in method, path and body, so the request and the
 * error handling live here once.
 */

export interface CartCallResult {
  cart: Cart | null;
  status: number;
  message: string;
}

/**
 * Call one cart endpoint as the signed-in customer.
 *
 * Returns `401` with no cart when there is no usable session, which is how the
 * client store tells "signed out" from "empty" — an empty cart is a `200` with
 * no lines in it.
 */
export async function cartFetch(
  path: string,
  {
    method = "GET",
    body,
  }: { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown } = {},
): Promise<CartCallResult> {
  const session = await auth();

  if (!session?.accessToken || session.error) {
    return {
      cart: null,
      status: 401,
      message: "Sign in to start an order.",
    };
  }

  let response: Response;

  try {
    response = await fetch(`${BACKEND_URL}/carts${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      // The docket is priced live — a tier can sell out between two reads —
      // so none of this is ever served from a cache.
      cache: "no-store",
    });
  } catch (error) {
    console.error(`Cart request failed (${method} ${path}):`, error);
    return {
      cart: null,
      status: 503,
      message: "Could not reach the kitchen. Check your connection.",
    };
  }

  // A proxy or gateway can answer with HTML, which would blow up `.json()`.
  const payload = (await response.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
    data?: unknown;
  } | null;

  if (!response.ok || !payload?.success) {
    // The backend refuses an add with a reason worth printing — a missing
    // option group, a sold-out tier, a dish outside its window — so its own
    // message is what travels back rather than a generic failure line.
    return {
      cart: null,
      status: response.status,
      message: payload?.message || "That could not be added. Please try again.",
    };
  }

  return {
    cart: toCart(payload.data),
    status: 200,
    message: payload.message || "",
  };
}

/** One answer shape for all five routes, so the client parses one thing. */
export function cartResponse(result: CartCallResult) {
  if (!result.cart) {
    return NextResponse.json(
      { message: result.message },
      { status: result.status },
    );
  }

  return NextResponse.json(
    { cart: result.cart, message: result.message },
    { status: 200 },
  );
}
