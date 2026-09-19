"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { LockIcon, MailIcon } from "@/components/icons/Icons";
import { AUTH_ROUTES, EMAIL_RE } from "@/lib/auth/constants";

import { AuthAlert } from "./AuthAlert";
import { AuthField } from "./AuthField";
import { AuthHeading } from "./AuthHeading";
import { AuthSubmit } from "./AuthSubmit";
import { AuthDivider, SocialSignIn } from "./SocialSignIn";
import { useAccountSignIn } from "./useAccountSignIn";

/**
 * Notices other screens hand over on the query string. Kept here because this
 * is where every one of them lands.
 */
const NOTICES: Record<string, { tone: "error" | "success"; message: string }> = {
  "signed-out": { tone: "success", message: "Signed out. See you soon!" },
  expired: {
    tone: "error",
    message: "Your session expired. Please sign in again.",
  },
  unavailable: {
    tone: "error",
    message: "We could not check your session just now. Please sign in again.",
  },
  verified: {
    tone: "success",
    message: "Email verified — sign in to finish setting up.",
  },
  "account-deleted": {
    tone: "success",
    message: "Your account is closed. Sign up any time.",
  },
  "password-reset": {
    tone: "success",
    message: "Password updated. Sign in with your new one.",
  },
};

interface Errors {
  email?: string;
  password?: string;
}

export function LoginForm() {
  const { signInWith, pending } = useAccountSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState<string | null>(null);
  /** Set when the backend says the address is not verified yet. */
  const [unverified, setUnverified] = useState(false);

  // Whatever screen sent them here left its note on the query string. It is
  // read straight off the URL rather than copied into state — the only thing
  // worth remembering is that they have moved on from it.
  const reason = useSearchParams().get("reason");
  const [noticeDismissed, setNoticeDismissed] = useState(false);
  const notice = !noticeDismissed && reason ? NOTICES[reason] : undefined;

  const validate = () => {
    const next: Errors = {};
    if (!email.trim()) next.email = "Enter your email address.";
    else if (!EMAIL_RE.test(email.trim()))
      next.email = "That does not look like an email address.";
    if (!password) next.password = "Enter your password.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFailure(null);
    setNoticeDismissed(true);
    setUnverified(false);

    if (!validate()) return;

    const result = await signInWith("/api/account/login", {
      email: email.trim().toLowerCase(),
      password,
    });

    if (!result) return;

    setFailure(result.message);
    // The backend words this differently depending on the case, so the offer
    // to verify is driven off the message rather than a status code.
    setUnverified(/verif/i.test(result.message));
  };

  const verifyHref = `${AUTH_ROUTES.verifyEmail}?email=${encodeURIComponent(
    email.trim().toLowerCase(),
  )}`;

  return (
    <>
      <AuthHeading
        title="Sign in"
        subtitle="Your orders, tables and favourites — right where you left them."
      />

      {notice && <AuthAlert tone={notice.tone}>{notice.message}</AuthAlert>}

      {failure && (
        <AuthAlert>
          {failure}
          {unverified && (
            <>
              {" "}
              <Link
                href={verifyHref}
                className="font-semibold underline underline-offset-2"
              >
                Verify it now
              </Link>
            </>
          )}
        </AuthAlert>
      )}

      <SocialSignIn
        signInWith={signInWith}
        onError={setFailure}
        disabled={pending}
      />

      <AuthDivider label="or with email" />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthField
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<MailIcon className="size-4.5 text-foreground" strokeWidth={1.5} />}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          disabled={pending}
        />

        <AuthField
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="Your password"
          revealable
          icon={<LockIcon className="size-4.5 text-foreground cursor-pointer" strokeWidth={1.5} />}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          disabled={pending}
          action={
            <Link
              href={AUTH_ROUTES.forgotPassword}
              className="text-[12px] font-medium text-primary transition-colors hover:text-primary/80"
            >
              Forgot password?
            </Link>
          }
        />

        <div className="pt-2">
          <AuthSubmit loading={pending} loadingText="Signing you in…">
            Sign in
          </AuthSubmit>
        </div>
      </form>

      <p className="mt-5 border-t border-border/50 pt-4 text-center text-[13.5px] text-muted-foreground">
        New to Barkeeper?{" "}
        <Link
          href={AUTH_ROUTES.register}
          className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
        >
          Create an account
        </Link>
      </p>
    </>
  );
}
