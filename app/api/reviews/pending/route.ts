import { NextResponse } from "next/server";

import { reviewError, reviewFetch } from "@/lib/reviews/server";
import { toPendingOrders } from "@/lib/reviews/types";

/**
 * `GET /reviews/my/pending` — collected orders with no review on them yet.
 *
 * Up to twenty, and it is the only honest source for a "rate your order"
 * prompt: working the same list out from the orders page would mean reading
 * every order and every review to find the gap between them.
 */
export async function GET() {
  const result = await reviewFetch("/my/pending");

  if (!result.ok) return reviewError(result);

  return NextResponse.json(
    { orders: toPendingOrders(result.data) },
    { status: 200 },
  );
}
