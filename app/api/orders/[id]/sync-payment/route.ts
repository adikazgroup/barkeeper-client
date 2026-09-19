import { NextResponse, type NextRequest } from "next/server";

import { orderError, orderFetch } from "@/lib/orders/server";
import { toOrder } from "@/lib/orders/types";

interface Context {
  params: Promise<{ id: string }>;
}

/**
 * `POST /orders/my/:id/sync-payment` — ask Stripe directly what happened.
 *
 * The webhook is the real record; this is for the moment the customer lands
 * back on the success page a second after paying, when the webhook may not have
 * arrived yet. It marks the order paid, or cancelled if the checkout expired,
 * so the page can say something true rather than "pending" to somebody holding
 * a receipt.
 */
export async function POST(_request: NextRequest, { params }: Context) {
  const { id } = await params;

  const result = await orderFetch(`/my/${id}/sync-payment`, {
    method: "POST",
  });

  if (!result.ok) return orderError(result);

  const order = toOrder(result.data);

  if (!order) {
    return NextResponse.json(
      { message: "The payment could not be checked." },
      { status: 502 },
    );
  }

  return NextResponse.json(
    { order, message: result.message },
    { status: 200 },
  );
}
