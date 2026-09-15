import type { ApiImage, CategoryRef } from "@/lib/types";

/** One choosable size of a food — the board's "Full / Side", "Full / Half". */
export interface FoodVariant {
  label: string;
  price?: number | null;
  offerPrice?: number | null;
  calories?: number | null;
  sortOrder?: number | null;
}

/** A single line inside an option group — one cheese, one topping. */
export interface FoodOption {
  name: string;
  price?: number | null;
  calories?: number | null;
  section?: string | null;
  sortOrder?: number | null;
  status?: string;
}

/**
 * A set of options attached to a food.
 *
 * `choiceOf` is pick-one and priced into the plate; `addOns` is pick-any and
 * each line carries its own surcharge.
 */
export interface OptionGroupBody {
  _id: string;
  name: string;
  selectionType: "choiceOf" | "addOns";
  options: FoodOption[];
  status?: string;
}

export interface FoodOptionGroup {
  groupId: string;
  sortOrder?: number | null;
  group: OptionGroupBody;
}

/**
 * The same group as `/foods/menu` sends it.
 *
 * That route resolves the group *into* `groupId` rather than joining it on
 * beside the id, so the two endpoints genuinely differ in shape.
 * `normalizeMenuFood` below is what keeps that difference out of components.
 */
export interface MenuOptionGroup {
  groupId: OptionGroupBody;
  sortOrder?: number | null;
}

/**
 * A food as `GET /foods` returns it. The list endpoint projects `categoryId`
 * away and joins the category document on as `category` instead, so the
 * readable name is already on the row.
 *
 * Price comes in two shapes, told apart by `priceType`: `single` fills `price`
 * and leaves `variants` empty, `variant` leaves `price` null and puts a figure
 * on each variant instead. Anything reading a price has to handle both.
 *
 * `GET /foods/:id` and `/foods/slug/:slug` populate in place instead — there
 * the ids themselves come back as objects. Nothing on the public site reads a
 * single food yet, so only the list shape is modelled here.
 */
export interface FoodItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: ApiImage | null;
  priceType?: "single" | "variant";
  price?: number | null;
  offerPrice?: number | null;
  calories?: number | null;
  variants?: FoodVariant[];
  optionGroups?: FoodOptionGroup[];
  rating?: number | null;
  /** Averaged from published reviews, with the number they were averaged from. */
  ratingAverage?: number | null;
  ratingCount?: number | null;
  /** A line the kitchen adds about how long the plate takes. */
  prepNote?: string | null;
  prepTimeMinutes?: number | null;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  /**
   * Rail placement. `featuredSorting` and `bannerSorting` are the admin's slot
   * order within their rail, and the list endpoint sorts on them itself when
   * asked for that rail — so nothing here has to re-sort, and a food with no
   * slot already arrives at the end.
   */
  isFeatured?: boolean;
  featuredSorting?: number | null;
  isBanner?: boolean;
  bannerSorting?: number | null;
  /** The admin's hand-set position within its category. */
  sortOrder?: number | null;
  category?: CategoryRef | null;
  /** Only on a food filed under a sub-category. */
  subCategory?: CategoryRef | null;
}

/** One counter on the board — a category and the plates filed under it. */
export interface MenuGroup {
  key: string;
  title: string;
  slug: string;
  items: FoodItem[];
}

/**
 * A food exactly as `GET /foods/menu` sends it.
 *
 * That route resolves ids *in place*, so the category arrives as `categoryId`
 * rather than `category` and each option group as `groupId` rather than
 * `{ groupId, group }`. Everything else matches `FoodItem`.
 */
export interface MenuFood extends Omit<
  FoodItem,
  "category" | "subCategory" | "optionGroups"
> {
  categoryId?: CategoryRef | null;
  subCategoryId?: CategoryRef | null;
  optionGroups?: MenuOptionGroup[];
  status?: string;
}

/** One category from `GET /foods/menu`, with its plates already filed in it. */
export interface MenuCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string | null;
  sortOrder?: number | null;
  status?: string;
  foods?: MenuFood[];
}

/** True for a resolved category object rather than a bare id string. */
const isCategoryRef = (value: unknown): value is CategoryRef =>
  typeof value === "object" && value !== null && "slug" in value;

/**
 * One food, shaped the way every component already expects, whichever route
 * fetched it. The only place the two endpoints' difference is handled.
 */
export function normalizeMenuFood(food: MenuFood): FoodItem {
  const { categoryId, subCategoryId, optionGroups, status, ...rest } = food;
  void status;

  return {
    ...rest,
    category: isCategoryRef(categoryId) ? categoryId : null,
    subCategory: isCategoryRef(subCategoryId) ? subCategoryId : null,
    optionGroups: (optionGroups ?? []).map((entry) => ({
      groupId: entry.groupId._id,
      sortOrder: entry.sortOrder,
      group: entry.groupId,
    })),
  };
}
