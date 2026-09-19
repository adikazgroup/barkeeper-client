"use client";

import { useMemo, useSyncExternalStore } from "react";

import {
  applyCoupon,
  clearCoupon,
  getServerSnapshot,
  getSnapshot,
  loadMyCoupons,
  subscribe,
  type CouponStatus,
} from "@/lib/coupons/store";
import type { AppliedCoupon, MyCoupon } from "@/lib/coupons/types";

export type { AppliedCoupon, MyCoupon } from "@/lib/coupons/types";

/** What an attempt answers with, so a caller can toast the backend's words. */
export type CouponResult = Promise<{ ok: boolean; message: string }>;

export interface Coupon {
  /** The quote for the held code, priced against the docket as it stands. */
  applied: AppliedCoupon | null;
  /** The money off. Zero when no code is on, so it is safe to subtract. */
  discount: number;
  /** This account's own redeemable codes. */
  myCoupons: MyCoupon[];

  status: CouponStatus;
  /** False until the first answer is in, as the cart's flag works. */
  hydrated: boolean;
  pending: boolean;
  error: string | null;
  signedOut: boolean;

  apply: (code: string) => CouponResult;
  clear: () => void;
  /** Re-read the wallet — after redeeming one, say. */
  reload: () => Promise<MyCoupon[]>;
}

/**
 * The code on the docket.
 *
 * No provider to mount: like the cart, this is an external store, so the
 * summary and anything else on screen read the same quote.
 */
export function useCoupon(): Coupon {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const { applied, myCoupons, status, pending, error } = state;

  return useMemo(
    (): Coupon => ({
      applied,
      discount: applied?.discountAmount ?? 0,
      myCoupons,

      status,
      hydrated: status !== "idle" && status !== "loading",
      pending,
      error,
      signedOut: status === "signed-out",

      apply: applyCoupon,
      clear: clearCoupon,
      reload: loadMyCoupons,
    }),
    [applied, myCoupons, status, pending, error],
  );
}
