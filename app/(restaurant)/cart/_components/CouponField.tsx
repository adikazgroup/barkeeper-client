"use client";

import { useState, type FormEvent } from "react";
import { Ticket, TriangleAlert } from "lucide-react";

import { CheckIcon, XIcon } from "@/components/icons/Icons";
import { useCoupon, type MyCoupon } from "@/hooks/useCoupon";
import { formatMoney } from "@/lib/price";
import { cn } from "@/lib/utils";

/**
 * The code, in the order summary.
 *
 * It sits under the totals rather than above them because that is the order it
 * is read in: what the plates come to, then what comes off. Nothing here works
 * out a discount — the field sends the code and prints the figure the kitchen
 * quoted back, the same way every other number on this page is the backend's.
 *
 * A customer with codes of their own does not have to remember one: the wallet
 * is listed below the field, and tapping one fills it in and tries it.
 */
export function CouponField() {
  const { applied, myCoupons, pending, error, signedOut, apply, clear } =
    useCoupon();

  const [code, setCode] = useState("");

  if (signedOut) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (pending) return;

    void apply(code).then((result) => {
      // Only a code that worked is cleared out of the field — a refused one
      // stays put so a typo can be fixed rather than retyped.
      if (result.ok) setCode("");
    });
  };

  // The wallet is worth showing only while there is something in it that is
  // not already on the docket.
  const wallet = myCoupons.filter((coupon) => coupon.code !== applied?.code);

  return (
    <div className="mt-6 border-t border-border/50 pt-6">
      <h3 className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
        Discount code
      </h3>

      {applied ? (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <CheckIcon className="size-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="truncate font-mono text-[12.5px] tracking-widest uppercase">
                {applied.code}
              </p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {formatMoney(applied.discountAmount)} off{" "}
                {formatMoney(applied.eligibleSubtotal)} of the docket
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={clear}
            disabled={pending}
            aria-label={`Remove code ${applied.code}`}
            className="shrink-0 cursor-pointer rounded-full border border-transparent p-1.5 text-muted-foreground transition-colors duration-200 hover:border-border hover:bg-card hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <label htmlFor="coupon-code" className="sr-only">
            Discount code
          </label>

          <input
            id="coupon-code"
            name="coupon-code"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            disabled={pending}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="ENTER CODE"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "coupon-error" : undefined}
            className={cn(
              "h-10 min-w-0 flex-1 rounded-full border border-border bg-card/60 px-4 font-mono text-[12.5px] tracking-widest uppercase backdrop-blur-sm transition-colors duration-200 placeholder:tracking-[0.16em] placeholder:text-muted-foreground/70 focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-60",
              error && "border-danger/50",
            )}
          />

          <button
            type="submit"
            disabled={pending || !code.trim()}
            className="h-10 shrink-0 cursor-pointer rounded-full bg-foreground px-5 text-[13px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {pending ? "Checking" : "Apply"}
          </button>
        </form>
      )}

      {/* Expired, minimum not met, not on this account, nothing covered — the
          backend is the only side that knows which, so it does the talking. */}
      {error && (
        <p
          id="coupon-error"
          role="status"
          className="mt-3 flex items-start gap-1.5 text-[12px] leading-[1.6] text-danger"
        >
          <TriangleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      )}

      {wallet.length > 0 && (
        <div className="mt-5">
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            On your account
          </p>

          <ul role="list" className="mt-3 space-y-2">
            {wallet.map((coupon) => (
              <li key={coupon._id}>
                <button
                  type="button"
                  onClick={() => {
                    setCode(coupon.code);
                    void apply(coupon.code);
                  }}
                  disabled={pending}
                  className="group flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-card/40 px-3 py-2.5 text-left transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Ticket
                    aria-hidden
                    className="size-3.5 shrink-0 text-primary"
                  />

                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-mono text-[11.5px] tracking-widest uppercase">
                      {coupon.code}
                    </span>
                    <span className="mt-0.5 block truncate text-[11.5px] text-muted-foreground">
                      {describeCoupon(coupon)}
                    </span>
                  </span>

                  <span className="shrink-0 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase transition-colors duration-200 group-hover:text-primary">
                    Use
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * The terms of a code, in one line.
 *
 * `discountType` is the backend's word and is only compared, never switched on
 * exhaustively: a type nobody here has heard of falls back to the plain value
 * rather than printing nothing.
 */
function describeCoupon(coupon: MyCoupon): string {
  const parts: string[] = [
    coupon.discountType === "percentage"
      ? `${coupon.discountValue}% off`
      : `${formatMoney(coupon.discountValue)} off`,
  ];

  if (coupon.minOrderAmount) {
    parts.push(`min ${formatMoney(coupon.minOrderAmount)}`);
  }

  // `usesLeft` is `null` for an unlimited code, which is why this tests the
  // number rather than truthiness — one left is worth saying, none is not a
  // state the backend lists at all.
  if (typeof coupon.usesLeft === "number") {
    parts.push(`${coupon.usesLeft} left`);
  }

  if (coupon.appliesTo && coupon.appliesTo !== "all") {
    parts.push("selected items");
  }

  return parts.join(" · ");
}
