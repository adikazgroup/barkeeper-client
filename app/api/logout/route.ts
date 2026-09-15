import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { BACKEND_URL } from "@/lib/auth/api";

/**
 * Tells the backend to drop the session, from the same side that opened it.
 *
 * Sign-in runs through NextAuth's `authorize()` on the server, so the backend
 * only ever talks to this process — the access token lives inside the NextAuth
 * cookie and the httpOnly `refreshToken` cookie the backend sets lands here,
 * never in the browser. Calling `/auth/logout` straight from client code would
 * therefore arrive without the state the backend expects.
 *
 * Always answers 200: the local `signOut()` must go through even when the token
 * has already expired or the backend is unreachable. `revoked` says whether the
 * backend actually acknowledged it.
 */
export async function POST() {
  const session = await auth();

  if (!session?.accessToken || session.error) {
    return NextResponse.json({ revoked: false, reason: "no-valid-session" });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session.accessToken}` },
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(`Backend logout failed (${response.status}):`, detail);
      return NextResponse.json({
        revoked: false,
        reason: `http-${response.status}`,
      });
    }

    return NextResponse.json({ revoked: true });
  } catch (error) {
    console.error("Backend logout request failed:", error);
    return NextResponse.json({ revoked: false, reason: "network-error" });
  }
}
