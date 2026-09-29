/**
 * The questions the site answers.
 *
 * The home page shows a shortlist and /faq shows all of them grouped, so an
 * answer corrected here is corrected in both.
 *
 * ⚠️ Placeholder wording, written to get the pages standing up. The numbers
 * follow `SERVICE_FACTS` in `promotions.ts` — keep the two in step, because a
 * pickup time promised here and contradicted on the home page is worse than
 * either one being wrong on its own. Replace with the kitchen's own answers
 * before this goes anywhere near a customer.
 */

export type FaqCategoryId =
  "ordering" | "pickup" | "the-menu" | "tables" | "your-account" | "payment";

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
    id: "pickup",
    title: "Pickup",
    blurb: "Where to collect, when to come, and how late we run.",
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
    blurb: "Favourites, past orders and signing in.",
  },
  {
    id: "payment",
    title: "Payment and refunds",
    blurb: "How you pay, and what happens when an order goes wrong.",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    category: "ordering",
    featured: true,
    question: "How long will my order take?",
    answer:
      "Everything is cooked to order, so most orders are ready for pickup 45 to 60 minutes after you place them. On a Friday night expect the longer end of that — the tracker on your order page carries the kitchen's own estimate, not an average.",
  },
  {
    category: "ordering",
    featured: true,
    question: "Can I change or cancel an order after placing it?",
    answer:
      "Call us on (202) 878 8077 as soon as you can. If the kitchen has not started on it, we cancel it and refund your card in full. Once it is on the grill we will do what we can, but we cannot always undo it.",
  },
  {
    category: "ordering",
    question: "Is there a minimum order?",
    answer: "Yes — $50 of food, before tax and tip.",
  },
  {
    category: "ordering",
    question: "Can I order for a group?",
    answer:
      "For anything over ten portions, give us a few hours' notice so the kitchen can stage it. Send it through the contact form and we will confirm a time rather than a window.",
  },

  /* ----------------------------------------------------------- pickup */
  {
    category: "pickup",
    featured: true,
    question: "Do you deliver?",
    answer:
      "Not for now — every order is takeaway. You order and pay online, and collect it from the bar when it is ready.",
  },
  {
    category: "pickup",
    featured: true,
    question: "Where do I pick up my order?",
    answer:
      "At the bar, 1901 C Street SE, Suite B, Washington, DC 20003. Give the name on the order and it is handed over — it is already paid for.",
  },
  {
    category: "pickup",
    question: "Can I choose when to collect?",
    answer:
      "Pick a pickup time at checkout. We start cooking so the food is ready at the time you chose, not the time you ordered.",
  },
  {
    category: "pickup",
    question: "How late can I order?",
    answer:
      "The kitchen runs 5pm to 2am. Pickup times at checkout stop short of close, so the last order still leaves the kitchen hot.",
  },
  {
    category: "pickup",
    question: "What if I am running late?",
    answer:
      "Call us on (202) 878 8077 and we will hold it. The food is best a few minutes after it is bagged, so the sooner you tell us the better.",
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
      "Not on a weekday — walk in and we will seat you. Thursday to Saturday evening fills up, so book from your account and you will have it confirmed on the spot rather than waiting on a phone call.",
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
      "You can check out as a guest. An account keeps your details and your past orders, so the order you place every week takes seconds instead of a form — and it is the only way to book a table yourself.",
  },
  {
    category: "your-account",
    question: "I have forgotten my password.",
    answer:
      "Use Forgot password on the sign-in screen. We mail you a six-digit code that lasts fifteen minutes, and you pick the new password yourself — nobody here can see or set it.",
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
      "By card, online, when you place the order — Visa, Mastercard or American Express. Payment is taken on Stripe's secure page, so your card details are held by Stripe, never by us. There is nothing to pay at the counter.",
  },
  {
    category: "payment",
    question: "When am I charged?",
    answer:
      "When you place the order. An order only goes to the kitchen once Stripe confirms the payment — if you closed the payment page before finishing, the order waits on your orders page and you can pay for it from there.",
  },
  {
    category: "payment",
    question: "Something was missing from my order.",
    answer:
      "Tell us before you leave the counter and we put it right there and then. If you only notice at home, call the same evening and we refund the missing items to your card — Stripe usually has it back in your account within 5 to 10 business days.",
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
