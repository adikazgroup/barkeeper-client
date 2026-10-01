"use client";

import { useCallback, useEffect, useState } from "react";

import {
  toAvailability,
  type PickupAvailability,
} from "@/lib/orders/availability";

/** Slots are on a 15-minute grid; a minute's refresh keeps the first one honest. */
const REFRESH_MS = 60 * 1000;

export interface PickupAvailabilityState {
  availability: PickupAvailability | null;
  /** True until the first answer (or failure) is in. */
  loading: boolean;
  /** Set when the kitchen could not be reached at all. */
  error: string | null;
  reload: () => Promise<void>;
}

/**
 * The kitchen's live ordering status and pickup times.
 *
 * Read on mount, every minute after, and whenever the tab comes back into
 * view — a checkout left open over lunch must not offer a slot that has gone.
 */
export function usePickupAvailability(): PickupAvailabilityState {
  const [availability, setAvailability] = useState<PickupAvailability | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const response = await fetch("/api/availability", { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as {
        availability?: unknown;
        message?: string;
      } | null;
      const next = response.ok ? toAvailability(payload?.availability) : null;

      if (next) {
        setAvailability(next);
        setError(null);
      } else {
        setError(payload?.message || "Could not reach the kitchen.");
      }
    } catch {
      setError("Could not reach the kitchen. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await reload();
    })();

    const timer = setInterval(() => void reload(), REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") void reload();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [reload]);

  return { availability, loading, error, reload };
}
