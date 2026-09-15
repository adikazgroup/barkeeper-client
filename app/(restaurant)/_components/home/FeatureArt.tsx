"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BRAND_PATHS } from "@/components/icons/BrandIcons";
import { EASE } from "./Reveal";

/* -------------------------------------------------------------------------- */
/*                                  PRIMITIVES                                */
/* -------------------------------------------------------------------------- */

/**
 * All five illustrations are inline SVG so the linework stays crisp at any
 * size and picks up the theme: strokes and fills reference the same design
 * tokens the rest of the page uses, so nothing needs a dark-mode variant.
 */
function Art({
  viewBox,
  children,
  className,
}: {
  viewBox: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        // No panel behind the drawing: it sits directly on the card. The
        // shapes inside carry their own outlines, so nothing needs a ground to
        // read against.
        "overflow-hidden",
        className,
      )}
    >
      <svg viewBox={viewBox} className="w-full" fill="none">
        {children}
      </svg>
    </div>
  );
}

/** A rounded panel standing in for a card of interface. */
function Surface({
  x,
  y,
  w,
  h,
  r = 6,
  muted = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  muted?: boolean;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={r}
      className={cn("stroke-border", muted ? "fill-muted" : "fill-card")}
      strokeWidth="1"
    />
  );
}

/** Placeholder text run. */
function Line({
  x,
  y,
  w,
  dim = false,
}: {
  x: number;
  y: number;
  w: number;
  dim?: boolean;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height="3"
      rx="1.5"
      className="fill-foreground"
      opacity={dim ? 0.12 : 0.22}
    />
  );
}

/** A brand mark placed inside the drawing at an arbitrary size. */
function Mark({
  d,
  x,
  y,
  size,
  opacity = 0.55,
}: {
  d: string;
  x: number;
  y: number;
  size: number;
  opacity?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 24})`}>
      <path d={d} className="fill-foreground" opacity={opacity} />
    </g>
  );
}

/** Stroke that draws itself in when the card scrolls into view. */
function Draw({
  d,
  delay = 0,
  className = "stroke-border",
  width = 1,
  dashed = false,
}: {
  d: string;
  delay?: number;
  className?: string;
  width?: number;
  dashed?: boolean;
}) {
  return (
    <motion.path
      d={d}
      className={className}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={dashed ? "3 4" : undefined}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    />
  );
}

/** Element that fades up into place. */
function Enter({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.g>
  );
}

/* -------------------------------------------------------------------------- */
/*                              1 — UNIFIED INBOX                             */
/* -------------------------------------------------------------------------- */

/** Four channels funnelling along curves into a single customer thread. */
export function InboxArt() {
  const sources = [
    { y: 22, mark: BRAND_PATHS.instagram },
    { y: 68, mark: BRAND_PATHS.facebook },
    { y: 114, mark: BRAND_PATHS.messenger },
    { y: 160, mark: BRAND_PATHS.whatsapp },
  ];

  return (
    <Art viewBox="0 0 420 206">
      {/* Curves converging on the thread */}
      {sources.map((source, index) => (
        <Draw
          key={source.y}
          d={`M96 ${source.y + 16}C150 ${source.y + 16} 168 103 214 103`}
          delay={0.15 + index * 0.08}
        />
      ))}

      {/* Channel chips */}
      {sources.map((source, index) => (
        <Enter key={source.y} delay={index * 0.07}>
          <Surface x={24} y={source.y} w={72} h={32} />
          <Mark d={source.mark} x={34} y={source.y + 8} size={16} />
          <Line x={58} y={source.y + 12} w={26} />
          <Line x={58} y={source.y + 19} w={16} dim />
        </Enter>
      ))}

      {/* The merged thread */}
      <Enter delay={0.5}>
        <Surface x={222} y={26} w={174} h={154} r={8} />

        {/* Thread header: one customer, every channel */}
        <circle cx="242" cy="46" r="9" className="fill-muted" />
        <Line x={258} y={41} w={54} />
        <Line x={258} y={49} w={34} dim />
        {[
          BRAND_PATHS.instagram,
          BRAND_PATHS.facebook,
          BRAND_PATHS.messenger,
        ].map((mark, index) => (
          <Mark
            key={mark}
            d={mark}
            x={330 + index * 16}
            y={41}
            size={11}
            opacity={0.4}
          />
        ))}

        <line
          x1="222"
          y1="64"
          x2="396"
          y2="64"
          className="stroke-border"
          strokeWidth="1"
        />

        {/* Incoming, then the agent's reply */}
        <rect
          x={238}
          y={78}
          width={92}
          height={26}
          rx="6"
          className="fill-muted"
        />
        <Line x={248} y={86} w={64} />
        <Line x={248} y={94} w={40} dim />

        <rect
          x={266}
          y={114}
          width={114}
          height={30}
          rx="6"
          className="fill-foreground"
        />
        <rect
          x={276}
          y={122}
          width={88}
          height={3}
          rx="1.5"
          className="fill-background"
          opacity="0.55"
        />
        <rect
          x={276}
          y={130}
          width={56}
          height={3}
          rx="1.5"
          className="fill-background"
          opacity="0.3"
        />

        <rect
          x={238}
          y={154}
          width={142}
          height={16}
          rx="5"
          className="fill-muted"
        />
      </Enter>
    </Art>
  );
}

/* -------------------------------------------------------------------------- */
/*                            2 — TRAINED ON CATALOGUE                        */
/* -------------------------------------------------------------------------- */

/** A product sheet feeding the agent, which answers with a grounded price. */
export function CatalogueArt() {
  return (
    <Art viewBox="0 0 320 176">
      {/* Source sheet */}
      <Enter>
        <Surface x={20} y={26} w={96} h={124} r={7} />
        <Line x={32} y={40} w={44} />
        {[0, 1, 2, 3, 4].map((row) => (
          <g key={row}>
            <Line x={32} y={58 + row * 15} w={row === 4 ? 34 : 56} dim />
            <Line x={94} y={58 + row * 15} w={12} dim />
          </g>
        ))}
      </Enter>

      {/* Feed into the agent */}
      <Draw d="M116 88H146" delay={0.3} dashed />

      <Enter delay={0.35}>
        <rect
          x={146}
          y={70}
          width={36}
          height={36}
          rx="10"
          className="fill-foreground"
        />
        {/* A small node graph, standing for the trained model */}
        <circle cx="157" cy="82" r="2.5" className="fill-background" />
        <circle cx="171" cy="80" r="2.5" className="fill-background" />
        <circle cx="164" cy="95" r="2.5" className="fill-background" />
        <path
          d="M157 82L171 80L164 95Z"
          className="stroke-background"
          strokeWidth="1"
          opacity="0.5"
        />
      </Enter>

      <Draw d="M182 88H212" delay={0.5} dashed />

      {/* Grounded answer */}
      <Enter delay={0.6}>
        <rect
          x={212}
          y={54}
          width={88}
          height={40}
          rx="7"
          className="fill-foreground"
        />
        <rect
          x={222}
          y={64}
          width={66}
          height={3}
          rx="1.5"
          className="fill-background"
          opacity="0.55"
        />
        <rect
          x={222}
          y={72}
          width={44}
          height={3}
          rx="1.5"
          className="fill-background"
          opacity="0.3"
        />
        <rect
          x={222}
          y={80}
          width={30}
          height={5}
          rx="2.5"
          className="fill-background"
          opacity="0.8"
        />

        {/* Language + tone tags */}
        <Surface x={212} y={104} w={42} h={16} r={5} muted />
        <Line x={219} y={110} w={28} dim />
        <Surface x={258} y={104} w={42} h={16} r={5} muted />
        <Line x={265} y={110} w={28} dim />
      </Enter>
    </Art>
  );
}

/* -------------------------------------------------------------------------- */
/*                            3 — CHAT BECOMES ORDER                          */
/* -------------------------------------------------------------------------- */

/** A conversation resolving into a written order. */
export function OrderArt() {
  return (
    <Art viewBox="0 0 320 176">
      <Enter>
        <rect
          x={22}
          y={38}
          width={104}
          height={30}
          rx="7"
          className="fill-card stroke-border"
          strokeWidth="1"
        />
        <Line x={34} y={47} w={72} />
        <Line x={34} y={56} w={46} dim />

        <rect
          x={40}
          y={80}
          width={104}
          height={30}
          rx="7"
          className="fill-foreground"
        />
        <rect
          x={52}
          y={89}
          width={72}
          height={3}
          rx="1.5"
          className="fill-background"
          opacity="0.55"
        />
        <rect
          x={52}
          y={98}
          width={40}
          height={3}
          rx="1.5"
          className="fill-background"
          opacity="0.3"
        />
      </Enter>

      <Draw d="M150 92C168 92 172 74 190 74" delay={0.35} dashed />

      {/* The order record */}
      <Enter delay={0.5}>
        <Surface x={190} y={30} w={108} h={116} r={8} />
        <Line x={202} y={44} w={40} />
        <line
          x1="190"
          y1="58"
          x2="298"
          y2="58"
          className="stroke-border"
          strokeWidth="1"
        />
        {[0, 1, 2].map((row) => (
          <g key={row}>
            <Line x={202} y={72 + row * 16} w={44} dim />
            <Line x={262} y={72 + row * 16} w={24} dim />
          </g>
        ))}
        <line
          x1="202"
          y1="120"
          x2="286"
          y2="120"
          className="stroke-border"
          strokeWidth="1"
        />
        <Line x={202} y={130} w={30} />
        <rect
          x={258}
          y={128}
          width={28}
          height={6}
          rx="3"
          className="fill-foreground"
          opacity="0.75"
        />
      </Enter>

      {/* Confirmation stamp */}
      <Enter delay={0.75}>
        <circle cx="298" cy="30" r="12" className="fill-success" />
        <path
          d="M292.5 30l4 4 8-8"
          className="stroke-white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Enter>
    </Art>
  );
}

/* -------------------------------------------------------------------------- */
/*                             4 — STOCK STAYS HONEST                         */
/* -------------------------------------------------------------------------- */

/** Stock draining, with the sold-out variant withdrawn from replies. */
export function StockArt() {
  const bars = [
    { x: 34, h: 74, sold: false },
    { x: 84, h: 52, sold: false },
    { x: 134, h: 30, sold: false },
    { x: 184, h: 8, sold: true },
  ];

  return (
    <Art viewBox="0 0 320 176">
      {/* Baseline */}
      <line
        x1="24"
        y1="122"
        x2="296"
        y2="122"
        className="stroke-border"
        strokeWidth="1"
      />

      {bars.map((bar, index) => (
        <g key={bar.x}>
          {/* Ghost of the full shelf */}
          <rect
            x={bar.x}
            y={40}
            width={30}
            height={82}
            rx="5"
            className="fill-foreground"
            opacity="0.06"
          />
          <motion.rect
            x={bar.x}
            width={30}
            rx="5"
            className={cn(bar.sold ? "fill-danger" : "fill-foreground")}
            opacity={bar.sold ? 1 : 0.55}
            initial={{ height: 0, y: 122 }}
            whileInView={{ height: bar.h, y: 122 - bar.h }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
          />
        </g>
      ))}

      {/* The sold-out column is struck out and withdrawn */}
      <Draw
        d="M180 100L218 62"
        delay={0.6}
        className="stroke-danger"
        width={1.5}
      />

      <Enter delay={0.75}>
        <rect
          x={200}
          y={30}
          width={92}
          height={24}
          rx="7"
          className="fill-card stroke-border"
          strokeWidth="1"
        />
        <circle cx="213" cy="42" r="3" className="fill-danger" />
        <Line x={222} y={40} w={58} />
      </Enter>

      {/* Axis labels */}
      {bars.map((bar) => (
        <rect
          key={bar.x}
          x={bar.x + 4}
          y={132}
          width={22}
          height={3}
          rx="1.5"
          className="fill-foreground"
          opacity="0.12"
        />
      ))}
    </Art>
  );
}

/* -------------------------------------------------------------------------- */
/*                              5 — HANDOFF RULES                             */
/* -------------------------------------------------------------------------- */

/** Incoming conversations routed by rule: the agent, or you. */
export function HandoffArt() {
  return (
    <Art viewBox="0 0 320 176">
      {/* Incoming */}
      <Enter>
        <Surface x={18} y={74} w={62} h={28} r={7} />
        <Line x={30} y={82} w={38} />
        <Line x={30} y={90} w={22} dim />
      </Enter>

      {/* The rule gate */}
      <Draw d="M80 88H112" delay={0.2} />

      <Enter delay={0.25}>
        <path
          d="M134 66l22 22-22 22-22-22z"
          className="fill-card stroke-border"
          strokeWidth="1"
        />
        <circle cx="134" cy="88" r="3" className="fill-foreground" />
      </Enter>

      {/* Two outcomes */}
      <Draw d="M156 88C182 88 182 50 208 50" delay={0.45} />
      <Draw d="M156 88C182 88 182 126 208 126" delay={0.5} dashed />

      <Enter delay={0.65}>
        <rect
          x={208}
          y={34}
          width={94}
          height={32}
          rx="8"
          className="fill-foreground"
        />
        <circle
          cx="226"
          cy="50"
          r="6"
          className="fill-background"
          opacity="0.9"
        />
        <path
          d="M223 50l2.4 2.4 4.6-4.8"
          className="stroke-foreground"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x={240}
          y={44}
          width={48}
          height={3}
          rx="1.5"
          className="fill-background"
          opacity="0.55"
        />
        <rect
          x={240}
          y={52}
          width={30}
          height={3}
          rx="1.5"
          className="fill-background"
          opacity="0.3"
        />
      </Enter>

      <Enter delay={0.75}>
        <Surface x={208} y={110} w={94} h={32} r={8} />
        <circle cx="226" cy="126" r="7" className="fill-muted" />
        <Line x={240} y={120} w={48} />
        <Line x={240} y={128} w={30} dim />
      </Enter>
    </Art>
  );
}

/* -------------------------------------------------------------------------- */
/*                              6 — YOUR VOICE                                */
/* -------------------------------------------------------------------------- */

/**
 * A customer's message, then the same reply written twice: once flat, once in
 * the shop's own voice. The second is the one that ships, so it sits forward
 * and carries the accent.
 */
export function VoiceArt() {
  return (
    <Art viewBox="0 0 320 176">
      {/* Incoming */}
      <Enter>
        <Surface x={20} y={22} w={150} h={38} r={10} muted />
        <Line x={34} y={33} w={92} />
        <Line x={34} y={43} w={58} dim />
      </Enter>

      {/* The generic draft, held back */}
      <Enter delay={0.12}>
        <g opacity={0.45}>
          <Surface x={96} y={74} w={172} h={32} r={10} />
          <Line x={110} y={86} w={116} dim />
        </g>
      </Enter>

      {/* The one in the shop's voice */}
      <Enter delay={0.24}>
        <rect
          x={80}
          y={116}
          width={200}
          height={40}
          rx={11}
          className="fill-foreground"
        />
        <rect
          x={94}
          y={128}
          width={124}
          height="3.5"
          rx="1.75"
          className="fill-background"
          opacity={0.9}
        />
        <rect
          x={94}
          y={139}
          width={72}
          height="3.5"
          rx="1.75"
          className="fill-background"
          opacity={0.5}
        />
      </Enter>

      {/* The thread of it: draft, then voice */}
      <Draw d="M170 41 C 214 41, 214 62, 214 74" delay={0.3} dashed />
      <Draw d="M182 106 C 182 116, 176 116, 168 116" delay={0.45} />
    </Art>
  );
}

/* -------------------------------------------------------------------------- */
/*                              7 — ALWAYS ON                                 */
/* -------------------------------------------------------------------------- */

/**
 * A day's worth of messages along a single line. The run through the small
 * hours is the point, so those markers are the ones that stay solid while the
 * daytime ones sit back.
 */
export function AlwaysOnArt() {
  const hours = [
    { x: 40, night: false },
    { x: 76, night: false },
    { x: 112, night: true },
    { x: 148, night: true },
    { x: 184, night: true },
    { x: 220, night: false },
    { x: 256, night: false },
  ];

  return (
    <Art viewBox="0 0 320 176">
      {/* The night band, so the run through it reads as unattended hours */}
      <Enter>
        <rect
          x={96}
          y={40}
          width={104}
          height={96}
          rx={10}
          className="fill-muted"
        />
      </Enter>

      <Draw d="M28 110 H 292" delay={0.15} />

      {hours.map((hour, index) => (
        <Enter key={hour.x} delay={0.2 + index * 0.06}>
          {/* Message arriving */}
          <rect
            x={hour.x - 9}
            y={hour.night ? 62 : 74}
            width={18}
            height={18}
            rx={5}
            className={cn(
              "stroke-border",
              hour.night ? "fill-foreground" : "fill-card",
            )}
            strokeWidth="1"
          />
          {/* Answered */}
          <circle
            cx={hour.x}
            cy={110}
            r={3.5}
            className={hour.night ? "fill-foreground" : "fill-border"}
          />
          <Draw
            d={`M${hour.x} ${hour.night ? 80 : 92} V 106`}
            delay={0.3 + index * 0.06}
            dashed={!hour.night}
          />
        </Enter>
      ))}

      <Enter delay={0.7}>
        <Line x={28} y={132} w={40} dim />
        <Line x={124} y={132} w={48} />
        <Line x={252} y={132} w={40} dim />
      </Enter>
    </Art>
  );
}
