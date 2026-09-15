import React from "react";

import { getAccount } from "@/lib/auth/account";
import { ClosingCta, SiteFooter, SiteHeader } from "./_components/home";

/**
 * The marketing shell.
 *
 * The signed-in account is read here rather than in the header itself: the
 * client session endpoint is not served in this app, and `getAccount()` is
 * already the gate `/profile` stands behind. Reading it once in the layout
 * means the bar paints the right state on the server, with no signed-out
 * flash before a fetch comes back.
 */
export default async function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Guarded: the bar is on every marketing page, and a failure in the auth
  // layer must degrade to a signed-out bar rather than take the page with it.
  let account = null;
  try {
    account = await getAccount();
  } catch (error) {
    console.error(
      "Could not read the signed-in account for the header:",
      error,
    );
  }

  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      <SiteHeader
        account={
          account
            ? {
                name: account.name,
                avatarUrl: account.profilePicture?.url ?? null,
              }
            : null
        }
      />
      {children}
      <ClosingCta />
      <SiteFooter />
    </div>
  );
}
