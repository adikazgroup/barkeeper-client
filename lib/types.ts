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

/** `GET /categories` returns the two-level tree, with usage counts. */
export interface CategoryNode extends CategoryRef {
  image?: ApiImage | null;
  parent?: string | null;
  totalFoods: number;
  totalBlogs: number;
  subCategories?: CategoryNode[];
}
