import { NextResponse, type NextRequest } from "next/server";

import { readOrderInput } from "@/lib/orders/input";
import { orderError, orderFetch } from "@/lib/orders/server";
import { toCheckout, toOrder, toOrders } from "@/lib/orders/types";

/**
 * The customer's orders, and the act of creating one.
 */

/**
 * `GET /orders/my` — newest first, paged.
 *
 * `page`, `limit` and `status` are passed through rather than interpreted: the
 * backend owns what a valid status is, and a filter it does not recognise is
 * its refusal to word, not ours.
 */
export async function GET(request: NextRequest) {
  const incoming = request.nextUrl.searchParams;
  const query = new URLSearchParams();

  for (const key of ["page", "limit", "status"]) {
    const value = incoming.get(key);
    if (value) query.set(key, value);
  }

  const search = query.toString();
  const result = await orderFetch(`/my${search ? `?${search}` : ""}`);

  if (!result.ok) return orderError(result);

  return NextResponse.json(
    { orders: toOrders(result.data), meta: result.meta },
    { status: 200 },
  );
}

/**
 * `POST /orders` — create the order and its Stripe session.
 *
 * The only thing to do with the answer is send the customer to `checkoutUrl`.
 * The order exists `pending` from this moment whether they pay or not, and the
 * cart is emptied by the backend only once payment succeeds — so nothing here
 * clears anything on the way out.
 */
export async function POST(request: NextRequest) {
  const { input, error } = readOrderInput(
    await request.json().catch(() => null),
  );

  if (error) return NextResponse.json({ message: error }, { status: 400 });

  const result = await orderFetch("", { method: "POST", body: input });

  if (!result.ok) return orderError(result);

  const payload = (
    typeof result.data === "object" && result.data !== null ? result.data : {}
  ) as { order?: unknown; checkout?: unknown };

  const order = toOrder(payload.order);

  if (!order) {
    return NextResponse.json(
      { message: "The order could not be started." },
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
