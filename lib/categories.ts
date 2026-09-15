import { getData } from "@/lib/api";
import type { CategoryNode } from "@/lib/types";

/**
 * The two-level category tree, in the order the API returns it (oldest first),
 * which is the order the admin created them in and therefore the order the
 * menu board and the blog rail should read in.
 */
export async function getCategoryTree(): Promise<CategoryNode[]> {
  const res = await getData<CategoryNode[]>("/categories", {
    tags: ["categories"],
  });
  return res?.data ?? [];
}

/**
 * One category, resolved from a slug off the URL.
 *
 * The endpoint takes either layer: a top-level slug comes back with its
 * `subCategories`, a sub-category slug without them and with `parent` set to
 * the id of the category above it — which is enough to tell the two apart
 * without holding the whole tree.
 *
 * The API 404s on an unknown or inactive slug and `getData` turns that into
 * `null`, so a stale link reads the same as a slug that never existed.
 */
export async function getCategoryBySlug(
  slug: string,
): Promise<CategoryNode | null> {
  if (!slug) return null;

  const res = await getData<CategoryNode>(`/categories/slug/${slug}`, {
    tags: ["categories", `category:${slug}`],
  });

  return res?.data ?? null;
}

/**
 * Turn a category into the query the blogs/foods endpoints understand.
 *
 * `parent` is what decides it: a top-level category filters on `categoryId`, a
 * sub-category on `subCategoryId` — the API has no single "either layer"
 * filter.
 */
export function categoryFilter(category: CategoryNode | null): {
  categoryId?: string;
  subCategoryId?: string;
} {
  if (!category) return {};

  return category.parent
    ? { subCategoryId: category._id }
    : { categoryId: category._id };
}
