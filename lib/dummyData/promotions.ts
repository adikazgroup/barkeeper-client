/**
 * Single source of truth for the service facts and the running offers.
 *
 * Both are things the kitchen changes without a developer — hours move, a
 * minimum order goes up, an offer ends on Friday — so they live as plain data
 * in one file rather than being typed into the markup. Icons are named rather
 * than imported, the same way `integrations.ts` does it, so this stays data and
 * the rendering layer decides what to draw them with.
 *
 * ⚠️ The numbers and offers below are placeholders written to get the layout
 * standing up. Replace them with the real ones before this goes anywhere near
 * a customer — a promise about delivery time or price is not ours to invent.
 */

export type FactIcon = "clock" | "bag" | "kitchen" | "payment";

export interface ServiceFact {
  id: string;
  icon: FactIcon;
  /** The number or phrase that carries the meaning. */
  value: string;
  /** What that number is, in as few words as possible. */
  label: string;
}

export const SERVICE_FACTS: ServiceFact[] = [
  {
    id: "delivery",
    icon: "clock",
    value: "30–45 min",
    label: "Average delivery",
  },
  { id: "minimum", icon: "bag", value: "৳150", label: "Minimum order" },
  { id: "hours", icon: "kitchen", value: "11am – 2am", label: "Kitchen open" },
  {
    id: "payment",
    icon: "payment",
    value: "bKash · Nagad · Card",
    label: "Or cash on delivery",
  },
];

export interface Promotion {
  id: string;
  /** The offer, as it would be said out loud. */
  title: string;
  /** One line of detail — what is actually in it. */
  body: string;
  image: string;
  href: string;
}

export const PROMOTIONS: Promotion[] = [
  {
    id: "combo-for-two",
    title: "Combo for two",
    body: "Two double smash burgers, a plate of wings and two drinks — ৳899 instead of ৳1,149.",
    image: "/food/RedChili_DoubleSmashBurger2.png",
    href: "/menu",
  },
  {
    id: "wings-bogo",
    title: "Buy one, get one on wings",
    body: "Any 10 pc boneless, twice over, every Tuesday until the kitchen closes at 2am.",
    image: "/food/RedChili_10Boneless.png",
    href: "/menu",
  },
];
