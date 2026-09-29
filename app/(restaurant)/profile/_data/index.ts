import { RESTAURANT_TIMEZONE } from "@/lib/orders/format";

/**
 * Date formatting for the account pages.
 *
 * Everything the account pages show now comes from the API; what is left here
 * is how its timestamps are printed.
 *
 * A fixed locale and zone on both sides of the render: letting `Intl` pick the
 * runtime's would have the server print one date and the browser another,
 * which React reports as a hydration mismatch. The zone is the restaurant's,
 * so a payment reads at the time it happened at the counter.
 */
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: RESTAURANT_TIMEZONE,
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: RESTAURANT_TIMEZONE,
});

/**
 * A stamp with no zone on it would be read in whatever zone the machine is
 * set to; the API's are UTC, so a bare local time is pinned to it.
 */
const asUtc = (iso: string) =>
  new Date(
    iso.includes("T") && !/[Z+]|[+-]\d\d:\d\d$/.test(iso) ? `${iso}Z` : iso,
  );

export const formatDate = (iso: string) => dateFormatter.format(asUtc(iso));

export const formatDateTime = (iso: string) => {
  const value = asUtc(iso);
  return `${dateFormatter.format(value)} · ${timeFormatter.format(value)}`;
};
