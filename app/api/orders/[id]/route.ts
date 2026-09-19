import { NextResponse, type NextRequest } from "next/server";

import { orderError, orderFetch } from "@/lib/orders/server";
import { toOrder } from "@/lib/orders/types";

interface Context {
  params: Promise<{ id: string }>;
}

/**
 * `GET /orders/my/:id` — one order with its status history.
 *
 * This is the tracking read, so the page behind it polls rather than waiting
 * for anything to be pushed at it.
 */
export async function GET(_request: NextRequest, { params }: Context) {
  const { id } = await params;

  const result = await orderFetch(`/my/${id}`);

  if (!result.ok) return orderError(result);

  const order = toOrder(result.data);

  if (!order) {
    return NextResponse.json({ message: "No such order." }, { status: 404 });
  }

  return NextResponse.json({ order }, { status: 200 });
}
