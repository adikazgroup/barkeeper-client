import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { TRIAL_DAYS } from "@/lib/pricing";
import { Logo } from "../home/Logo";
import { BeamBorder } from "../home/BeamBorder";

function AuthBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute inset-0 isolate opacity-[0.28] dark:opacity-[0.13] dark:brightness-75"
        style={{
          // Strongest along the foot of the screen, thinning towards the top
          // so the form never sits on the busy part of the picture.
          maskImage:
            "linear-gradient(180deg, transparent 0%, rgb(0 0 0 / 0.5) 30%, #000 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, rgb(0 0 0 / 0.5) 30%, #000 100%)",
        }}
      >
        <Image
          src="/herobg2.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />
        {/* Drains the picture's own colour so it reads as ground, not image. */}
        <div className="absolute inset-0 bg-background mix-blend-color" />
      </div>

      <div className="absolute -bottom-56 left-1/2 h-120 w-340 -translate-x-1/2 rounded-[50%] bg-primary/10 blur-[160px]" />

      <div className="bg-grain absolute inset-0 opacity-[0.045] mix-blend-multiply dark:opacity-[0.07] dark:mix-blend-screen" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    SHELL                                   */
/* -------------------------------------------------------------------------- */

/**
 * Field overrides for `FormInput`, which is styled for the dashboard in zinc
 * and blue. `cn` runs through tailwind-merge, so these win — and scoping the
 * change here leaves the dashboard's own forms alone.
 */
export const AUTH_FIELD =
  "h-11 rounded-lg border-border bg-card/60 px-3.5 text-[14px] backdrop-blur-sm placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

export function AuthShell({
  badge,
  title,
  subtitle,
  children,
  footer,
  /** Points on the brand panel. Omitted on the verification screen. */
  points,
}: {
  badge: string;
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  points?: { title: string; body: string }[];
}) {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background">
      <AuthBackdrop />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col ">
        <div className="grid flex-1 lg:grid-cols-[1fr_1fr]">
          {/* brand side — the reason they clicked, kept in view ------- */}
          <aside className="hidden flex-col justify-between  p-10 lg:flex xl:p-12">
            <Link href="/" className="flex w-fit items-center gap-2.5">
              <Logo className="h-6 w-auto" priority />
            </Link>

            <div>
              <h2 className="max-w-[18ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[34px] leading-[1.06] font-medium tracking-[-0.04em] text-transparent xl:text-[40px]">
                Every order captured. Every message answered.
              </h2>

              {points && (
                <ul className="mt-20 space-y-6">
                  {points.map((point, index) => (
                    <li key={point.title} className="flex gap-4">
                      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10 font-mono text-[10.5px] tabular-nums text-primary">
                        {index + 1}
                      </span>
                      <span>
                        <span className="block text-[14px] font-medium tracking-[-0.02em]">
                          {point.title}
                        </span>
                        <span className="mt-1.5 block max-w-[60ch] text-[13px] leading-[1.7] text-muted-foreground">
                          {point.body}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="max-w-[36ch] text-[12.5px] leading-[1.7] text-muted-foreground">
              {TRIAL_DAYS} days free on every plan. Cancel from the dashboard —
              no notice period, and nobody to email.
            </p>
          </aside>

          {/* form side ------------------------------------------------ */}
          <div className="flex flex-col">
            {/* On narrow screens the brand panel is gone, so the way back
                to the site has to live here. */}
            <div className="flex items-center justify-between gap-4 border-b border-border/50 px-5 py-5 sm:px-8 lg:justify-end lg:border-b-0">
              <Link href="/" className="flex items-center gap-2.5 lg:hidden">
                <Logo className="h-6 w-auto" priority />
                <span className="text-[15.5px] font-semibold tracking-[-0.02em]">
                  Barkeeper
                </span>
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                <span aria-hidden>←</span>
                Back to site
              </Link>
            </div>

            <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
              <div className="w-full max-w-[26rem]">
                <p className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card/30 py-1.5 pr-3.5 pl-2.5 font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase backdrop-blur-sm">
                  <BeamBorder />
                  <span className="relative flex size-1.5 shrink-0">
                    <span className="relative size-1.5 rounded-full bg-primary" />
                  </span>
                  {badge}
                </p>

                <h1 className="mt-6 text-[30px] leading-[1.08] font-medium tracking-[-0.04em] sm:text-[36px]">
                  {title}
                </h1>

                {subtitle && (
                  <p className="mt-4 text-[14px] leading-[1.7] text-muted-foreground">
                    {subtitle}
                  </p>
                )}

                <div className="mt-9">{children}</div>

                {footer && (
                  <div className="mt-8 border-t border-border/50 pt-6 text-[13.5px] text-muted-foreground">
                    {footer}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
