"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { CheckCircleIcon } from "@/components/icons/Icons";
import { EMAIL_RE } from "@/lib/auth/constants";
import { unsubscribeFromNewsletter } from "@/lib/newsletter";
import { cn } from "@/lib/utils";

/**
 * Leaving the list.
 *
 * Reached from the footer of a mailing, which carries the address in the link,
 * so the field arrives filled and the whole job is one button. It is still a
 * field rather than a line of text: a link forwarded to somebody else should
 * not quietly unsubscribe the person who forwarded it, and an address typed in
 * by hand has to work too.
 *
 * The backend answers the same whether or not the address was ever on the list,
 * so this screen does too — telling a stranger which addresses are subscribed
 * would be a leak dressed up as helpfulness.
 */
export function UnsubscribeForm({ defaultEmail }: { defaultEmail: string }) {
  const [email, setEmail] = useState(defaultEmail);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const address = email.trim();

    if (!EMAIL_RE.test(address)) {
      setError("That address does not look right.");
      return;
    }

    setSending(true);
    setError(null);

    const answer = await unsubscribeFromNewsletter(address);

    setSending(false);

    if (!answer.ok) {
      setError(answer.message);
      return;
    }

    setDone(answer.message || "Done — you will not hear from us again.");
  };

  if (done) {
    return (
      <div className="text-center">
        <span className="mx-auto grid size-11 place-items-center rounded-full border border-primary/30 bg-primary/5 text-primary">
          <CheckCircleIcon className="size-4.5" />
        </span>

        <h2 className="mx-auto mt-7 max-w-[20ch] text-[26px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[32px]">
          You are off the list
        </h2>

        <p className="mx-auto mt-4 max-w-[46ch] text-[13.5px] leading-[1.7] text-muted-foreground">
          {done} Anything you have ordered is unaffected — this was only the
          mailing list.
        </p>

        <Link
          href="/menu"
          className="mt-8 inline-flex h-11 items-center rounded-full border border-border bg-card/60 px-5 text-[14px] font-medium transition-colors duration-200 hover:bg-foreground hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Back to the board
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl">

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          id="unsubscribe-email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={sending}
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "unsubscribe-error" : undefined}
          className={cn(
            "h-11 w-full min-w-0 flex-1 rounded-full border border-border bg-card/60 px-5 text-[14px] backdrop-blur-sm transition-colors duration-200",
            "placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/15 focus:outline-none disabled:opacity-60",
            error && "border-danger/50",
          )}
        />

        <button
          type="submit"
          disabled={sending || !email.trim()}
          className="inline-flex h-11 w-full shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary px-6 text-[14px] font-medium whitespace-nowrap text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
        >
          {sending ? "One moment…" : "Unsubscribe me"}
        </button>
      </div>

      {error && (
        <p
          id="unsubscribe-error"
          role="status"
          className="mt-3 text-[12.5px] leading-[1.6] text-danger"
        >
          {error}
        </p>
      )}

      <p className="mt-5 text-center text-[12px] leading-[1.7] text-muted-foreground">
        Changed your mind? Signing up again anywhere on the site puts you
        straight back on.
      </p>
    </form>
  );
}
