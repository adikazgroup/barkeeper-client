import { getLivePromotions } from "@/lib/promotions";
import { PromoBannerDialog } from "./PromoBannerDialog";

/**
 * The offer that greets a first visit, read from the kitchen's own list.
 *
 * `GET /promotions` returns only what is live, newest first, so the newest
 * row is the one to show and no date arithmetic happens here. When the list
 * is empty — nothing running, or the API is unreachable — nothing renders and
 * the page is simply quiet.
 *
 * Fetching happens on the server so the artwork's URL is known before the
 * dialog mounts; the session-scoped dismissal that decides whether it opens
 * lives in the client half.
 */
export async function PromoBanner() {
  const [promotion] = await getLivePromotions({ limit: 1 });

  if (!promotion?.image?.url) return null;

  return <PromoBannerDialog promotion={promotion} />;
}
