import { NextResponse } from "next/server";

import { exchangeForAccessToken, readJson } from "@/lib/auth/session-routes";

/**
 * The last leg of "Continue with Google". The backend finished the Google flow
 * itself and sent the browser to /login/google/callback with a one-time code;
 * that page posts the code here, and the access token that comes back becomes
 * the NextAuth session — the same step an email sign-in ends with.
 */
export async function POST(request: Request) {
  const { code } = await readJson(request);

  if (typeof code !== "string" || !code) {
    return NextResponse.json(
      { message: "Google did not return a sign-in code. Please try again." },
      { status: 400 },
    );
  }

  return exchangeForAccessToken("/auth/google/exchange", { code });
}
