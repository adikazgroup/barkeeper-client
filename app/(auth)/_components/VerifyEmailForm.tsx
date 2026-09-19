"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { MailIcon } from "@/components/icons/Icons";
import {
  AuthApiError,
  resendVerification,
  verifyEmail,
} from "@/lib/auth/api";
import {
  AUTH_ROUTES,
  EMAIL_RE,
  OTP_TTL_MINUTES,
} from "@/lib/auth/constants";

import { AuthAlert } from "./AuthAlert";
import { AuthField } from "./AuthField";
import { AuthHeading } from "./AuthHeading";
import { AuthSubmit } from "./AuthSubmit";
import { isCompleteOtp, OtpInput } from "./OtpInput";
import { useCooldown } from "./useCooldown";

/**
 * Verifying proves the mailbox, not that whoever is at the keyboard knows the
 * password — so this never signs anyone in. It hands them to the sign-in
 * screen with a note saying the address is now confirmed.
 */
export function VerifyEmailForm() {
  const router = useRouter();
  const cooldown = useCooldown();

  // Register hands the address over on the query string; someone arriving here
  // cold types it in themselves.
  const params = useSearchParams();
  const [email, setEmail] = useState(() => params.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [failure, setFailure] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  // `mail=failed` means the account was created but the code never went out,
  // so the screen leads with Resend instead of an empty wait.
  const mailFailed = params.get("mail") === "failed";
  const shownNotice =
    notice ??
    (mailFailed
      ? "Your account is ready, but the code could not be sent. Use Resend below."
      : null);

  const submit = async (code: string) => {
    setFailure(null);

    if (!EMAIL_RE.test(email.trim())) {
      setFailure("Enter the email address you registered with.");
      return;
    }

    if (!isCompleteOtp(code)) {
      setFailure("Enter all six digits of the code.");
      return;
    }

    setSubmitting(true);

    try {
      await verifyEmail({ email: email.trim().toLowerCase(), otp: code });
      toast.success("Email verified!");
      router.replace(`${AUTH_ROUTES.login}?reason=verified`);
    } catch (error) {
      setSubmitting(false);
      setOtp("");
      setFailure(
        error instanceof AuthApiError
          ? error.message
          : "That code did not work. Please try again.",
      );
    }
  };

  const handleResend = async () => {
    setFailure(null);
    setNotice(null);

    if (!EMAIL_RE.test(email.trim())) {
      setFailure("Enter the email address you registered with.");
      return;
    }

    setResending(true);

    try {
      const { message } = await resendVerification(email.trim().toLowerCase());
      // Unknown, already-verified and genuinely pending addresses all answer
      // the same way, so the backend's wording is passed through untouched.
      setNotice(message || "We've sent a new code.");
      cooldown.start();
    } catch (error) {
      setFailure(
        error instanceof AuthApiError
          ? error.message
          : "Could not send a new code. Please try again.",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <AuthHeading
        title="Verify email"
        subtitle={
          <>
            We sent a six-digit code to{" "}
            <span className="font-medium text-foreground">
              {email || "your inbox"}
            </span>
            . It expires in {OTP_TTL_MINUTES} minutes.
          </>
        }
      />

      {shownNotice && <AuthAlert tone="success">{shownNotice}</AuthAlert>}
      {failure && <AuthAlert>{failure}</AuthAlert>}

      <form
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          submit(otp);
        }}
        noValidate
        className="space-y-5"
      >
        <AuthField
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<MailIcon className="size-4.5" strokeWidth={1.5} />}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={submitting}
        />

        <div className="space-y-2">
          <span className="block text-[13px] font-medium text-foreground">
            Verification code
          </span>
          <OtpInput
            value={otp}
            onChange={setOtp}
            // Six digits in and there is nothing left to decide — send it.
            onComplete={submit}
            disabled={submitting}
            invalid={Boolean(failure) && otp.length === 0}
            autoFocus
          />
        </div>

        <AuthSubmit loading={submitting} loadingText="Verifying…">
          Verify email
        </AuthSubmit>
      </form>

      <div className="mt-5 space-y-3 border-t border-border/50 pt-4 text-center text-[13.5px] text-muted-foreground">
        <p className="text-muted-foreground">
          Didn&rsquo;t get it? Check spam, or{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown.active || submitting}
            className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
          >
            {cooldown.active
              ? `resend in ${cooldown.remaining}s`
              : resending
                ? "sending…"
                : "send a new code"}
          </button>
        </p>

        <p className="text-muted-foreground">
          <Link
            href={AUTH_ROUTES.login}
            className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </>
  );
}
