"use client";

import { Clock, Store, TriangleAlert } from "lucide-react";

import type { PickupAvailabilityState } from "@/hooks/usePickupAvailability";
import { statusHeadline } from "@/lib/orders/availability";
import { cn } from "@/lib/utils";

/**
 * The kitchen's status, as the cart and checkout show it.
 *
 * Closed, paused or out of pickup times → a red panel with the kitchen's own
 * message; open → one quiet line with the earliest pickup. Nothing while the
 * first answer is on its way, so an open kitchen never flashes "closed".
 */
export function OrderingStatus({
  state,
  className,
}: {
  state: PickupAvailabilityState;
  className?: string;
}) {
  const { availability, loading, error } = state;

  if (loading) return null;

  if (!availability) {
    return (
      <p
        role="status"
        className={cn(
          "flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/5 px-3.5 py-3 text-[12.5px] leading-[1.6]",
          className,
        )}
      >
        <TriangleAlert
          aria-hidden
          className="mt-0.5 size-3.5 shrink-0 text-warning"
        />
        {error || "Could not check whether the kitchen is open."}
      </p>
    );
  }

  if (!availability.canOrder) {
    // The headline already says closed; the line under it says when it opens.
    // A pause has no hours to point at, so it keeps the kitchen's message.
    const detail =
      availability.status !== "paused" && availability.openingHours
        ? `We take orders daily, ${availability.openingHours}.`
        : availability.message;

    return (
      <div
        role="status"
        className={cn(
          "rounded-xl border border-danger/30 bg-danger/5 px-4 py-3.5",
          className,
        )}
      >
        <p className="flex items-center gap-2 text-[14px] font-medium">
          <Store aria-hidden className="size-4 shrink-0 text-danger" />
          {statusHeadline(availability.status)}
        </p>
        {detail && (
          <p className="mt-1.5 pl-6 text-[12.5px] leading-[1.6] text-muted-foreground">
            {detail}
          </p>
        )}
      </div>
    );
  }

  return (
    <p
      role="status"
      className={cn(
        "flex items-start gap-2 text-[12.5px] leading-[1.6] text-muted-foreground",
        className,
      )}
    >
      <Clock aria-hidden className="mt-0.5 size-3.5 shrink-0 text-primary" />
      <span>
        <span className="font-medium text-foreground">Open now</span> — earliest
        pickup {availability.slots[0].label}
        {availability.openingHours && ` · Hours ${availability.openingHours}`}
      </span>
    </p>
  );
}
