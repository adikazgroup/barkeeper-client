import { NextResponse, type NextRequest } from "next/server";

import { toCart } from "@/lib/cart/types";
import { orderError, orderFetch } from "@/lib/orders/server";
import type { SkippedLine } from "@/lib/orders/types";

interface Context {
  params: Promise<{ id: string }>;
}

/**
 * `POST /orders/my/:id/reorder` — put a past order's lines back in the cart.
 *
 * Anything sold out or off the menu is left behind and named in `skipped`, so
 * the screen can say which plates did not come with rather than let the
 * customer find out at the counter.
 *
 * The answer carries the whole priced cart, which is exactly what the cart
 * store holds — so the caller can drop it straight in without a re-read.
 */
export async function POST(_request: NextRequest, { params }: Context) {
  const { id } = await params;

  const result = await orderFetch(`/my/${id}/reorder`, { method: "POST" });

  if (!result.ok) return orderError(result);

  const payload = (
    typeof result.data === "object" && result.data !== null ? result.data : {}
  ) as { cart?: unknown; added?: unknown; skipped?: unknown };

  return NextResponse.json(
    {
      cart: toCart(payload.cart),
      added: typeof payload.added === "number" ? payload.added : 0,
      skipped: (Array.isArray(payload.skipped)
        ? payload.skipped
        : []) as SkippedLine[],
      message: result.message,
    },
    { status: 200 },
  );
}
