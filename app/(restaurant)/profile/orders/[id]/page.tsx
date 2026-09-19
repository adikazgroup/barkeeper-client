import type { Metadata } from "next";

import { OrderTracker } from "../../_components/OrderTracker";

export const metadata: Metadata = {
  title: "Your Order | Barkeeper’s",
  description:
    "Where your Barkeeper’s order is, what is on it and what it came to.",
  robots: { index: false, follow: false },
};

/**
 * One docket, watched.
 *
 * The layout above has already guarded the account, so the only thing this
 * needs is which order — the read itself is done in the browser, because a live
 * order is polled and a server render would be stale the moment it painted.
 */
export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <OrderTracker orderId={id} />;
}
