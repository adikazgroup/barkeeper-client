import Image from "next/image";

import { BeamBorder } from "../../_components/home/BeamBorder";
import { HeroBackdrop } from "../../_components/home/HeroBackdrop";
import { demoUser, formatDate } from "../_data";

/**
 * The account's band.
 *
 * Drawn in the same language as the home hero, the board's and the docket's —
 * the shared backdrop, the pill badge, the gradient headline, the page's own
 * border-x frame. What differs is what sits on it: the customer, not a title,
 * so the headline is their name and the one number worth carrying (the points)
 * sits opposite it.
 *
 * The photograph is framed the way the board frames a plate — a bordered card
 * with the picture inset — so a person and a dish are presented alike.
 */
export function ProfileHero({
  name,
  avatarUrl,
  createdAt,
}: {
  name: string;
  avatarUrl: string | null;
  createdAt?: string;
}) {
  // The tier and the points have no endpoint behind them yet; the name, the
  // photo and the join date come from the account.
  const { avatar, tier, memberSince, loyaltyPoints } = demoUser;

  const trimmed = name.trim();
  const photo = avatarUrl || avatar;

  return (
    <section
      aria-labelledby="profile-hero-heading"
      className="relative -mt-16 overflow-hidden border-b border-border/50 pt-28"
    >
      <HeroBackdrop />

      <div className="relative mx-auto max-w-7xl border-x border-border/50 px-5 pb-12 sm:px-8 sm:pb-14">
        <p className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card/20 py-1.5 pr-4 pl-2 text-[12px] font-medium text-muted-foreground backdrop-blur-sm">
          <BeamBorder />
          <span
            aria-hidden
            className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold tracking-wide text-background uppercase"
          >
            Account
          </span>
          {tier} · at the counter since{" "}
          {formatDate(createdAt ?? memberSince)}
        </p>

        <div className="mt-7 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* No photograph on the account and none shipped with the app, so
                the initial stands in rather than a stock face. */}
            <div className="size-16 shrink-0 rounded-2xl border border-border/60 bg-card p-1.5 sm:size-20">
              <div className="relative grid size-full place-items-center overflow-hidden rounded-xl bg-muted text-[20px] font-medium">
                {photo ? (
                  <Image
                    src={photo}
                    alt=""
                    fill
                    sizes="80px"
                    unoptimized={Boolean(avatarUrl)}
                    className="object-cover"
                  />
                ) : (
                  trimmed.charAt(0).toUpperCase()
                )}
              </div>
            </div>

            <div className="min-w-0">
              <h1
                id="profile-hero-heading"
                className="bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[32px] leading-[1.06] font-medium tracking-[-0.04em] text-transparent sm:text-[44px]"
              >
                {trimmed}
              </h1>

              <p className="mt-2 text-[13.5px] leading-[1.7] text-muted-foreground">
                Your details, your dockets and what you have paid — all in one
                place.
              </p>
            </div>
          </div>

          {/* The one number worth carrying at the top of every account page. */}
          <div className="flex shrink-0 items-baseline gap-2.5 self-start rounded-full border border-border bg-card/60 px-4 py-2 backdrop-blur-sm sm:self-auto">
            <span className="font-mono text-[18px] tracking-[-0.02em] tabular-nums text-primary">
              {loyaltyPoints.toLocaleString("en-IE")}
            </span>
            <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              Clover points
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
