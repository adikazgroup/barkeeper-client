import { auth } from "@/auth";
import { BACKEND_URL } from "@/lib/auth/api";

/**
 * The coupons' half of the BFF.
 *
 * Both coupon endpoints are `[User]` routes, and the access token lives in the
 * NextAuth cookie rather than in the browser — so the same arrangement the cart
 * uses applies here: the browser calls our `/api/coupons/*`, this attaches the
 * bearer on the server, and the backend's own answer travels back.
 *
 * Unlike the cart, the two routes answer with different shapes — a list and a
 * quote — so this returns the raw `data` and each route shapes it.
 */

export interface CouponCallResult {
  data: unknown;
  ok: boolean;
  status: number;
  message: string;
}

export async function couponFetch(
  path: string,
  { method = "GET", body }: { method?: "GET" | "POST"; body?: unknown } = {},
): Promise<CouponCallResult> {
  const session = await auth();

  if (!session?.accessToken || session.error) {
    return {
      data: null,
      ok: false,
      status: 401,
      message: "Sign in to use a code.",
    };
  }

  let response: Response;

  try {
    response = await fetch(`${BACKEND_URL}/coupons${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      // A code expires, runs out, or stops covering the docket the moment a
      // line changes. None of that survives a cache.
      cache: "no-store",
    });
  } catch (error) {
    console.error(`Coupon request failed (${method} ${path}):`, error);
    return {
      data: null,
      ok: false,
      status: 503,
      message: "Could not reach the kitchen. Check your connection.",
    };
  }

  const payload = (await response.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
    data?: unknown;
  } | null;

  if (!response.ok || !payload?.success) {
    // The refusal is the useful part here — expired, minimum not met, not on
    // your account, nothing covered — so the backend's wording is what the
    // field prints rather than one generic line for four different problems.
    return {
      data: null,
      ok: false,
      status: response.status,
      message: payload?.message || "That code could not be used.",
    };
  }

  return {
    data: payload.data ?? null,
    ok: true,
    status: 200,
    message: payload.message || "",
  };
}
