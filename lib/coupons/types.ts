import type { Cart } from "@/lib/cart/types";

/**
 * Coupons, as the backend hands them over.
 *
 * Two endpoints, and they answer with different things. `/coupons/my` lists
 * the codes an admin put on this account — the wallet. `/coupons/apply` prices
 * one against the docket and writes nothing, which is the whole reason the
 * store below re-checks a held code every time the cart moves: the figure it
 * returned a minute ago was only ever true for the cart of a minute ago.
 */

/** A category or dish a restricted code is limited to. */
export interface CouponScopeRef {
  _id: string;
  name: string;
  slug?: string;
}

/** One redeemable code sitting on the account. */
export interface MyCoupon {
  _id: string;
  code: string;
  description?: string | null;
  /** `percentage` or `fixed`, in the backend's words — never switched on here. */
  discountType: string;
  discountValue: number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
  /** `all`, or a scope narrowed by `categoryIds` / `foodIds`. */
  appliesTo?: string | null;
  categoryIds?: CouponScopeRef[];
  foodIds?: CouponScopeRef[];
  startDate?: string | null;
  endDate?: string | null;
  perUserLimit?: number | null;
  /** `null` means unlimited, which is not the same as none left. */
  usesLeft?: number | null;
}

/** What a code is worth against the docket as it stands right now. */
export interface AppliedCoupon {
  code: string;
  discountType: string;
  discountValue: number;
  /** The part of the subtotal the code actually covers. */
  eligibleSubtotal: number;
  /** The money off — the only figure the summary subtracts. */
  discountAmount: number;
}

/**
 * Trust nothing off the wire.
 *
 * Same reasoning as `toCart`: these figures are printed as money and a missing
 * `discountAmount` would render as `$NaN`, so the envelope is shaped rather
 * than cast.
 */
const money = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

export function toAppliedCoupon(data: unknown): AppliedCoupon | null {
  if (typeof data !== "object" || data === null) return null;

  const raw = data as Partial<AppliedCoupon>;
  if (typeof raw.code !== "string" || !raw.code) return null;

  return {
    code: raw.code,
    discountType: typeof raw.discountType === "string" ? raw.discountType : "",
    discountValue: money(raw.discountValue),
    eligibleSubtotal: money(raw.eligibleSubtotal),
    discountAmount: money(raw.discountAmount),
  };
}

export function toMyCoupons(data: unknown): MyCoupon[] {
  if (!Array.isArray(data)) return [];

  return data.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return [];

    const raw = entry as Partial<MyCoupon>;
    if (typeof raw.code !== "string" || !raw.code) return [];

    return [
      {
        ...raw,
        _id: typeof raw._id === "string" ? raw._id : raw.code,
        code: raw.code,
        discountType:
          typeof raw.discountType === "string" ? raw.discountType : "",
        discountValue: money(raw.discountValue),
        categoryIds: Array.isArray(raw.categoryIds) ? raw.categoryIds : [],
        foodIds: Array.isArray(raw.foodIds) ? raw.foodIds : [],
      } as MyCoupon,
    ];
  });
}

/**
 * What the docket comes to with a code on it.
 *
 * The backend prices the cart and prices the coupon; this only puts the two
 * together, and it clamps because a discount larger than the subtotal would
 * otherwise print a negative total while the backend charges zero.
 */
export function totalWithCoupon(
  cart: Pick<Cart, "subtotal">,
  coupon: AppliedCoupon | null,
): number {
  if (!coupon) return cart.subtotal;
  return Math.max(0, cart.subtotal - coupon.discountAmount);
}
