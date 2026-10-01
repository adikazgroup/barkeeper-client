import { NextResponse } from "next/server";

import { BACKEND_URL } from "@/lib/auth/api";
import { toAvailability } from "@/lib/orders/availability";

/**
 * `GET /settings/availability` — open or closed right now, and today's pickup
 * times. Public, so no bearer; proxied only to keep the browser talking to
 * this app alone, and never cached, because the answer moves every minute.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/settings/availability`, {
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => null)) as {
      data?: unknown;
      message?: string;
    } | null;

    const availability = response.ok ? toAvailability(payload?.data) : null;

    if (!availability) {
      return NextResponse.json(
        { message: payload?.message || "Could not reach the kitchen." },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      { availability },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach the kitchen." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
