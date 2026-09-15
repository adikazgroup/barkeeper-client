"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { AFTER_LOGIN_ROUTE } from "@/lib/auth/constants";

/**
 * Only same-origin paths are honoured. An absolute URL in `callbackUrl` would
 * otherwise turn the sign-in screen into an open redirect.
 */
function intendedDestination(): string {
  if (typeof window === "undefined") return AFTER_LOGIN_ROUTE;

  const callbackUrl = new URLSearchParams(window.location.search).get(
    "callbackUrl",
  );

  if (!callbackUrl?.startsWith("/") || callbackUrl.startsWith("//")) {
    return AFTER_LOGIN_ROUTE;
  }

  return callbackUrl;
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
