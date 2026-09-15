import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAccount } from "@/lib/auth/account";
import { hasNoPasswordYet } from "@/lib/auth/api";
import { AUTH_ROUTES } from "@/lib/auth/constants";

import { ChangePasswordCard } from "./_components/ChangePasswordCard";
import { ProfileForm } from "./_components/ProfileForm";

export const metadata: Metadata = {
  title: "Your Profile | Barkeeper’s",
  description:
    "Update your name, contact details, delivery address and ordering preferences at Barkeeper’s.",
};

export default async function ProfilePage() {
  // The layout has already guarded this, and `getAccount` is cached for the
  // render — so this is the same record, not a second call.
  const account = await getAccount();

  if (!account) {
    redirect(`${AUTH_ROUTES.login}?callbackUrl=/profile`);
  }

  // No wrapper spacing: each section is a ruled row of the page's frame, so
  // they stack against one another the way the home page's sections do.
  return (
    <>
      <ProfileForm
        account={{
          name: account.name,
          email: account.email,
          phone: account.phone ?? "",
          avatarUrl: account.profilePicture?.url ?? null,
          isEmailVerified: account.isEmailVerified,
          isPhoneVerified: account.isPhoneVerified ?? false,
        }}
      />

      <ChangePasswordCard
        // An account that has only ever used Google or Apple has no current
        // password to be asked for, so the field is dropped rather than left
        // there for them to guess at.
        needsCurrentPassword={!hasNoPasswordYet(account)}
      />
    </>
  );
}
