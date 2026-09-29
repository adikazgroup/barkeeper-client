import type { OrderInput } from "./types";

/**
 * The checkout body, shaped before it leaves our server.
 *
 * Quote and place take the same fields, so they share this — the figure the
 * customer was shown came from exactly the body that then creates the order.
 *
 * It is deliberately thin. The kitchen decides whether it is open and a code
 * live; all this does is drop what the backend does not take, so an unknown
 * field never turns into a 400 from upstream.
 */
export function readOrderInput(
  body: unknown,
):
  | { input: OrderInput; error?: undefined }
  | { input?: undefined; error: string } {
  const raw = (typeof body === "object" && body !== null ? body : {}) as Record<
    string,
    unknown
  >;

  const input: OrderInput = {};

  if (typeof raw.couponCode === "string" && raw.couponCode.trim()) {
    input.couponCode = raw.couponCode.trim();
  }

  if (typeof raw.customerNote === "string" && raw.customerNote.trim()) {
    input.customerNote = raw.customerNote.trim();
  }

  if (typeof raw.phone === "string" && raw.phone.trim()) {
    input.phone = raw.phone.trim();
  }

  return { input };
}
