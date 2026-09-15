import { getData } from "@/lib/api";
// The food shapes are modelled next to the menu page that first needed them.
import {
  normalizeMenuFood,
  type FoodItem,
  type MenuCategory,
  type MenuGroup,
} from "@/app/(restaurant)/menu/_type";

export interface FeaturedFoodsOptions {
  /** Rows to ask for. The API defaults to 10. */
  limit?: number;
}

/**
 * The featured rail.
 *
 * `isFeatured=true` does two things at once: it narrows the list to the rail,
 * and it switches the sort to the rail's own slot order (`featuredSorting`),
 * with unslotted foods falling to the end. So the order the API returns is the
 * order the admin arranged, and nothing here re-sorts it.
 *
 * Returns an empty list rather than throwing when the API is unreachable or
 * the rail is empty — a home page missing one section is not a broken page.
 */
export async function getFeaturedFoods({
  limit,
}: FeaturedFoodsOptions = {}): Promise<FoodItem[]> {
  const query = new URLSearchParams({ isFeatured: "true" });
  if (limit) query.set("limit", String(limit));

  const res = await getData<FoodItem[]>(`/foods?${query}`, {
    tags: ["foods", "foods:featured"],
  });

  return res?.data ?? [];
}

/**
 * The whole board, in one call.
 *
 * `/foods/menu` is built for exactly this page: active categories in print
 * order, each with its active foods in print order, every tier and option
 * group already resolved. The alternative — the food list plus the category
 * tree, joined here — is several round trips and a join this does not have to
 * write.
 *
 * Categories with nothing in them are dropped: an empty counter on the board
 * is a tab a visitor clicks and finds bare.
 */
export async function getFullMenu(): Promise<MenuGroup[]> {
  const res = await getData<MenuCategory[]>("/foods/menu", {
    tags: ["foods", "categories"],
  });

  return (res?.data ?? [])
    .map((category) => ({
      key: category._id,
      title: category.name,
      slug: category.slug,
      items: (category.foods ?? []).map(normalizeMenuFood),
    }))
    .filter((group) => group.items.length > 0);
}

/**
 * One food, by the slug in the URL.
 *
 * The API 404s on an unknown slug or an inactive food, and `getData` turns
 * that into `null`, so a stale link reads the same as one that never existed.
 */
export async function getFoodBySlug(slug: string): Promise<FoodItem | null> {
  if (!slug) return null;

  const res = await getData<FoodItem>(`/foods/slug/${slug}`, {
    tags: ["foods", `food:${slug}`],
  });

  return res?.data ?? null;
}
