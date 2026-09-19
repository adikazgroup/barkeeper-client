/**
 * The hero, with the kitchen's own plates in the fan.
 *
 * Which plates those are is the admin's call, not a developer's: the fan is
 * `GET /foods?isBanner=true`, which returns the banner foods already in
 * `bannerSorting` order. Re-ordering the rail in the admin re-orders the fan,
 * including which plate lands in the middle seat and gets the caption.
 *
 * Fetching happens here rather than in the view because the view is a client
 * component — the fan animates and reads reduced-motion — and a client
 * component cannot await the rail itself.
 */

import { getBannerFoods } from "@/lib/foods";

import { HeroView, type HeroDish } from "./HeroView";

/** Seats in the fan. Anything past the last seat is never drawn. */
const FAN_SIZE = 7;

export async function Hero() {
  const foods = await getBannerFoods({ limit: FAN_SIZE });

  // A plate with no photograph yet still takes its seat — the view draws the
  // frame with the picture mark in it, so the arc is whole while the kitchen
  // is still uploading.
  const dishes: HeroDish[] = foods.map((food) => ({
    id: food._id,
    src: food.image?.url,
    name: food.name,
  }));

  return <HeroView dishes={dishes} />;
}
