import Link from "next/link";

import { ArrowLeftIcon } from "@/components/icons/Icons";
import Logo from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/ui";
import { AuthAssurance, AuthBackdrop } from "./_components";

/**
 * One centred column for all five auth screens.
 *
 * The form sits in a single card in the middle of the page rather than beside a
 * column of copy: four of the five screens are three fields or fewer, and a
 * split layout left them floating in half a screen. The card owns the width, so
 * every form inside it lines up without setting its own.
 *
 * The page is sized to hold the tallest screen (register) inside one viewport —
 * spacing tightens on short windows and the strip under the card drops away, so
 * signing in never asks for a scroll.
 *
 * The whole thing sits in the site's frame — `max-w-7xl` with a rule down each
 * side, ruled off under the bar — the same box every section of the home page
 * is drawn in, so the auth screens are measured against the same edges.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-background">
      <AuthBackdrop />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col border-x border-border/50">
        <div className="flex items-center justify-between gap-4 border-b border-border/50 px-5 py-3 sm:px-8">
          <Logo href="/" className="h-10 w-auto" priority />
          <div className="flex items-center gap-2">
            {/* Given the same ground, height and radius as the theme toggle
                beside it, so the two read as one pair of controls rather than
                a loose line of text next to a button. */}
            <Link
              href="/"
              className="group inline-flex h-8 items-center gap-1.5 rounded-lg border border-border hover:border-primary/50 bg-transparent px-3 text-[13px] text-foreground transition-all duration-200  hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ArrowLeftIcon className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back to site
            </Link>

            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-6 sm:px-8 [@media(max-height:760px)]:py-3">
          <div className="w-full max-w-132">
            <div className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-lg shadow-black/4 backdrop-blur-md sm:p-7 [@media(max-height:760px)]:p-5 dark:shadow-black/20">
              {children}
            </div>

            <AuthAssurance />
          </div>
        </div>
      </div>
    </main>
  );
}
