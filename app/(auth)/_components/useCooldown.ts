"use client";

import { useCallback, useEffect, useState } from "react";

import { RESEND_COOLDOWN_SECONDS } from "@/lib/auth/constants";

/**
 * Counts a "Resend" button back to life.
 *
 * The backend throttles per address, so a customer who taps repeatedly gets
 * rate-limited rather than a second email — the cool-off makes that visible
 * instead of letting them find out by being blocked.
 */
export function useCooldown(seconds: number = RESEND_COOLDOWN_SECONDS) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (remaining <= 0) return;

    const timer = setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  const start = useCallback(() => setRemaining(seconds), [seconds]);

  return { remaining, active: remaining > 0, start };
}
