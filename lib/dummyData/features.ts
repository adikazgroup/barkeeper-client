/**
 * The claims the home page collage makes, in one place.
 *
 * `Features.tsx` hand-places its tiles — a number here, a picture there — so it
 * pulls them one at a time by id rather than mapping a list. Only the heading
 * and the paragraph live here; the artwork, the channel icons and the metric
 * bars are drawn in the component.
 *
 * ⚠️ This is the wording the collage was built around, and it describes the
 * seller-automation product, not the restaurant — the tiles' pictures and icons
 * say the same thing. The whole section needs rewriting for Barkeeper, artwork
 * included; until then the copy here at least matches what is drawn beside it.
 *
 * A fuller version of this data — grouped, with bullets, for the /features page
 * that used to exist — is in git history if that page comes back.
 */

export interface Feature {
  id: string;
  /** The tile heading. */
  title: string;
  /** The one-paragraph version beneath it. */
  summary: string;
}

export const FEATURES: Feature[] = [
  {
    id: "one-inbox",
    title: "One inbox, every channel",
    summary:
      "Instagram, Facebook, Messenger, WhatsApp and TikTok collapse into one thread per customer — past orders and open tickets beside the conversation, so nobody has to ask twice.",
  },
  {
    id: "chat-to-order",
    title: "Chat becomes an order",
    summary:
      "Size, address and payment method are collected in the thread, then written straight into your store.",
  },
  {
    id: "your-voice",
    title: "It answers in your voice",
    summary:
      "Give it a handful of your own replies and it picks up how you write — your greetings, how much you explain, when you keep it short.",
  },
  {
    id: "live-stock",
    title: "Stock stays honest",
    summary:
      "Sold-out variants stop being offered the moment the last one goes, so you stop issuing refunds.",
  },
  {
    id: "catalogue",
    title: "Trained on your catalogue",
    summary:
      "The agent quotes only the prices and stock you gave it, in the language the customer opened with.",
  },
];

/**
 * Look one up by id, for the collage's hand-placed tiles.
 *
 * Throws rather than returning undefined: a typo in a tile should fail the
 * build, not render a heading-shaped hole nobody notices.
 */
export const feature = (id: string) => {
  const found = FEATURES.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown feature: ${id}`);
  return found;
};
