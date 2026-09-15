import type { ApiImage, CategoryRef } from "@/lib/types";

/** The fields every blog carries, whichever endpoint it came from. */
interface BlogBase {
  _id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage?: ApiImage | null;
  metaTitle?: string;
  metaDescription?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * A row from `GET /blogs`. The list runs through an aggregation that *joins*
 * the category documents on under new keys, leaving the raw ids in place.
 */
export interface BlogListItem extends BlogBase {
  categoryId?: string;
  subCategoryId?: string | null;
  category?: CategoryRef | null;
  subCategory?: CategoryRef | null;
}

/**
 * A document from `GET /blogs/slug/:slug`. This one is a Mongoose `populate`,
 * which replaces the ids *in place* — so the category arrives as `categoryId`,
 * not `category`. The two endpoints genuinely differ; `normalizeBlog` below is
 * what keeps that difference out of the components.
 */
export interface BlogDetail extends BlogBase {
  categoryId?: CategoryRef | null;
  subCategoryId?: CategoryRef | null;
}

/** One blog, with the category resolved the same way whatever route fetched it. */
export interface Blog extends BlogBase {
  category: CategoryRef | null;
  subCategory: CategoryRef | null;
}

/** True for a populated category object rather than a bare id string. */
const isCategoryRef = (value: unknown): value is CategoryRef =>
  typeof value === "object" && value !== null && "name" in value;

export function normalizeBlog(blog: BlogListItem | BlogDetail): Blog {
  const { categoryId, subCategoryId, ...rest } = blog as BlogListItem &
    BlogDetail;

  return {
    ...rest,
    category:
      ("category" in blog && blog.category) ||
      (isCategoryRef(categoryId) ? categoryId : null),
    subCategory:
      ("subCategory" in blog && blog.subCategory) ||
      (isCategoryRef(subCategoryId) ? subCategoryId : null),
  };
}

/** What `BlogCard` renders — a view model, not an API shape. */
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  author: string;
  image: string;
  category: string;
  slug: string;
}

/** The one place a `Blog` is turned into what the card wants. */
export function toBlogPost(blog: Blog): BlogPost {
  return {
    id: blog._id,
    title: blog.title,
    excerpt: blog.content || "",
    image: blog.featuredImage?.url || "",
    category: blog.category?.name || "General",
    date: new Date(blog.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    author: "Duffy’s",
    slug: blog.slug || "",
  };
}
