import { NextResponse, type NextRequest } from "next/server";

import type { NoAccountReason } from "@/lib/auth/account";
import { AUTH_ROUTES, SESSION_COOKIES } from "@/lib/auth/constants";

/**
 * Why the account could not be loaded, translated into the notice the sign-in
 * screen shows. A session that was refused and one that could not be checked
 * land the customer in the same place, but only one of them is their doing.
 */
const NOTICE_FOR: Record<NoAccountReason, string> = {
  "no-session": "expired",
  rejected: "expired",
  unreachable: "unavailable",
};

/**
 * The way out of a session that is over.
 *
 * `proxy.ts` can only see that a session cookie exists, so a cookie the real
 * check refuses — expired, revoked, signed with a rotated `AUTH_SECRET` — puts
 * the customer between two redirects: the proxy bounces them off `/login`
 * towards `/profile`, and `/profile` sends them straight back. Neither screen
 * ever renders.
 *
 * Clearing the cookie is what breaks that. The account screens redirect here
 * instead of to `/login` directly, so by the time the sign-in screen is asked
 * for, there is nothing left in the jar for the proxy to react to.
 *
 * A session that could not be checked at all — the backend down — comes
 * through here too. It costs that customer a fresh sign-in once the backend is
 * back, which is the cheaper of the two outcomes: the alternative is an error
 * page on a screen that has nothing to render, in front of a sign-in screen
 * the cookie is keeping them out of.
 *
 * A GET, because it is reached by a redirect out of a server render.
 */
export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const callbackUrl = searchParams.get("callbackUrl");
  const reason = searchParams.get("reason") as NoAccountReason | null;

  const url = request.nextUrl.clone();
  url.pathname = AUTH_ROUTES.login;
  url.search = "";
  url.searchParams.set(
    "reason",
    (reason && NOTICE_FOR[reason]) || NOTICE_FOR["no-session"],
  );

  // Same-origin paths only — an absolute URL here would make this an open
  // redirect wearing a sign-in screen.
  if (callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")) {
    url.searchParams.set("callbackUrl", callbackUrl);
  }

  const response = NextResponse.redirect(url);

  for (const cookie of request.cookies.getAll()) {
    const isSessionCookie = SESSION_COOKIES.some(
      (name) => cookie.name === name || cookie.name.startsWith(`${name}.`),
    );

    if (isSessionCookie) response.cookies.delete(cookie.name);
  }

  return response;
}
