import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/auth";
import { BACKEND_URL } from "@/lib/auth/api";
import { toSummary, toTransactions } from "@/lib/transactions/types";

/**
 * `GET /transactions/my` — the signed-in customer's payments and refunds,
 * newest first, with the account summary alongside.
 *
 * Same BFF arrangement as the cart and orders: the bearer token lives in the
 * NextAuth cookie, so it is attached here on the server and never reaches the
 * browser. `type`, `page` and `limit` are passed through for the backend to
 * judge.
 */
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.accessToken || session.error) {
    return NextResponse.json(
      { message: "Sign in to see your payments." },
      { status: 401 },
    );
  }

  const incoming = request.nextUrl.searchParams;
  const query = new URLSearchParams();
  for (const key of ["type", "page", "limit"]) {
    const value = incoming.get(key);
    if (value) query.set(key, value);
  }

  let response: Response;
  try {
    response = await fetch(
      `${BACKEND_URL}/transactions/my${query.size ? `?${query}` : ""}`,
      {
        headers: { Authorization: `Bearer ${session.accessToken}` },
        // Money moves; a statement is never served from a cache.
        cache: "no-store",
      },
    );
  } catch (error) {
    console.error("Transactions request failed:", error);
    return NextResponse.json(
      { message: "Could not reach the kitchen. Check your connection." },
      { status: 503 },
    );
  }

  const payload = (await response.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
    meta?: unknown;
    data?: { summary?: unknown; transactions?: unknown } | null;
  } | null;

  if (!response.ok || !payload?.success) {
    return NextResponse.json(
      { message: payload?.message || "Your payments could not be read." },
      { status: response.status || 502 },
    );
  }

  return NextResponse.json({
    summary: toSummary(payload.data?.summary),
    transactions: toTransactions(payload.data?.transactions),
    meta: payload.meta ?? null,
  });
}
