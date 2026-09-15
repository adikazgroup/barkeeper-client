import { NextResponse, type NextRequest } from "next/server";

import { cartFetch, cartResponse } from "@/lib/cart/server";
import type { UpdateItemInput } from "@/lib/cart/types";

/**
 * One line, by its cart `_id` — not the dish's id: the same dish built two
 * ways is two lines, and only this id tells them apart.
 */

interface Context {
  params: Promise<{ itemId: string }>;
}

/**
 * `PATCH /carts/items/:itemId` — the whole line goes back.
 *
 * Options and quantity price each other, so the client sends the line as it
 * should now be rather than the one field that changed.
 */
export async function PATCH(request: NextRequest, { params }: Context) {
  const { itemId } = await params;

  const body = (await request
    .json()
    .catch(() => null)) as UpdateItemInput | null;

  if (!body) {
    return NextResponse.json(
      { message: "Nothing to change." },
      { status: 400 },
    );
  }

  return cartResponse(
    await cartFetch(`/items/${itemId}`, { method: "PATCH", body }),
  );
}

/** `DELETE /carts/items/:itemId` — drop the line. */
export async function DELETE(_request: NextRequest, { params }: Context) {
  const { itemId } = await params;

  return cartResponse(
    await cartFetch(`/items/${itemId}`, { method: "DELETE" }),
  );
}
