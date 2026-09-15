import { getData } from "@/lib/api";
import type { Promotion } from "@/lib/types";

export interface LivePromotionsOptions {
  /** Defaults to 1 at the API. */
  page?: number;
  /** Defaults to 10 at the API. */
  limit?: number;
  /** Matches title and description. */
  searchTerm?: string;
}

/**
 * The promotions that are live right now, newest first.
 *
 * The endpoint filters on the window itself, so a caller never has to compare
 * `startDate`/`endDate` against the clock — whatever comes back is on.
 *
 * Returns an empty list rather than throwing when the API is unreachable or
 * has nothing on: a missing offer is a quiet page, not a broken one.
 */
export async function getLivePromotions({
  page,
  limit,
  searchTerm,
}: LivePromotionsOptions = {}): Promise<Promotion[]> {
  const query = new URLSearchParams();
  if (page) query.set("page", String(page));
  if (limit) query.set("limit", String(limit));
  if (searchTerm) query.set("searchTerm", searchTerm);

  const qs = query.toString();
  const res = await getData<Promotion[]>(`/promotions${qs ? `?${qs}` : ""}`, {
    tags: ["promotions"],
  });

  return res?.data ?? [];
}

/**
 * One live promotion.
 *
 * The API 404s when the offer is inactive, still scheduled or already
 * expired, and `getData` turns that into `null` — so an expired link reads the
 * same as a missing one, which is what a visitor should see either way.
 */
export async function getPromotionById(id: string): Promise<Promotion | null> {
  if (!id) return null;

  const res = await getData<Promotion>(`/promotions/${id}`, {
    tags: ["promotions", `promotion:${id}`],
  });

  return res?.data ?? null;
}
