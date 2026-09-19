"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

import { BadgeAlertIcon, TrashIcon } from "@/components/icons/Icons";
import { Modal } from "@/components/ui/modal/Modal";
import { AuthApiError, deleteMe } from "@/lib/auth/api";
import { cn } from "@/lib/utils";

import { SectionCard } from "./SectionCard";

/** What has to be typed before the confirm button will do anything. */
const CONFIRM_WORD = "DELETE";

/**
 * Closing the account, against `DELETE /users/me`.
 *
 * Its own section at the foot of the page, after everything that only changes
 * something: the one control here ends the account, and it reads that way.
 *
 * The backend kills the token along with the record, so the local session has
 * to go too — anything left in the cookie afterwards is a key to a door that
 * is no longer there. `signOut()` runs whether or not the call succeeded on
 * the second half, because a customer who has just been told their account is
 * gone must not be left looking at it.
 */
export function CloseAccountCard() {
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [closing, setClosing] = useState(false);

  const confirmed = typed.trim().toUpperCase() === CONFIRM_WORD;

  const dismiss = () => {
    if (closing) return;
    setOpen(false);
    setTyped("");
  };

  const closeAccount = async () => {
    if (!confirmed || closing) return;

    if (!session?.accessToken) {
      toast.error("Your session has expired. Please sign in again.");
      return;
    }

    setClosing(true);

    try {
      await deleteMe(session.accessToken);
    } catch (error) {
      toast.error(
        error instanceof AuthApiError
          ? error.message
          : "Could not close your account. Please try again.",
      );
      setClosing(false);
      return;
    }

    toast.success("Your account is closed. Thanks for eating with us.");

    // No `/api/logout` on the way out: that route asks the backend to revoke a
    // token the backend has already destroyed. Only the local session is left
    // to clear.
    await signOut({ callbackUrl: "/login?reason=account-deleted" });
  };

  return (
    <>
      <SectionCard
        title="Close your account"
        description="Deletes your account and the details on it. Orders already placed stay on the kitchen’s books — closing the account does not cancel them."
        icon={<BadgeAlertIcon className="size-4" />}
      >
        <div className="rounded-xl border border-danger/25 bg-danger/[0.04] p-5">
          <p className="max-w-[58ch] text-[13.5px] leading-[1.7] text-muted-foreground">
            This cannot be undone. Your name, contact details and saved photo go
            with it, and you would have to sign up again to order from us.
          </p>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-5 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-danger/40 px-5 text-[14px] font-medium text-danger transition-colors duration-200 hover:bg-danger hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2"
          >
            <TrashIcon className="size-4" />
            Close my account
          </button>
        </div>
      </SectionCard>

      <Modal
        open={open}
        onClose={dismiss}
        size="small"
        variant="destructive"
        title="Close your account?"
        // While the call is in flight there is nothing to go back to, so the
        // easy ways out are taken off the modal rather than left to misfire.
        closeOnBackdropClick={!closing}
        closeOnEsc={!closing}
        showCloseButton={!closing}
      >
        <p className="text-[13.5px] leading-[1.7] text-muted-foreground">
          This deletes your account for good. Type{" "}
          <span className="font-mono font-medium text-foreground">
            {CONFIRM_WORD}
          </span>{" "}
          below to confirm.
        </p>

        <input
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          disabled={closing}
          autoComplete="off"
          spellCheck={false}
          aria-label={`Type ${CONFIRM_WORD} to confirm`}
          placeholder={CONFIRM_WORD}
          className={cn(
            "mt-4 h-11 w-full rounded-lg border border-border bg-card/60 px-3.5 font-mono text-[14px] tracking-[0.08em] uppercase",
            "placeholder:tracking-[0.08em] placeholder:text-muted-foreground/60",
            "focus:border-danger/50 focus:ring-2 focus:ring-danger/15 focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        />

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={dismiss}
            disabled={closing}
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card/60 px-5 text-[14px] font-medium transition-colors duration-200 hover:bg-foreground hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            Keep my account
          </button>

          <button
            type="button"
            onClick={closeAccount}
            disabled={!confirmed || closing}
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-danger px-5 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-danger/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <TrashIcon className="size-4" />
            {closing ? "Closing…" : "Close my account"}
          </button>
        </div>
      </Modal>
    </>
  );
}
