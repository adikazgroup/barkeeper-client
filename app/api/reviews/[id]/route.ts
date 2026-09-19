import { NextResponse, type NextRequest } from "next/server";

import { RATING_REQUIRED, readComment, readRating } from "@/lib/reviews/input";
import { reviewError, reviewFetch } from "@/lib/reviews/server";
import { toReview } from "@/lib/reviews/types";

interface Context {
  params: Promise<{ id: string }>;
}

/**
 * `PATCH /reviews/my/:id` — change the rating, the comment, or both.
 *
 * Either field alone is a valid edit, so only the ones that were sent are
 * passed on: a body carrying just a comment must not be read as a review whose
 * rating was cleared. The backend marks the review edited either way.
 */
export async function PATCH(request: NextRequest, { params }: Context) {
  const { id } = await params;

  const body = (await request.json().catch(() => null)) as {
    rating?: unknown;
    comment?: unknown;
  } | null;

  const patch: { rating?: number; comment?: string } = {};

  if (body?.rating !== undefined) {
    const rating = readRating(body.rating);

    if (rating === null) {
      return NextResponse.json({ message: RATING_REQUIRED }, { status: 400 });
    }

    patch.rating = rating;
  }

  if (body?.comment !== undefined) {
    // A comment cleared to nothing is a real change, so unlike the write this
    // sends the empty string through rather than dropping the field.
    const { comment } = readComment(body.comment);
    patch.comment = comment ?? "";
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ message: "Nothing to change." }, { status: 400 });
  }

  const result = await reviewFetch(`/my/${id}`, {
    method: "PATCH",
    body: patch,
  });

  if (!result.ok) return reviewError(result);

  const review = toReview(result.data);

  if (!review) {
    return NextResponse.json(
      { message: "The review could not be changed." },
      { status: 502 },
    );
  }

  return NextResponse.json(
    { review, message: result.message },
    { status: 200 },
  );
}

/**
 * `DELETE /reviews/my/:id` — take it down.
 *
 * The backend recalculates the ratings of every dish that was on the order, so
 * the answer is the review that was removed rather than nothing at all.
 */
export async function DELETE(_request: NextRequest, { params }: Context) {
  const { id } = await params;

  const result = await reviewFetch(`/my/${id}`, { method: "DELETE" });

  if (!result.ok) return reviewError(result);

  return NextResponse.json(
    { review: toReview(result.data), message: result.message },
    { status: 200 },
  );
}
