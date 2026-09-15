import { hasPrice as has, payableOf } from "@/lib/price";
import { cn } from "@/lib/utils";
import type { FoodVariant } from "../_type";

/**
 * Every board and card prints a price the same way.
 *
 * Two shapes come off `/foods`: a single price, or a set of variants each with
 * their own. A variant food carries `price: null`, so reading `price` alone
 * prints nothing at all for half the salads — the cheapest variant stands in
 * for the plate instead, marked "from" so the figure is not mistaken for the
 * only one.
 *
 * Set in the mono face with tabular figures, as the home page sets its prices:
 * a column of plates should have its decimal points in a line.
 */
export function Price({
  price,
  offerPrice,
  variants,
  className = "",
  size = "base",
}: {
  price?: number | null;
  offerPrice?: number | null;
  variants?: FoodVariant[];
  className?: string;
  size?: "sm" | "base" | "lg";
}) {
  const priced = (variants ?? [])
    .map((variant) => payableOf(variant.price, variant.offerPrice))
    .filter((entry) => has(entry.payable));

  const cheapest = priced.length
    ? priced.reduce((low, entry) =>
        entry.payable! < low.payable! ? entry : low,
      )
    : null;

  // The variants are the price when there are any; `price` is null on those
  // rows anyway.
  const { payable, struck } = cheapest ?? payableOf(price, offerPrice);
  if (!has(payable)) return null;

  const text =
    size === "lg"
      ? "text-[16px]"
      : size === "sm"
        ? "text-[12px]"
        : "text-[14px]";

  return (
    <span
      className={cn(
        "flex shrink-0 items-baseline gap-1.5 font-mono tabular-nums",
        className,
      )}
    >
      {cheapest && priced.length > 1 && (
        <span className="text-[9.5px] tracking-[0.14em] text-muted-foreground uppercase">
          from
        </span>
      )}

      {has(struck) && (
        <span className="text-[11px] text-muted-foreground line-through">
          ${struck.toFixed(2)}
        </span>
      )}

      <span className={cn(text, "whitespace-nowrap text-foreground")}>
        ${payable.toFixed(2)}
      </span>
    </span>
  );
}
