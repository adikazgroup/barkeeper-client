import type { OrderInput } from "./types";

/**
 * The checkout body, shaped before it leaves our server.
 *
 * Quote and place take the same fields, so they share this — the figure the
 * customer was shown came from exactly the body that then creates the order.
 *
 * It is deliberately thin. The kitchen decides whether a slot is still open, a
 * tip sane or a code live; all this does is refuse the two shapes the backend
 * cannot answer at all — a scheduled pickup with no slot, and a tip sent twice
 * over — so those come back as a plain sentence instead of a 400 from upstream.
 */
export function readOrderInput(
  body: unknown,
): { input: OrderInput; error?: undefined } | { input?: undefined; error: string } {
  const raw = (typeof body === "object" && body !== null ? body : {}) as Record<
    string,
    unknown
  >;

  const input: OrderInput = {};

  if (raw.scheduleType === "asap" || raw.scheduleType === "scheduled") {
    input.scheduleType = raw.scheduleType;
  }

  if (typeof raw.slotStartAt === "string" && raw.slotStartAt.trim()) {
    input.slotStartAt = raw.slotStartAt.trim();
  }

  if (input.scheduleType === "scheduled" && !input.slotStartAt) {
    return { error: "Pick a pickup time." };
  }

  if (typeof raw.couponCode === "string" && raw.couponCode.trim()) {
    input.couponCode = raw.couponCode.trim();
  }

  const percentage = finiteNumber(raw.tipPercentage);
  const amount = finiteNumber(raw.tipAmount);

  if (percentage !== null && amount !== null) {
    return { error: "Send a tip percentage or an amount, not both." };
  }

  if (percentage !== null) input.tipPercentage = percentage;
  if (amount !== null) input.tipAmount = amount;

  if (typeof raw.customerNote === "string" && raw.customerNote.trim()) {
    input.customerNote = raw.customerNote.trim();
  }

  if (typeof raw.phone === "string" && raw.phone.trim()) {
    input.phone = raw.phone.trim();
  }

  return { input };
}

/**
 * A tip that is genuinely a figure.
 *
 * Zero counts — "no tip" is a choice a customer can make explicitly, and it is
 * not the same as leaving the field off — so this tests the type rather than
 * truthiness. A negative one is not a tip at all and is dropped.
 */
function finiteNumber(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return null;
  }

  return value;
}
