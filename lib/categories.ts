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

export interface CategoryMatch {
  category: CategoryNode;
  /** Set only when the match is a sub-category. */
  parent?: CategoryNode;
}

/**
 * Resolve a slug taken off the URL to a category document. Slugs are unique
 * across both layers, so a single pass over the tree is enough.
 *
 * The URL carries slugs rather than ids because ids are unreadable and would
 * make every shared link opaque — but the API filters on `categoryId`, so the
 * lookup has to happen somewhere, and doing it here keeps it out of the pages.
 */
export function findCategoryBySlug(
  tree: CategoryNode[],
  slug: string,
): CategoryMatch | null {
  if (!slug) return null;

  for (const parent of tree) {
    if (parent.slug === slug) return { category: parent };

    const child = parent.subCategories?.find((sub) => sub.slug === slug);
    if (child) return { category: child, parent };
  }

  return null;
}

/**
 * Turn a slug into the query the blogs/foods endpoints understand. A top-level
 * slug filters on `categoryId`, a sub-category slug on `subCategoryId` — the
 * API has no single "either layer" filter.
 */
export function categoryFilterFor(
  tree: CategoryNode[],
  slug: string,
): { categoryId?: string; subCategoryId?: string } {
  const match = findCategoryBySlug(tree, slug);
  if (!match) return {};

  return match.parent
    ? { subCategoryId: match.category._id }
    : { categoryId: match.category._id };
}
