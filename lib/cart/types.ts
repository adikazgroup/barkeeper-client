import type { ApiImage } from "@/lib/types";

/**
 * The cart, as the backend prices it.
 *
 * Every one of the five cart endpoints answers with this same whole object —
 * add a line, change one, drop one, empty the lot — so a caller never has to
 * re-fetch to find out where it stands. That is why the client store below
 * simply replaces what it holds with whatever came back.
 */

/**
 * Why a line, or the whole cart, cannot be ordered.
 *
 * The backend writes the message, because it is the only side that knows what
 * went wrong — a tier sold out, a dish outside its serving window, a required
 * option group left unanswered. Printing its words rather than mapping `code`
 * to our own keeps a new reason from showing up as a blank.
 */
export interface CartIssue {
  code: string;
  message: string;
}

/** One chosen option on a line, priced. */
export interface CartModifier {
  groupId: string;
  groupName: string;
  optionName: string;
  unitPrice: number;
  quantity: number;
  /** How many of this option the dish already includes at no charge. */
  freeQuantity?: number;
  lineTotal: number;
  calories?: number | null;
}

/**
 * One line on the docket.
 *
 * `_id` is the line, not the dish: the same dish built two ways is two lines,
 * and it is this id — not `foodId` — that the update and remove endpoints take.
 */
export interface CartItem {
  _id: string;
  foodId: string;
  name: string;
  slug: string;
  image?: ApiImage | null;
  categoryId?: string | null;
  subCategoryId?: string | null;
  /** The chosen tier on a variant-priced dish; absent on a single-price one. */
  variantLabel?: string | null;
  /** The tier's own price, before modifiers. */
  basePrice: number;
  modifiers?: CartModifier[];
  modifiersTotal?: number;
  /** Base plus modifiers, for one of them. */
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  calories?: number | null;
  specialInstructions?: string | null;
  prepTimeMinutes?: number | null;
  issues?: CartIssue[];
  /** False when this line alone is blocking checkout. */
  isOrderable?: boolean;
}

export interface Cart {
  items: CartItem[];
  /** Physical items, not lines — the figure the navbar badge prints. */
  itemCount: number;
  subtotal: number;
  issues: CartIssue[];
  /** False while any line has an issue. Check it before offering checkout. */
  isOrderable: boolean;
}

/** What the store holds before the first answer has come back. */
export const EMPTY_CART: Cart = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  issues: [],
  isOrderable: true,
};

/** One option chosen, on the way in. */
export interface ModifierInput {
  groupId: string;
  optionName: string;
  quantity?: number;
}

export interface AddItemInput {
  foodId: string;
  /** Required on a variant-priced dish; the tier's label, verbatim. */
  variantLabel?: string | null;
  modifiers?: ModifierInput[];
  quantity?: number;
  specialInstructions?: string;
}

/**
 * A change to an existing line.
 *
 * The whole line goes back, not a patch of it: options and quantity price each
 * other, so sending a new quantity without the options it was built with would
 * re-price the line as a bare dish.
 */
export interface UpdateItemInput {
  variantLabel?: string | null;
  modifiers?: ModifierInput[];
  quantity?: number;
  specialInstructions?: string;
}

/**
 * Trust nothing off the wire.
 *
 * The cart drives money on screen and a missing `subtotal` would render as
 * `$NaN`, so the envelope is shaped into a `Cart` here rather than cast into
 * one. A field the backend omits reads as its empty value, not as `undefined`
 * leaking into arithmetic.
 */
export function toCart(data: unknown): Cart {
  if (typeof data !== "object" || data === null) return EMPTY_CART;

  const raw = data as Partial<Cart>;
  const items = Array.isArray(raw.items) ? raw.items : [];

  return {
    items,
    itemCount:
      typeof raw.itemCount === "number" && Number.isFinite(raw.itemCount)
        ? raw.itemCount
        : items.reduce((total, item) => total + (item.quantity ?? 0), 0),
    subtotal:
      typeof raw.subtotal === "number" && Number.isFinite(raw.subtotal)
        ? raw.subtotal
        : 0,
    issues: Array.isArray(raw.issues) ? raw.issues : [],
    // Only an explicit `false` blocks checkout; an older backend that does not
    // send the flag at all should not lock every cart.
    isOrderable: raw.isOrderable !== false,
  };
}
