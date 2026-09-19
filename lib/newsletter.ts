import { BACKEND_URL } from "@/lib/auth/api";

/**
 * The newsletter list.
 *
 * These two are the only public writes in the whole API, so they are also the
 * only backend calls this app makes straight from the browser: there is no
 * token to attach and nothing to hide, which is the entire reason the cart,
 * the coupons and the orders go through `/api/*` instead. Putting a route of
 * our own in front of these would only add a hop and hide the backend's own
 * rate limiter from the address it is meant to be counting.
 *
 * Subscribing again after unsubscribing re-activates the address, and
 * unsubscribing answers the same whether or not the address was ever on the
 * list — so neither call leaks whether somebody is a subscriber.
 */

export interface NewsletterAnswer {
  ok: boolean;
  /** The backend's own words, which is what the form prints. */
  message: string;
}

async function post(path: string, email: string): Promise<NewsletterAnswer> {
  let response: Response;

  try {
    response = await fetch(`${BACKEND_URL}/newsletters${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  } catch {
    return {
      ok: false,
      message: "Could not reach the kitchen. Try again in a moment.",
    };
  }

  const payload = (await response.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
  } | null;

  if (!response.ok || !payload?.success) {
    // A rate-limited address gets told so in the backend's wording rather than
    // being left to guess why nothing happened.
    return {
      ok: false,
      message: payload?.message || "That could not be saved. Try again.",
    };
  }

  return { ok: true, message: payload.message || "" };
}

/** Add an address to the list. */
export const subscribeToNewsletter = (email: string) => post("", email);

/**
 * Take an address off the list.
 *
 * Called from `/unsubscribe`, which is where a mailed footer link lands — not
 * from anything on the site itself. Nobody arrives at a home page meaning to
 * leave a list.
 */
export const unsubscribeFromNewsletter = (email: string) =>
  post("/unsubscribe", email);
