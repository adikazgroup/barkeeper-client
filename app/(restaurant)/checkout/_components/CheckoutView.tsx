"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Clock, Info, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingBagIcon,
} from "@/components/icons/Icons";
import { OrderingStatus } from "@/components/shared/OrderingStatus";
import { useCart } from "@/hooks/useCart";
import { useCoupon } from "@/hooks/useCoupon";
import { usePickupAvailability } from "@/hooks/usePickupAvailability";
import { placeOrder, quoteOrder } from "@/lib/orders/client";

/**
 * The payment hop is off until Stripe has a live key — the server is still on a
 * `sk_test_` secret, so `placeOrder` would create a real docket and then send
 * the customer to a test checkout they cannot pay. Flip this to true once the
 * live key is in place.
 */
const PAYMENT_ENABLED = false;
import { pickupLabel } from "@/lib/orders/format";
import type { OrderInput, OrderQuote } from "@/lib/orders/types";
import { formatMoney } from "@/lib/price";
import { cn } from "@/lib/utils";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

export function CheckoutView({ defaultPhone }: { defaultPhone: string }) {
  const router = useRouter();

  const { items, count, hydrated, signedOut } = useCart();
  const { applied } = useCoupon();

  const ordering = usePickupAvailability();
  const { availability } = ordering;
  const kitchenClosed = availability?.canOrder === false;

  const [pickupTime, setPickupTime] = useState("");
  // Only a slot that is still on offer counts. The list refreshes every
  // minute, so a time that has slipped under the grace time simply drops out.
  const selectedSlot =
    availability?.slots.find((slot) => slot.value === pickupTime) ?? null;
  const slotExpired = Boolean(pickupTime && availability && !selectedSlot);

  const [customerNote, setCustomerNote] = useState("");
  const [phone, setPhone] = useState(defaultPhone);

  const [quoted, setQuoted] = useState<OrderQuote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  const couponCode = applied?.code ?? "";

  /**
   * The half of the body that moves the price.
   *
   * The note and the phone are on the order but not on the bill, so they are
   * kept out of here — otherwise every keystroke in the note would cost a
   * round trip and re-draw the total underneath the customer's hands.
   */
  const chosenTime = selectedSlot?.value ?? "";
  const priceInput = useMemo<OrderInput>(
    () => ({
      ...(couponCode ? { couponCode } : {}),
      // Priced for the chosen time, because some dishes are only served at
      // certain hours; before a choice the kitchen prices the earliest slot.
      ...(chosenTime ? { pickupTime: chosenTime } : {}),
    }),
    [couponCode, chosenTime],
  );

  const askable = hydrated && !signedOut && items.length > 0 && !kitchenClosed;

  // A quote belongs to the question that produced it. The moment the docket
  // stops being askable the last figure is not this order's price any more, so
  // it is dropped here rather than cleared out of the effect.
  const quote = askable ? quoted : null;

  useEffect(() => {
    if (!askable) return;

    let cancelled = false;

    // Enough of a pause that a burst of docket edits is one quote rather than
    // several.
    const timer = setTimeout(async () => {
      setQuoting(true);

      const answer = await quoteOrder(priceInput);
      if (cancelled) return;

      setQuoting(false);

      if (answer.ok && answer.data) {
        setQuoted(answer.data);
        setQuoteError(null);
      } else {
        // The old figure is not the price of this docket any more, so it goes
        // rather than sitting there looking current.
        setQuoted(null);
        setQuoteError(answer.message);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // `count` and the subtotal are in here so a docket edited in another tab
    // re-prices rather than quoting a cart that no longer exists.
  }, [askable, priceInput, count]);

  if (!hydrated) return <CheckoutSkeleton />;
  if (signedOut || items.length === 0) return <NothingToCheckOut />;

  const handlePlace = async () => {
    if (kitchenClosed) {
      toast.error(availability?.message ?? "Restaurant is currently closed.");
      return;
    }

    if (!selectedSlot) {
      toast.error(
        slotExpired
          ? "That pickup time has passed. Please choose another."
          : "Choose a pickup time to continue.",
      );
      return;
    }

    if (!phone.trim()) {
      toast.error("A phone number is needed so the counter can reach you.");
      return;
    }

    if (!quote) {
      toast.error(quoteError ?? "The docket has not been priced yet.");
      return;
    }

    if (!quote.isOrderable) {
      toast.error(
        quote.issues[0]?.message ??
          "Something on the docket cannot be ordered yet.",
      );
      return;
    }

    setPlacing(true);

    const answer = await placeOrder({
      ...priceInput,
      pickupTime: selectedSlot.value,
      ...(customerNote.trim() ? { customerNote: customerNote.trim() } : {}),
      phone: phone.trim(),
    });

    if (!answer.ok || !answer.data) {
      setPlacing(false);
      toast.error(answer.message || "The order could not be started.");
      // A refusal is often the clock: the slot went, or the kitchen closed.
      void ordering.reload();
      return;
    }

    const { order, checkout } = answer.data;

    // The order exists from here whether or not they pay, so there is always
    // somewhere to send them — the payment screen if Stripe gave us one, the
    // order itself if it did not.
    if (checkout?.checkoutUrl) {
      window.location.href = checkout.checkoutUrl;
      return;
    }

    setPlacing(false);
    router.push(`/profile/orders/${order._id}`);
  };

  const pricing = quote?.pricing;
  const short =
    quote?.minimumOrderAmount && pricing
      ? quote.minimumOrderAmount - pricing.subtotal
      : 0;

  return (
    <section aria-labelledby="checkout-heading">
      <div className="mx-auto max-w-7xl">
        <div className="border-x border-border/50">
          <div className="grid lg:grid-cols-[1fr_24rem]">
            {/* What the customer decides */}
            <div className="min-w-0">
              <div
                className={cn(
                  "flex flex-wrap items-baseline justify-between gap-4 border-b border-border/50 py-7",
                  CELL,
                )}
              >
                <h2
                  id="checkout-heading"
                  className="text-[24px] leading-[1.1] font-medium tracking-[-0.035em] sm:text-[28px]"
                >
                  {count} {count === 1 ? "plate" : "plates"}, for collection
                </h2>

                <Link
                  href="/cart"
                  className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase transition-colors duration-200 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Edit docket
                </Link>
              </div>

              {/* Pickup time */}
              <Field
                label="Pickup time"
                required
                hint={
                  availability?.canOrder
                    ? `Choose when you will collect it. The kitchen needs at least ${availability.orderGraceMinutes} minutes, so the earliest time is ${availability.slots[0].day === "Tomorrow" ? "tomorrow, " : ""}${availability.slots[0].label}.`
                    : undefined
                }
              >
                {ordering.loading ? (
                  <div className="h-11 w-full max-w-sm animate-pulse rounded-full bg-muted-foreground/10" />
                ) : availability?.canOrder ? (
                  <>
                    <label htmlFor="pickup-time" className="sr-only">
                      Pickup time
                    </label>
                    <div className="relative max-w-sm">
                      <Clock
                        aria-hidden
                        className="pointer-events-none absolute top-1/2 left-4 z-10 size-3.5 -translate-y-1/2 text-primary"
                      />
                      <select
                        id="pickup-time"
                        value={selectedSlot?.value ?? ""}
                        onChange={(event) => setPickupTime(event.target.value)}
                        required
                        aria-invalid={slotExpired || undefined}
                        className={cn(
                          "h-11 w-full cursor-pointer appearance-none rounded-full border bg-card/60 pr-10 pl-10 text-[13.5px] backdrop-blur-sm transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/15 focus:outline-none",
                          slotExpired ? "border-danger/50" : "border-border",
                          !selectedSlot && "text-muted-foreground",
                        )}
                      >
                        <option value="" disabled>
                          Choose a pickup time
                        </option>
                        {availability.slots.map((slot) => (
                          <option
                            key={slot.value}
                            value={slot.value}
                            className="text-foreground"
                          >
                            {slot.day}, {slot.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        aria-hidden
                        className="pointer-events-none absolute top-1/2 right-4 z-10 size-4 -translate-y-1/2 text-muted-foreground"
                      />
                    </div>
                    {slotExpired && (
                      <p className="mt-2 text-[12.5px] text-danger">
                        That time has passed. Please choose another.
                      </p>
                    )}
                  </>
                ) : (
                  <OrderingStatus state={ordering} />
                )}
              </Field>

              {/* Phone */}
              <Field
                label="Phone number"
                hint="Asked once and kept on the account — it is how the counter reaches you if something is off."
              >
                <label htmlFor="phone" className="sr-only">
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  autoComplete="tel"
                  placeholder="+1 555 0100"
                  required
                  className="h-11 w-full  rounded-full border border-border bg-card/60 px-4 text-[13.5px] backdrop-blur-sm transition-colors placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/15 focus:outline-none"
                />
              </Field>

              {/* Note */}
              <Field
                label="Note for the kitchen"
                hint="Allergies, a collection name, anything they should know. Optional."
              >
                <label htmlFor="note" className="sr-only">
                  Note for the kitchen
                </label>
                <textarea
                  id="note"
                  value={customerNote}
                  onChange={(event) => setCustomerNote(event.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="No sesame on the bun, please."
                  className="w-full resize-none rounded-xl border border-border bg-card/60 px-4 py-3 text-[13.5px] leading-[1.7] backdrop-blur-sm transition-colors placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/15 focus:outline-none"
                />
              </Field>

              <div className={cn("border-t border-border/50 py-7", CELL)}>
                <Link
                  href="/cart"
                  className="group inline-flex items-center gap-2 text-[13.5px] font-medium transition-colors duration-200 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <ChevronLeftIcon className="size-3.5 text-primary transition-transform duration-200 group-hover:-translate-x-0.5" />
                  Back to the docket
                </Link>
              </div>
            </div>

            {/* What it comes to — every figure the kitchen's */}
            <aside
              aria-labelledby="checkout-summary-heading"
              className="border-t border-border/50 bg-card/20 backdrop-blur-sm lg:border-t-0 lg:border-l"
            >
              <div className={cn("py-7 lg:sticky lg:top-20", CELL)}>
                <h2
                  id="checkout-summary-heading"
                  className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase"
                >
                  Order summary
                </h2>

                {!kitchenClosed && (
                  <p className="mt-4 flex items-start gap-2 text-[12.5px] leading-[1.6] text-muted-foreground">
                    <Clock aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                    {selectedSlot && quote
                      ? `Pickup ${pickupLabel(quote)}`
                      : "No pickup time chosen yet"}
                  </p>
                )}

                <dl
                  className={cn(
                    "mt-6 space-y-3.5 text-[13.5px] transition-opacity duration-200",
                    quoting && "opacity-50",
                  )}
                  aria-busy={quoting}
                >
                  <Row label="Subtotal" value={pricing?.subtotal} />

                  {pricing && pricing.discount > 0 && (
                    <Row
                      label="Discount"
                      badge={pricing.couponCode ?? undefined}
                      value={-pricing.discount}
                      accent
                    />
                  )}

                  <Row
                    label={
                      pricing?.taxPercentage
                        ? `Tax (${pricing.taxPercentage}%)`
                        : "Tax"
                    }
                    value={pricing?.tax}
                  />

                  <div className="flex items-baseline justify-between gap-4 border-t border-border/50 pt-4">
                    <dt className="font-medium">Total</dt>
                    <dd className="font-mono text-[22px] tracking-[-0.02em] tabular-nums text-primary">
                      {pricing ? formatMoney(pricing.total) : "—"}
                    </dd>
                  </div>
                </dl>

                {/* Why it cannot be sent, in the kitchen's own words. */}
                {(quoteError || (quote && quote.issues.length > 0)) && (
                  <ul
                    role="list"
                    className="mt-6 space-y-2 rounded-xl border border-danger/30 bg-danger/5 px-3.5 py-3"
                  >
                    {quoteError && <Issue key="quote">{quoteError}</Issue>}
                    {quote?.issues.map((issue) => (
                      <Issue key={`${issue.code}-${issue.message}`}>
                        {issue.message}
                      </Issue>
                    ))}
                  </ul>
                )}

                {short > 0 && (
                  <p className="mt-4 text-[12.5px] leading-[1.6] text-muted-foreground">
                    {formatMoney(short)} more on the docket and it can be sent —
                    the kitchen takes orders from{" "}
                    {formatMoney(quote?.minimumOrderAmount ?? 0)}.
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => void handlePlace()}
                  disabled={
                    !PAYMENT_ENABLED ||
                    placing ||
                    quoting ||
                    kitchenClosed ||
                    !selectedSlot ||
                    !quote?.isOrderable
                  }
                  className="group mt-7 flex h-11 w-full cursor-pointer items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-5 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {!PAYMENT_ENABLED
                    ? "Under construction"
                    : placing
                      ? "Taking you to payment…"
                      : "Pay and send it"}
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
                    <ChevronRightIcon className="size-4" />
                  </span>
                </button>

                <p className="mt-5 flex items-start gap-2 text-[12px] leading-[1.7] text-muted-foreground">
                  <Info
                    aria-hidden
                    className="mt-0.5 size-3.5 shrink-0 text-primary"
                  />
                  {PAYMENT_ENABLED
                    ? "Payment is taken on Stripe’s own page. Your docket stays as it is until it goes through."
                    : "Online payment is under construction. Your docket is saved — please call the restaurant to place the order for now."}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

/** One question, as a ruled row of the frame. */
function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("border-b border-border/50 py-7", CELL)}>
      <h3 className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
        {label}
        {required && (
          <span aria-hidden className="ml-1 text-primary">
            *
          </span>
        )}
      </h3>

      {hint && (
        <p className="mt-2 max-w-[52ch] text-[12.5px] leading-[1.7] text-muted-foreground">
          {hint}
        </p>
      )}

      <div className="mt-4">{children}</div>
    </div>
  );
}

/** One line of the bill. An em dash until the kitchen has priced it. */
function Row({
  label,
  badge,
  value,
  accent,
}: {
  label: string;
  badge?: string;
  value?: number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="min-w-0 truncate text-muted-foreground">
        {label}
        {badge && (
          <span className="ml-1.5 font-mono text-[11px] tracking-widest text-primary uppercase">
            {badge}
          </span>
        )}
      </dt>
      <dd className={cn("font-mono tabular-nums", accent && "text-primary")}>
        {typeof value === "number"
          ? `${value < 0 ? "−" : ""}${formatMoney(Math.abs(value))}`
          : "—"}
      </dd>
    </div>
  );
}

function Issue({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-[12.5px] leading-[1.6] text-foreground">
      <TriangleAlert
        aria-hidden
        className="mt-0.5 size-3.5 shrink-0 text-danger"
      />
      {children}
    </li>
  );
}

/**
 * Nothing to check out.
 *
 * One screen for both causes: a signed-out reader has no docket to price and an
 * empty one has nothing on it, and in both cases the way out is the board.
 */
function NothingToCheckOut() {
  return (
    <section>
      <div className="mx-auto max-w-7xl">
        <div className="border-x border-border/50 px-5 py-20 text-center sm:px-8 sm:py-28">
          <span className="mx-auto grid size-11 place-items-center rounded-full border border-border bg-card text-muted-foreground">
            <ShoppingBagIcon className="size-4.5" />
          </span>

          <h2 className="mx-auto mt-7 max-w-[20ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[30px] leading-[1.05] font-medium tracking-[-0.04em] text-transparent sm:text-[40px]">
            Nothing to check out
          </h2>

          <p className="mx-auto mt-5 max-w-[46ch] text-[14px] leading-[1.7] text-muted-foreground">
            Your docket is empty. Pick a counter on the board and the plates
            will be waiting here.
          </p>

          <Link
            href="/menu"
            className="group mt-9 inline-flex h-11 items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-5 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Browse the board
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
              <ChevronRightIcon className="size-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Holds the frame for the frame it takes to read the docket back. */
function CheckoutSkeleton() {
  return (
    <div aria-hidden className="mx-auto max-w-7xl">
      <div className="border-x border-border/50">
        <div className="grid lg:grid-cols-[1fr_24rem]">
          <div className="min-w-0 divide-y divide-border/50">
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className={cn("space-y-3 py-7", CELL)}>
                <div className="h-3 w-32 animate-pulse rounded bg-muted-foreground/10" />
                <div className="h-11 w-full max-w-sm animate-pulse rounded-full bg-muted-foreground/10" />
              </div>
            ))}
          </div>

          <div className="border-t border-border/50 bg-card/20 lg:border-t-0 lg:border-l">
            <div className={cn("space-y-4 py-7", CELL)}>
              <div className="h-3 w-28 animate-pulse rounded bg-muted-foreground/10" />
              <div className="h-4 w-full animate-pulse rounded bg-muted-foreground/10" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted-foreground/10" />
              <div className="h-11 w-full animate-pulse rounded-full bg-primary/15" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
