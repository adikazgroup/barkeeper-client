/**
 * The contact page's opening band.
 *
 * Same shell as the home page's hero and the menu's — the shared backdrop, the
 * pill badge, the gradient headline, the ruled max-w-7xl frame — so the page
 * reads as part of the same site rather than a form bolted on the side.
 *
 * The three ways in sit on one ruled line under the copy: a visitor who only
 * came for the phone number never has to reach the form at all.
 */

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { COMPANY } from "@/lib/dummyData";
import { ChevronRightIcon } from "@/components/icons/Icons";
import { HeroBackdrop } from "../../_components/home/HeroBackdrop";
import { BeamBorder } from "../../_components/home/BeamBorder";
import { MAP_URL, TEL } from "../_data";

/** The three ways in, set as one line under the billing. */
const lines = [
  { icon: Phone, value: COMPANY.phone, href: TEL, external: false },
  {
    icon: Mail,
    value: COMPANY.email,
    href: `mailto:${COMPANY.email}`,
    external: false,
  },
  {
    icon: MapPin,
    value: COMPANY.address.full,
    href: MAP_URL,
    external: true,
  },
];

export function ContactHero() {
  return (
    <section
      aria-labelledby="contact-hero-heading"
      className="relative -mt-16 overflow-hidden border-b border-border/50 pt-28"
    >
      <HeroBackdrop />

      <div className="relative mx-auto max-w-7xl border-x border-border/50 px-5 pb-14 text-center sm:px-8 sm:pb-16">
        <p className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card/20 py-1.5 pr-4 pl-2 text-[12px] font-medium text-muted-foreground backdrop-blur-sm">
          <BeamBorder />
          <span
            aria-hidden
            className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold tracking-wide text-background uppercase"
          >
            Contact
          </span>
          A person answers, usually the same day
        </p>

        <h1
          id="contact-hero-heading"
          className="mx-auto mt-5 max-w-[16ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[38px] leading-[1.06] font-medium tracking-[-0.04em] text-balance text-transparent sm:text-[54px]"
        >
          Say it to us straight
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-pretty text-muted-foreground sm:text-[17px]">
          A table for Sunday, a tray of wings for twenty, or a word about the
          last plate we sent out — it all reaches the same counter.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="#message"
            className="group inline-flex h-11 w-full items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-5 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
          >
            Send word
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
              <ChevronRightIcon className="size-4" />
            </span>
          </Link>

          <Link
            href={TEL}
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-card/60 px-5 text-[14px] font-medium backdrop-blur-sm transition-colors duration-200 hover:bg-foreground hover:text-background sm:w-auto"
          >
            Rather ring?
          </Link>
        </div>

        {/* The lines, ruled off underneath */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-7 gap-y-3 border-t border-border/50 pt-6">
          {lines.map(({ icon: Icon, value, href, external }) => (
            <Link
              key={value}
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="inline-flex items-center gap-2 text-[13px] whitespace-nowrap text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              <Icon aria-hidden className="size-3.5 shrink-0" />
              {value}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
