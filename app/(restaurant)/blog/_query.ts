import { getData } from "@/lib/api";
import buildQueryParams from "@/lib/buildQueryParams";
import { categoryFilter, getCategoryBySlug } from "@/lib/categories";
import type { CategoryNode } from "@/lib/types";

import { Blog, BlogListItem, normalizeBlog } from "./_type";

/** How many stories a page of the journal holds. */
export const BLOG_PAGE_SIZE = 9;

export interface BlogQuery {
  searchTerm: string;
  category: string;
  page: string | number;
}

export interface BlogPage {
  blogs: Blog[];
  total: number;
  currentPage: number;
  activeCategory: CategoryNode | null;
}

/**
 * One page of the journal, for a given filter.
 *
 * The toolbar's count and the grid below it are rendered by two different
 * components — the count sits beside the controls, the grid under them — but
 * they are the same query. Both call this, and because the request is a plain
 * `fetch` to an identical URL within one render, Next serves the second from
 * the first: two callers, one round trip.
 */
export async function getBlogPage({
  searchTerm,
  category,
  page,
}: BlogQuery): Promise<BlogPage> {
  const currentPage = Number(page) || 1;

  // The URL carries a readable slug; the API filters on an ObjectId. One call
  // to `/categories/slug/:slug` resolves it — and the `parent` it comes back
  // with is what says whether this is a category or a sub-category, so the
  // whole tree no longer has to be threaded down here to find out.
  const activeCategory = await getCategoryBySlug(category);

  const queryParams = buildQueryParams({
    page: currentPage,
    limit: BLOG_PAGE_SIZE,
    searchTerm,
    ...categoryFilter(activeCategory),
  });

  const data = await getData<BlogListItem[]>(`/blogs?${queryParams}`, {
    tags: ["blogs"],
  });

  return {
    blogs: (data?.data ?? []).map(normalizeBlog),
    total: data?.meta?.total ?? 0,
    currentPage,
    activeCategory,
  };
}
