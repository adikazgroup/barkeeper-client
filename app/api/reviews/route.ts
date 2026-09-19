import { NextResponse, type NextRequest } from "next/server";

import {
  RATING_REQUIRED,
  readComment,
  readRating,
} from "@/lib/reviews/input";
import { reviewError, reviewFetch } from "@/lib/reviews/server";
import { toReview, toReviews } from "@/lib/reviews/types";

/**
 * The customer's reviews, and the writing of one.
 */

/**
 * `GET /reviews/my` — the account's reviews, paged.
 *
 * `orderId` is the interesting one: it is how a screen asks "has this order
 * been reviewed?" without reading every review on the account.
 */
export async function GET(request: NextRequest) {
  const incoming = request.nextUrl.searchParams;
  const query = new URLSearchParams();

  for (const key of ["page", "limit", "orderId", "rating"]) {
    const value = incoming.get(key);
    if (value) query.set(key, value);
  }

  const search = query.toString();
  const result = await reviewFetch(`/my${search ? `?${search}` : ""}`);

  if (!result.ok) return reviewError(result);

  return NextResponse.json(
    { reviews: toReviews(result.data), meta: result.meta },
    { status: 200 },
  );
}

/**
 * `POST /reviews` — write one.
 *
 * Only the shape is checked here. Whether the order is this customer's,
 * whether it has been collected and whether it has already been reviewed are
 * all the backend's to answer, and a 409 on a second attempt is a perfectly
 * good answer that travels back as it is.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    orderId?: unknown;
    rating?: unknown;
    comment?: unknown;
  } | null;

  const orderId = typeof body?.orderId === "string" ? body.orderId.trim() : "";

  if (!orderId) {
    return NextResponse.json(
      { message: "No order was named." },
      { status: 400 },
    );
  }

  const rating = readRating(body?.rating);

  if (rating === null) {
    return NextResponse.json({ message: RATING_REQUIRED }, { status: 400 });
  }

  const result = await reviewFetch("", {
    method: "POST",
    body: { orderId, rating, ...readComment(body?.comment) },
  });

  if (!result.ok) return reviewError(result);

  const review = toReview(result.data);

  if (!review) {
    return NextResponse.json(
      { message: "The review could not be saved." },
      { status: 502 },
    );
  }

  return NextResponse.json(
    { review, message: result.message },
    { status: 200 },
  );
}
