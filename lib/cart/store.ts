"use client";

import {
  EMPTY_CART,
  type AddItemInput,
  type Cart,
  type UpdateItemInput,
} from "./types";

/**
 * The cart, as a store outside React.
 *
 * The docket lives on the server now, not in this tab, so every mutation is a
 * round trip and the answer *is* the new cart — all five endpoints return the
 * whole priced object. That is what makes this store so small: it never merges
 * lines or re-totals anything, it replaces what it holds with what came back.
 * The kitchen prices the docket; this only shows it.
 *
 * It stays an external store rather than React state because the navbar's
 * badge, the cart page and anything else on screen have to read one figure
 * without a chain of effects copying it between them.
 *
 * Nothing here ever sees an access token: it calls this app's own `/api/cart/*`
 * routes, which attach the bearer on the server.
 */

export type CartStatus =
  | "idle"
  | "loading"
  | "ready"
  /** No usable session. The cart is a signed-in feature. */
  | "signed-out"
  | "error";

export interface CartState {
  cart: Cart;
  status: CartStatus;
  /** True while a mutation is in flight, so controls can be disabled. */
  pending: boolean;
  /** The last thing that went wrong, in the backend's own words. */
  error: string | null;
}

const INITIAL: CartState = {
  cart: EMPTY_CART,
  status: "idle",
  pending: false,
  error: null,
};

let state: CartState = INITIAL;
const listeners = new Set<() => void>();

/** Stable by identity between writes, as `useSyncExternalStore` requires. */
export function getSnapshot(): CartState {
  return state;
}

/**
 * The server render has no docket and no session to read one with, so it gets
 * the same frozen object every time — a new one each call would re-render for
 * ever.
 */
export function getServerSnapshot(): CartState {
  return INITIAL;
}

function set(next: Partial<CartState>) {
  state = { ...state, ...next };
  for (const listener of listeners) listener();
}

/**
 * The first read is deliberately lazy: the cart is fetched when something
 * actually subscribes to it, not at import time, so a page that never shows a
 * docket never asks for one.
 */
let started = false;

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  if (!started) {
    started = true;
    void refresh();
  }

  return () => {
    listeners.delete(listener);
  };
}

interface CartApiAnswer {
  cart?: Cart;
  message?: string;
}

/**
 * One request, one new state.
 *
 * A 401 is not an error to show anybody — it only means nobody is signed in —
 * so it settles the store into `signed-out` rather than raising a message.
 */
async function call(
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; message: string }> {
  set({ pending: true, error: null });

  let response: Response;

  try {
    response = await fetch(`/api/cart${path}`, {
      ...init,
      headers: {
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    const message = "Could not reach the kitchen. Check your connection.";
    set({ pending: false, status: "error", error: message });
    return { ok: false, message };
  }

  const payload = (await response
    .json()
    .catch(() => null)) as CartApiAnswer | null;

  if (response.status === 401) {
    set({
      cart: EMPTY_CART,
      pending: false,
      status: "signed-out",
      error: null,
    });
    return { ok: false, message: payload?.message ?? "Sign in to order." };
  }

  if (!response.ok || !payload?.cart) {
    const message = payload?.message || "Something went wrong.";
    // The cart already held is still the truth — a refused add changes
    // nothing — so only the error is written.
    set({ pending: false, status: "ready", error: message });
    return { ok: false, message };
  }

  set({
    cart: payload.cart,
    pending: false,
    status: "ready",
    error: null,
  });

  return { ok: true, message: payload.message ?? "" };
}

/** Read the docket. Safe to call again; the backend creates one on first touch. */
export function refresh() {
  set({ status: state.status === "ready" ? "ready" : "loading" });
  return call("");
}

export function addItem(input: AddItemInput) {
  return call("/items", { method: "POST", body: JSON.stringify(input) });
}

export function updateItem(itemId: string, input: UpdateItemInput) {
  return call(`/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function removeItem(itemId: string) {
  return call(`/items/${itemId}`, { method: "DELETE" });
}

export function clearCart() {
  return call("", { method: "DELETE" });
}

/**
 * Take a docket that arrived by another road.
 *
 * `/orders/my/:id/reorder` answers with the whole priced cart, so re-reading
 * `/carts` straight afterwards would only ask for what is already in hand —
 * and would leave the navbar badge a request behind in the meantime.
 */
export function adoptCart(cart: Cart) {
  set({ cart, pending: false, status: "ready", error: null });
}
