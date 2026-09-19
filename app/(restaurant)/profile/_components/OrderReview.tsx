"use client";

import { useEffect, useState } from "react";
import { Loader2, MessageSquareQuote } from "lucide-react";
import { toast } from "sonner";

import {
  deleteMyReview,
  editMyReview,
  fetchReviewForOrder,
  writeReview,
} from "@/lib/reviews/client";
import { formatDateTime } from "@/lib/orders/format";
import { MAX_COMMENT_LENGTH, type Review } from "@/lib/reviews/types";
import { cn } from "@/lib/utils";

import { StarPicker, Stars } from "./Stars";

/**
 * The review on one order.
 *
 * It reads its own state rather than being told it, because "has this order
 * been reviewed?" is one narrow question — `/reviews/my?orderId=` — and the
 * screens that show an order should not each have to carry the answer around.
 * The block is mounted only where a review is possible: a collected order.
 *
 * All four things a customer can do with a review are here, because they are
 * the same object in four states — nothing written, written, being changed,
 * gone. Splitting them across screens would mean a customer who wanted to fix
 * a typo had to go looking for where reviews live.
 */
export function OrderReview({
  orderId,
  onChange,
}: {
  orderId: string;
  /** Told when the order gains or loses its review, for a list that shows it. */
  onChange?: (review: Review | null) => void;
}) {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const answer = await fetchReviewForOrder(orderId);
      if (cancelled) return;

      setLoading(false);

      if (answer.ok && answer.data) {
        setReview(answer.data);
        setRating(answer.data.rating);
        setComment(answer.data.comment ?? "");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const settle = (next: Review | null) => {
    setReview(next);
    setEditing(false);
    onChange?.(next);
  };

  const handleWrite = async () => {
    if (rating < 1) {
      toast.error("Pick a rating first.");
      return;
    }

    setBusy(true);

    const answer = await writeReview({
      orderId,
      rating,
      comment: comment.trim() || undefined,
    });

    setBusy(false);

    if (!answer.ok || !answer.data) {
      // "You have already reviewed this one" is a 409 and arrives here like
      // any other refusal — worth printing rather than flattening.
      toast.error(answer.message || "The review could not be saved.");
      return;
    }

    settle(answer.data);
    toast.success(answer.message || "Thanks — the kitchen will see it.");
  };

  const handleEdit = async () => {
    if (!review) return;

    if (rating < 1) {
      toast.error("Pick a rating first.");
      return;
    }

    setBusy(true);

    const answer = await editMyReview(review._id, {
      rating,
      comment: comment.trim(),
    });

    setBusy(false);

    if (!answer.ok || !answer.data) {
      toast.error(answer.message || "The review could not be changed.");
      return;
    }

    settle(answer.data);
    toast.success(answer.message || "Review updated.");
  };

  const handleDelete = async () => {
    if (!review) return;

    setBusy(true);

    const answer = await deleteMyReview(review._id);

    setBusy(false);

    if (!answer.ok) {
      toast.error(answer.message || "The review could not be removed.");
      return;
    }

    // Back to an unwritten review, which is exactly what the order is now.
    setRating(0);
    setComment("");
    settle(null);
    toast.success(answer.message || "Review removed.");
  };

  if (loading) {
    return (
      <div aria-hidden className="mt-6 border-t border-border/50 pt-6">
        <div className="h-3 w-32 animate-pulse rounded bg-muted-foreground/10" />
        <div className="mt-4 h-8 w-44 animate-pulse rounded-full bg-muted-foreground/10" />
      </div>
    );
  }

  const writing = !review || editing;

  return (
    <div className="mt-6 border-t border-border/50 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
          {review ? "Your review" : "How was it?"}
        </h4>

        {review && !editing && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditing(true)}
              disabled={busy}
              className="cursor-pointer font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase transition-colors duration-200 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={busy}
              className="cursor-pointer font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase transition-colors duration-200 hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {writing ? (
        <div className="mt-4">
          <StarPicker value={rating} onChange={setRating} disabled={busy} />

          <label htmlFor={`comment-${orderId}`} className="sr-only">
            What did you think?
          </label>

          <textarea
            id={`comment-${orderId}`}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            disabled={busy}
            rows={3}
            maxLength={MAX_COMMENT_LENGTH}
            placeholder="What was good, what was not. Optional."
            className="mt-4 w-full resize-none rounded-2xl border border-border bg-card/60 px-4 py-3 text-[13.5px] leading-[1.7] backdrop-blur-sm transition-colors placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/15 focus:outline-none disabled:opacity-60"
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void (review ? handleEdit() : handleWrite())}
              disabled={busy || rating < 1}
              className={cn(
                "inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-primary px-5 text-[13.5px] font-medium text-background",
                "transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
              )}
            >
              {busy && <Loader2 aria-hidden className="size-4 animate-spin" />}
              {review ? "Save changes" : "Leave review"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={() => {
                  // Back to what is actually stored, not to empty.
                  setRating(review?.rating ?? 0);
                  setComment(review?.comment ?? "");
                  setEditing(false);
                }}
                disabled={busy}
                className="cursor-pointer text-[13px] text-muted-foreground transition-colors duration-200 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
              >
                Cancel
              </button>
            )}

            <span className="ml-auto font-mono text-[10.5px] text-muted-foreground tabular-nums">
              {comment.length}/{MAX_COMMENT_LENGTH}
            </span>
          </div>
        </div>
      ) : (
        review && (
          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-3">
              <Stars rating={review.rating} />

              <span className="text-[12px] text-muted-foreground">
                {formatDateTime(review.createdAt)}
                {review.isEdited && " · edited"}
              </span>
            </div>

            {review.comment && (
              <p className="mt-3 text-[13.5px] leading-[1.7] text-muted-foreground italic">
                &ldquo;{review.comment}&rdquo;
              </p>
            )}

            {/* The restaurant writing back is the part worth showing off, so
                it is set apart rather than run in with the customer's own
                words. */}
            {review.adminReply?.message && (
              <div className="mt-4 rounded-xl border border-border/60 bg-card/40 px-4 py-3">
                <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                  <MessageSquareQuote aria-hidden className="size-3.5" />
                  Barkeeper’s replied
                  {review.adminReply.repliedAt &&
                    ` · ${formatDateTime(review.adminReply.repliedAt)}`}
                </p>
                <p className="mt-2 text-[13px] leading-[1.7]">
                  {review.adminReply.message}
                </p>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
