"use client";

import { toWishlistIds } from "./types";

/**
 * Which dishes the customer has saved, as a store outside React.
 *
 * Every heart on the page — the menu, the home rail, the wishlist itself, the
 * count in the bar — reads this one set, so a tap anywhere lights up the same
 * dish everywhere at once. Only ids live here; the wishlist page fetches the
 * dishes themselves when it opens.
 *
 * Saving is optimistic. The heart fills the moment it is tapped and only falls
 * back if the kitchen refuses — a round trip is not something a customer
 * should have to wait out to see their own tap register.
 *
 * Like the cart, it never sees an access token: it calls this app's own
 * `/api/wishlist/*`, which attaches the bearer on the server.
 */

export type WishlistStatus =
  | "idle"
  | "loading"
  | "ready"
  /** No usable session. Saving dishes is a signed-in feature. */
  | "signed-out"
  | "error";

export interface WishlistState {
  /** Saved food ids, newest first. */
  ids: string[];
  status: WishlistStatus;
  /** Foods with a save/unsave still in flight. */
  pendingIds: string[];
  error: string | null;
}

const INITIAL: WishlistState = {
  ids: [],
  status: "idle",
  pendingIds: [],
  error: null,
};

let state: WishlistState = INITIAL;
const listeners = new Set<() => void>();

export function getSnapshot(): WishlistState {
  return state;
}

export function getServerSnapshot(): WishlistState {
  return INITIAL;
}

function set(next: Partial<WishlistState>) {
  state = { ...state, ...next };
  for (const listener of listeners) listener();
}

/** Read lazily, when something first subscribes — as the cart does. */
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

interface WishlistApiAnswer {
  data?: unknown;
  message?: string;
}

async function request(
  path: string,
  init?: RequestInit,
): Promise<{ status: number; payload: WishlistApiAnswer | null }> {
  const response = await fetch(`/api/wishlist${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  const payload = (await response
    .json()
    .catch(() => null)) as WishlistApiAnswer | null;

  return { status: response.status, payload };
}

/** Re-read the saved ids. Safe to call any time. */
export async function refresh(): Promise<void> {
  set({ status: state.status === "ready" ? "ready" : "loading" });

  try {
    const { status, payload } = await request("/ids");

    if (status === 401) {
      set({ ids: [], status: "signed-out", error: null, pendingIds: [] });
      return;
    }

    if (status !== 200) {
      set({
        status: "error",
        error: payload?.message ?? "Something went wrong.",
      });
      return;
    }

    set({ ids: toWishlistIds(payload?.data), status: "ready", error: null });
  } catch {
    set({
      status: "error",
      error: "Could not reach the kitchen. Check your connection.",
    });
  }
}

export interface WishlistResult {
  ok: boolean;
  message: string;
  /** True when the tap failed only because nobody is signed in. */
  signedOut: boolean;
}

/**
 * Save or unsave one dish.
 *
 * One request per dish at a time — a second tap while the first is still on
 * its way is ignored rather than raced, so the heart can never settle on the
 * answer to the older request.
 */
async function write(foodId: string, save: boolean): Promise<WishlistResult> {
  if (state.status === "signed-out") {
    return {
      ok: false,
      message: "Sign in to save dishes to your wishlist.",
      signedOut: true,
    };
  }

  if (state.pendingIds.includes(foodId)) {
    return { ok: true, message: "", signedOut: false };
  }

  const before = state.ids;
  const optimistic = save
    ? [foodId, ...before.filter((id) => id !== foodId)]
    : before.filter((id) => id !== foodId);

  set({ ids: optimistic, pendingIds: [...state.pendingIds, foodId] });

  const settle = (ids: string[]) =>
    set({ ids, pendingIds: state.pendingIds.filter((id) => id !== foodId) });

  try {
    const { status, payload } = save
      ? await request("", {
          method: "POST",
          body: JSON.stringify({ foodId }),
        })
      : await request(`/${encodeURIComponent(foodId)}`, { method: "DELETE" });

    if (status === 401) {
      set({ ids: [], status: "signed-out", pendingIds: [], error: null });
      return {
        ok: false,
        message: payload?.message ?? "Sign in to save dishes to your wishlist.",
        signedOut: true,
      };
    }

    if (status !== 200) {
      // Put back only this dish's state — anything else tapped meanwhile
      // keeps its own answer.
      const reverted = before.includes(foodId)
        ? [foodId, ...state.ids.filter((id) => id !== foodId)]
        : state.ids.filter((id) => id !== foodId);
      settle(reverted);
      return {
        ok: false,
        message:
          payload?.message ?? "That did not go through. Please try again.",
        signedOut: false,
      };
    }

    settle(state.ids);
    return { ok: true, message: payload?.message ?? "", signedOut: false };
  } catch {
    const reverted = before.includes(foodId)
      ? [foodId, ...state.ids.filter((id) => id !== foodId)]
      : state.ids.filter((id) => id !== foodId);
    settle(reverted);
    return {
      ok: false,
      message: "Could not reach the kitchen. Check your connection.",
      signedOut: false,
    };
  }
}

export const addToWishlist = (foodId: string) => write(foodId, true);

export const removeFromWishlist = (foodId: string) => write(foodId, false);

export const toggleWishlist = (foodId: string) =>
  write(foodId, !state.ids.includes(foodId));

/** Empty the list in one go. */
export async function clearWishlist(): Promise<WishlistResult> {
  const before = state.ids;
  set({ ids: [] });

  try {
    const { status, payload } = await request("", { method: "DELETE" });
    if (status === 200) return { ok: true, message: "", signedOut: false };

    set({ ids: before });
    return {
      ok: false,
      message: payload?.message ?? "That did not go through. Please try again.",
      signedOut: status === 401,
    };
  } catch {
    set({ ids: before });
    return {
      ok: false,
      message: "Could not reach the kitchen. Check your connection.",
      signedOut: false,
    };
  }
}

/**
 * Line the store up with who the layout says is signed in.
 *
 * Signing in moves between pages without a reload, so a list read while
 * signed out would otherwise still say "signed out" afterwards (and the other
 * way round after an account change).
 */
export function syncWithAccount(signedIn: boolean): void {
  if (!started) return; // Nothing read yet — the first subscribe will.

  if (signedIn && (state.status === "signed-out" || state.status === "error")) {
    void refresh();
  } else if (!signedIn && state.status !== "signed-out") {
    set({ ids: [], status: "signed-out", pendingIds: [], error: null });
  }
}
