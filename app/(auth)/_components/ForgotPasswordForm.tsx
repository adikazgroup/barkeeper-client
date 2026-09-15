"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { MailIcon } from "@/components/icons/Icons";
import { AuthApiError, forgotPassword } from "@/lib/auth/api";
import { AUTH_ROUTES, EMAIL_RE } from "@/lib/auth/constants";

import { AuthAlert } from "./AuthAlert";
import { AuthField } from "./AuthField";
import { AuthHeading } from "./AuthHeading";
import { AuthSubmit } from "./AuthSubmit";

/**
 * Asks for the reset code. The backend answers the same way for a registered
 * and an unregistered address, so this screen cannot be used to find out who
 * holds an account — the copy is written to match that.
 */
export function ForgotPasswordForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [failure, setFailure] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFailure(null);
    setError(undefined);

    const address = email.trim().toLowerCase();

    if (!address) {
      setError("Enter your email address.");
      return;
    }

    if (!EMAIL_RE.test(address)) {
      setError("That does not look like an email address.");
      return;
    }

    setSubmitting(true);

    try {
      await forgotPassword(address);
      router.push(
        `${AUTH_ROUTES.resetPassword}?email=${encodeURIComponent(address)}`,
      );
    } catch (err) {
      setSubmitting(false);
      setFailure(
        err instanceof AuthApiError
          ? err.message
          : "Could not send the code. Please try again.",
      );
    }
  };

  return (
    <>
      <AuthHeading
        title="Reset it"
        subtitle="Give us the address on your account and we’ll send a six-digit code to it."
      />

      {failure && <AuthAlert>{failure}</AuthAlert>}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <AuthField
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<MailIcon className="size-4.5" />}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={error}
          disabled={submitting}
          autoFocus
        />

        <AuthSubmit loading={submitting} loadingText="Sending code…">
          Send reset code
        </AuthSubmit>
      </form>

      <p className="mt-5 border-t border-border/50 pt-4 text-center text-[13.5px] text-muted-foreground">
        Remembered it?{" "}
        <Link
          href={AUTH_ROUTES.login}
          className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
        >
          Back to sign in
        </Link>
      </p>
    </>
  );
}
