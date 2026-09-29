"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import {
  addToWishlist,
  clearWishlist,
  getServerSnapshot,
  getSnapshot,
  refresh,
  removeFromWishlist,
  subscribe,
  toggleWishlist,
  type WishlistResult,
  type WishlistStatus,
} from "@/lib/wishlist/store";

export type { WishlistResult } from "@/lib/wishlist/store";

export interface Wishlist {
  /** Saved food ids, newest first. */
  ids: string[];
  count: number;
  /** Is this dish saved? */
  has: (foodId: string) => boolean;
  /** Is a save/unsave for this dish still in flight? */
  isPending: (foodId: string) => boolean;

  status: WishlistStatus;
  /** False until the first answer is in — hearts wait on it. */
  hydrated: boolean;
  signedOut: boolean;
  error: string | null;

  add: (foodId: string) => Promise<WishlistResult>;
  remove: (foodId: string) => Promise<WishlistResult>;
  toggle: (foodId: string) => Promise<WishlistResult>;
  clear: () => Promise<WishlistResult>;
  refresh: () => Promise<void>;
}

/** Read the saved dishes. Any number of components can call this at once. */
export function useWishlist(): Wishlist {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const saved = useMemo(() => new Set(state.ids), [state.ids]);
  const has = useCallback((foodId: string) => saved.has(foodId), [saved]);

  const pending = useMemo(() => new Set(state.pendingIds), [state.pendingIds]);
  const isPending = useCallback(
    (foodId: string) => pending.has(foodId),
    [pending],
  );

  return useMemo(
    (): Wishlist => ({
      ids: state.ids,
      count: state.ids.length,
      has,
      isPending,

      status: state.status,
      hydrated: state.status !== "idle" && state.status !== "loading",
      signedOut: state.status === "signed-out",
      error: state.error,

      add: addToWishlist,
      remove: removeFromWishlist,
      toggle: toggleWishlist,
      clear: clearWishlist,
      refresh,
    }),
    [state.ids, state.status, state.error, has, isPending],
  );
}
