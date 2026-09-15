"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PROMOTIONS } from "@/lib/dummyData";
import { Reveal, staggerChild, staggerParent } from "./Reveal";

const CELL = "px-5 sm:px-8";

/** Full at the foot, gone by half height — used for both blur and darkness. */
const FADE =
  "linear-gradient(to top, #000 30%, rgba(0,0,0,0.55) 55%, transparent 78%)";

export function Promotions() {
  return (
    <section className="border-t border-border/50">
      <div className="mx-auto max-w-7xl">
        <div className="border-x border-border/50">
          <Reveal
            className={`flex items-center justify-between gap-5 border-b border-border/50 py-10 ${CELL}`}
          >
            <h2 className="max-w-[18ch] text-[30px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[40px]">
              Offers worth clearing an evening for
            </h2>
            <p className="max-w-[44ch] text-[14px] leading-[1.65] text-muted-foreground">
              The kitchen runs a couple of deals at a time. They change when the
              week does, so what is here is what is on.
            </p>
          </Reveal>

          <motion.ul
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-4 p-4 sm:gap-5 sm:p-5 px-5 sm:px-8 lg:grid-cols-2"
          >
            {PROMOTIONS.map((offer) => (
              <motion.li key={offer.id} variants={staggerChild}>
                <Link
                  href={offer.href}
                  className="group relative flex min-h-96 flex-col justify-end overflow-hidden rounded-lg bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:min-h-100"
                >
                  <Image
                    src={offer.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="ani5 object-cover group-hover:scale-[1.03]"
                  />

                  {/* Blur first, then a light wash of dark over it. The blur
                      alone softens the picture but does not guarantee contrast
                      — a pale plate under white type still fails. */}
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

                  <span className={`relative block py-10 sm:py-12 ${CELL}`}>
                    <span className="block max-w-[16ch] text-[26px] leading-[1.1] font-medium tracking-[-0.035em] text-white sm:text-[34px]">
                      {offer.title}
                    </span>

                    <span className="mt-3.5 block max-w-[44ch] text-[14px] leading-[1.7] text-white/75">
                      {offer.body}
                    </span>
                  </span>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
