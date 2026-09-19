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
