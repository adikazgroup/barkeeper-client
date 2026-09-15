/**
 * The platforms the product connects to.
 *
 * `IconKey` is the contract between this list and `integrationIcons.tsx`: the
 * icon map is typed as `Record<IconKey, …>`, so adding a platform here fails
 * the build until it has a mark to draw it with, and the home shortlist and
 * the integrations page can never show one under two different icons.
 */
export type IconKey =
  | "facebook"
  | "instagram"
  | "messenger"
  | "whatsapp"
  | "tiktok"
  | "telegram"
  | "woocommerce"
  | "shopify"
  | "webflow"
  | "custom";

export interface Integration {
  key: IconKey;
  name: string;
  /** What connecting it actually gets the shop. */
  blurb: string;
}

export const INTEGRATIONS: Integration[] = [
  {
    key: "facebook",
    name: "Facebook Page",
    blurb: "Comments and page messages in one thread.",
  },
  {
    key: "instagram",
    name: "Instagram",
    blurb: "DMs and story replies, answered in your voice.",
  },
  {
    key: "messenger",
    name: "Messenger",
    blurb: "The inbox most orders still arrive in.",
  },
  {
    key: "whatsapp",
    name: "WhatsApp",
    blurb: "Business numbers, with delivery updates.",
  },
  {
    key: "tiktok",
    name: "TikTok",
    blurb: "Replies to the video that sold the thing.",
  },
  {
    key: "telegram",
    name: "Telegram",
    blurb: "Groups and one-to-one chats alike.",
  },
  {
    key: "woocommerce",
    name: "WooCommerce",
    blurb: "Live stock and prices, orders written back.",
  },
  {
    key: "shopify",
    name: "Shopify",
    blurb: "Catalogue sync and order creation.",
  },
  {
    key: "webflow",
    name: "Webflow",
    blurb: "Product data pulled from your CMS collections.",
  },
  {
    key: "custom",
    name: "Custom API",
    blurb: "Anything else, through our REST endpoints.",
  },
];
