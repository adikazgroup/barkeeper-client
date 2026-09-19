import { NextResponse, type NextRequest } from "next/server";

import { orderError, orderFetch } from "@/lib/orders/server";
import { toCheckout, toOrder } from "@/lib/orders/types";

interface Context {
  params: Promise<{ id: string }>;
}

/**
 * `POST /orders/my/:id/retry-payment` — another go at paying.
 *
 * Answers with the open Stripe link, or a fresh one if the last closed unpaid.
 * A `checkout` of `null` is not a failure: it is how the backend says the order
 * had in fact been paid, so the caller shows the order rather than a link.
 *
 * It is refused once the order is no longer pending — an expired checkout
 * cancels it — once the pickup time has passed, or while ordering is paused.
 */
export async function POST(_request: NextRequest, { params }: Context) {
  const { id } = await params;

  const result = await orderFetch(`/my/${id}/retry-payment`, {
    method: "POST",
  });

  if (!result.ok) return orderError(result);

  const payload = (
    typeof result.data === "object" && result.data !== null ? result.data : {}
  ) as { order?: unknown; checkout?: unknown };

  const order = toOrder(payload.order);

  if (!order) {
    return NextResponse.json(
      { message: "The payment could not be restarted." },
      { status: 502 },
    );
  }

  return NextResponse.json(
    {
      order,
      checkout: toCheckout(payload.checkout),
      message: result.message,
    },
    { status: 200 },
  );
}
