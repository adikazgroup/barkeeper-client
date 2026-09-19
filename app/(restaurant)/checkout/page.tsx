import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAccountResult } from "@/lib/auth/account";
import { SESSION_ENDED_ROUTE } from "@/lib/auth/constants";

import { CheckoutHero } from "./_components/CheckoutHero";
import { CheckoutView } from "./_components/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout | Barkeeper’s",
  description:
    "Pick a collection time, tip the kitchen and pay for your order at Barkeeper’s.",
  // One person's order, and nothing a crawler should index.
  robots: { index: false, follow: true },
};

/**
 * The account is read here rather than asked for again on screen: the backend
 * wants a phone number once and then remembers it, so a customer who has
 * ordered before should find the field already filled.
 *
 * `proxy.ts` has checked for a cookie; this is the real gate, and it goes out
 * through the route that clears a dead one so the two do not bounce a customer
 * between them.
 */
export default async function CheckoutPage() {
  const { account, reason } = await getAccountResult();

  if (!account) {
    redirect(`${SESSION_ENDED_ROUTE}?reason=${reason}&callbackUrl=/checkout`);
  }

  return (
    <main>
      <CheckoutHero />
      <CheckoutView defaultPhone={account.phone ?? ""} />
    </main>
  );
}
