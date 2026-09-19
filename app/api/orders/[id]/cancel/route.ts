import { NextResponse, type NextRequest } from "next/server";

import { orderError, orderFetch } from "@/lib/orders/server";
import { toOrder } from "@/lib/orders/types";

interface Context {
  params: Promise<{ id: string }>;
}

/**
 * `PATCH /orders/my/:id/cancel` — call it off.
 *
 * Only while it is unpaid and still pending; once money has changed hands it
 * is the restaurant's to cancel. The backend enforces that, and its refusal is
 * what the screen prints — the button is hidden on the same rule, but the two
 * can disagree for as long as a page is left open.
 */
export async function PATCH(request: NextRequest, { params }: Context) {
  const { id } = await params;

  const body = (await request.json().catch(() => null)) as {
    reason?: unknown;
  } | null;

  const reason = typeof body?.reason === "string" ? body.reason.trim() : "";

  const result = await orderFetch(`/my/${id}/cancel`, {
    method: "PATCH",
    body: { reason },
  });

  if (!result.ok) return orderError(result);

  const order = toOrder(result.data);

  if (!order) {
    return NextResponse.json(
      { message: "The order could not be cancelled." },
      { status: 502 },
    );
  }

  return NextResponse.json(
    { order, message: result.message },
    { status: 200 },
  );
}
