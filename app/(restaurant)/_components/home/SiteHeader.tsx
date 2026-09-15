"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AUTH_ROUTES } from "@/lib/auth/constants";
import { ShoppingBagIcon, UserIcon } from "@/components/icons/Icons";
import { ThemeToggle } from "@/components/ui";
import { useCart } from "@/hooks/useCart";
import { EASE } from "./Reveal";
import { Logo } from "./Logo";

const NAV_LINKS = [
  // Root-relative, so the nav still works from /about, /contact and the
  // policy pages. A bare "#menu" only resolves on the home page.
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Where the bar sends a customer who has a docket, and one who has an account. */
const CART_HREF = "/cart";
const PROFILE_HREF = "/profile";

/** What the bar needs about whoever is signed in. Null when nobody is. */
export interface HeaderAccount {
  name: string;
  avatarUrl: string | null;
}

/**
 * @param account The signed-in customer, read on the server by the layout. It
 *   is passed in rather than fetched here so the bar paints the right state in
 *   the first render, with no signed-out flash.
 */
export function SiteHeader({ account }: { account?: HeaderAccount | null }) {
  // `hydrated` gates the badge: the server has no docket to count, so a number
  // painted before the stored one is read back would not match.
  const { count, hydrated } = useCart();
  const badge = hydrated && count > 0 ? (count > 99 ? "99+" : count) : null;

  const signedIn = Boolean(account);
  const initial = account?.name?.trim()?.charAt(0)?.toUpperCase() ?? "";

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());

  const [pill, setPill] = useState<{ x: number; width: number } | null>(null);

  const measure = useCallback((href: string | null) => {
    if (!href) return;
    const nav = navRef.current;
    const item = itemRefs.current.get(href);
    if (!nav || !item) return;
    const navBox = nav.getBoundingClientRect();
    const itemBox = item.getBoundingClientRect();
    setPill({ x: itemBox.left - navBox.left, width: itemBox.width });
  }, []);

  useEffect(() => {
    measure(hovered);
  }, [hovered, measure]);

  useEffect(() => {
    if (!hovered) return;
    const onResize = () => measure(hovered);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [hovered, measure]);

  // Bare at the top of the page, so the hero reads edge to edge; the moment the
  // page moves, the bar earns a ground. The threshold is a few pixels rather
  // than zero so a rubber-band scroll does not flicker it on and off.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300 ease-out",
        "backdrop-blur-xl",
        "border-b border-border/50",
        scrolled ? "bg-background/30" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* <Link
          href="/"
          className="shrink-0 rounded-full text-[19px] font-semibold tracking-[-0.02em] text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Barkeeper&apos;s
        </Link> */}

        <Logo className="h-10 w-auto shrink-0" priority />

        <nav
          ref={navRef}
          className="relative hidden shrink-0 items-center lg:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {pill && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-0 h-8 -translate-y-1/2 rounded-full bg-primary will-change-transform"
              initial={false}
              animate={{
                x: pill.x,
                width: pill.width,
                opacity: hovered ? 1 : 0,
              }}
              transition={{
                x: { type: "spring", stiffness: 420, damping: 38, mass: 0.7 },
                width: {
                  type: "spring",
                  stiffness: 420,
                  damping: 38,
                  mass: 0.7,
                },
                opacity: { duration: hovered ? 0.15 : 0.22, ease: EASE },
              }}
              style={{ translateZ: 0 }}
            />
          )}

          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              ref={(node) => {
                if (node) itemRefs.current.set(link.href, node);
                else itemRefs.current.delete(link.href);
              }}
              onMouseEnter={() => setHovered(link.href)}
              onFocus={() => setHovered(link.href)}
              className={cn(
                "relative z-10 rounded-full px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap",
                "transition-colors duration-200 ease-out",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                hovered === link.href
                  ? "text-primary-foreground"
                  : "text-foreground",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* ----------------------------- ACTIONS ---------------------------- */}
        <div className="flex shrink-0 items-center gap-1">
          <ThemeToggle className="rounded-full border-transparent bg-transparent hover:border-transparent" />

          <Link
            href={CART_HREF}
            aria-label={
              badge
                ? `View cart, ${count} item${count === 1 ? "" : "s"}`
                : "View cart"
            }
            className="relative flex size-8 items-center justify-center rounded-full text-foreground transition-colors duration-200 hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ShoppingBagIcon className="size-4.5" />

            {badge && (
              <span
                aria-hidden
                className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9.5px] font-semibold text-background ring-2 ring-background tabular-nums"
              >
                {badge}
              </span>
            )}
          </Link>

          {/* Signed in, the bar stops offering a way in and starts offering a
              way to their own account. */}
          {signedIn ? (
            <Link
              href={PROFILE_HREF}
              aria-label={`Your account, ${account?.name}`}
              className="flex size-8 items-center justify-center overflow-hidden rounded-full border border-border bg-card text-[12px] font-semibold text-foreground transition-colors duration-200 hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {account?.avatarUrl ? (
                // Unoptimized: the avatar comes off whatever host the backend
                // stores it on, and `next.config.ts` declares no image hosts,
                // so running it through the optimizer would throw on an
                // unconfigured hostname.
                <Image
                  src={account.avatarUrl}
                  alt=""
                  width={32}
                  height={32}
                  unoptimized
                  className="size-full object-cover"
                />
              ) : initial ? (
                initial
              ) : (
                <UserIcon className="size-4" />
              )}
            </Link>
          ) : (
            <Link
              href={AUTH_ROUTES.login}
              className="hidden h-8 items-center rounded-full px-3 text-[13px] text-muted-foreground transition-colors duration-200 hover:text-foreground sm:inline-flex"
            >
              Sign in
            </Link>
          )}

          <Link
            href="/contact"
            className="hidden h-8 items-center rounded-full bg-primary px-4 text-[13px] font-medium text-background transition-opacity duration-200 hover:opacity-88 sm:inline-flex"
          >
            Book now
          </Link>

          {/* Mobile trigger — the two rules cross into an X when open. */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex size-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-secondary lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={cn(
                  "absolute left-0 block h-px w-full bg-foreground transition-all duration-300",
                  menuOpen ? "top-1.5 rotate-45" : "top-0.5",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-px w-full bg-foreground transition-all duration-300",
                  menuOpen ? "top-1.5 -rotate-45" : "top-2.5",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* ----------------------------- MOBILE ----------------------------- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="mx-auto max-w-7xl px-5 pb-3 sm:px-8 lg:hidden"
          >
            <ul className="rounded-2xl border border-border bg-card/75 px-4 py-3 shadow-[0_16px_40px_-20px_rgb(1_13_82/0.35)] backdrop-blur-xl">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-border/60 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href={CART_HREF}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 border-b border-border/60 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ShoppingBagIcon className="size-4" />
                  Cart
                  {badge && (
                    <span className="ml-auto grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9.5px] font-semibold text-background tabular-nums">
                      {badge}
                    </span>
                  )}
                </Link>
              </li>

              <li className="flex gap-2 pt-3">
                <Link
                  href={signedIn ? PROFILE_HREF : AUTH_ROUTES.login}
                  onClick={() => setMenuOpen(false)}
                  className="flex h-10 flex-1 items-center justify-center rounded-full border border-border text-sm font-medium"
                >
                  {signedIn ? "My account" : "Sign in"}
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-10 flex-1 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background"
                >
                  Book now
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
