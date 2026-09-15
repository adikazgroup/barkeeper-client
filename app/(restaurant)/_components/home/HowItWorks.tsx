"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "@/components/icons/BrandIcons";
import { EASE, Reveal } from "./Reveal";

/* -------------------------------------------------------------------------- */
/*                                 STEP VISUALS                               */
/* -------------------------------------------------------------------------- */

export function ConnectVisual() {
  return (
    <div aria-hidden="true" className="space-y-1.5">
      {[
        { Icon: InstagramIcon, name: "@rooh.label", state: "Connected" },
        { Icon: FacebookIcon, name: "Rooh Label", state: "Connected" },
        { Icon: WhatsAppIcon, name: "+880 1712 …", state: "Connect" },
      ].map(({ Icon, name, state }, index) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: index * 0.1, ease: EASE }}
          className="flex items-center gap-2.5 rounded-md border border-border bg-card px-3 py-2.5"
        >
          <Icon className="size-3.5 text-muted-foreground" />
          <span className="flex-1 truncate text-[11.5px]">{name}</span>
          <span
            className={cn(
              "text-[10px]",
              state === "Connected"
                ? "text-muted-foreground"
                : "font-medium text-foreground",
            )}
          >
            {state}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export function TrainVisual() {
  return (
    <div
      aria-hidden="true"
      className="rounded-md border border-border bg-card p-3.5"
    >
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-medium">products.csv</span>
        <span className="font-mono text-[10px] text-muted-foreground">
          312 rows
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {[
          { label: "Catalogue & prices", pct: 100 },
          { label: "Delivery & returns", pct: 100 },
          { label: "Tone of voice", pct: 64 },
        ].map((row, index) => (
          <div key={row.label}>
            <div className="flex items-baseline justify-between">
              <span className="text-[10.5px] text-muted-foreground">
                {row.label}
              </span>
              <span className="font-mono text-[9.5px] text-muted-foreground/70">
                {row.pct}%
              </span>
            </div>
            <span className="mt-1 block h-1 overflow-hidden rounded-full bg-foreground/8">
              <motion.i
                className="block h-full rounded-full bg-foreground/50"
                initial={{ width: 0 }}
                whileInView={{ width: `${row.pct}%` }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.9,
                  delay: 0.15 + index * 0.12,
                  ease: EASE,
                }}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SellVisual() {
  return (
    <div aria-hidden="true" className="space-y-1.5">
      <div className="rounded-md border border-border bg-card px-3 py-2.5">
        <p className="text-[10.5px] text-muted-foreground">
          &ldquo;Sylhet e deliver koren?&rdquo;
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.2, ease: EASE }}
        className="rounded-md bg-foreground px-3 py-2.5"
      >
        <p className="text-[10.5px] text-background">
          Ji, ৳120 delivery charge, 2–3 din. Confirm kore dibo?
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.42, ease: EASE }}
        className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2.5"
      >
        <span className="size-1.5 rounded-full bg-success" />
        <span className="text-[10.5px]">Order #1043 · cash on delivery</span>
      </motion.div>
    </div>
  );
}

export const STEPS = [
  {
    number: "01",
    title: "Connect your channels",
    description:
      "Sign in with Facebook, Instagram or WhatsApp and pick the pages the agent should watch. No plugin, no developer, no code on your site.",
    Visual: ConnectVisual,
  },
  {
    number: "02",
    title: "Teach it your business",
    description:
      "Upload your catalogue, set delivery charges and return policy, then choose how the agent should sound. Ten minutes, once.",
    Visual: TrainVisual,
  },
  {
    number: "03",
    title: "Let it sell",
    description:
      "It answers, quotes, handles objections and closes. Orders and customers appear in your dashboard, ready to pack.",
    Visual: SellVisual,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-border py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <h2 className="max-w-[16ch] text-[30px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[40px]">
            Live before your tea gets cold
          </h2>
          <p className="max-w-[42ch] self-end text-[14px] leading-[1.65] text-muted-foreground">
            Three steps, and the last one runs by itself. Most shops connect
            their first channel and see the agent answer within the hour.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-px bg-border lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <Reveal
              key={step.number}
              delay={index * 0.1}
              className="bg-background pt-8 lg:px-8 lg:first:pl-0 lg:last:pr-0"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[11px] text-muted-foreground">
                  {step.number}
                </span>
                <h3 className="text-[19px] font-medium tracking-tight">
                  {step.title}
                </h3>
              </div>

              <p className="mt-3 max-w-[38ch] pl-[2.1rem] text-[13.5px] leading-[1.65] text-muted-foreground">
                {step.description}
              </p>

              <div className="mt-8 pb-8 pl-[2.1rem]">
                <step.Visual />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
