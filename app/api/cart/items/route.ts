import { NextResponse, type NextRequest } from "next/server";

import { cartFetch, cartResponse } from "@/lib/cart/server";
import type { AddItemInput } from "@/lib/cart/types";

/**
 * `POST /carts/items` — add a line.
 *
 * The backend merges a dish built the same way into the line that is already
 * there, so nothing here has to look for a match first.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as AddItemInput | null;

  if (!body?.foodId) {
    return NextResponse.json(
      { message: "No dish was named." },
      { status: 400 },
    );
  }

  return cartResponse(await cartFetch("/items", { method: "POST", body }));
}
