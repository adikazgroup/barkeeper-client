import { MAX_COMMENT_LENGTH, MAX_RATING, MIN_RATING } from "./types";

/**
 * What a review's two fields are allowed to be.
 *
 * Shared by the write and the edit, which take the same pair — the edit simply
 * allows either one to be left out. Nothing here decides whether the review may
 * be written at all: that depends on whose order it is and whether it has been
 * collected, which only the backend knows.
 */

/** A whole number inside the backend's own range, or nothing. */
export function readRating(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;

  const rating = Math.round(value);
  if (rating < MIN_RATING || rating > MAX_RATING) return null;

  return rating;
}

/**
 * The comment, when there is one.
 *
 * Trimmed to the backend's limit rather than refused at it: somebody who
 * pasted a long paragraph would rather have it shortened than handed back.
 * An empty string is dropped, so "no comment" and "a comment of nothing" do
 * not reach the backend as two different things.
 */
export function readComment(value: unknown): { comment?: string } {
  if (typeof value !== "string") return {};

  const comment = value.trim().slice(0, MAX_COMMENT_LENGTH);
  return comment ? { comment } : {};
}

/** The wording the rating field is refused with, in one place. */
export const RATING_REQUIRED = `Pick a rating from ${MIN_RATING} to ${MAX_RATING}.`;
