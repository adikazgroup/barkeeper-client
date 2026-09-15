import type { StaticImageData } from "next/image";

import burger from "@/public/food/RedChili_DoubleSmashBurger2.png";
import boneless from "@/public/food/RedChili_Boneless.png";
import fish from "@/public/food/RedChili_FishSandwich.png";
import steak from "@/public/food/RedChili_SteakAndCheese.png";
import riceBowl from "@/public/food/RedChili_CrispyChickenRiceBowl.png";
import wings from "@/public/food/RedChili_10Boneless.png";

/**
 * The counter has no accounts behind it yet, so everything below stands in for
 * what an API will eventually hand these pages. It lives in one file on
 * purpose: when the endpoints land, only this module and the views that read
 * it have to change.
 */

/* ─── The customer ─── */

export interface ProfileAddress {
  label: string;
  line1: string;
  line2: string;
  city: string;
  postcode: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** ISO date, so the field can go straight into an `<input type="date">`. */
  dateOfBirth: string;
  /**
   * No stand-in photograph ships with the app: a made-up face on a real
   * account reads as that customer. Null means the views draw an initial
   * instead, and a real account overrides it with its own upload.
   */
  avatar: StaticImageData | null;
  /** ISO date the account was opened. */
  memberSince: string;
  tier: string;
  loyaltyPoints: number;
  address: ProfileAddress;
  preferences: {
    dietary: string[];
    orderUpdates: boolean;
    offers: boolean;
    newsletter: boolean;
  };
}

export const demoUser: UserProfile = {
  firstName: "Aoife",
  lastName: "Gallagher",
  email: "aoife.gallagher@example.com",
  phone: "+353 87 412 9930",
  dateOfBirth: "1994-03-17",
  avatar: null,
  memberSince: "2023-05-09",
  tier: "Gold Clover",
  loyaltyPoints: 2480,
  address: {
    label: "Home",
    line1: "42 Merrion Row",
    line2: "Apt 3B",
    city: "Dublin 2",
    postcode: "D02 XY71",
  },
  preferences: {
    dietary: ["No pork"],
    orderUpdates: true,
    offers: true,
    newsletter: false,
  },
};

export const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "No pork",
  "Gluten free",
  "Extra spicy",
  "Nut allergy",
];

/* ─── Orders ─── */

export type OrderStatus =
  "preparing" | "on-the-way" | "delivered" | "cancelled";

export interface OrderItem {
  name: string;
  variant: string;
  quantity: number;
  price: number;
  image: StaticImageData;
}

export interface Order {
  id: string;
  /** ISO timestamp of when the docket hit the kitchen. */
  placedAt: string;
  status: OrderStatus;
  type: "Delivery" | "Collection";
  branch: string;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  /** Only set while the order is still live. */
  eta?: string;
}

/** How each status is written and coloured everywhere it appears. */
export const orderStatusMeta: Record<
  OrderStatus,
  { label: string; className: string; dot: string }
> = {
  preparing: {
    label: "In the kitchen",
    className:
      "bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  "on-the-way": {
    label: "On the way",
    className: "bg-sky-500/10 text-sky-700 ring-sky-500/25 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  delivered: {
    label: "Delivered",
    className: "bg-primary/10 text-primary ring-primary/25",
    dot: "bg-primary",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-rose-500/10 text-rose-700 ring-rose-500/25 dark:text-rose-300",
    dot: "bg-rose-500",
  },
};

/** The rail an open order walks along, in the order it walks it. */
export const orderProgress: OrderStatus[] = [
  "preparing",
  "on-the-way",
  "delivered",
];

export const demoOrders: Order[] = [
  {
    id: "DUF-10482",
    placedAt: "2026-09-01T18:42:00",
    status: "on-the-way",
    type: "Delivery",
    branch: "Duffy’s Merrion Row",
    items: [
      {
        name: "Double Smash Burger",
        variant: "Large",
        quantity: 1,
        price: 13.5,
        image: burger,
      },
      {
        name: "Boneless Wings",
        variant: "10 pc · Buffalo",
        quantity: 1,
        price: 11.0,
        image: boneless,
      },
    ],
    subtotal: 24.5,
    delivery: 3.5,
    total: 28.0,
    eta: "20–30 min",
  },
  {
    id: "DUF-10461",
    placedAt: "2026-08-28T13:05:00",
    status: "preparing",
    type: "Collection",
    branch: "Duffy’s Camden Street",
    items: [
      {
        name: "Crispy Chicken Rice Bowl",
        variant: "Regular",
        quantity: 2,
        price: 10.75,
        image: riceBowl,
      },
    ],
    subtotal: 21.5,
    delivery: 0,
    total: 21.5,
    eta: "Ready 13:25",
  },
  {
    id: "DUF-10322",
    placedAt: "2026-08-14T19:20:00",
    status: "delivered",
    type: "Delivery",
    branch: "Duffy’s Merrion Row",
    items: [
      {
        name: "Steak & Cheese",
        variant: "Regular",
        quantity: 1,
        price: 12.25,
        image: steak,
      },
      {
        name: "Classic Wings",
        variant: "6 pc · Garlic Parm",
        quantity: 1,
        price: 9.5,
        image: wings,
      },
      {
        name: "Fish Sandwich",
        variant: "Regular",
        quantity: 1,
        price: 10.0,
        image: fish,
      },
    ],
    subtotal: 31.75,
    delivery: 3.5,
    total: 35.25,
  },
  {
    id: "DUF-10197",
    placedAt: "2026-07-30T12:10:00",
    status: "delivered",
    type: "Collection",
    branch: "Duffy’s Camden Street",
    items: [
      {
        name: "Double Smash Burger",
        variant: "Regular",
        quantity: 2,
        price: 11.5,
        image: burger,
      },
    ],
    subtotal: 23.0,
    delivery: 0,
    total: 23.0,
  },
  {
    id: "DUF-10088",
    placedAt: "2026-07-11T20:55:00",
    status: "cancelled",
    type: "Delivery",
    branch: "Duffy’s Merrion Row",
    items: [
      {
        name: "Boneless Wings",
        variant: "10 pc · Honey BBQ",
        quantity: 1,
        price: 11.0,
        image: boneless,
      },
    ],
    subtotal: 11.0,
    delivery: 3.5,
    total: 14.5,
  },
];

/* ─── Transactions ─── */

export type TransactionKind = "payment" | "refund" | "reward";
export type TransactionStatus = "completed" | "pending" | "failed";

export interface Transaction {
  id: string;
  /** ISO timestamp. */
  date: string;
  kind: TransactionKind;
  description: string;
  /** The order this money moved against, when there is one. */
  orderId?: string;
  method: string;
  /** Positive for a charge, negative for money coming back. */
  amount: number;
  status: TransactionStatus;
}

export const transactionStatusMeta: Record<
  TransactionStatus,
  { label: string; className: string }
> = {
  completed: {
    label: "Completed",
    className: "bg-primary/10 text-primary ring-primary/25",
  },
  pending: {
    label: "Pending",
    className:
      "bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-300",
  },
  failed: {
    label: "Failed",
    className:
      "bg-rose-500/10 text-rose-700 ring-rose-500/25 dark:text-rose-300",
  },
};

export const demoTransactions: Transaction[] = [
  {
    id: "TXN-88213",
    date: "2026-09-01T18:42:00",
    kind: "payment",
    description: "Order payment",
    orderId: "DUF-10482",
    method: "Visa •••• 4417",
    amount: 28.0,
    status: "pending",
  },
  {
    id: "TXN-88190",
    date: "2026-08-28T13:05:00",
    kind: "payment",
    description: "Order payment",
    orderId: "DUF-10461",
    method: "Apple Pay",
    amount: 21.5,
    status: "completed",
  },
  {
    id: "TXN-88104",
    date: "2026-08-20T09:30:00",
    kind: "reward",
    description: "Loyalty credit applied",
    method: "Clover points",
    amount: -5.0,
    status: "completed",
  },
  {
    id: "TXN-87965",
    date: "2026-08-14T19:20:00",
    kind: "payment",
    description: "Order payment",
    orderId: "DUF-10322",
    method: "Visa •••• 4417",
    amount: 35.25,
    status: "completed",
  },
  {
    id: "TXN-87702",
    date: "2026-07-30T12:10:00",
    kind: "payment",
    description: "Order payment",
    orderId: "DUF-10197",
    method: "Mastercard •••• 9021",
    amount: 23.0,
    status: "completed",
  },
  {
    id: "TXN-87551",
    date: "2026-07-12T10:02:00",
    kind: "refund",
    description: "Refund — cancelled order",
    orderId: "DUF-10088",
    method: "Visa •••• 4417",
    amount: -14.5,
    status: "completed",
  },
  {
    id: "TXN-87550",
    date: "2026-07-11T20:55:00",
    kind: "payment",
    description: "Order payment",
    orderId: "DUF-10088",
    method: "Visa •••• 4417",
    amount: 14.5,
    status: "failed",
  },
];

/* ─── Shared formatting ─── */

/**
 * A fixed locale on both sides of the render. Letting `Intl` pick the runtime's
 * locale would have the server print one date and the browser another, which
 * React reports as a hydration mismatch.
 */
const dateFormatter = new Intl.DateTimeFormat("en-IE", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const timeFormatter = new Intl.DateTimeFormat("en-IE", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

/**
 * The stamps above carry no zone, so a bare `new Date()` would read them in
 * whatever zone the machine is set to — the server's and the reader's rarely
 * match. Pinning them to UTC keeps both sides printing the same string.
 */
const asUtc = (iso: string) =>
  // A date with no time is already read as UTC; only a bare local time needs it.
  new Date(
    iso.includes("T") && !/[Z+]|[+-]\d\d:\d\d$/.test(iso) ? `${iso}Z` : iso,
  );

export const formatDate = (iso: string) => dateFormatter.format(asUtc(iso));

export const formatDateTime = (iso: string) => {
  const value = asUtc(iso);
  return `${dateFormatter.format(value)} · ${timeFormatter.format(value)}`;
};

/** The month bucket a stamp falls in, for the transactions summary. */
export const monthKeyOf = (iso: string) => asUtc(iso).toISOString().slice(0, 7);
