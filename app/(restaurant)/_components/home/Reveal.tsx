"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*                                   EASING                                   */
/* -------------------------------------------------------------------------- */

/** A soft ease-out. Everything on the marketing page decelerates the same way. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/* -------------------------------------------------------------------------- */
/*                                   REVEAL                                   */
/* -------------------------------------------------------------------------- */

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before this element starts. */
  delay?: number;
  /** Pixels travelled on the way in. Negative values come from below. */
  y?: number;
  /** Render as something other than a <div> (`"li"`, `"section"`, …). */
  as?: ElementType;
}

/**
 * Fades and lifts its children the first time they scroll into view.
 *
 * `once` keeps the page calm — sections don't re-animate when the visitor
 * scrolls back up — and the whole effect collapses to a plain fade when the
 * visitor has asked for reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </Component>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  STAGGER                                   */
/* -------------------------------------------------------------------------- */

/**
 * Parent/child pair for lists whose items should arrive one after another.
 * Spread `staggerParent` on the container and `staggerChild` on each item.
 */
export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};
