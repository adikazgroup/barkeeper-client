/**
 * The content the marketing pages read: who we are, what is on offer, and the
 * questions we answer.
 *
 * It lives here as plain data because the kitchen changes all of it without a
 * developer — hours move, an offer ends on Friday, an answer gets reworded —
 * and because most of it is still placeholder wording. Pages import from this
 * barrel, so swapping a stand-in for a real source (a CMS, an API) later is an
 * edit inside this folder and nothing else.
 */

export { COMPANY, LEGAL_PAGES, POLICY_EFFECTIVE_DATE } from "./company";

export {
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  faqByCategory,
  featuredFaq,
  type FaqCategory,
  type FaqCategoryId,
  type FaqItem,
} from "./faq";

export { POPULAR_DISHES, type Dish } from "./dishes";

export { FEATURES, feature, type Feature } from "./features";

export {
  MENU_CATEGORIES,
  MENU_GROUPS,
  categoriesInGroup,
  type MenuCategory,
  type MenuGroup,
  type MenuGroupId,
  type MenuIcon,
} from "./menu";

export {
  PROMOTIONS,
  SERVICE_FACTS,
  type FactIcon,
  type Promotion,
  type ServiceFact,
} from "./promotions";
