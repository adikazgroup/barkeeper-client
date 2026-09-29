import { wishlistFetch, wishlistResponse } from "@/lib/wishlist/server";

/** `DELETE /wishlists/:foodId` — unsave one dish; unsaving nothing is fine. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ foodId: string }> },
) {
  const { foodId } = await params;

  return wishlistResponse(
    await wishlistFetch(`/${encodeURIComponent(foodId)}`, { method: "DELETE" }),
  );
}
