import type { Metadata } from "next";

import { PaymentShell } from "../_components/PaymentShell";
import { PaymentSuccess } from "../_components/PaymentSuccess";

export const metadata: Metadata = {
  title: "Payment Complete | Barkeeper’s",
  description: "Your Barkeeper’s order is paid and with the kitchen.",
  robots: { index: false, follow: false },
};

/**
 * Stripe's return URL: `/payment/success?orderId=…&session_id=…`.
 *
 * Only `orderId` is used. The session id is Stripe's own reference and the
 * backend reads it from Stripe directly when it syncs — taking a payment state
 * from a query string the customer could edit would be no evidence at all.
 */
export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <PaymentShell badge="Thank you">
      <PaymentSuccess orderId={orderId ?? ""} />
    </PaymentShell>
  );
}
