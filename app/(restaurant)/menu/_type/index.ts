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
export interface FoodOptionGroup {
  groupId: string;
  sortOrder?: number | null;
  group: {
    _id: string;
    name: string;
    selectionType: "choiceOf" | "addOns";
    options: FoodOption[];
    status?: string;
  };
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
  prepTimeMinutes?: number | null;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  isFeatured?: boolean;
  isBanner?: boolean;
  bannerSorting?: number | null;
  /** The admin's hand-set position within its category. */
  sortOrder?: number | null;
  category?: CategoryRef | null;
}

/** One counter on the board — a category and the plates filed under it. */
export interface MenuGroup {
  key: string;
  title: string;
  slug: string;
  items: FoodItem[];
}
