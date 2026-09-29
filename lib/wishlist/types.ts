import {
  normalizeMenuFood,
  type FoodItem,
  type MenuFood,
} from "@/app/(restaurant)/menu/_type";

/**
 * A saved dish, as `GET /wishlists` returns it.
 *
 * The backend populates ids in place (the same shape `/foods/menu` sends), so
 * every row goes through `normalizeMenuFood` and a wishlist card renders from
 * exactly what a menu card does.
 */
export interface WishlistFood extends FoodItem {
  isWishlist: true;
  /** When it was saved — the list is newest first. */
  savedAt?: string;
}

/** What save and unsave answer with. */
export interface WishlistToggle {
  foodId: string;
  isWishlist: boolean;
}

/** Trust nothing off the wire — anything that is not a food is dropped. */
export function toWishlistFoods(data: unknown): WishlistFood[] {
  if (!Array.isArray(data)) return [];

  return data
    .filter(
      (row): row is MenuFood & { savedAt?: string } =>
        typeof row === "object" &&
        row !== null &&
        typeof (row as { _id?: unknown })._id === "string",
    )
    .map((row) => ({
      ...normalizeMenuFood(row),
      isWishlist: true as const,
      savedAt: row.savedAt,
    }));
}

/** The id list the hearts are lit from. */
export function toWishlistIds(data: unknown): string[] {
  return Array.isArray(data)
    ? data.filter((id): id is string => typeof id === "string")
    : [];
}
