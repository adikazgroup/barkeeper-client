import { redirect } from "next/navigation";

/**
 * The old cancel return URL. Checkout pages opened before it moved to
 * `/payment/failed` still send customers here, so the query is carried over.
 */
export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === "string") params.set(key, value);
  }

  redirect(`/payment/failed${params.size ? `?${params}` : ""}`);
}
