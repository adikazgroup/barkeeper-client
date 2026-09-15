"use client";

import type { ReactNode } from "react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

/**
 * Makes the session readable from client components.
 *
 * Most of the app does not need this: pages read the account on the server
 * through `getAccount()`, which is both fresher and cheaper. The exception is
 * a form that has to call the backend as the customer — changing a password —
 * because that needs the access token in the browser.
 *
 * `session` is handed in from the server so the provider starts with an answer
 * instead of fetching one, which is what would otherwise flash a signed-out
 * state on the first paint.
 */
export function AuthProvider({
  session,
  children,
}: {
  session: Session | null;
  children: ReactNode;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
