import type { Metadata } from "next";

import { PaymentCancel } from "../_components/PaymentCancel";
import { PaymentShell } from "../_components/PaymentShell";

export const metadata: Metadata = {
  title: "Payment Not Completed | Barkeeper’s",
  description: "Your Barkeeper’s order is unpaid — pay it or call it off.",
  robots: { index: false, follow: false },
};

/** Stripe's other return URL: `/payment/cancel?orderId=…`. */
export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <PaymentShell badge="Not completed">
      <PaymentCancel orderId={orderId ?? ""} />
    </PaymentShell>
  );
}
