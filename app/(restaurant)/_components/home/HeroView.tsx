"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import SafeImage from "@/components/ui/SafeImage";

import { HeroBackdrop } from "./HeroBackdrop";
import { EASE } from "./Reveal";
import { BeamBorder } from "./BeamBorder";
import { cn } from "@/lib/utils";

/**
 * Where each dish sits in the arc, read outwards from the middle.
 *
 * The whole fan is described here rather than in seven sets of classes: the
 * angle and lift are what make it an arc, so they belong in one table where the
 * curve can be seen and adjusted as a curve.
 */
const FAN = [
  {
    width: "w-24 sm:w-32 lg:w-36 xl:w-40",
    rotate: -20,
    lift: 84,
    at: "hidden lg:block",
  },
  {
    width: "w-28 sm:w-36 lg:w-40 xl:w-48",
    rotate: -13,
    lift: 42,
    at: "hidden md:block",
  },
  {
    width: "w-[30vw] max-w-44 sm:w-44 sm:max-w-none lg:w-48 xl:w-56",
    rotate: -6,
    lift: 14,
    at: "",
  },
  {
    width: "w-[58vw] max-w-72 sm:w-56 sm:max-w-none lg:w-60 xl:w-68",
    rotate: 0,
    lift: -14,
    at: "",
  },
  {
    width: "w-[30vw] max-w-44 sm:w-44 sm:max-w-none lg:w-48 xl:w-56",
    rotate: 6,
    lift: 14,
    at: "",
  },
  {
    width: "w-28 sm:w-36 lg:w-40 xl:w-48",
    rotate: 13,
    lift: 42,
    at: "hidden md:block",
  },
  {
    width: "w-24 sm:w-32 lg:w-36 xl:w-40",
    rotate: 20,
    lift: 84,
    at: "hidden lg:block",
  },
];

/** The middle of the fan — the one plate that stands up straight and is named. */
const CENTRE = 3;

/**
 * One plate in the fan, as the banner rail hands it over.
 *
 * The seating is still the page's: the rail arrives in the admin's
 * `bannerSorting` order and is read straight into the seats left to right, so
 * whichever plate the admin puts fourth is the one that stands upright at
 * `CENTRE` and gets the caption.
 */
export interface HeroDish {
  id: string;
  /** Absent until the kitchen has photographed the plate. */
  src?: string;
  name: string;
}

export function HeroView({ dishes }: { dishes: HeroDish[] }) {
  const reduced = useReducedMotion();

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  // Fewer plates than seats are seated from the middle outwards, not packed
  // against the left edge: the fan is a symmetrical arc, and half an arc
  // hanging off one side is not the same shape. A full rail leaves this at 0.
  const offset = Math.max(0, Math.floor((FAN.length - dishes.length) / 2));

  // Every seat is drawn whether or not the rail has a plate for it, so the arc
  // keeps its shape while the kitchen is still filling the rail in.
  const seats = FAN.map((seat, seatIndex) => ({
    seat,
    seatIndex,
    dish: dishes[seatIndex - offset],
  }));

  const [pickedId, setPickedId] = useState<string | null>(null);
  const middle = dishes[CENTRE - offset] ?? dishes[0];
  const picked = dishes.find((dish) => dish.id === pickedId) ?? middle;

  return (
    <section className="relative -mt-16 overflow-hidden pt-24 pb-14 sm:pt-28 sm:pb-16">
      <HeroBackdrop />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center">
          <motion.p
            {...rise(0)}
            className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card/20 py-1.5 pr-4 pl-2 text-[12px] font-medium text-muted-foreground backdrop-blur-sm"
          >
            <BeamBorder />
            <span
              aria-hidden
              className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold tracking-wide text-background uppercase"
            >
              CHEERS
            </span>
            Your table is waiting!
          </motion.p>

          <motion.h1
            {...rise(0.1)}
            className="mx-auto mt-5 max-w-5xl bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[38px] leading-[1.06] font-medium tracking-[-0.04em] text-balance text-transparent sm:text-[54px] lg:text-[62px]"
          >

            Drinks to Remember  Good Food. Great Nights.
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mx-auto mt-6 max-w-3xl text-[15px] leading-relaxed text-pretty text-muted-foreground sm:text-[17px]"
          >
            Crafted flavors, signature drinks, and warm hospitality come together for memorable nights made to share with friends.
          </motion.p>
        </div>
      </div>

      {/* Nothing on the banner rail: the words still stand on their own, and
          an empty fan would only leave a hole under them. */}
      {dishes.length > 0 && (
        <div className="relative mx-auto max-w-[110rem] px-5 sm:px-8">
          <div className="flex items-center justify-center pt-10 sm:pt-14">
            {seats.map(({ seat, seatIndex, dish }) => {
              const depth = Math.abs(CENTRE - seatIndex);
              const isPicked = !!dish && dish.id === picked?.id;

              return (
                <span
                  key={dish?.id ?? `seat-${seatIndex}`}
                  className={cn(
                    "block shrink-0 -mx-5 sm:-mx-5.5 lg:-mx-6 xl:-mx-7",
                    seat.width,
                    seat.at,
                  )}
                  style={{
                    transform: `translateY(${seat.lift}px) rotate(${seat.rotate}deg)`,
                    zIndex: FAN.length - depth,
                  }}
                >
                  <button
                    type="button"
                    title={dish?.name}
                    disabled={!dish}
                    aria-pressed={isPicked}
                    onClick={() => dish && setPickedId(dish.id)}
                    className={cn(
                      "group ani3 relative block w-full cursor-pointer rounded-3xl border bg-card p-1.5 text-left shadow-xl shadow-black/10 hover:-translate-y-2 hover:shadow-2xl disabled:cursor-default",
                      isPicked ? "border-primary/50" : "border-border",
                    )}
                  >
                    <span className="relative block aspect-3/4 w-full overflow-hidden rounded-[1.2rem] bg-background/60">
                      {/* No photograph yet — the plate keeps its frame and the
                          mark sits in the middle of it, so the arc reads the
                          same whether or not the picture has been uploaded. */}
                      <SafeImage
                        src={dish?.src}
                        alt={dish?.name ?? ""}
                        fill
                        sizes="(max-width: 640px) 58vw, (max-width: 1024px) 26vw, 20vw"
                        priority={seatIndex === CENTRE}
                        fallbackClassName="absolute inset-0 flex items-center justify-center text-muted-foreground"
                        style={{
                          filter: `saturate(${1 - depth * 0.26}) contrast(${1 - depth * 0.05}) brightness(${1 - depth * 0.03})`,
                        }}
                        className={cn(
                          "object-cover transition-[filter] duration-500 ease-out group-hover:filter-none!",
                          isPicked && "filter-none!",
                        )}
                      />
                    </span>

                    {depth > 0 && (
                      <span
                        aria-hidden
                        className="ani3 pointer-events-none absolute inset-1.5 rounded-[1.2rem] bg-background group-hover:opacity-0"
                        style={{ opacity: isPicked ? 0 : depth * 0.13 }}
                      />
                    )}
                  </button>
                </span>
              );
            })}
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-10 mx-auto hidden max-w-5xl justify-between px-4 lg:flex">
            <span className="mt-4 flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-foreground shadow-lg">
              Made Fresh
            </span>

            <span className="mt-4 flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-foreground shadow-lg">
              Bar Perfected
            </span>
          </div>

          {picked && (
            <motion.p
              layout={!reduced}
              transition={{ duration: 0.35, ease: EASE }}
              aria-live="polite"
              className="mx-auto mt-5 flex w-fit max-w-full items-center overflow-hidden rounded-full border border-border bg-card py-1.5 pr-4 pl-1.5 shadow-lg sm:mt-10"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={picked.id}
                  initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduced ? 0 : -8 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="flex min-w-0 items-center gap-2.5"
                >
                  {/* Too small for the fallback mark, so an unphotographed plate
                      leaves the disc plain rather than cramming an icon into it. */}
                  <span className="relative block size-8 shrink-0 overflow-hidden rounded-full bg-muted">
                    {picked.src && (
                      <Image
                        src={picked.src}
                        alt=""
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    )}
                  </span>
                  <span className="truncate text-[12px] font-semibold text-foreground">
                    {picked.name}
                  </span>
                </motion.span>
              </AnimatePresence>
            </motion.p>
          )}

          {/* <motion.div
            {...rise(0.22)}
            className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"
          >
            <Link href="/register">
              <Button
                size="lg"
                rounded="full"
                fullWidth
                endIcon={<ArrowRightIcon className="size-4" />}
              >
                Start free trial
              </Button>
            </Link>

            <Link href="#how-it-works">
              <Button variant="outline" size="lg" rounded="full" fullWidth>
                See how it works
              </Button>
            </Link>
          </motion.div> */}
        </div>
      )}
    </section>
  );
}
