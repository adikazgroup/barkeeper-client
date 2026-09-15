import { NextResponse } from "next/server";

import { exchangeForAccessToken, readJson } from "@/lib/auth/session-routes";

/**
 * Apple hands back a signed JWT plus, on the very first authorization only, the
 * customer's display name — which never appears inside the token itself. So the
 * name is forwarded when present and simply ignored by the backend for an
 * account that already exists.
 */
export async function POST(request: Request) {
  const { identityToken, name } = await readJson(request);

  if (typeof identityToken !== "string" || !identityToken) {
    return NextResponse.json(
      { message: "Apple did not return a token. Please try again." },
      { status: 400 },
    );
  }

  return exchangeForAccessToken("/auth/apple", {
    identityToken,
    ...(typeof name === "string" && name ? { name } : {}),
  });
}
