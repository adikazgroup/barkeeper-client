/**
 * The questions the site answers.
 *
 * The home page shows a shortlist and /faq shows all of them grouped, so an
 * answer corrected here is corrected in both.
 *
 * ⚠️ Placeholder wording, written to get the pages standing up. The numbers
 * follow `SERVICE_FACTS` in `promotions.ts` — keep the two in step, because a
 * delivery time promised here and contradicted on the home page is worse than
 * either one being wrong on its own. Replace with the kitchen's own answers
 * before this goes anywhere near a customer.
 */

export type FaqCategoryId =
  | "ordering"
  | "delivery"
  | "the-menu"
  | "tables"
  | "your-account"
  | "payment";

export interface FaqCategory {
  id: FaqCategoryId;
  title: string;
  /** One line under the heading, saying what this group covers. */
  blurb: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: FaqCategoryId;
  /** Shown in the home page shortlist. */
  featured?: boolean;
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "ordering",
    title: "Ordering",
    blurb: "Placing one, changing it, and how long the kitchen takes.",
  },
  {
    id: "delivery",
    title: "Delivery and collection",
    blurb: "Where we go, what it costs, and how late we run.",
  },
  {
    id: "the-menu",
    title: "The menu",
    blurb: "What is in the food, and what we can leave out.",
  },
  {
    id: "tables",
    title: "Tables",
    blurb: "Booking, moving and cancelling a reservation.",
  },
  {
    id: "your-account",
    title: "Your account",
    blurb: "Addresses, favourites, past orders and signing in.",
  },
  {
    id: "payment",
    title: "Payment and refunds",
    blurb: "How you pay, and what happens when an order goes wrong.",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  /* --------------------------------------------------------- ordering */
  {
    category: "ordering",
    featured: true,
    question: "How long will my order take?",
    answer:
      "Everything is cooked to order, so a burger leaves the kitchen about fifteen minutes after you place it and a delivery is usually with you in thirty to forty-five. On a Friday night expect the longer end of that — the tracker on your order page carries the kitchen's own estimate, not an average.",
  },
  {
    category: "ordering",
    featured: true,
    question: "Can I change or cancel an order after placing it?",
    answer:
      "Yes, while it is still on the Received step — open the order and use Change or Cancel, and nothing is charged. Once the kitchen accepts it the food is on the grill, so call the restaurant instead and we will do what we can.",
  },
  {
    category: "ordering",
    question: "Can I order for later tonight?",
    answer:
      "Pick a slot at checkout, up to seven days ahead. We start cooking so the food is ready at the time you chose, not the time you ordered.",
  },
  {
    category: "ordering",
    question: "Is there a minimum order?",
    answer:
      "None for collection. Delivery starts at ৳150 of food, before the delivery fee.",
  },
  {
    category: "ordering",
    question: "Can I order for a group?",
    answer:
      "For anything over ten portions, give us a few hours' notice so the kitchen can stage it. Send it through the contact form and we will confirm a time rather than a window.",
  },

  /* --------------------------------------------------------- delivery */
  {
    category: "delivery",
    featured: true,
    question: "How late do you deliver?",
    answer:
      "The kitchen runs 11am to 2am, every night, and takes its last order fifteen minutes before close. The full menu stays on until then — nothing is pulled after midnight.",
  },
  {
    category: "delivery",
    featured: true,
    question: "Do you deliver to my area?",
    answer:
      "Enter your address at checkout and we will tell you before you pay. We cover most of Gazipur and the north of Dhaka; outside that you are welcome to collect.",
  },
  {
    category: "delivery",
    question: "What does delivery cost?",
    answer:
      "৳60 within three kilometres and ৳100 beyond it, shown before you pay. Orders over ৳1,500 are delivered free.",
  },
  {
    category: "delivery",
    question: "Can I collect instead?",
    answer:
      "Choose Collection at checkout. We will text you when it is bagged, and there is no fee and no minimum.",
  },
  {
    category: "delivery",
    question: "My food arrived cold. What now?",
    answer:
      "Tell us the same evening from the order page and we will remake it or refund it — your choice. We would rather hear it from you than read it somewhere else.",
  },

  /* --------------------------------------------------------- the menu */
  {
    category: "the-menu",
    featured: true,
    question: "Can you cook around an allergy?",
    answer:
      "Every dish lists its allergens, and you can leave a note on any item at checkout. The kitchen is small and shares fryers and surfaces, though, so we cannot promise a dish is free of a trace — if a reaction would be serious, call us before you order and speak to the kitchen.",
  },
  {
    category: "the-menu",
    question: "Is there anything for vegetarians and vegans?",
    answer:
      "The mushroom smash, the spiced bean burger and the rice bowls are all vegetarian, and the bean burger and two of the bowls are vegan as listed. Filter the menu by Vegetarian or Vegan to see them together.",
  },
  {
    category: "the-menu",
    question: "Is the meat halal?",
    answer:
      "All our beef and chicken is halal, from suppliers we have used since we opened. The certificates are on the wall in the restaurant and we will happily send copies.",
  },
  {
    category: "the-menu",
    question: "How hot are the hot wings?",
    answer:
      "Three steps: Mild is a warm buffalo, Hot will make you reach for the drink, and Reaper is on there because people kept asking. Sauces come on the side if you would rather judge for yourself.",
  },
  {
    category: "the-menu",
    question: "Does the menu change?",
    answer:
      "The core stays put. The specials board moves with whatever is good that week, and anything seasonal is marked on the menu.",
  },

  /* ----------------------------------------------------------- tables */
  {
    category: "tables",
    featured: true,
    question: "Do I need to book a table?",
    answer:
      "Not on a weekday — walk in and we will seat you. Thursday to Sunday evening fills up, so book from your account and you will have it confirmed on the spot rather than waiting on a phone call.",
  },
  {
    category: "tables",
    question: "Can I move or cancel a booking?",
    answer:
      "Any time up to two hours before, from the booking in your account. After that the table is being held for you, so a call is kinder than a no-show.",
  },
  {
    category: "tables",
    question: "How long do I have the table for?",
    answer:
      "Two hours for a table of four or fewer, two and a half above that. If the evening is quiet, nobody will move you on.",
  },
  {
    category: "tables",
    question: "Are children welcome?",
    answer:
      "Very. High chairs are there if you need one, and there are smaller portions of the burgers and the bowls that are not on the printed menu — just ask.",
  },

  /* ----------------------------------------------------- your account */
  {
    category: "your-account",
    featured: true,
    question: "Do I need an account to order?",
    answer:
      "You can check out as a guest. An account keeps your address, your card and your past orders, so the order you place every week takes seconds instead of a form — and it is the only way to book a table yourself.",
  },
  {
    category: "your-account",
    question: "I have forgotten my password.",
    answer:
      "Use Forgot password on the sign-in screen. We mail you a six-digit code that lasts fifteen minutes, and you pick the new password yourself — nobody here can see or set it.",
  },
  {
    category: "your-account",
    question: "Can I save more than one address?",
    answer:
      "Keep home and work on the account and choose between them at checkout. The one you used last is offered first.",
  },
  {
    category: "your-account",
    question: "How do I delete my account?",
    answer:
      "Ask from the account page and we close it, keeping only what the tax rules make us keep about orders already paid for. The privacy policy sets out exactly what that is.",
  },

  /* ---------------------------------------------------------- payment */
  {
    category: "payment",
    featured: true,
    question: "How can I pay?",
    answer:
      "bKash, Nagad or card online, or cash at the door for delivery and at the till for collection. Card details are held by our payment provider, never by us.",
  },
  {
    category: "payment",
    question: "When am I charged?",
    answer:
      "When the kitchen accepts the order, not when you place it. If we cannot cook it, nothing leaves your account.",
  },
  {
    category: "payment",
    question: "Something was missing from my order.",
    answer:
      "Report it from the order page the same day and we refund the missing items straight away — usually within the hour, and back on the card inside three working days.",
  },
  {
    category: "payment",
    question: "Can I have a receipt?",
    answer:
      "Every order has one on its page in your account, and we mail it as soon as the order is paid for.",
  },
];

/** The shortlist the home page carries. */
export const featuredFaq = () => FAQ_ITEMS.filter((item) => item.featured);

/** Everything in one category, in the order written above. */
export const faqByCategory = (category: FaqCategoryId) =>
  FAQ_ITEMS.filter((item) => item.category === category);
