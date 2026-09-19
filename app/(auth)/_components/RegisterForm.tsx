"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { LockIcon, MailIcon, UserIcon } from "@/components/icons/Icons";
import { AuthApiError, register } from "@/lib/auth/api";
import {
  AUTH_ROUTES,
  EMAIL_RE,
  MIN_PASSWORD_LENGTH,
  PASSWORD_HINTS,
} from "@/lib/auth/constants";

import { AuthAlert } from "./AuthAlert";
import { AuthField, PasswordHints } from "./AuthField";
import { AuthHeading } from "./AuthHeading";
import { AuthSubmit } from "./AuthSubmit";
import { AuthDivider, SocialSignIn } from "./SocialSignIn";
import { useAccountSignIn } from "./useAccountSignIn";

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

export function RegisterForm() {
  const router = useRouter();
  // Google and Apple sign a customer straight in, so registering through them
  // reuses the same session step the sign-in screen uses.
  const { signInWith, pending: socialPending } = useAccountSignIn();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const busy = submitting || socialPending;

  const validate = () => {
    const next: Errors = {};

    if (!name.trim()) next.name = "Tell us what to call you.";
    else if (name.trim().length < 2) next.name = "That name looks too short.";

    if (!email.trim()) next.email = "Enter your email address.";
    else if (!EMAIL_RE.test(email.trim()))
      next.email = "That does not look like an email address.";

    if (!password) next.password = "Choose a password.";
    else if (password.length < MIN_PASSWORD_LENGTH)
      next.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;

    if (confirm !== password) next.confirm = "The two passwords do not match.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFailure(null);

    if (!validate()) return;

    const address = email.trim().toLowerCase();
    setSubmitting(true);

    try {
      const { data } = await register({
        name: name.trim(),
        email: address,
        password,
      });

      // The account is real either way; `verificationEmailSent: false` only
      // means the code did not go out, so the next screen leads with Resend.
      const query = new URLSearchParams({ email: address });
      if (data?.verificationEmailSent === false) query.set("mail", "failed");

      router.push(`${AUTH_ROUTES.verifyEmail}?${query.toString()}`);
    } catch (error) {
      setSubmitting(false);
      setFailure(
        error instanceof AuthApiError
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <>
      <AuthHeading
        title="Create account"
        subtitle="One account for ordering, booking and every offer we run."
      />

      {failure && <AuthAlert>{failure}</AuthAlert>}

      <SocialSignIn
        signInWith={signInWith}
        onError={setFailure}
        disabled={busy}
      />

      <AuthDivider label="or with email" />

      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        <AuthField
          label="Full name"
          name="name"
          autoComplete="name"
          placeholder="Jane Cooper"
          icon={<UserIcon className="size-4.5" strokeWidth={1.5} />}
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name}
          disabled={busy}
        />

        <AuthField
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<MailIcon className="size-4.5" strokeWidth={1.5} />}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          disabled={busy}
        />

        {/* The two password fields share a row from `sm` up — they are one
            question asked twice, so they belong side by side. */}
        <div className="space-y-2.5">
          <div className="grid gap-4 sm:grid-cols-2">
            <AuthField
              label="Password"
              name="password"
              autoComplete="new-password"
              placeholder="6+ characters"
              revealable
              icon={<LockIcon className="size-4.5" strokeWidth={1.5} />}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={errors.password}
              disabled={busy}
            />

            <AuthField
              label="Confirm password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Repeat it"
              revealable
              icon={<LockIcon className="size-4.5" strokeWidth={1.5} />}
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              error={errors.confirm}
              disabled={busy}
            />
          </div>

          {/* Under both, not under one column — otherwise the chips would
              stretch the left field and leave the row uneven. */}
          {password && <PasswordHints value={password} hints={PASSWORD_HINTS} />}
        </div>

        <div className="pt-1">
          <AuthSubmit loading={submitting} loadingText="Creating account…">
            Create account
          </AuthSubmit>
        </div>

        <p className="text-[12px] leading-[1.7] text-muted-foreground">
          By continuing you agree to our{" "}
          <Link
            href="/terms"
            className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary">
            privacy policy
          </Link>
          .
        </p>
      </form>

      <p className="mt-5 border-t border-border/50 pt-4 text-center text-[13.5px] text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={AUTH_ROUTES.login}
          className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
