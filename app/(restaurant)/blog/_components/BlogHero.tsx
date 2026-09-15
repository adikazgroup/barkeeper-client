import Image from "next/image";

import { Leaf } from "lucide-react";
import heroBg from "@/public/herobg2.png";

export function BlogHero() {
  return (
    <section
      aria-labelledby="blog-hero-heading"
      className="relative w-full overflow-hidden bg-background"
    >
      <Image
        src={heroBg}
        alt=""
        fill
        priority
        sizes="100vw"
        className="animate-zoom-slow object-cover object-center opacity-[0.12] saturate-50 motion-reduce:animate-none dark:opacity-50 dark:saturate-100"
      />

      {/* The house green, multiplied into the photograph — dark only. */}
      <span
        aria-hidden
        className="absolute inset-0 hidden dark:block dark:bg-[#0B2418]/55 dark:mix-blend-multiply"
      />
      {/* A pool of light under the type on cream; a vignette on dark. */}
      <span
        aria-hidden
        className="absolute inset-0 bg-radial-[at_50%_40%] from-transparent via-background/30 to-background/90 dark:from-transparent dark:via-[#0B2418]/70 dark:to-[#0B2418]"
      />

      {/* The band dissolves into the filter rail rather than ending on a line. */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-background dark:hidden"
      />

      <div className="relative mx-auto max-w-3xl px-5 pt-22 pb-12 text-center sm:px-8 sm:pt-28 sm:pb-14">
        {/* Kicker, ruled off on both sides */}
        <span className="flex items-center justify-center gap-3 text-[10px] font-semibold tracking-[0.3em] text-redPrimary uppercase sm:gap-4 dark:text-primary">
          <span aria-hidden className="h-px w-8 bg-primary/40 sm:w-12" />
          <Leaf className="size-3.5 shrink-0" />
          An iris
          <span aria-hidden className="h-px w-8 bg-primary/40 sm:w-12" />
        </span>

        <h1
          id="blog-hero-heading"
          className="mt-5 font-title text-3xl leading-tight font-semibold tracking-tight text-(--rc-premium-dark) sm:text-5xl dark:text-white dark:drop-shadow-2xl"
        >
          Notes from <span className="text-primary">behind the counter</span>
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-pretty text-(--rc-premium-muted) dark:text-white/70">
          How the food gets made, who makes it, and what we learned getting it
          right — written by the people at the fryers.
        </p>
      </div>
    </section>
  );
}
