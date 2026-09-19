import { NextResponse, type NextRequest } from "next/server";

import {
  AUTH_ROUTES,
  PROTECTED_PREFIXES,
  SESSION_COOKIES,
} from "@/lib/auth/constants";

/**
 * An optimistic gate, not the authorization itself.
 *
 * It only checks that a session cookie is *present*, because verifying the JWT
 * here would pull the whole Node crypto path into the proxy runtime for every
 * request. The real check is `auth()` inside the protected pages — this just
 * saves a signed-out visitor from loading an account screen that would only
 * bounce them back.
 *
 * Because the optimism runs both ways, a cookie the real check refuses would
 * otherwise trap a customer between the two redirects. It does not, because
 * the account screens hand a refused session to `/api/account/session-ended`,
 * which drops the cookie before the sign-in screen is asked for.
 */

/** Signed-in customers have no business on the sign-in screens. */
const AUTH_PAGES: string[] = Object.values(AUTH_ROUTES);

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const hasSession = SESSION_COOKIES.some((name) => request.cookies.has(name));

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = AUTH_ROUTES.login;
    url.search = "";
    // Bring them back to the page they actually wanted once they are in.
    url.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  if (hasSession && AUTH_PAGES.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/profile";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/checkout",
    "/payment/:path*",
    "/login",
    "/register",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
  ],
};
