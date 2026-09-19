"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutIcon, UserIcon } from "@/components/icons/Icons";
import { CreditCard, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/useLogout";

/**
 * The account's three rooms, in the order a customer walks them: who you are,
 * what you ordered, what it cost.
 */
const SECTIONS = [
  {
    href: "/profile",
    label: "Profile",
    hint: "Name, photo, password",
    icon: UserIcon,
  },
  {
    href: "/profile/orders",
    label: "Orders",
    hint: "Dockets and tracking",
    icon: Receipt,
  },
  {
    href: "/profile/transactions",
    label: "Transactions",
    hint: "Payments and refunds",
    icon: CreditCard,
  },
];

/**
 * The rooms, as a column beside the page rather than a rail above it.
 *
 * Drawn as the frame's left cell, the way the FAQ and the docket carry their
 * index: a rule between it and the content, and pinned so it stays put while a
 * long list of orders scrolls. Signing out lives at its foot, ruled off — it
 * belongs to the account, not to any one room, and it is the one control here
 * that ends the session rather than moving between pages.
 *
 * Below `lg` there is no column to be beside, so it lays itself back out as
 * the scrollable pill rail the board uses.
 */
export function ProfileNav() {
  const pathname = usePathname();
  const { logout, loggingOut } = useLogout();

  const isActive = (href: string) =>
    href === "/profile" ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="border-b border-border/50 lg:border-r lg:border-b-0">
      <div className="lg:sticky lg:top-16">
        <div className="px-5 py-5 sm:px-8 lg:py-8">
          <p className="hidden font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase lg:block">
            Your account
          </p>

          <nav aria-label="Account sections">
            <ul
              role="list"
              className={cn(
                "scrollbar-hide flex items-center gap-1 overflow-x-auto rounded-full border border-border bg-card/60 p-1 backdrop-blur-sm",
                "lg:mt-5 lg:block lg:space-y-1 lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none",
              )}
            >
              {SECTIONS.map((section) => {
                const active = isActive(section.href);

                return (
                  <li key={section.href} className="shrink-0 lg:shrink">
                    <Link
                      href={section.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium tracking-[-0.01em] whitespace-nowrap transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        "lg:flex lg:items-start lg:gap-3 lg:rounded-lg lg:px-3 lg:py-2.5 lg:whitespace-normal",
                        active
                          ? "bg-primary text-foreground"
                          : "text-muted-foreground hover:text-foreground lg:hover:bg-muted",
                      )}
                    >
                      <section.icon className="size-4 shrink-0 lg:mt-0.5" />

                      <span className="lg:flex lg:min-w-0 lg:flex-col">
                        {section.label}
                        <span
                          className={cn(
                            "hidden text-[11.5px] leading-normal font-normal lg:mt-0.5 lg:block",
                            active
                              ? "text-foreground/70"
                              : "text-muted-foreground",
                          )}
                        >
                          {section.hint}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="hidden border-y border-border/50 px-5 py-3 sm:px-8 lg:block">
          <SignOut logout={logout} loggingOut={loggingOut} />
        </div>
      </div>

      <div className="border-t border-border/50 px-5 py-3 sm:px-8 lg:hidden">
        <SignOut logout={logout} loggingOut={loggingOut} />
      </div>
    </aside>
  );
}

function SignOut({
  logout,
  loggingOut,
}: {
  logout: () => void;
  loggingOut: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => logout()}
      disabled={loggingOut}
      className="inline-flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-muted-foreground transition-colors duration-200 hover:bg-danger/10 hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogoutIcon className="size-4 shrink-0" />
      {loggingOut ? "Signing out…" : "Sign out"}
    </button>
  );
}
