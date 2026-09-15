import type { Metadata } from "next";
import { CartHero } from "./_components/CartHero";
import { CartView } from "./_components/CartView";

export const metadata: Metadata = {
  title: "Your Cart | Barkeeper’s",
  description:
    "Review the plates on your docket at Barkeeper’s — change sizes and quantities before you send the order to the kitchen.",
  // A cart is one person's docket and nothing a crawler should index.
  robots: { index: false, follow: true },
};

export default function CartPage() {
  // No wrapper of its own: the hero is pulled up under the sticky header the
  // way the home and menu heroes are, and the shell already paints the page.
  return (
    <main>
      <CartHero />
      <CartView />
    </main>
  );
}
