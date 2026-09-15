"use client";

import { useSession } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { ChevronRightIcon, LockIcon } from "@/components/icons/Icons";
import { AuthApiError, changePassword } from "@/lib/auth/api";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/constants";
import { cn } from "@/lib/utils";

import { SectionCard } from "./SectionCard";

interface Errors {
  current?: string;
  next?: string;
  confirm?: string;
}

/**
 * Changing the password, against the live backend.
 *
 * Its own `<form>` rather than a section of the profile form: this posts to a
 * different endpoint, and one Save button that sometimes also changed the
 * password would be a trap.
 *
 * `currentPassword` is required except in one case — an account created through
 * Google or Apple has no password yet and is setting its first one, which is
 * what makes email sign-in available to it afterwards. `authProviders` on the
 * account says which case this is, so the field is simply not shown to someone
 * who has no current password to give.
 */
export function ChangePasswordCard({
  needsCurrentPassword,
}: {
  needsCurrentPassword: boolean;
}) {
  const { data: session } = useSession();

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setCurrent("");
    setNext("");
    setConfirm("");
    setErrors({});
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const found: Errors = {};
    if (needsCurrentPassword && !current)
      found.current = "Enter your current password.";
    if (!next) found.next = "Choose a new password.";
    else if (next.length < MIN_PASSWORD_LENGTH)
      found.next = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    if (confirm !== next) found.confirm = "The two passwords do not match.";

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    if (!session?.accessToken) {
      toast.error("Your session has expired. Please sign in again.");
      return;
    }

    setSaving(true);

    try {
      await changePassword(
        {
          ...(current ? { currentPassword: current } : {}),
          newPassword: next,
        },
        session.accessToken,
      );

      toast.success("Password updated!");
      reset();
    } catch (error) {
      const message =
        error instanceof AuthApiError
          ? error.message
          : "Could not update your password. Please try again.";

      // A rejected current password is the common failure, so the message goes
      // on that field rather than only into a toast that fades. With no such
      // field on screen it would have nowhere to show, so it moves to the one
      // field there is.
      setErrors(
        needsCurrentPassword ? { current: message } : { next: message },
      );
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <SectionCard
        title="Password"
        description={
          needsCurrentPassword
            ? "Change the password you sign in with."
            : "You signed up with Google or Apple, so you have no password yet. Set one and you can sign in with your email as well."
        }
        icon={<LockIcon className="size-4" />}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {needsCurrentPassword && (
            <PasswordField
              label="Current password"
              value={current}
              onChange={setCurrent}
              autoComplete="current-password"
              error={errors.current}
              disabled={saving}
            />
          )}
          <PasswordField
            label="New password"
            value={next}
            onChange={setNext}
            autoComplete="new-password"
            hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
            error={errors.next}
            disabled={saving}
          />
          <PasswordField
            label="Confirm new password"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            error={errors.confirm}
            disabled={saving}
          />
        </div>

        <div className="mt-7 flex sm:justify-end">
          <button
            type="submit"
            disabled={saving}
            className="group inline-flex h-11 w-full cursor-pointer items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-5 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
          >
            {saving ? "Updating…" : "Update password"}
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
              <ChevronRightIcon className="size-4" />
            </span>
          </button>
        </div>
      </SectionCard>
    </form>
  );
}

/** Matches the fields the profile form uses, so the page reads as one. */
function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  hint,
  error,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] font-medium tracking-[-0.01em]">
        {label}
      </span>

      <input
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder="••••••••"
        disabled={disabled}
        aria-invalid={Boolean(error) || undefined}
        className={cn(
          "h-11 w-full rounded-lg border bg-card/60 px-3.5 text-[14px] backdrop-blur-sm transition-colors",
          "placeholder:text-muted-foreground/70",
          "focus:border-primary/40 focus:ring-2 focus:ring-primary/15 focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-60",
          error ? "border-danger/60" : "border-border",
        )}
      />

      {error ? (
        <span className="text-[12px] text-danger">{error}</span>
      ) : (
        hint && <span className="text-[12px] text-muted-foreground">{hint}</span>
      )}
    </label>
  );
}
