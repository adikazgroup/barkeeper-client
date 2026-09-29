import type { Metadata } from "next";

import { PaymentFailed } from "../_components/PaymentFailed";
import { PaymentShell } from "../_components/PaymentShell";

export const metadata: Metadata = {
  title: "Payment Not Completed | Barkeeper’s",
  description: "Your Barkeeper’s order is unpaid — pay it or call it off.",
  robots: { index: false, follow: false },
};

/**
 * The payment gateway's "did not complete" return URL:
 * `/payment/failed?orderId=…&provider=…` — a customer who backed out, or whose
 * payment was declined. Only `orderId` is read; the page asks the backend what
 * actually happened rather than trusting the URL.
 */
export default async function PaymentFailedPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <PaymentShell badge="Not completed">
      <PaymentFailed orderId={orderId ?? ""} />
    </PaymentShell>
  );
}
