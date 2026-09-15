"use client";

import Script from "next/script";
import { useCallback, useState } from "react";

import { AppleIcon, GoogleIcon, LoaderIcon } from "@/components/icons/Icons";
import { cn } from "@/lib/utils";

import type { SignInFailure } from "./useAccountSignIn";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
const APPLE_REDIRECT_URI = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI;

/* ─── The two SDKs, described only as far as this file uses them ─── */

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
}

interface AppleSignInResponse {
  authorization?: { id_token?: string };
  user?: { name?: { firstName?: string; lastName?: string } };
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient(config: {
            client_id: string;
            scope: string;
            callback: (response: GoogleTokenResponse) => void;
            error_callback?: (error: { type?: string }) => void;
          }): { requestAccessToken(): void };
        };
      };
    };
    AppleID?: {
      auth: {
        init(config: {
          clientId: string;
          scope: string;
          redirectURI: string;
          usePopup: boolean;
        }): void;
        signIn(): Promise<AppleSignInResponse>;
      };
    };
  }
}

interface SocialSignInProps {
  /** From `useAccountSignIn` — the same session step the email form uses. */
  signInWith: (
    path: string,
    body: Record<string, unknown>,
  ) => Promise<SignInFailure | null>;
  onError: (message: string) => void;
  /** True while any other part of the screen is busy. */
  disabled?: boolean;
}

function SocialButton({
  onClick,
  disabled,
  busy,
  icon,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  busy: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || busy}
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
 * Google and Apple, both finished in the browser.
 *
 * Neither SDK is bundled — the scripts load lazily and only what they hand back
 * (Google's access token, Apple's identity token) is posted on. The backend
 * verifies each with its issuer, so nothing here is trusted on its own.
 */
export function SocialSignIn({
  signInWith,
  onError,
  disabled = false,
}: SocialSignInProps) {
  const [busy, setBusy] = useState<"google" | "apple" | null>(null);

  const handleGoogle = useCallback(() => {
    if (!GOOGLE_CLIENT_ID) {
      onError("Google sign-in is not configured yet.");
      return;
    }

    if (!window.google?.accounts?.oauth2) {
      onError("Google is still loading. Try again in a moment.");
      return;
    }

    setBusy("google");

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      callback: async (response) => {
        if (!response.access_token) {
          setBusy(null);
          // A closed popup is a choice, not a fault — say nothing for it.
          if (response.error && response.error !== "access_denied") {
            onError("Google sign-in did not complete. Please try again.");
          }
          return;
        }

        const failure = await signInWith("/api/account/google", {
          token: response.access_token,
        });

        setBusy(null);
        if (failure) onError(failure.message);
      },
      error_callback: () => setBusy(null),
    });

    client.requestAccessToken();
  }, [onError, signInWith]);

  const handleApple = useCallback(async () => {
    if (!APPLE_CLIENT_ID || !APPLE_REDIRECT_URI) {
      onError("Apple sign-in is not configured yet.");
      return;
    }

    if (!window.AppleID) {
      onError("Apple is still loading. Try again in a moment.");
      return;
    }

    setBusy("apple");

    try {
      window.AppleID.auth.init({
        clientId: APPLE_CLIENT_ID,
        scope: "name email",
        redirectURI: APPLE_REDIRECT_URI,
        usePopup: true,
      });

      const response = await window.AppleID.auth.signIn();
      const identityToken = response.authorization?.id_token;

      if (!identityToken) {
        setBusy(null);
        onError("Apple sign-in did not complete. Please try again.");
        return;
      }

      // Apple returns the name on the first authorization only, and never
      // inside the token — so it is passed alongside it or lost for good.
      const first = response.user?.name?.firstName ?? "";
      const last = response.user?.name?.lastName ?? "";
      const name = `${first} ${last}`.trim();

      const failure = await signInWith("/api/account/apple", {
        identityToken,
        ...(name ? { name } : {}),
      });

      setBusy(null);
      if (failure) onError(failure.message);
    } catch {
      // The SDK rejects when the customer dismisses the popup as well.
      setBusy(null);
    }
  }, [onError, signInWith]);

  return (
    <>
      {GOOGLE_CLIENT_ID && (
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="lazyOnload"
        />
      )}
      {APPLE_CLIENT_ID && (
        <Script
          src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
          strategy="lazyOnload"
        />
      )}

      <div className="flex gap-3">
        <SocialButton
          onClick={handleGoogle}
          disabled={disabled}
          busy={busy === "google"}
          icon={<GoogleIcon className="size-4" />}
        >
          Google
        </SocialButton>

        <SocialButton
          onClick={handleApple}
          disabled={disabled}
          busy={busy === "apple"}
          icon={<AppleIcon className="size-4" />}
        >
          Apple
        </SocialButton>
      </div>
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
