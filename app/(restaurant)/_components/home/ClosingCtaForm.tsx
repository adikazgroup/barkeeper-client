"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { ChevronRightIcon } from "@/components/icons/Icons";
import { EMAIL_RE } from "@/lib/auth/constants";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { cn } from "@/lib/utils";

/**
 * The closing ask, as one field.
 *
 * A pair of buttons at the bottom of the page asks the reader to choose, and
 * the page has already made its case by here — so the ask is the smallest one
 * there is: leave an address. The field and its button are drawn as a single
 * pill, the same shape the hero's primary button wears, so it still reads as
 * the page's one last action rather than as a form bolted on.
 *
 * The address goes to the public `POST /newsletters`, which is the list — the
 * notification mail to the kitchen follows it and is allowed to fail quietly.
 * It is checked here only to catch a typo before the round trip; the backend
 * checks it again, because nothing typed in a browser is trusted.
 */
export function ClosingCtaForm() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const address = email.trim();

    if (!EMAIL_RE.test(address)) {
      toast.error("That address does not look right.");
      return;
    }

    setSending(true);

    // The list itself is the backend's, so that call is the one that decides
    // whether this worked.
    const answer = await subscribeToNewsletter(address);

    setSending(false);

    if (!answer.ok) {
      toast.error(answer.message);
      return;
    }

    toast.success(answer.message || "You’re on the list — we’ll be in touch.");
    setEmail("");

    // The kitchen likes to hear about a new name, but a mail server having a
    // bad afternoon is not the subscriber's problem: they are on the list
    // either way, so this is sent after the fact and its failure stays here.
    void fetch("/api/cta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: address }),
    }).catch(() => {});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full items-center gap-1 rounded-full border border-border bg-card/60 p-1 backdrop-blur-sm transition-colors duration-200",
        "focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15",
      )}
    >
      <label htmlFor="cta-email" className="sr-only">
        Email address
      </label>

      <input
        id="cta-email"
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={sending}
        autoComplete="email"
        placeholder="you@example.com"
        className="h-11 min-w-0 flex-1 bg-transparent pr-2 pl-4 text-[14px] placeholder:text-muted-foreground/70 focus:outline-none disabled:opacity-60"
      />

      <button
        type="submit"
        disabled={sending || !email.trim()}
        aria-label={sending ? "Sending" : "Keep me posted"}
        className="group inline-flex h-11 shrink-0 cursor-pointer items-center gap-3 rounded-full bg-primary py-1 pr-1 pl-4 text-[14px] font-medium whitespace-nowrap text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 max-[380px]:pl-1"
      >
        <span className="max-[380px]:sr-only">
          {sending ? "Sending…" : "Keep me posted"}
        </span>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
          <ChevronRightIcon className="size-4" />
        </span>
      </button>
    </form>
  );
}
