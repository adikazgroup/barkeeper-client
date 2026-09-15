"use client";

import { useMemo, useSyncExternalStore } from "react";

import {
  addItem,
  clear,
  getServerSnapshot,
  getSnapshot,
  removeItem,
  setQuantity,
  subscribe,
  type CartLine,
} from "@/lib/cart";

export type { CartLine, CartLineInput } from "@/lib/cart";

/** Always false on the server, always true once the browser has taken over. */
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export interface Cart {
  items: CartLine[];
  /** Plates on the docket, counting quantities. */
  count: number;
  /** The total before whatever tax and fees a checkout would add. */
  subtotal: number;
  /**
   * False until the browser has hydrated. Anything that would otherwise flash
   * the server's empty docket before the stored one arrives — the navbar's
   * badge, the cart page's empty state — waits on this.
   */
  hydrated: boolean;
  addItem: typeof addItem;
  setQuantity: typeof setQuantity;
  removeItem: typeof removeItem;
  clear: typeof clear;
}

/**
 * Read the docket. No provider to mount: the cart is an external store, so
 * every caller subscribes to the same one wherever it sits in the tree.
 */
export function useCart(): Cart {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );

  return useMemo(() => {
    let count = 0;
    let subtotal = 0;

    for (const item of items) {
      count += item.quantity;
      subtotal += item.unitPrice * item.quantity;
    }

    return {
      items,
      count,
      // Cents accumulate a float error over a long docket; the docket is money.
      subtotal: Math.round(subtotal * 100) / 100,
      hydrated,
      addItem,
      setQuantity,
      removeItem,
      clear,
    };
  }, [items, hydrated]);
}
