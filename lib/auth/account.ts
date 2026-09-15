import { cache } from "react";

// Server-only by construction: it reads the session cookie through `auth()`,
// which throws outside a server render.

import { auth } from "@/auth";

import { AuthApiError, getMe, type AccountUser } from "./api";

/**
 * The signed-in account, read fresh from the backend.
 *
 * The session cookie carries a snapshot taken at sign-in, which goes stale the
 * moment anything changes — a phone number added, an avatar uploaded, Google
 * linked to an existing login. The account screens want the live record, so
 * they ask `/users/me` for it on every visit.
 *
 * `cache()` keeps that to one call per render: the layout paints the name and
 * avatar, the page fills the form, and both share the same answer.
 *
 * Returns `null` when there is no session at all. When there is one but the
 * backend refuses it — expired token, revoked account — it also returns `null`,
 * so callers treat both as "not signed in" and send the customer back to the
 * sign-in screen rather than showing a half-empty account.
 */
/**
 * Why there is no account to show.
 *
 * `no-session` and `rejected` both mean the customer is signed out and the
 * cookie in their jar is worthless. `unreachable` is the opposite: the session
 * is very likely fine and the backend simply did not answer, so treating it as
 * a sign-out would log people out over a blip.
 */
export type NoAccountReason = "no-session" | "rejected" | "unreachable";

export type AccountResult =
  | { account: AccountUser; reason?: undefined }
  | { account: null; reason: NoAccountReason };

/**
 * The cached half, so `getAccount()` and any caller that needs the reason
 * share one `/users/me` call per render.
 */
const loadAccount = cache(async (): Promise<AccountResult> => {
  const session = await auth();

  if (!session?.accessToken) return { account: null, reason: "no-session" };
  if (session.error) return { account: null, reason: "rejected" };

  try {
    const { data } = await getMe(session.accessToken);
    return { account: data };
  } catch (error) {
    // A 401 means the token is dead and the session with it. Anything else —
    // the backend down, a network blip — leaves us with nothing to render but
    // says nothing about whether the customer is signed in.
    if (error instanceof AuthApiError && error.status === 401) {
      return { account: null, reason: "rejected" };
    }

    console.error("Could not load the signed-in account:", error);
    return { account: null, reason: "unreachable" };
  }
});

export const getAccount = async (): Promise<AccountUser | null> =>
  (await loadAccount()).account;

/** The same read, for callers that have to act on *why* it came back empty. */
export const getAccountResult = (): Promise<AccountResult> => loadAccount();
