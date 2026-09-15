import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { AUTH_ROUTES } from "./constants";
import { getMe } from "./api";

/**
 * Reads the `exp` claim so the NextAuth session can expire alongside the
 * backend's own access token instead of outliving it.
 */
function readTokenExpiry(accessToken: string): number | null {
  try {
    const [, payload] = accessToken.split(".");
    const claims = JSON.parse(
      Buffer.from(payload, "base64").toString("utf8"),
    ) as { exp?: number };
    return claims.exp ? claims.exp * 1000 : null;
  } catch {
    return null;
  }
}

/**
 * One provider, one job: turn a backend access token into a NextAuth session.
 *
 * The three ways in — email/password, Google and Apple — all end at the same
 * place, a token from the backend, so they share this provider rather than
 * having one each. Each flow calls its own route under `app/api/account/`
 * first, which is what lets a form show the backend's real message ("Please
 * verify your email") — a message thrown inside `authorize()` would reach the
 * client as NextAuth's opaque `CredentialsSignin` instead.
 *
 * The token is not taken on trust: `GET /users/me` has to accept it before a
 * session is issued, so a made-up value gets nothing.
 */
export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: AUTH_ROUTES.login,
    error: AUTH_ROUTES.login,
  },
  providers: [
    Credentials({
      id: "backend-token",
      name: "Duffy's account",
      credentials: {
        accessToken: { label: "Access token", type: "text" },
      },
      async authorize(credentials) {
        const accessToken =
          typeof credentials?.accessToken === "string"
            ? credentials.accessToken
            : "";

        if (!accessToken) return null;

        try {
          const { data: user } = await getMe(accessToken);

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            image: user.profilePicture?.url ?? null,
            accessToken,
            isEmailVerified: user.isEmailVerified,
            authProviders: user.authProviders ?? [],
          };
        } catch (error) {
          console.error("Rejected an access token at sign-in:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Sign-in: keep the backend token and the moment it dies.
      if (user) {
        token.accessToken = user.accessToken;
        token.accessTokenExpires = readTokenExpiry(user.accessToken);
        token.isEmailVerified = user.isEmailVerified;
        token.authProviders = user.authProviders;
        token.picture = user.image ?? null;
      }

      // `useSession().update()` after a profile edit — refresh the copy of the
      // name and avatar the header paints, without a round trip to sign-in.
      if (trigger === "update" && session?.user) {
        token.name = session.user.name ?? token.name;
        token.picture = session.user.image ?? token.picture;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.sub ?? "";
      session.user.isEmailVerified = token.isEmailVerified ?? false;
      session.user.authProviders = token.authProviders ?? [];

      // The backend would reject this token now. Say so rather than letting
      // every signed-in call fail one by one — `SessionGuard` signs out on it.
      if (token.accessTokenExpires && Date.now() >= token.accessTokenExpires) {
        session.error = "AccessTokenExpired";
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
