import type { Metadata } from "next";

import { WishlistHero } from "./_components/WishlistHero";
import { WishlistView } from "./_components/WishlistView";

export const metadata: Metadata = {
  title: "Your Wishlist | Barkeeper’s",
  description:
    "The plates you saved at Barkeeper’s — add any of them to your cart whenever you are ready.",
  // One person's list and nothing a crawler should index.
  robots: { index: false, follow: true },
};

/**
 * The saved dishes. Behind sign-in (`proxy.ts`), like the account screens —
 * the list lives on the customer's account, not in this browser.
 */
export default function WishlistPage() {
  return (
    <main>
      <WishlistHero />
      <WishlistView />
    </main>
  );
}
