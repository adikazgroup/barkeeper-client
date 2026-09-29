"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { AFTER_LOGIN_ROUTE } from "@/lib/auth/constants";

/** Where a Google/Apple round trip parks the page it should come back to. */
const DESTINATION_KEY = "barkeeper:after-sign-in";

/**
 * Only same-origin paths are honoured. An absolute URL in `callbackUrl` would
 * otherwise turn the sign-in screen into an open redirect.
 */
const isSafePath = (path: string | null | undefined): path is string =>
  Boolean(path?.startsWith("/") && !path.startsWith("//"));

const readStoredDestination = (): string | null => {
  try {
    return sessionStorage.getItem(DESTINATION_KEY);
  } catch {
    return null;
  }
};

/**
 * Called just before leaving for Google or Apple: the provider round trip
 * lands on /login/<provider>/callback, which has no `?callbackUrl` of its own.
 */
export function rememberDestination(): void {
  const callbackUrl = new URLSearchParams(window.location.search).get(
    "callbackUrl",
  );

  try {
    if (isSafePath(callbackUrl)) {
      sessionStorage.setItem(DESTINATION_KEY, callbackUrl);
    } else {
      sessionStorage.removeItem(DESTINATION_KEY);
    }
  } catch {
    // Storage blocked (private mode): they simply land on the default page.
  }
}

function intendedDestination(): string {
  if (typeof window === "undefined") return AFTER_LOGIN_ROUTE;

  const callbackUrl = new URLSearchParams(window.location.search).get(
    "callbackUrl",
  );
  if (isSafePath(callbackUrl)) return callbackUrl;

  const stored = readStoredDestination();
  try {
    sessionStorage.removeItem(DESTINATION_KEY);
  } catch {
    // Nothing to clean up.
  }

  return isSafePath(stored) ? stored : AFTER_LOGIN_ROUTE;
}

export interface SignInFailure {
  message: string;
  status: number;
}

/**
 * The second half of every way in.
 *
 * Each flow first posts to its own route under `/api/account/`, which is where
 * the backend's message survives intact; this then trades the access token that
 * comes back for a NextAuth session and moves the customer on. Splitting it
 * this way means Google, Apple and email/password share one session step.
 */
export function useAccountSignIn() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const signInWith = useCallback(
    async (
      path: string,
      body: Record<string, unknown>,
    ): Promise<SignInFailure | null> => {
      setPending(true);

      try {
        const response = await fetch(path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const payload = (await response.json().catch(() => null)) as {
          accessToken?: string;
          message?: string;
        } | null;

        if (!response.ok || !payload?.accessToken) {
          setPending(false);
          return {
            message:
              payload?.message ?? "Something went wrong. Please try again.",
            status: response.status,
          };
        }

        const result = await signIn("backend-token", {
          accessToken: payload.accessToken,
          redirect: false,
        });

        if (!result || result.error) {
          setPending(false);
          return {
            message: "We could not start your session. Please try again.",
            status: 500,
          };
        }

        // Leave `pending` on: the redirect is part of the same wait, and
        // re-enabling the button under a navigating page only invites a
        // second submit.
        router.replace(intendedDestination());
        router.refresh();
        return null;
      } catch (error) {
        console.error(`Sign-in through ${path} failed:`, error);
        setPending(false);
        return {
          message:
            "Could not reach the server. Check your connection and try again.",
          status: 0,
        };
      }
    },
    [router],
  );

  return { signInWith, pending, setPending };
}
