import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getAccountResult } from "@/lib/auth/account";
import { AuthProvider } from "@/components/providers";
import { SESSION_ENDED_ROUTE } from "@/lib/auth/constants";

import { ProfileHero } from "./_components/ProfileHero";
import { ProfileNav } from "./_components/ProfileNav";

export const metadata: Metadata = {
  title: "Your Account | Barkeeper’s",
  description:
    "Your details, your orders and your payments at Barkeeper’s — all in one place.",
  // An account is one person's, and nothing a crawler should index.
  robots: { index: false, follow: true },
};

/**
 * The shell the three account pages share: the band up top, the rail under it,
 * and the page's frame around whichever room is open. Keeping it in a layout
 * means moving between the pages never repaints the band or moves the rail.
 *
 * The sign-in check lives here rather than in each page, so every room behind
 * it is covered by one gate. `proxy.ts` only looks for the cookie; this loads
 * the account behind it, which is what a forged, expired or revoked one fails.
 */
export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ account, reason }, session] = await Promise.all([
    getAccountResult(),
    auth(),
  ]);

  // No account to show, whatever the cause — an expired session, a revoked
  // one, or a backend that did not answer. All of it ends at the sign-in
  // screen rather than an error page: there is nothing an account screen can
  // render without an account, and sign-in is where the customer was headed
  // anyway. `reason` only decides the wording they are met with.
  //
  // Out through the route that clears the cookie, too. Redirecting to `/login`
  // with a session still in the jar only has `proxy.ts` send them back here,
  // and the two redirects chase each other forever.
  if (!account) {
    redirect(`${SESSION_ENDED_ROUTE}?reason=${reason}&callbackUrl=/profile`);
  }

  // The account screens are the only place a client component needs the
  // session — the change-password form calls the backend as the customer — so
  // the provider is mounted here rather than around the whole app.
  return (
    <AuthProvider session={session}>
      <main>
        <ProfileHero
          name={account.name}
          avatarUrl={account.profilePicture?.url ?? null}
          createdAt={account.createdAt}
        />

        <ProfileNav />

        {/* The frame every room is drawn in — the same box the home page's
            sections sit in, so the account is measured against the same
            edges. */}
        <div className="mx-auto max-w-7xl">
          <div className="min-w-0 border-x border-border/50">{children}</div>
        </div>
      </main>
    </AuthProvider>
  );
}
