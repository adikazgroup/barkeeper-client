"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import type { FoodItem, FoodVariant } from "@/app/(restaurant)/menu/_type";
import { useCart } from "@/hooks/useCart";
import { AUTH_ROUTES } from "@/lib/auth/constants";
import { getSnapshot as getCartSnapshot } from "@/lib/cart/store";
import { prepareGroups, pricedVariants } from "@/lib/cart/rules";
import type { AddItemInput } from "@/lib/cart/types";

import { FoodOptionsModal } from "./FoodOptionsModal";

export interface FoodOrder {
  /**
   * Start ordering this dish. A dish with option groups (or several sizes and
   * no size named) opens the builder; anything else goes straight on.
   */
  order: (variant?: FoodVariant) => void;
  /** True when a tap will open the builder rather than add at once. */
  opensBuilder: boolean;
  /** A cart write is in flight. */
  pending: boolean;
  /** Units of this dish already on the docket, across every line. */
  inCart: number;
  /** Render this once, anywhere in the card — it is the builder sheet. */
  builder: React.ReactNode;
}

/**
 * One way to put a dish on the docket, shared by every card on the site.
 *
 * Like a delivery app: a dish with choices to make slides up the builder, a
 * plain one adds in a tap. Either way the kitchen prices and checks the line,
 * and its own words are what the customer sees if it refuses.
 */
export function useFoodOrder(item: FoodItem): FoodOrder {
  const { addItem, pending, items } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  // The builder is only mounted once it has been asked for — a menu of
  // eighty cards should not carry eighty closed sheets and their listeners.
  const [everOpened, setEverOpened] = useState(false);
  const [initialVariant, setInitialVariant] = useState<string | null>(null);

  const hasGroups = useMemo(() => prepareGroups(item).length > 0, [item]);
  const variants = useMemo(() => pricedVariants(item), [item]);

  const inCart = useMemo(
    () =>
      items
        .filter((line) => line.foodId === item._id)
        .reduce((sum, line) => sum + line.quantity, 0),
    [items, item._id],
  );

  const submit = useCallback(
    async (input: AddItemInput): Promise<boolean> => {
      const { ok, message } = await addItem(input);

      if (ok) {
        const variantNote = input.variantLabel
          ? ` (${input.variantLabel})`
          : "";
        toast.success(`${item.name}${variantNote} added to cart`, {
          action: { label: "View cart", onClick: () => router.push("/cart") },
        });
        return true;
      }

      if (getCartSnapshot().status === "signed-out") {
        toast("Sign in to start an order", {
          description:
            "Your cart is kept on your account, ready on any device.",
          action: {
            label: "Sign in",
            onClick: () =>
              router.push(
                `${AUTH_ROUTES.login}?callbackUrl=${encodeURIComponent(pathname)}`,
              ),
          },
        });
        return false;
      }

      toast.error(message);
      return false;
    },
    [addItem, item.name, pathname, router],
  );

  const order = useCallback(
    (variant?: FoodVariant) => {
      // Options always need the builder; so do several sizes with none named.
      if (hasGroups || (!variant && variants.length > 1)) {
        setInitialVariant(variant?.label ?? null);
        setEverOpened(true);
        setOpen(true);
        return;
      }

      const size = variant ?? (variants.length === 1 ? variants[0] : undefined);
      void submit({
        foodId: item._id,
        variantLabel: size?.label ?? null,
        quantity: 1,
      });
    },
    [hasGroups, variants, submit, item._id],
  );

  return {
    order,
    opensBuilder: hasGroups || variants.length > 1,
    pending,
    inCart,
    builder: everOpened ? (
      <FoodOptionsModal
        item={item}
        open={open}
        onClose={() => setOpen(false)}
        initialVariant={initialVariant}
        onSubmit={submit}
      />
    ) : null,
  };
}
