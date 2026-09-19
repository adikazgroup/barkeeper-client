"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { LockIcon, MailIcon } from "@/components/icons/Icons";
import { AuthApiError, forgotPassword, resetPassword } from "@/lib/auth/api";
import {
  AUTH_ROUTES,
  EMAIL_RE,
  MIN_PASSWORD_LENGTH,
  OTP_TTL_MINUTES,
  PASSWORD_HINTS,
} from "@/lib/auth/constants";

import { AuthAlert } from "./AuthAlert";
import { AuthField, PasswordHints } from "./AuthField";
import { AuthHeading } from "./AuthHeading";
import { AuthSubmit } from "./AuthSubmit";
import { isCompleteOtp, OtpInput } from "./OtpInput";
import { useCooldown } from "./useCooldown";

interface Errors {
  email?: string;
  otp?: string;
  password?: string;
  confirm?: string;
}

/**
 * Spends the code from the reset email. Holding the code stands in for knowing
 * the current password — it is the proof that the mailbox, and so the account,
 * belongs to whoever is on this screen.
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const cooldown = useCooldown();

  // The address is carried over from the forgot-password screen; someone
  // arriving with the code from their inbox types it in themselves.
  const params = useSearchParams();
  const [email, setEmail] = useState(() => params.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const validate = () => {
    const next: Errors = {};

    if (!EMAIL_RE.test(email.trim()))
      next.email = "Enter the email address you asked to reset.";

    if (!isCompleteOtp(otp)) next.otp = "Enter all six digits of the code.";

    if (!password) next.password = "Choose a new password.";
    else if (password.length < MIN_PASSWORD_LENGTH)
      next.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;

    if (confirm !== password) next.confirm = "The two passwords do not match.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFailure(null);
    setNotice(null);

    if (!validate()) return;

    setSubmitting(true);

    try {
      await resetPassword({
        email: email.trim().toLowerCase(),
        otp,
        newPassword: password,
      });

      toast.success("Password updated!");
      router.replace(`${AUTH_ROUTES.login}?reason=password-reset`);
    } catch (error) {
      setSubmitting(false);
      // A spent or expired code is the usual cause, so the boxes are cleared
      // ready for the next one rather than left holding a dead code.
      setOtp("");
      setFailure(
        error instanceof AuthApiError
          ? error.message
          : "Could not reset your password. Please try again.",
      );
    }
  };

  const handleResend = async () => {
    setFailure(null);
    setNotice(null);

    if (!EMAIL_RE.test(email.trim())) {
      setErrors((current) => ({
        ...current,
        email: "Enter the email address you asked to reset.",
      }));
      return;
    }

    setResending(true);

    try {
      const { message } = await forgotPassword(email.trim().toLowerCase());
      setNotice(message || "We’ve sent a new code.");
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
        title="New password"
        subtitle={`Enter your code and pick a new password. Expires in ${OTP_TTL_MINUTES} min.`}
      />

      {notice && <AuthAlert tone="success">{notice}</AuthAlert>}
      {failure && <AuthAlert>{failure}</AuthAlert>}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
          disabled={submitting}
        />

        <div className="space-y-2">
          <span className="block text-[13px] font-medium text-foreground">
            Reset code
          </span>
          <OtpInput
            value={otp}
            onChange={setOtp}
            disabled={submitting}
            invalid={Boolean(errors.otp)}
          />
          {errors.otp && <p className="text-[12px] text-danger">{errors.otp}</p>}
        </div>

        <div className="space-y-2.5">
          <AuthField
            label="New password"
            name="newPassword"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            revealable
            icon={<LockIcon className="size-4.5" strokeWidth={1.5} />}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={errors.password}
            disabled={submitting}
          />
          {password && <PasswordHints value={password} hints={PASSWORD_HINTS} />}
        </div>

        <AuthField
          label="Confirm new password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Type it once more"
          revealable
          icon={<LockIcon className="size-4.5" strokeWidth={1.5} />}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          error={errors.confirm}
          disabled={submitting}
        />

        <AuthSubmit loading={submitting} loadingText="Updating…">
          Update password
        </AuthSubmit>
      </form>

      <div className="mt-5 space-y-3 border-t border-border/50 pt-4 text-center text-[13.5px] text-muted-foreground">
        <p className="text-muted-foreground">
          Code expired?{" "}
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
                : "send a new one"}
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
