

import { getBannerFoods } from "@/lib/foods";

import { HeroView, type HeroDish } from "./HeroView";

const FAN_SIZE = 7;

export async function Hero() {
  const foods = await getBannerFoods({ limit: FAN_SIZE });

  const dishes: HeroDish[] = foods.map((food) => ({
    id: food._id,
    src: food.image?.url,
    name: food.name,
  }));

  return <HeroView dishes={dishes} />;
}
