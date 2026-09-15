"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import {
  addItem,
  clearCart,
  getServerSnapshot,
  getSnapshot,
  refresh,
  removeItem,
  subscribe,
  updateItem,
  type CartStatus,
} from "@/lib/cart/store";
import type {
  AddItemInput,
  Cart as CartData,
  CartItem,
  CartIssue,
  ModifierInput,
  UpdateItemInput,
} from "@/lib/cart/types";

export type {
  AddItemInput,
  CartItem,
  CartIssue,
  CartModifier,
  ModifierInput,
  UpdateItemInput,
} from "@/lib/cart/types";

/** What a mutation answers with, so a caller can toast the backend's words. */
export type CartResult = Promise<{ ok: boolean; message: string }>;

export interface Cart {
  items: CartItem[];
  /** Physical items, not lines — what the navbar badge prints. */
  count: number;
  subtotal: number;
  /** Whatever is blocking the whole docket, in the backend's own words. */
  issues: CartIssue[];
  /** False while any line has an issue; checkout waits on it. */
  isOrderable: boolean;

  status: CartStatus;
  /**
   * False until the first answer is in. Anything that would otherwise flash an
   * empty docket before the real one arrives waits on this.
   */
  hydrated: boolean;
  /** True while a mutation is in flight, so controls can be disabled. */
  pending: boolean;
  error: string | null;
  /** The cart is a signed-in feature; this is how the UI knows to say so. */
  signedOut: boolean;

  addItem: (input: AddItemInput) => CartResult;
  updateItem: (itemId: string, input: UpdateItemInput) => CartResult;
  /** Steps a line's quantity, sending the rest of the line back with it. */
  setQuantity: (itemId: string, quantity: number) => CartResult;
  removeItem: (itemId: string) => CartResult;
  clear: () => CartResult;
  refresh: () => CartResult;
}

/**
 * The options a line was built with, on their way back out.
 *
 * A quantity change has to send the whole line — options and quantity price
 * each other — so the priced modifiers the backend returned are folded back
 * into the bare input shape it takes.
 */
const modifiersOf = (item: CartItem): ModifierInput[] =>
  (item.modifiers ?? []).map((modifier) => ({
    groupId: modifier.groupId,
    optionName: modifier.optionName,
    quantity: modifier.quantity,
  }));

/**
 * Read the docket. No provider to mount: the cart is an external store, so
 * every caller subscribes to the same one wherever it sits in the tree.
 */
export function useCart(): Cart {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const { cart, status, pending, error } = state;

  const setQuantity = useCallback(
    (itemId: string, quantity: number): CartResult => {
      // Stepping the last one off a line is how a line is removed.
      if (quantity < 1) return removeItem(itemId);

      const item = cart.items.find((line) => line._id === itemId);
      if (!item) return removeItem(itemId);

      return updateItem(itemId, {
        variantLabel: item.variantLabel ?? null,
        modifiers: modifiersOf(item),
        specialInstructions: item.specialInstructions ?? undefined,
        quantity: Math.floor(quantity),
      });
    },
    [cart],
  );

  return useMemo(
    (): Cart => ({
      items: cart.items,
      count: cart.itemCount,
      subtotal: cart.subtotal,
      issues: cart.issues,
      isOrderable: cart.isOrderable,

      status,
      hydrated: status !== "idle" && status !== "loading",
      pending,
      error,
      signedOut: status === "signed-out",

      addItem,
      updateItem,
      setQuantity,
      removeItem,
      clear: clearCart,
      refresh,
    }),
    [cart, status, pending, error, setQuantity],
  );
}

export type { CartData };
