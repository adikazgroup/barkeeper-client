/**
 * The menu board, as two groups of categories.
 *
 * This is the printed menu typed up — the kitchen's sections in the order they
 * are printed, and under each one the dishes that sit in it. The home page
 * shows the categories; the menu page shows what is inside them.
 *
 * Named `menu.ts` rather than `categories.ts` on purpose: `lib/categories.ts`
 * is the real category tree the admin maintains and the API serves. This is
 * placeholder copy standing in until that tree is populated, and the shapes
 * here are deliberately close to `CategoryNode` so swapping one for the other
 * is a change of source, not of markup.
 *
 * Icons are named rather than imported, the same way `promotions.ts` does it,
 * so this stays data and the rendering layer decides what to draw them with.
 *
 * ⚠️ Prices are deliberately absent. The printed menu prices in dollars and the
 * rest of the site quotes taka — quoting either here would contradict
 * something, so the numbers live on the menu page where there is one currency.
 */

export type MenuGroupId = "kitchen" | "bar";

export type MenuIcon =
  | "starters"
  | "salad"
  | "sandwich"
  | "mains"
  | "pasta"
  | "dessert"
  | "cocktail"
  | "beer"
  | "wine"
  | "soft";

export interface MenuGroup {
  id: MenuGroupId;
  title: string;
  /** One word, for the label beside a card's number. */
  label: string;
  /** One line under the group label, saying what it covers. */
  blurb: string;
  /** What this group's categories are counted in. */
  unit: string;
}

export interface MenuCategory {
  /** Doubles as the slug the menu page anchors on. */
  id: string;
  group: MenuGroupId;
  title: string;
  icon: MenuIcon;
  /** One line on the card, under the heading. */
  blurb: string;
  /** What is printed under this heading on the menu. */
  items: string[];
  /** Overrides the group's counting word where it does not fit. */
  unit?: string;
}

export const MENU_GROUPS: MenuGroup[] = [
  {
    id: "kitchen",
    title: "From the kitchen",
    label: "Kitchen",
    blurb: "Cooked to order, from the fryer to the grill to the pass.",
    unit: "dishes",
  },
  {
    id: "bar",
    title: "From the bar",
    label: "Bar",
    blurb: "Mixed to order, poured cold, and plenty that is not alcoholic.",
    unit: "pours",
  },
];

export const MENU_CATEGORIES: MenuCategory[] = [
  /* ---------------------------------------------------------- kitchen */
  {
    id: "starters",
    group: "kitchen",
    title: "Starters",
    icon: "starters",
    blurb: "The fryer's greatest hits, and the wings the tables come back for.",
    items: [
      "Wings — bone-in or boneless",
      "Beer battered onion rings",
      "Chicken tenders",
      "Mozzarella sticks",
      "Fried calamari",
      "Nachos supreme",
      "Sweet potato fries",
      "House fries",
      "Cauliflower bites",
      "Blackened quesadilla",
      "Tacos — chicken, fish, steak or shrimp",
      "Jalapeño poppers",
    ],
  },
  {
    id: "salads",
    group: "kitchen",
    title: "Salads",
    icon: "salad",
    blurb: "Add chicken, shrimp or steak to any of them.",
    items: ["Greek salad", "Traditional Caesar", "House salad"],
  },
  {
    id: "sandwiches",
    group: "kitchen",
    title: "Sandwiches",
    icon: "sandwich",
    blurb: "Served with house fries or a side salad. Impossible patty on ask.",
    items: [
      "Barkeeper burger",
      "Mushroom truffle burger",
      "Grilled chicken",
      "Spicy chicken sandwich",
      "Steak & cheese",
    ],
  },
  {
    id: "mains",
    group: "kitchen",
    title: "Mains",
    icon: "mains",
    blurb: "The plates worth booking a table for.",
    items: [
      "New York steak",
      "Lamb chops",
      "Grilled salmon",
      "Fish and chips",
    ],
  },
  {
    id: "pasta",
    group: "kitchen",
    title: "Pasta",
    icon: "pasta",
    blurb: "Chicken or shrimp on either, if you want it.",
    items: ["Alfredo pasta", "Ravioli pasta"],
  },
  {
    id: "dessert",
    group: "kitchen",
    title: "Dessert",
    icon: "dessert",
    blurb: "The reason to stay for one more.",
    items: [
      "Classic New York cheesecake",
      "Chocolate lava cake",
      "Tiramisu",
      "Apple cinnamon crumble",
      "Ice cream",
    ],
  },

  /* -------------------------------------------------------------- bar */
  {
    id: "cocktails",
    group: "bar",
    title: "Cocktails",
    icon: "cocktail",
    blurb: "Everything shaken to order, including the boozy milkshakes.",
    items: [
      "Old fashioned",
      "Margarita",
      "Manhattan",
      "Mojito",
      "Moscow mule",
      "Mai tai",
      "Cosmopolitan",
      "Tequila sunrise",
      "Irish lemonade",
      "Long Island tea",
      "Sex on the beach",
      "Piña colada",
      "Boozy milkshakes",
    ],
  },
  {
    id: "beer",
    group: "bar",
    title: "Beer",
    icon: "beer",
    blurb: "Sixteen by the bottle, and ask the server what is on draft.",
    items: [
      "Guinness",
      "Corona",
      "Stella",
      "Heineken",
      "Blue Moon",
      "Modelo",
      "Yuengling",
      "Sam Adams",
      "Goose Island IPA",
      "Dog Fish 60 / 90 min",
      "Angry Orchard",
      "Budweiser",
      "Bud Light",
      "Miller Lite",
      "Flying Dog",
    ],
  },
  {
    id: "wine",
    group: "bar",
    title: "Wine",
    icon: "wine",
    blurb: "By the glass or the bottle, across three lists.",
    items: ["White", "Red", "Sparkling"],
    unit: "lists",
  },
  {
    id: "non-alcoholic",
    group: "bar",
    title: "Non-alcoholic",
    icon: "soft",
    blurb: "The same care, none of the alcohol — plus alcohol-free beer.",
    items: [
      "Mojito",
      "Margarita",
      "Shirley Temple",
      "Apero spritz",
      "Whiskey ginger",
      "Cuba libre",
      "Paloma",
      "Vodka spritz",
      "Piña colada",
    ],
  },
];

/** The categories printed under one group, in menu order. */
export const categoriesInGroup = (group: MenuGroupId) =>
  MENU_CATEGORIES.filter((category) => category.group === group);
