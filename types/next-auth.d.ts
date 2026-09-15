import type { DefaultSession } from "next-auth";

/**
 * The session carries the backend's access token, because every `[User]`
 * endpoint is called with it as a bearer.
 *
 * The verified flag is called `isEmailVerified` rather than `emailVerified`:
 * the adapter's own `emailVerified` is a `Date | null`, and reusing the name
 * would collide with it.
 */
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    /** Set once the access token is past its `exp` — see `SessionGuard`. */
    error?: "AccessTokenExpired";
    user: {
      id: string;
      isEmailVerified: boolean;
      /** How this account can sign in: `local`, `google`, `apple`. */
      authProviders: string[];
    } & DefaultSession["user"];
  }

  interface User {
    accessToken: string;
    isEmailVerified: boolean;
    authProviders: string[];
  }
}

/**
 * `next-auth/jwt` only re-exports this module, so the augmentation has to name
 * the module the interface actually lives in.
 */
declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string;
    /** Milliseconds since the epoch; `null` when the token carries no `exp`. */
    accessTokenExpires?: number | null;
    isEmailVerified?: boolean;
    authProviders?: string[];
  }
}

export {};
