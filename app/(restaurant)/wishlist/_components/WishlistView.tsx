"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ChevronRightIcon } from "@/components/icons/Icons";
import { useWishlist } from "@/hooks/useWishlist";
import { AUTH_ROUTES } from "@/lib/auth/constants";
import { cn } from "@/lib/utils";
import { toWishlistFoods, type WishlistFood } from "@/lib/wishlist/types";

import { Reveal, staggerParent } from "../../_components/home/Reveal";
import { FoodCard } from "../../menu/_components/FoodCard";

const MENU_HREF = "/menu";
/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

type LoadState =
  | { kind: "loading" }
  | { kind: "signed-out" }
  | { kind: "error"; message: string }
  | { kind: "ready"; foods: WishlistFood[] };

/** Read the saved dishes once; the store decides which are still saved. */
async function fetchWishlist(): Promise<LoadState> {
  try {
    const response = await fetch("/api/wishlist", { cache: "no-store" });
    const payload = (await response.json().catch(() => null)) as {
      data?: unknown;
      message?: string;
    } | null;

    if (response.status === 401) return { kind: "signed-out" };

    if (!response.ok) {
      return {
        kind: "error",
        message: payload?.message ?? "Your wishlist could not be loaded.",
      };
    }

    return { kind: "ready", foods: toWishlistFoods(payload?.data) };
  } catch {
    return {
      kind: "error",
      message: "Could not reach the kitchen. Check your connection.",
    };
  }
}

/**
 * The saved dishes.
 *
 * The dishes themselves are read once when the page opens; which of them are
 * still saved is read from the shared wishlist store. So unhearting a card
 * here takes it off the page at once, and a dish saved on another page while
 * this one was open is picked up on the next visit.
 *
 * Each card is the menu's own — same builder, same add, same heart — and
 * adding one to the cart leaves it saved here: a wishlist is not a queue.
 */
export function WishlistView() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  /** Bumped by "Try again" to run the read once more. */
  const [attempt, setAttempt] = useState(0);
  const wishlist = useWishlist();
  const reduced = useReducedMotion();

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const next = await fetchWishlist();
      if (!cancelled) setState(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  if (state.kind === "loading") return <WishlistSkeleton />;
  if (state.kind === "signed-out") return <SignedOutWishlist />;

  if (state.kind === "error") {
    return (
      <Notice
        title="We could not open your wishlist"
        body={state.message}
        action={
          <button
            type="button"
            onClick={() => {
              setState({ kind: "loading" });
              setAttempt((count) => count + 1);
            }}
            className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-[14px] font-medium text-background"
          >
            Try again
          </button>
        }
      />
    );
  }

  // Unhearted here (or elsewhere) since it loaded — take it off the page.
  const foods = wishlist.hydrated
    ? state.foods.filter((food) => wishlist.has(food._id))
    : state.foods;

  if (foods.length === 0) return <EmptyWishlist />;

  const clearAll = async () => {
    const result = await wishlist.clear();
    if (result.ok) toast.success("Wishlist cleared");
    else toast.error(result.message);
  };

  return (
    <section>
      <div className="mx-auto max-w-7xl border-x border-border/50">
        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-3 border-b border-border/50 py-5",
            CELL,
          )}
        >
          <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase tabular-nums">
            {foods.length} saved {foods.length === 1 ? "plate" : "plates"}
          </p>

          <button
            type="button"
            onClick={clearAll}
            className="text-[13px] font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-danger hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Clear wishlist
          </button>
        </div>

        <motion.ul
          role="list"
          variants={staggerParent}
          initial={reduced ? false : "hidden"}
          animate="visible"
          className={cn(
            "grid gap-4 py-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3",
            CELL,
          )}
        >
          {foods.map((food) => (
            <FoodCard key={food._id} item={food} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/* ─── States ─── */

function Notice({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action: React.ReactNode;
}) {
  return (
    <section>
      <div className="mx-auto max-w-7xl">
        <div className="border-x border-border/50 px-5 py-20 text-center sm:px-8 sm:py-28">
          <Reveal className="mx-auto max-w-[46ch]">
            <span className="mx-auto grid size-11 place-items-center rounded-full border border-border bg-card text-muted-foreground">
              <Heart className="size-4.5" strokeWidth={1.8} />
            </span>

            <h2 className="mx-auto mt-7 max-w-[20ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[30px] leading-[1.05] font-medium tracking-[-0.04em] text-transparent sm:text-[40px]">
              {title}
            </h2>

            <p className="mt-5 text-[14px] leading-[1.7] text-muted-foreground">
              {body}
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {action}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const PRIMARY_LINK =
  "group inline-flex h-11 w-full items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-5 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto";

function EmptyWishlist() {
  return (
    <Notice
      title="Nothing saved yet"
      body="Tap the heart on any plate on the board and it will be kept here for next time."
      action={
        <Link href={MENU_HREF} className={PRIMARY_LINK}>
          Browse the board
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
            <ChevronRightIcon className="size-4" />
          </span>
        </Link>
      }
    />
  );
}

function SignedOutWishlist() {
  return (
    <Notice
      title="Sign in to see your wishlist"
      body="Your saved plates live on your account, so they follow you from your laptop to your phone."
      action={
        <>
          <Link
            href={`${AUTH_ROUTES.login}?callbackUrl=/wishlist`}
            className={PRIMARY_LINK}
          >
            Sign in
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
              <ChevronRightIcon className="size-4" />
            </span>
          </Link>
          <Link
            href={MENU_HREF}
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-card/60 px-5 text-[14px] font-medium transition-colors duration-200 hover:bg-foreground hover:text-background sm:w-auto"
          >
            Browse the board
          </Link>
        </>
      }
    />
  );
}

function WishlistSkeleton() {
  return (
    <section aria-busy="true" aria-label="Loading your wishlist">
      <div className="mx-auto max-w-7xl border-x border-border/50">
        <div className={cn("border-b border-border/50 py-5", CELL)}>
          <div className="h-3 w-28 animate-pulse rounded bg-muted" />
        </div>
        <ul
          className={cn(
            "grid gap-4 py-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3",
            CELL,
          )}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <li
              key={index}
              className="flex flex-col rounded-2xl border border-border/60 bg-card/30 p-2"
            >
              <div className="aspect-square animate-pulse rounded-xl bg-muted" />
              <div className="space-y-3 px-3 pt-5 pb-3">
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
