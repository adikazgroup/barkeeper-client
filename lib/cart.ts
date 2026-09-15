/**
 * The cart, as a store outside React.
 *
 * The docket really does live outside the component tree — it is a slice of
 * `localStorage` that any tab can write — so it is modelled as an external
 * store and read with `useSyncExternalStore` rather than mirrored into state
 * and re-synced by effects. That is what makes the navbar's badge, the cart
 * page and a second open tab all read the same figure without a chain of
 * effects copying it between them.
 */

/**
 * One line on the docket.
 *
 * The line carries its own copy of the name, photograph and price rather than
 * an id to look them up by. A cart outlives the page it was filled on — it is
 * read back days later, by which time the kitchen may have pulled the plate
 * off the board entirely — and a docket that renders as blanks because the
 * food is gone is worse than one quoting a stale figure the customer can still
 * see and remove.
 */
export interface CartLine {
  /** Food and size together, so two sizes of one plate are two lines. */
  id: string;
  foodId: string;
  name: string;
  slug: string;
  image?: string | null;
  /** The chosen size — "Full", "Half" — or null on a single-price plate. */
  variantLabel?: string | null;
  categoryName?: string | null;
  /** What this line charges per unit: the offer price when one is live. */
  unitPrice: number;
  /** The list price it was marked down from, kept only to strike through. */
  listPrice?: number | null;
  quantity: number;
}

/** What `addItem` is handed — the quantity is decided by the store. */
export type CartLineInput = Omit<CartLine, "id" | "quantity">;

/** Versioned, so a future change to `CartLine` can drop old dockets cleanly. */
const STORAGE_KEY = "duffy.cart.v1";

/** More of one plate than any kitchen would send out in a single order. */
const MAX_QUANTITY = 99;

/** Food and size are what identify a line; the same pair stacks. */
export const lineIdOf = (foodId: string, variantLabel?: string | null) =>
  `${foodId}::${variantLabel ?? ""}`;

/**
 * Trust nothing that comes back out of storage — it is user-writable, and a
 * half-written docket from an older build would otherwise crash the page that
 * renders it. Anything that does not look like a line is dropped.
 */
function parseStored(raw: string | null): CartLine[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((entry): CartLine[] => {
      if (typeof entry !== "object" || entry === null) return [];
      const line = entry as Partial<CartLine>;

      if (
        typeof line.id !== "string" ||
        typeof line.foodId !== "string" ||
        typeof line.name !== "string" ||
        typeof line.unitPrice !== "number" ||
        typeof line.quantity !== "number" ||
        !Number.isFinite(line.unitPrice) ||
        !Number.isFinite(line.quantity) ||
        line.quantity < 1
      ) {
        return [];
      }

      return [
        {
          id: line.id,
          foodId: line.foodId,
          name: line.name,
          slug: typeof line.slug === "string" ? line.slug : "",
          image: typeof line.image === "string" ? line.image : null,
          variantLabel:
            typeof line.variantLabel === "string" ? line.variantLabel : null,
          categoryName:
            typeof line.categoryName === "string" ? line.categoryName : null,
          unitPrice: line.unitPrice,
          listPrice: typeof line.listPrice === "number" ? line.listPrice : null,
          quantity: Math.min(Math.floor(line.quantity), MAX_QUANTITY),
        },
      ];
    });
  } catch {
    return [];
  }
}

/**
 * The server has no docket, and `getServerSnapshot` has to hand back the same
 * reference every time or React re-renders forever.
 */
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

/**
 * Read storage once, lazily, on whichever of `subscribe` or `getSnapshot`
 * React reaches first. Doing it at module scope instead would run during the
 * server render, where there is no `window`.
 */
function load() {
  if (loaded || typeof window === "undefined") return;
  lines = parseStored(window.localStorage.getItem(STORAGE_KEY));
  loaded = true;
}

function emit() {
  for (const listener of listeners) listener();
}

/** A cart open in two tabs stays one cart. */
function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  lines = parseStored(event.newValue);
  emit();
}

function commit(next: CartLine[]) {
  lines = next;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // A full or blocked store costs persistence, not the session.
  }

  emit();
}

export function subscribe(listener: () => void): () => void {
  load();
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

/** Stable by identity between writes, as `useSyncExternalStore` requires. */
export function getSnapshot(): CartLine[] {
  load();
  return lines;
}

export function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

export function addItem(line: CartLineInput, quantity = 1) {
  const id = lineIdOf(line.foodId, line.variantLabel);
  const added = Math.max(1, Math.floor(quantity));
  const existing = lines.find((item) => item.id === id);

  // A second press of the same size is one more of that line, not a duplicate
  // row — and the fresher price and photograph win.
  commit(
    existing
      ? lines.map((item) =>
          item.id === id
            ? {
                ...item,
                ...line,
                id,
                quantity: Math.min(item.quantity + added, MAX_QUANTITY),
              }
            : item,
        )
      : [...lines, { ...line, id, quantity: Math.min(added, MAX_QUANTITY) }],
  );
}

export function setQuantity(id: string, quantity: number) {
  const next = Math.floor(quantity);

  // Stepping the last one off a line is how a line is removed.
  if (next < 1) {
    removeItem(id);
    return;
  }

  commit(
    lines.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.min(next, MAX_QUANTITY) }
        : item,
    ),
  );
}

export function removeItem(id: string) {
  commit(lines.filter((item) => item.id !== id));
}

export function clear() {
  commit([]);
}
