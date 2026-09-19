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

export interface BannerFoodsOptions {
  /** Rows to ask for. The API defaults to 10. */
  limit?: number;
}

export async function getBannerFoods({
  limit,
}: BannerFoodsOptions = {}): Promise<FoodItem[]> {
  const query = new URLSearchParams({ isBanner: "true" });
  if (limit) query.set("limit", String(limit));

  const res = await getData<FoodItem[]>(`/foods?${query}`, {
    tags: ["foods", "foods:banner"],
  });

  return res?.data ?? [];
}

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

export async function getFoodBySlug(slug: string): Promise<FoodItem | null> {
  if (!slug) return null;

  const res = await getData<FoodItem>(`/foods/slug/${slug}`, {
    tags: ["foods", `food:${slug}`],
  });

  return res?.data ?? null;
}
