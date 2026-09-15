/**
 * The plates the kitchen sends out most, for the home page.
 *
 * A shortlist, not a menu: six dishes with a photograph each, so a visitor who
 * does not know the place yet can see what it actually cooks before deciding
 * whether to read further. The full board lives in `menu.ts`.
 *
 * ⚠️ Placeholder copy. The prices are in taka, like the rest of the site, and
 * they add up against the combo in `promotions.ts` on purpose — two smash
 * burgers (৳720), a plate of wings (৳270) and two drinks (৳160) come to the
 * ৳1,149 that offer says it is discounting from. Change one and check the
 * other, or the offer stops being an offer.
 */

export interface Dish {
  id: string;
  name: string;
  /** One line: what is actually on the plate. */
  blurb: string;
  /** Taka, as printed. Kept as a string so the symbol never drifts. */
  price: string;
  image: string;
  /** The menu heading this sits under, for the link. */
  category: string;
  /** A word on the photograph, where there is one worth saying. */
  tag?: string;
}

export const POPULAR_DISHES: Dish[] = [
  {
    id: "double-smash-burger",
    name: "Double smash burger",
    blurb:
      "Two patties seared hard on the flat top, melted cheese, pickles and house sauce in a brioche bun.",
    price: "৳360",
    image: "/food/RedChili_DoubleSmashBurger.png",
    category: "sandwiches",
    tag: "Most ordered",
  },
  {
    id: "boneless-wings-10",
    name: "Boneless wings, 10 pc",
    blurb:
      "Tossed in whichever of the ten sauces you pick — mild buffalo through ghost pepper.",
    price: "৳270",
    image: "/food/RedChili_10Boneless.png",
    category: "starters",
    tag: "Two for one on Tuesdays",
  },
  {
    id: "steak-and-cheese",
    name: "Steak & cheese",
    blurb:
      "Shaved ribeye, caramelised onion, peppers and provolone, pressed until the cheese gives.",
    price: "৳420",
    image: "/food/RedChili_SteakAndCheese.png",
    category: "sandwiches",
  },
  {
    id: "crispy-chicken-rice-bowl",
    name: "Crispy chicken rice bowl",
    blurb:
      "Fried chicken over turmeric rice, with charred greens and a fried egg on top.",
    price: "৳320",
    image: "/food/RedChili_CrispyChickenRiceBowl.png",
    category: "mains",
  },
  {
    id: "fish-sandwich",
    name: "Fish sandwich",
    blurb:
      "Beer-battered cod, tartar and slaw, served with house fries or a side salad.",
    price: "৳340",
    image: "/food/RedChili_FishSandwich.png",
    category: "sandwiches",
  },
  {
    id: "garlic-parmesan-boneless",
    name: "Garlic parmesan boneless",
    blurb:
      "The wings that win the arguments. Ranch or blue cheese on the side, never on them.",
    price: "৳190",
    image: "/food/RedChili_Boneless.png",
    category: "starters",
  },
];
