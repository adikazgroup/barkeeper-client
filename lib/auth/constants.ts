/**
 * Single source of truth for the auth routes. Import these instead of
 * hardcoding strings so links stay correct if the routes ever move.
 */
export const AUTH_ROUTES = {
  login: "/login",
  register: "/register",
  verifyEmail: "/verify-email",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
} as const;

/**
 * The cookies NextAuth signs the session into — plain over http, `__Secure-`
 * prefixed once the site is on https. A session too large for one cookie is
 * split into `<name>.0`, `<name>.1`, …, so anything clearing these has to
 * sweep the numbered chunks too.
 */
export const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
] as const;

/** Clears a stale session cookie before sending the customer back to sign-in. */
export const SESSION_ENDED_ROUTE = "/api/account/session-ended";

/**
 * Every path under these prefixes needs a signed-in customer.
 *
 * Checkout and the two pages Stripe returns to are on the list for the same
 * reason the account is: all three read or change one person's order, and none
 * of them has anything to draw without the session that owns it.
 */
export const PROTECTED_PREFIXES = [
  "/profile",
  "/checkout",
  "/payment",
] as const;

/** Where a customer lands once they are signed in. */
export const AFTER_LOGIN_ROUTE = "/profile";

/** Shared email shape check — used by every auth form. */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The backend's own floor. Anything shorter is rejected server-side too. */
export const MIN_PASSWORD_LENGTH = 6;

/**
 * Advisory strength hints shown as live chips wherever a customer picks a new
 * password. Only the length rule is enforced on submit — the rest are guidance,
 * so an existing account with a short-but-valid password is never locked out.
 */
export const PASSWORD_HINTS: { label: string; test: (v: string) => boolean }[] =
  [
    { label: "6+ characters", test: (v) => v.length >= MIN_PASSWORD_LENGTH },
    { label: "1 uppercase", test: (v) => /[A-Z]/.test(v) },
    { label: "1 number", test: (v) => /[0-9]/.test(v) },
    { label: "1 symbol", test: (v) => /[^A-Za-z0-9]/.test(v) },
  ];

/** Length of every code the backend mails (verification and reset alike). */
export const OTP_LENGTH = 6;

/** How long the backend keeps a mailed code alive. Mirrored in the copy. */
export const OTP_TTL_MINUTES = 15;

/** Cool-off before the "Resend" affordance comes back, in seconds. */
export const RESEND_COOLDOWN_SECONDS = 60;

/**
 * What the avatar field will take. The backend has its own limits; these are
 * here so a file that was never going to be accepted is caught in the browser
 * rather than after a round trip.
 */
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
export const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
/** The `accept` attribute, kept in step with `AVATAR_TYPES`. */
export const AVATAR_ACCEPT = AVATAR_TYPES.join(",");
