"use client";

import { useMemo, useState } from "react";

import { useCart, type Cart, type CartLine } from "@/hooks/useCart";

/**
 * TEMPORARY — a stand-in docket so the cart can be designed against a full
 * page while the menu it fills from is not wired up yet.
 *
 * The demo lines only ever stand in for an *empty* real cart, and they live in
 * component state: nothing here is written to storage, and the moment a real
 * plate is added from the board the real docket takes over completely. So this
 * cannot corrupt or shadow a customer's actual cart.
 *
 * To remove it when the board is connected: set `SHOW_DEMO_CART` to false, or
 * delete this file and change the one import in `CartView` from
 * `useCartOrDemo` back to `useCart`.
 */
export const SHOW_DEMO_CART = true;

const DEMO_LINES: CartLine[] = [
  {
    id: "demo-smash-burger::Double",
    foodId: "demo-smash-burger",
    name: "Double Smash Burger",
    slug: "double-smash-burger",
    image: "/images/section_Home/RedChili_DoubleSmashBurger.png",
    variantLabel: "Double",
    categoryName: "Burgers",
    unitPrice: 12.5,
    listPrice: 14.0,
    quantity: 2,
  },
  {
    id: "demo-boneless-wings::10 pc",
    foodId: "demo-boneless-wings",
    name: "Boneless Wings",
    slug: "boneless-wings",
    image: "/images/section_Home/RedChili_10Boneless.png",
    variantLabel: "10 pc",
    categoryName: "Wings",
    unitPrice: 11.25,
    listPrice: null,
    quantity: 1,
  },
  {
    id: "demo-crispy-chicken-rice-bowl::",
    foodId: "demo-crispy-chicken-rice-bowl",
    name: "Crispy Chicken Rice Bowl",
    slug: "crispy-chicken-rice-bowl",
    image: "/images/section_Home/RedChili_CrispyChickenRiceBowl.png",
    variantLabel: null,
    categoryName: "Bowls",
    unitPrice: 13.75,
    listPrice: null,
    quantity: 1,
  },
  {
    id: "demo-seasoned-fries::Side",
    foodId: "demo-seasoned-fries",
    name: "Seasoned Fries",
    slug: "seasoned-fries",
    image: "/images/foods/sides.png",
    variantLabel: "Side",
    categoryName: "Sides",
    unitPrice: 4.5,
    listPrice: null,
    quantity: 3,
  },
];

/** More of one plate than any kitchen would send out in a single order. */
const MAX_QUANTITY = 99;

/**
 * The real cart, or the stand-in when the real one is empty. Same shape either
 * way, so the page cannot tell the difference and needs no demo branches of
 * its own.
 */
export function useCartOrDemo(): Cart {
  const cart = useCart();
  const [lines, setLines] = useState<CartLine[]>(DEMO_LINES);

  // Only ever stands in for an empty docket, and only after hydration — before
  // that the page is still showing its skeleton.
  const standIn = SHOW_DEMO_CART && cart.hydrated && cart.items.length === 0;

  return useMemo(() => {
    if (!standIn) return cart;

    let count = 0;
    let subtotal = 0;
    for (const line of lines) {
      count += line.quantity;
      subtotal += line.unitPrice * line.quantity;
    }

    return {
      ...cart,
      items: lines,
      count,
      subtotal: Math.round(subtotal * 100) / 100,
      setQuantity: (id, quantity) =>
        setLines((current) =>
          quantity < 1
            ? current.filter((line) => line.id !== id)
            : current.map((line) =>
                line.id === id
                  ? {
                      ...line,
                      quantity: Math.min(Math.floor(quantity), MAX_QUANTITY),
                    }
                  : line,
              ),
        ),
      removeItem: (id) =>
        setLines((current) => current.filter((line) => line.id !== id)),
      clear: () => setLines([]),
    };
  }, [cart, lines, standIn]);
}
