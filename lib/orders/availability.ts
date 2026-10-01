/**
 * Whether the kitchen is taking orders right now, and for which pickup times.
 *
 * The server works all of it out — the daily window, the admin's grace time,
 * the 15-minute grid — in the restaurant's own timezone, so the browser only
 * ever prints what it was handed and sends a slot's `value` back untouched.
 */

export type OrderingStatus = "open" | "closed" | "paused" | "no_slots";

export interface PickupSlot {
  /** The instant, ISO. What checkout sends as `pickupTime`. */
  value: string;
  /** "7:30 PM", already in the restaurant's zone. */
  label: string;
  /** "Tomorrow" only late in a window that runs past midnight. */
  day: "Today" | "Tomorrow";
}

export interface PickupAvailability {
  status: OrderingStatus;
  /** True only when there is at least one slot to choose. */
  canOrder: boolean;
  /** The kitchen's own words when an order cannot be placed. */
  message: string | null;
  timezone: string;
  /** "11:00 AM – 10:00 PM". */
  openingHours: string;
  orderGraceMinutes: number;
  slotMinutes: number;
  slots: PickupSlot[];
}

const STATUSES: OrderingStatus[] = ["open", "closed", "paused", "no_slots"];

/** Trust nothing off the wire — a malformed answer reads as "closed". */
export function toAvailability(data: unknown): PickupAvailability | null {
  if (!data || typeof data !== "object") return null;
  const raw = data as Partial<PickupAvailability>;

  const status = STATUSES.includes(raw.status as OrderingStatus)
    ? (raw.status as OrderingStatus)
    : "closed";

  const slots: PickupSlot[] = Array.isArray(raw.slots)
    ? raw.slots
        .filter(
          (slot) =>
            typeof slot?.value === "string" && typeof slot?.label === "string",
        )
        .map((slot) => ({
          value: slot.value,
          label: slot.label,
          day: slot.day === "Tomorrow" ? "Tomorrow" : "Today",
        }))
    : [];

  return {
    status,
    canOrder: raw.canOrder === true && status === "open" && slots.length > 0,
    message: typeof raw.message === "string" ? raw.message : null,
    timezone: typeof raw.timezone === "string" ? raw.timezone : "",
    openingHours: typeof raw.openingHours === "string" ? raw.openingHours : "",
    orderGraceMinutes:
      typeof raw.orderGraceMinutes === "number" ? raw.orderGraceMinutes : 0,
    slotMinutes: typeof raw.slotMinutes === "number" ? raw.slotMinutes : 15,
    slots,
  };
}

/** The headline the cart and checkout print for each state. */
export function statusHeadline(status: OrderingStatus): string {
  switch (status) {
    case "paused":
      return "Online ordering is paused";
    case "no_slots":
      return "No pickup times left today";
    case "closed":
      return "Restaurant is currently closed";
    default:
      return "Open for pickup orders";
  }
}
