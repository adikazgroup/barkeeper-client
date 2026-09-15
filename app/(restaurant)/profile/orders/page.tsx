import type { Metadata } from "next";

import { OrdersView } from "../_components/OrdersView";

export const metadata: Metadata = {
  title: "Your Orders | Barkeeper’s",
  description:
    "Every docket you’ve sent to the kitchen at Barkeeper’s — what’s live, what landed, and what it came to.",
};

export default function OrdersPage() {
  return (
    <>
      <header className="border-b border-border/50 px-5 py-8 sm:px-8">
        <h1 className="text-[26px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[32px]">
          Your orders
        </h1>
        <p className="mt-3 max-w-[56ch] text-[13.5px] leading-[1.7] text-muted-foreground">
          Everything you’ve sent to the kitchen, newest first. Open a docket to
          see the plates and what each one came to.
        </p>
      </header>

      <OrdersView />
    </>
  );
}
