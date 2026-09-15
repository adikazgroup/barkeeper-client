import { cartFetch, cartResponse } from "@/lib/cart/server";

/**
 * The docket itself.
 *
 * `GET` is `GET /carts` — the backend creates one empty on first touch, so
 * this never 404s for a signed-in customer.
 *
 * `DELETE` is `DELETE /carts`, which empties it.
 */

export async function GET() {
  return cartResponse(await cartFetch(""));
}

export async function DELETE() {
  return cartResponse(await cartFetch("", { method: "DELETE" }));
}
