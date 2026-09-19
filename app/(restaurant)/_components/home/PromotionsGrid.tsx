"use client";

/**
 * The offers, laid out by how many there are.
 *
 * One offer takes the full width — a lone card in half a row reads as a card
 * that lost its pair. Two sit side by side. Three or more still show two, with
 * the rest behind a link: the home page is a way in, not the whole offers
 * board.
 *
 * Client-side only because the cards stagger in; the fetch that decides what
 * is on happens on the server, in `Promotions`.
 */

import Link from "next/link";
import { motion } from "framer-motion";

import { ArrowRightIcon } from "@/components/icons/Icons";
import SafeImage from "@/components/ui/SafeImage";
import type { Promotion } from "@/lib/types";
import { cn } from "@/lib/utils";

import { staggerChild, staggerParent } from "./Reveal";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

/**
 * Blur first, then a light wash of dark over it. The blur alone softens the
 * picture but does not guarantee contrast — a pale plate under white type
 * still fails.
 */
const FADE =
  "linear-gradient(to top, #000 30%, rgba(0,0,0,0.55) 55%, transparent 78%)";

function Card({ promotion, alone }: { promotion: Promotion; alone: boolean }) {
  return (
    <motion.li variants={staggerChild} id={`offer-${promotion._id}`}>
      <div
        className={cn(
          "group relative flex flex-col justify-end overflow-hidden rounded-lg bg-card",
          alone ? "min-h-100 lg:min-h-112" : "min-h-96 lg:min-h-100",
        )}
      >
        <SafeImage
          src={promotion.image?.url}
          alt={promotion.image?.alt || ""}
          fill
          sizes={alone ? "100vw" : "(max-width: 1024px) 100vw, 50vw"}
          fallbackClassName="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground"
          className="ani5 object-cover group-hover:scale-[1.03]"
        />

        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 backdrop-blur-lg"
          style={{ maskImage: FADE, WebkitMaskImage: FADE }}
        />

        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgb(0 0 0 / 0.72), rgb(0 0 0 / 0.35) 45%, transparent 72%)",
          }}
        />

        <div className={cn("relative block py-10 sm:py-12", CELL)}>
          <h3 className="block max-w-[16ch] text-[26px] leading-[1.1] font-medium tracking-[-0.035em] text-white sm:text-[34px]">
            {promotion.title}
          </h3>

          <p className="mt-3.5 block max-w-[44ch] text-[14px] leading-[1.7] text-white/75">
            {promotion.description}
          </p>
        </div>
      </div>
    </motion.li>
  );
}

export function PromotionsGrid({
  promotions,
  /** Renders the row that leads to the rest of the board. */
  seeMoreHref,
}: {
  promotions: Promotion[];
  seeMoreHref?: string;
}) {
  const alone = promotions.length === 1;

  return (
    <>
      <motion.ul
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className={cn(
          "grid gap-4 py-5 sm:gap-5",
          !alone && "lg:grid-cols-2",
          CELL,
        )}
      >
        {promotions.map((promotion) => (
          <Card key={promotion._id} promotion={promotion} alone={alone} />
        ))}
      </motion.ul>

      {seeMoreHref && (
        <div
          className={cn(
            "flex justify-center border-t border-border/50 py-6",
            CELL,
          )}
        >
          <Link
            href={seeMoreHref}
            className="group inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-5 text-[13px] font-medium transition-colors duration-200 hover:border-transparent hover:bg-primary hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            See all offers
            <ArrowRightIcon
              aria-hidden
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      )}
    </>
  );
}
