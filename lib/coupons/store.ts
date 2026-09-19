"use client";

import {
  getSnapshot as getCartSnapshot,
  subscribe as subscribeToCart,
} from "@/lib/cart/store";

import { type AppliedCoupon, type MyCoupon } from "./types";

/**
 * The code on the docket, as a store outside React.
 *
 * `/coupons/apply` writes nothing — it quotes a code against the cart as it
 * stands and forgets it. So "an applied coupon" is not something the backend
 * keeps; it is a code this tab is holding plus the last quote it got for it.
 * Two consequences shape everything below:
 *
 *  - The quote goes stale the moment a line changes, so this watches the cart
 *    store and re-asks. A customer who adds a plate after entering a code must
 *    not be shown the old money-off figure against the new subtotal.
 *  - Nothing is decided here. The order call sends the *code*, and the kitchen
 *    prices it again when the order is placed. What this holds is what to show
 *    and what to send, never what to charge.
 *
 * It sits beside the cart store rather than inside it because the cart's shape
 * is the backend's and a coupon is not part of it.
 */

export type CouponStatus = "idle" | "loading" | "ready" | "signed-out";

export interface CouponState {
  /** The last quote for the held code, or `null` when none is on. */
  applied: AppliedCoupon | null;
  /** The wallet — this account's own codes. */
  myCoupons: MyCoupon[];
  status: CouponStatus;
  /** True while a code is being tried or re-checked. */
  pending: boolean;
  /** Why the last attempt was refused, in the backend's words. */
  error: string | null;
}

const INITIAL: CouponState = {
  applied: null,
  myCoupons: [],
  status: "idle",
  pending: false,
  error: null,
};

let state: CouponState = INITIAL;
const listeners = new Set<() => void>();

export function getSnapshot(): CouponState {
  return state;
}

/** One frozen object for the server render, as the cart store does. */
export function getServerSnapshot(): CouponState {
  return INITIAL;
}

function set(next: Partial<CouponState>) {
  state = { ...state, ...next };
  for (const listener of listeners) listener();
}

/**
 * The held code, kept where a reload can find it.
 *
 * The cart survives on the server; a coupon does not, so without this a
 * customer who refreshes the cart page silently loses their discount. Only the
 * code is stored — never the figure, which is re-quoted on the way back in.
 */
const STORAGE_KEY = "barkeeper.coupon";

function readStoredCode(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Private mode, or storage refused. A coupon is not worth failing over.
    return null;
  }
}

function storeCode(code: string | null) {
  try {
    if (code) window.localStorage.setItem(STORAGE_KEY, code);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // As above.
  }
}

/**
 * Re-quote when the docket moves.
 *
 * Subscribed only while a code is held, so a page that never shows a coupon
 * does not pull the cart in behind it. The signature is the subtotal and the
 * count together: a swap that leaves the subtotal alone can still change what
 * a code covers, since a restricted one is priced against eligible lines only.
 */
let unwatchCart: (() => void) | null = null;
let lastCartSignature = "";

function cartSignature(): string {
  const { cart, status } = getCartSnapshot();
  return `${status}:${cart.subtotal}:${cart.itemCount}`;
}

function watchCart() {
  if (unwatchCart) return;

  lastCartSignature = cartSignature();

  unwatchCart = subscribeToCart(() => {
    const signature = cartSignature();
    if (signature === lastCartSignature) return;
    lastCartSignature = signature;

    const code = state.applied?.code;
    if (!code) return;

    const { cart, status } = getCartSnapshot();

    // An empty docket has nothing to discount, and a signed-out one is not
    // ours to discount. Either way the code comes off quietly — the customer
    // did nothing wrong, so there is no refusal to show them.
    if (status === "signed-out" || cart.items.length === 0) {
      clearCoupon();
      return;
    }

    void quote(code, { silent: true });
  });
}

function unwatchIfIdle() {
  if (state.applied || !unwatchCart) return;
  unwatchCart();
  unwatchCart = null;
}

interface QuoteAnswer {
  coupon?: AppliedCoupon;
  message?: string;
}

/**
 * Ask what a code is worth.
 *
 * `silent` marks the re-check after a cart change: the customer did not just
 * type anything, so a network stumble stays quiet. A code the backend has
 * stopped honouring still comes off with its reason shown — that one they need
 * to see, because the total is about to change under them.
 */
async function quote(
  code: string,
  { silent = false }: { silent?: boolean } = {},
): Promise<{ ok: boolean; message: string }> {
  set({ pending: true, error: null });

  let response: Response;

  try {
    response = await fetch("/api/coupons/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
  } catch {
    const message = "Could not reach the kitchen. Check your connection.";
    set({ pending: false, status: "ready", error: silent ? null : message });
    return { ok: false, message };
  }

  const payload = (await response
    .json()
    .catch(() => null)) as QuoteAnswer | null;

  if (response.status === 401) {
    storeCode(null);
    set({
      applied: null,
      myCoupons: [],
      pending: false,
      status: "signed-out",
      error: null,
    });
    unwatchIfIdle();
    return { ok: false, message: payload?.message ?? "Sign in to use a code." };
  }

  if (!response.ok || !payload?.coupon) {
    const message = payload?.message || "That code could not be used.";

    // A code that was on and has stopped working comes off, so the summary
    // never shows money off that the kitchen will not honour.
    storeCode(null);
    set({
      applied: null,
      pending: false,
      status: "ready",
      error: message,
    });
    unwatchIfIdle();
    return { ok: false, message };
  }

  storeCode(payload.coupon.code);
  set({
    applied: payload.coupon,
    pending: false,
    status: "ready",
    error: null,
  });
  watchCart();

  return { ok: true, message: payload.message ?? "" };
}

/** Try a code the customer typed, or picked out of their wallet. */
export function applyCoupon(code: string) {
  const trimmed = code.trim();

  if (!trimmed) {
    set({ error: "Enter a code." });
    return Promise.resolve({ ok: false, message: "Enter a code." });
  }

  return quote(trimmed);
}

/** Take the code off. Nothing to tell the backend — it never held one. */
export function clearCoupon() {
  storeCode(null);
  set({ applied: null, error: null, status: "ready", pending: false });
  unwatchIfIdle();
}

/** The wallet. A signed-out reader has nothing to list, which is not an error. */
export async function loadMyCoupons(): Promise<MyCoupon[]> {
  let response: Response;

  try {
    response = await fetch("/api/coupons/my");
  } catch {
    return state.myCoupons;
  }

  if (response.status === 401) {
    set({ myCoupons: [], status: "signed-out" });
    return [];
  }

  const payload = (await response.json().catch(() => null)) as {
    coupons?: MyCoupon[];
  } | null;

  const coupons = Array.isArray(payload?.coupons) ? payload.coupons : [];
  set({ myCoupons: coupons, status: "ready" });

  return coupons;
}

/**
 * The first subscriber starts the store: the wallet is read, and a code left
 * over from a previous visit is re-quoted against today's docket rather than
 * trusted.
 */
let started = false;

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  if (!started) {
    started = true;
    set({ status: "loading" });

    void loadMyCoupons();

    const stored = readStoredCode();
    if (stored) void quote(stored, { silent: true });
  }

  return () => {
    listeners.delete(listener);
  };
}
