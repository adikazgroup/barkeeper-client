import { getFeaturedFoods } from "@/lib/foods";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { PopularDishesGrid } from "./PopularDishesGrid";

const CELL = "px-5 sm:px-8";
const RAIL_SIZE = 6;

export async function PopularDishes() {
  const foods = await getFeaturedFoods({ limit: RAIL_SIZE });

  if (foods.length === 0) return null;

  return (
    <section id="popular" className="border-t border-border/50">
      <div className="mx-auto max-w-7xl">
        <div className="border-x border-border/50">
          <Reveal
            className={cn(
              "flex flex-wrap items-center justify-between gap-5 border-b border-border/50 py-10",
              CELL,
            )}
          >
            <h2 className="max-w-[18ch] text-[30px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[40px]">
              The Dishes Everyone Comes Back For
            </h2>
            <p className="max-w-[44ch] text-[14px] leading-[1.65] text-muted-foreground">
              Discover the dishes that define Barkeeper’s—freshly prepared, full of flavor, and always crowd-pleasing.
            </p>
          </Reveal>

          <PopularDishesGrid foods={foods} />
        </div>
      </div>
    </section>
  );
}
