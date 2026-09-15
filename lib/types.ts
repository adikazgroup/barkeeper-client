/** Shapes the API hands back on more than one resource. */

/** An uploaded asset. `url` points at the S3 object. */
export interface ApiImage {
  url: string;
  publicId?: string;
  title?: string;
  alt?: string;
}

/**
 * A category as it arrives joined onto a food or a blog. One collection backs
 * both layers: a top-level category has `parent: null`, a sub-category carries
 * its parent's id.
 */
export interface CategoryRef {
  _id: string;
  name: string;
  slug: string;
}

/**
 * `GET /categories` returns the whole active tree in one call — top-level
 * categories each carrying their active sub-categories, with usage counts on
 * every node. `GET /categories/slug/:slug` hands back one node in the same
 * shape, whichever layer the slug names.
 *
 * Trimmed is the word for that shape: the admin-side fields (image, sortOrder,
 * status, timestamps) are not exposed on the public routes, so nothing here
 * may reach for them.
 */
export interface CategoryNode extends CategoryRef {
  /** One line the admin writes, printed under the heading. */
  description?: string;
  /** `null` on a top-level category, the parent's id on a sub-category. */
  parent?: string | null;
  totalFoods: number;
  totalBlogs: number;
  /** Carried by a top-level node; a sub-category comes back without it. */
  subCategories?: CategoryNode[];
}

/**
 * A promotion as the public endpoints hand it back.
 *
 * `GET /promotions` only ever returns the live ones — active, and inside their
 * window — with `status`, `createdAt` and `updatedAt` stripped, so nothing
 * here has to re-check whether an offer should be on screen.
 *
 * Both dates are nullable in the contract's own terms: a null `startDate`
 * means it is live straight away, a null `endDate` that it never expires.
 */
export interface Promotion {
  _id: string;
  title: string;
  description: string;
  image?: ApiImage | null;
  startDate?: string | null;
  endDate?: string | null;
}
