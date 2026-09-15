"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

import { Modal } from "@/components/ui/modal/Modal";
import type { Promotion } from "@/lib/types";

/**
 * The offer that greets a first visit.
 *
 * The artwork carries the offer — the headline, the discount, the dates are
 * all inside the picture, so nothing is repeated around it. The promotion's
 * `description` is the one line added, and it rides the bottom of the image on
 * a blurred strip rather than sitting underneath it, so the panel stays one
 * picture rather than a picture with a caption stapled on.
 *
 * Shown once per browsing session: closing it writes a flag to
 * `sessionStorage`, which the browser drops when the tab does. So a visitor
 * who dismisses it is left alone while they browse, and a fresh tab sees the
 * offer again. `localStorage` would silence it for good.
 *
 * Closing is deliberately easy: the X, a click on the backdrop, or Escape.
 * `Modal` already does all three, so nothing is re-implemented here.
 */

/**
 * Keyed by promotion, so a new offer is not silenced by a visitor who waved
 * the previous one away earlier in the same tab.
 */
const dismissedKey = (id: string) => `barkeeper:promo-dismissed:${id}`;

export function PromoBannerDialog({ promotion }: { promotion: Promotion }) {
  // Starts closed and opens from an effect: `sessionStorage` does not exist on
  // the server, and guessing wrong would flash the offer at someone who has
  // already waved it away.
  const [open, setOpen] = useState(false);

  const id = promotion._id;

  useEffect(() => {
    try {
      if (sessionStorage.getItem(dismissedKey(id)) === "1") return;
    } catch {
      // A locked-down browser (private mode, blocked site data) throws rather
      // than returning null. Showing the offer is the safe side of that.
    }

    // A beat, so the offer lands after the page has painted rather than on
    // top of a half-drawn hero.
    const timer = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(timer);
  }, [id]);

  const dismiss = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(dismissedKey(id), "1");
    } catch {
      // Nothing to do — the offer simply reappears on the next page.
    }
  };

  const image = promotion.image;
  if (!image?.url) return null;

  return (
    <Modal
      open={open}
      onClose={dismiss}
      bodyClassName="p-0"
      // A banner, so it is wide before it is tall, and it takes as much of the
      // viewport as it can without crowding the edges. Border, ground and
      // shadow are dropped so what floats is the picture, not a panel.
      className="max-w-[min(94vw,68rem)] border-0 bg-transparent shadow-none"
      aria-label={promotion.title}
    >
      {/* A landscape frame whichever way the file is cut: the artwork is
          expected to be a banner, and a portrait file uploaded by the kitchen
          is filled to the frame rather than left to tower over the fold. On a
          phone the box is squarer, so a wide banner is not reduced to a
          sliver. */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl sm:aspect-16/9">
        <Image
          src={image.url}
          alt={image.alt || promotion.title}
          fill
          priority
          sizes="(max-width: 640px) 94vw, 68rem"
          className="object-cover"
        />

        {/* The close button sits on the artwork, so the top of the frame is
            darkened enough for it to stay visible whatever the picture does. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/45 to-transparent"
        />

        {promotion.description && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-linear-to-t from-black/70 to-transparent px-4 pt-12 pb-4">
            <p className="flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-center text-[12.5px] leading-snug font-medium text-white backdrop-blur-md sm:text-[13.5px]">
              <MapPin aria-hidden className="size-3.5 shrink-0" />
              {promotion.description}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
