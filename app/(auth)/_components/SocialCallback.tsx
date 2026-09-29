"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LoaderIcon } from "@/components/icons/Icons";
import { AUTH_ROUTES } from "@/lib/auth/constants";

import { AuthAlert } from "./AuthAlert";
import { AuthHeading } from "./AuthHeading";
import { useAccountSignIn } from "./useAccountSignIn";

const LABELS = { google: "Google", apple: "Apple" } as const;

export type TSocialProvider = keyof typeof LABELS;

/**
 * Where the backend sends the browser once Google or Apple has said yes.
 *
 * The URL carries a one-time code, never a token. It is redeemed straight away
 * through the same session step every other sign-in ends with, and the
 * customer moves on to wherever they were headed before they left for the
 * provider.
 */
export function SocialCallback({ provider }: { provider: TSocialProvider }) {
  const { signInWith } = useAccountSignIn();
  const code = useSearchParams().get("code");
  const [failure, setFailure] = useState<string | null>(null);

  // The code is single use and React runs effects twice in development, so a
  // second redemption would fail and paint an error over a working sign-in.
  const started = useRef(false);

  useEffect(() => {
    if (!code || started.current) return;
    started.current = true;

    signInWith(`/api/account/${provider}`, { code }).then((result) => {
      if (result) setFailure(result.message);
    });
  }, [code, provider, signInWith]);

  const label = LABELS[provider];
  const shownFailure =
    failure ??
    (code
      ? null
      : `${label} did not send a sign-in code back. Please try again.`);

  if (shownFailure) {
    return (
      <>
        <AuthHeading
          title={`${label} sign-in`}
          subtitle="That did not go through — nothing was changed on your account."
        />

        <AuthAlert>{shownFailure}</AuthAlert>

        <Link
          href={AUTH_ROUTES.login}
          className="flex h-11 w-full items-center justify-center rounded-lg bg-primary text-[14px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Back to sign in
        </Link>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center py-6 text-center" role="status">
      <LoaderIcon className="mb-4 size-6 animate-spin text-primary" />
      <AuthHeading
        title={`Signing you in with ${label}`}
        subtitle="One moment — we are finishing up your session."
      />
    </div>
  );
}
