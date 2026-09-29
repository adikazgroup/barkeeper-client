import { wishlistFetch, wishlistResponse } from "@/lib/wishlist/server";

/** `GET /wishlists/ids` — just the ids, which is all a heart needs. */
export async function GET() {
  return wishlistResponse(await wishlistFetch("/ids"));
}
