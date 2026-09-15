import Link from "next/link";

import SafeImage from "@/components/ui/SafeImage";
import foodPlaceholder from "@/public/food/RedChili_DoubleSmashBurger2.png";
import { Price } from "./price";
import { FoodItem } from "../_type";

const ORDER_URL =
  "https://order.online/business/red-chili-wings--burgers-13658065";

/**
 * The frame is a rounded rectangle tipped back in space, not a polygon cut out
 * of one.
 *
 * `clip-path` was the obvious tool and the wrong one: it cuts the border box,
 * so the corner radius goes with it and the card comes out as a sharp-cornered
 * shard rather than the softly tapered one in the reference. A 3D tip keeps
 * `border-radius` intact and produces the taper for free.
 *
 * The numbers are measured off the reference rather than guessed at:
 *
 * - `rotateX(17deg)` leans the top away, so the top edge comes out at about
 *   three-quarters of the bottom one. That flare is the whole silhouette.
 * - `perspective(500px)` is what lets an angle that modest flare that far.
 *   Perspective is a viewing distance: past a thousand pixels the far edge and
 *   the near one land within a percent of each other and no angle rescues it.
 *
 * That is the whole transform, and the restraint is the point. Anything turned
 * about another axis costs the shape its symmetry: a flat `rotate` tips the
 * card over bodily, and even a few degrees of `rotateY` carries the right-hand
 * edge further away than the left, which drops the top-right corner below the
 * top-left and lifts the bottom-right above the bottom-left. Tipping about X
 * alone keeps the top edge level, the bottom edge level, and the two verticals
 * splayed by exactly the same amount — the two halves mirror each other.
 *
 * The sign alternates along the row: a positive tip leans the top away and
 * narrows it, a negative one leans the bottom away instead. Same angle, same
 * flare, mirrored — so the row reads as one deliberate pattern rather than as
 * cards at scattered angles. Alternating on position, not on anything in the
 * food itself, is what keeps it a rhythm.
 *
 * The `translateY` is what puts the two back on the same line. A tip about the
 * centre does not keep the shape inside its own box: the far edge shrinks and
 * slides toward the middle while the near edge grows and swings past the
 * bottom, so the whole silhouette drifts about seven percent of its height
 * down the page — and the opposite tip drifts the same distance up, which is
 * why alternating cards sat a good sixty pixels out of step with each other.
 * The correction is written in percent, not pixels, because it scales with the
 * card, and it is placed before `perspective` so it moves the finished
 * projection rather than travelling through it.
 */
const TIPS = [
  "translateY(-7%) perspective(500px) rotateX(17deg)",
  "translateY(7%) perspective(500px) rotateX(-17deg)",
];

/**
 * The board's other plate: a photograph over a named pill.
 *
 * Where `FoodCard` sets a menu entry — name, leader, price on one rule — this
 * one leads with the photograph and says the name once, on the button. It
 * takes the same `FoodItem`, so the two are interchangeable in the grid.
 *
 * `index` is the card's place in the row, and it decides which way the frame
 * tips. It defaults to zero so a lone card still renders.
 */
export const FoodCard2 = ({
  item,
  index = 0,
}: {
  item: FoodItem;
  index?: number;
}) => {
  return (
    <li className="group flex list-none flex-col items-center">
      <div
        className="relative aspect-4/5 w-full overflow-hidden rounded-4xl bg-(--color-card) transition-transform duration-500 ease-out"
        style={{ transform: TIPS[index % TIPS.length] }}
      >
        <SafeImage
          src={item.image?.url || foodPlaceholder}
          alt={item.name}
          fill
          fallbackClassName="flex h-full w-full items-center justify-center bg-primary/5"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* The name is the button. One label, one target — nothing else on the
          card competes for the press. */}
      <Link
        href={ORDER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-11 inline-flex max-w-full items-center justify-center rounded-full border border-(--rc-premium-dark)/35 bg-(--color-card) px-10 py-3 text-center text-sm font-semibold tracking-[0.06em] text-(--rc-premium-dark) uppercase transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-white/25 dark:text-white"
      >
        <span className="truncate">{item.name}</span>
      </Link>

      <Price
        price={item.price}
        offerPrice={item.offerPrice}
        variants={item.variants}
        className="mt-3 font-semibold text-(--rc-premium-dark) dark:text-white"
      />
    </li>
  );
};
