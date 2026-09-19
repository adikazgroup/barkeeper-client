"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

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
  { width: "w-32 sm:w-44 lg:w-48 xl:w-56", rotate: -6, lift: 14, at: "" },
  { width: "w-40 sm:w-56 lg:w-60 xl:w-68", rotate: 0, lift: -14, at: "" },
  { width: "w-32 sm:w-44 lg:w-48 xl:w-56", rotate: 6, lift: 14, at: "" },
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

  const middle = dishes[CENTRE - offset] ?? dishes[0];

  return (
    // Pulled up by exactly the header's height, with that height given back as
    // padding. The header is sticky, so it takes its 64px out of the flow and
    // the backdrop would otherwise start below it — leaving the bar sitting on
    // flat page background instead of on the hero's own art. This slides the
    // section up under the transparent bar without moving a pixel of content.
    <section className="relative -mt-16 overflow-hidden pt-28 pb-16">
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
              New
            </span>
            Now delivering until 2am
          </motion.p>

          <motion.h1
            {...rise(0.1)}
            className="mx-auto mt-5 max-w-4xl bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[38px] leading-[1.06] font-medium tracking-[-0.04em] text-balance text-transparent sm:text-[54px] lg:text-[62px]"
          >
            Your next favourite meal is minutes away.
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mx-auto mt-6 max-w-3xl text-[15px] leading-relaxed text-pretty text-muted-foreground sm:text-[17px]"
          >
            Smash burgers, crispy wings and rice bowls—made fresh the moment you
            order, and at your door while they are still hot.
          </motion.p>
        </div>
      </div>

      {/* Nothing on the banner rail: the words still stand on their own, and
          an empty fan would only leave a hole under them. */}
      {dishes.length > 0 && (
        <div className="relative mx-auto max-w-[110rem] px-5 sm:px-8">
          <div className="flex items-center justify-center -space-x-7 pt-14 sm:-space-x-11 lg:-space-x-12 xl:-space-x-14">
            {seats.map(({ seat, seatIndex, dish }) => {
              const depth = Math.abs(CENTRE - seatIndex);

              return (
                <span
                  key={dish?.id ?? `seat-${seatIndex}`}
                  className={cn("block shrink-0", seat.width, seat.at)}
                  style={{
                    transform: `translateY(${seat.lift}px) rotate(${seat.rotate}deg)`,
                    zIndex: FAN.length - depth,
                  }}
                >
                  <span
                    title={dish?.name}
                    className="group ani3 relative block rounded-3xl border border-border bg-card p-1.5 shadow-xl shadow-black/10 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <span className="relative block aspect-3/4 w-full overflow-hidden rounded-[1.2rem] bg-background/60">
                      {/* No photograph yet — the plate keeps its frame and the
                          mark sits in the middle of it, so the arc reads the
                          same whether or not the picture has been uploaded. */}
                      <SafeImage
                        src={dish?.src}
                        alt={dish?.name ?? ""}
                        fill
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 26vw, 20vw"
                        priority={seatIndex === CENTRE}
                        fallbackClassName="absolute inset-0 flex items-center justify-center text-muted-foreground"
                        style={{
                          filter: `saturate(${1 - depth * 0.26}) contrast(${1 - depth * 0.05}) brightness(${1 - depth * 0.03})`,
                        }}
                        className="object-cover transition-[filter] duration-500 ease-out group-hover:filter-none!"
                      />
                    </span>

                    {depth > 0 && (
                      <span
                        aria-hidden
                        className="ani3 pointer-events-none absolute inset-1.5 rounded-[1.2rem] bg-background group-hover:opacity-0"
                        style={{ opacity: depth * 0.13 }}
                      />
                    )}
                  </span>
                </span>
              );
            })}
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-10 mx-auto hidden max-w-5xl justify-between px-4 lg:flex">
            <span className="mt-4 flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-foreground shadow-lg">
              Cooked to order
            </span>

            <span className="mt-4 flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-foreground shadow-lg">
              Delivered hot
            </span>
          </div>

          {middle && (
            <p className="ani2 mx-auto mt-10 flex w-fit items-center gap-2.5 rounded-full border border-border bg-card py-1.5 pr-4 pl-1.5 shadow-lg">
              {/* Too small for the fallback mark, so an unphotographed plate
                  leaves the disc plain rather than cramming an icon into it. */}
              <span className="relative block size-8 shrink-0 overflow-hidden rounded-full bg-muted">
                {middle.src && (
                  <Image
                    src={middle.src}
                    alt=""
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                )}
              </span>
              <span className="text-[12px] font-semibold text-foreground">
                {middle.name}
              </span>
            </p>
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
