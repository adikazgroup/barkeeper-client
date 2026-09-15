/**
 * Thin wrapper over the backend's `/auth/*` endpoints.
 *
 * Everything here is safe to call from the browser except the three that mint
 * a session (`/auth/login`, `/auth/google`, `/auth/apple`) — those run on our
 * own server behind `app/api/account/*` so the access token is handed straight
 * to NextAuth instead of passing through client code.
 */

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

/** The envelope every endpoint answers with, success or failure. */
export interface ApiEnvelope<T = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

/**
 * A non-2xx answer from the backend, carrying its own message so forms can
 * show what actually went wrong rather than a generic failure line.
 */
export class AuthApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

interface RequestOptions {
  /** Bearer token for the `[User]` endpoints. */
  token?: string;
  method?: "GET" | "POST" | "PATCH";
}

export async function authFetch<T>(
  path: string,
  body?: unknown,
  { token, method }: RequestOptions = {},
): Promise<ApiEnvelope<T>> {
  let response: Response;

  try {
    response = await fetch(`${BACKEND_URL}${path}`, {
      method: method ?? (body === undefined ? "GET" : "POST"),
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      // The refresh token is set as an httpOnly cookie, so the jar has to
      // travel with every call that might rotate or clear it.
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    // A dead network and a 500 read the same to a customer, but only this one
    // is worth retrying, so the copy says so.
    throw new AuthApiError(
      "Could not reach the server. Check your connection and try again.",
      0,
    );
  }

  // A proxy or gateway can answer with HTML, which would blow up `.json()`.
  const payload = (await response
    .json()
    .catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !payload?.success) {
    throw new AuthApiError(
      payload?.message || "Something went wrong. Please try again.",
      response.status,
    );
  }

  return payload;
}

/* ─── Account shape ─── */

/** The uploaded avatar, as the API stores it. */
export interface ProfilePicture {
  url: string;
  publicId?: string;
  title?: string;
  alt?: string;
}

/**
 * What `GET /users/me` returns. `/auth/register` and `/auth/verify-email`
 * answer with a trimmed version of the same record, which is why almost
 * everything past the identity is optional here.
 */
export interface AccountUser {
  _id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  /** Null until the customer sets one; checkout is where it starts to matter. */
  phone?: string | null;
  isPhoneVerified?: boolean;
  profilePicture?: ProfilePicture | null;
  /** How this account can sign in: `local`, `google`, `apple`. */
  authProviders?: string[];
  googleId?: string | null;
  appleId?: string | null;
  status?: "active" | "inactive";
  /** Set the first time the customer checks out. */
  stripeCustomerId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  /** Present on register only — `false` means the code did not go out. */
  verificationEmailSent?: boolean;
}

/**
 * True when the account has no password of its own — it was created through
 * Google or Apple and has only ever signed in that way.
 *
 * This is the one case where `/auth/change-password` takes no
 * `currentPassword`: there is none to give, and setting a first one is what
 * makes email sign-in available to them afterwards.
 */
export function hasNoPasswordYet(user: Pick<AccountUser, "authProviders">) {
  const providers = user.authProviders;
  return Array.isArray(providers) && providers.length > 0
    ? !providers.includes("local")
    : false;
}

/* ─── Public endpoints (browser-callable) ─── */

export function register(input: {
  name: string;
  email: string;
  password: string;
}) {
  return authFetch<AccountUser>("/auth/register", input);
}

export function verifyEmail(input: { email: string; otp: string }) {
  return authFetch<AccountUser>("/auth/verify-email", input);
}

export function resendVerification(email: string) {
  return authFetch<null>("/auth/resend-verification", { email });
}

export function forgotPassword(email: string) {
  return authFetch<null>("/auth/forgot-password", { email });
}

export function resetPassword(input: {
  email: string;
  otp: string;
  newPassword: string;
}) {
  return authFetch<null>("/auth/reset-password", input);
}

/* ─── Signed-in endpoints ─── */

/**
 * `currentPassword` is omitted only by an account created through Google or
 * Apple, which has no password yet and is setting its first one.
 */
export function changePassword(
  input: { currentPassword?: string; newPassword: string },
  token: string,
) {
  return authFetch<null>("/auth/change-password", input, { token });
}

export function getMe(token: string) {
  return authFetch<AccountUser>("/users/me", undefined, { token });
}
