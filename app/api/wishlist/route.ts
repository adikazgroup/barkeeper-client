import { NextResponse, type NextRequest } from "next/server";

import { wishlistFetch, wishlistResponse } from "@/lib/wishlist/server";

/**
 * The wishlist itself.
 *
 * `GET`    is `GET /wishlists` — every saved dish, newest first.
 * `POST`   is `POST /wishlists` — save one; saving it twice is a no-op.
 * `DELETE` is `DELETE /wishlists` — empty the list.
 */

export async function GET() {
  return wishlistResponse(await wishlistFetch(""));
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    foodId?: unknown;
  } | null;

  if (typeof body?.foodId !== "string" || !body.foodId) {
    return NextResponse.json(
      { message: "No dish was named." },
      { status: 400 },
    );
  }

  return wishlistResponse(
    await wishlistFetch("", { method: "POST", body: { foodId: body.foodId } }),
  );
}

export async function DELETE() {
  return wishlistResponse(await wishlistFetch("", { method: "DELETE" }));
}
