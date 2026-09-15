/**
 * The money rules the board and the cart both have to agree on.
 *
 * These used to live inside the menu's `<Price>`, but the cart has to arrive at
 * the same figure the card printed — a line that adds at the list price after
 * the card advertised the offer is the kind of mismatch a customer notices at
 * the counter. One implementation, read by both.
 */

export const hasPrice = (value?: number | null): value is number =>
  typeof value === "number";

export interface Payable {
  /** What the line actually charges, or `null` when nothing is priced. */
  payable: number | null;
  /** The list price to strike through, set only when an offer is live. */
  struck: number | null;
}

/** What a line actually charges: the offer when it is genuinely cheaper. */
export function payableOf(
  price?: number | null,
  offerPrice?: number | null,
): Payable {
  // An "offer" that is not actually cheaper is a data slip, not a discount.
  const discounted =
    hasPrice(offerPrice) && hasPrice(price) && offerPrice < price;
  const payable = discounted ? offerPrice : (price ?? offerPrice);

  return {
    payable: hasPrice(payable) ? payable : null,
    struck: discounted ? price : null,
  };
}

/** One way of writing a figure, so every total on the site matches. */
export const formatMoney = (amount: number): string => `$${amount.toFixed(2)}`;
