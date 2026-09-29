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
    value: "45-60 min",
    label: "Average delivery",
  },
  { id: "minimum", icon: "bag", value: "$50", label: "Minimum order" },
  { id: "hours", icon: "kitchen", value: "05pm – 2am", label: "Kitchen open" },
  {
    id: "payment",
    icon: "payment",
    value: "Visa, Mastercard, Amex",
    label: "Or Take away",
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
