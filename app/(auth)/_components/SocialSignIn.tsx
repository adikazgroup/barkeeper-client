"use client";

import { useEffect, useState } from "react";

import { AppleIcon, GoogleIcon, LoaderIcon } from "@/components/icons/Icons";
import { BACKEND_URL } from "@/lib/auth/api";
import { cn } from "@/lib/utils";

import { rememberDestination } from "./useAccountSignIn";

type TProvider = "google" | "apple";

/**
 * Apple sign-in is off until the Apple credentials exist: every `APPLE_*` value
 * on the server is still blank, so the backend's own `isAppleOAuthConfigured`
 * is false and the flow would bounce straight back to /login?error=apple.
 * Flip this to true once the Services ID, team ID, key ID and .p8 are set.
 */
const APPLE_ENABLED = false;

interface SocialSignInProps {
  /** True while any other part of the screen is busy. */
  disabled?: boolean;
}

function SocialButton({
  onClick,
  disabled,
  busy,
  icon,
  title,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  busy: boolean;
  icon: React.ReactNode;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || busy}
      title={title}
      className={cn(
        "flex h-11 flex-1 items-center justify-center gap-2.5 rounded-lg border border-border bg-card/60 px-4 text-[13.5px] font-medium text-foreground backdrop-blur-sm transition-colors",
        "hover:border-primary/40 hover:bg-primary/5",
        "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-55",
      )}
    >
      {busy ? <LoaderIcon className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

/**
 * Google and Apple, both as a full-page redirect through the backend.
 *
 *   button -> <backend>/auth/<provider> -> the provider's consent screen
 *          -> <backend>/auth/<provider>/callback
 *          -> /login/<provider>/callback?code=…  (redeemed for a session there)
 *
 * No SDK runs in the page and no client id lives in the browser — the backend
 * owns the whole exchange and only ever hands back a one-time code. If a
 * provider is not configured on the server it sends the customer straight
 * back to /login?error=<provider>, which the login form explains.
 */
export function SocialSignIn({ disabled = false }: SocialSignInProps) {
  const [busy, setBusy] = useState<TProvider | null>(null);

  // Backing out of the provider's screen restores this page from the
  // back/forward cache, spinner and all — clear it so the buttons work again.
  useEffect(() => {
    const reset = (event: PageTransitionEvent) => {
      if (event.persisted) setBusy(null);
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const start = (provider: TProvider) => {
    setBusy(provider);
    // The round trip leaves the site, so the ?callbackUrl this page was opened
    // with would be lost — keep it for the callback page to honour.
    rememberDestination();
    // A full-page hop to the backend (another origin), not an internal route —
    // the provider's consent screen cannot be reached through the router.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`${BACKEND_URL}/auth/${provider}`);
  };

  return (
    <>
      <div className="flex gap-3">
        <SocialButton
          onClick={() => start("google")}
          disabled={disabled || busy !== null}
          busy={busy === "google"}
          icon={<GoogleIcon className="size-4" />}
        >
          Google
        </SocialButton>

        <SocialButton
          onClick={() => start("apple")}
          disabled={!APPLE_ENABLED || disabled || busy !== null}
          busy={busy === "apple"}
          icon={<AppleIcon className="size-4" />}
          title={APPLE_ENABLED ? undefined : "Under construction"}
        >
          Apple
        </SocialButton>
      </div>

      {!APPLE_ENABLED && (
        <p className="mt-2.5 text-center text-[12px] text-muted-foreground">
          Apple sign-in is under construction — please use Google or your email
          for now.
        </p>
      )}
    </>
  );
}

/** "or" rule between the social buttons and the email form. */
export function AuthDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
