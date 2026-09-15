import { NextResponse } from "next/server";

import { exchangeForAccessToken, readJson } from "@/lib/auth/session-routes";

/**
 * The browser finishes the Google flow itself and posts back whatever it got —
 * an ID token from One Tap, or an OAuth access token from the popup. The
 * backend tells the two apart, so both go over as `token` unchanged.
 */
export async function POST(request: Request) {
  const { token } = await readJson(request);

  if (typeof token !== "string" || !token) {
    return NextResponse.json(
      { message: "Google did not return a token. Please try again." },
      { status: 400 },
    );
  }

  return exchangeForAccessToken("/auth/google", { token });
}
