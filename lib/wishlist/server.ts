import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { BACKEND_URL } from "@/lib/auth/api";

/**
 * The wishlist's half of the BFF — the same arrangement as `lib/cart/server`.
 *
 * Every `/wishlists` endpoint wants the customer's bearer token, which lives in
 * the NextAuth cookie and never reaches the browser. So the browser calls this
 * app's own `/api/wishlist/*`, this attaches the token on the server, and the
 * backend's answer goes straight back.
 */

export interface WishlistCallResult {
  data: unknown;
  ok: boolean;
  status: number;
  message: string;
}

export async function wishlistFetch(
  path: string,
  {
    method = "GET",
    body,
  }: { method?: "GET" | "POST" | "DELETE"; body?: unknown } = {},
): Promise<WishlistCallResult> {
  const session = await auth();

  if (!session?.accessToken || session.error) {
    return {
      data: null,
      ok: false,
      status: 401,
      message: "Sign in to save dishes to your wishlist.",
    };
  }

  let response: Response;

  try {
    response = await fetch(`${BACKEND_URL}/wishlists${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      // One person's list, changed by their own taps — never served stale.
      cache: "no-store",
    });
  } catch (error) {
    console.error(`Wishlist request failed (${method} ${path}):`, error);
    return {
      data: null,
      ok: false,
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
    return {
      data: null,
      ok: false,
      status: response.status,
      message: payload?.message || "That did not go through. Please try again.",
    };
  }

  return {
    data: payload.data ?? null,
    ok: true,
    status: 200,
    message: payload.message || "",
  };
}

/** One answer shape for every route, so the client parses one thing. */
export function wishlistResponse(result: WishlistCallResult) {
  return NextResponse.json(
    { data: result.data, message: result.message },
    { status: result.ok ? 200 : result.status },
  );
}
