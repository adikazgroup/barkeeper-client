import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { BACKEND_URL } from "@/lib/auth/api";
import type { ApiMeta } from "@/lib/api";

/**
 * The reviews' half of the BFF.
 *
 * The same arrangement the cart, the coupons and the orders use: every
 * `/reviews*` route wants a bearer, the token lives in the NextAuth cookie and
 * never reaches the browser, so the browser calls our own `/api/reviews/*` and
 * this attaches it on the server.
 *
 * The refusals here are worth more than most: "that order is not yours", "it
 * has not been collected yet", "you have already reviewed this one" are three
 * different 4xx answers to what looks like the same click, and only the
 * backend can tell them apart. So its wording travels back untouched.
 */

export interface ReviewCallResult {
  data: unknown;
  meta: ApiMeta | null;
  ok: boolean;
  status: number;
  message: string;
}

export async function reviewFetch(
  path: string,
  {
    method = "GET",
    body,
  }: { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown } = {},
): Promise<ReviewCallResult> {
  const session = await auth();

  if (!session?.accessToken || session.error) {
    return {
      data: null,
      meta: null,
      ok: false,
      status: 401,
      message: "Sign in to leave a review.",
    };
  }

  let response: Response;

  try {
    response = await fetch(`${BACKEND_URL}/reviews${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      // Whether an order has been reviewed changes the moment the customer
      // reviews it, so none of this is ever served from a cache.
      cache: "no-store",
    });
  } catch (error) {
    console.error(`Review request failed (${method} ${path}):`, error);
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
    return {
      data: null,
      meta: null,
      ok: false,
      status: response.status,
      message: payload?.message || "That could not be saved. Please try again.",
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

/** The refusal, passed straight through. */
export function reviewError(result: ReviewCallResult) {
  return NextResponse.json(
    { message: result.message },
    { status: result.status },
  );
}
