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
const sections = [
  { href: "/profile", label: "Profile", icon: UserIcon },
  { href: "/profile/orders", label: "Orders", icon: Receipt },
  { href: "/profile/transactions", label: "Transactions", icon: CreditCard },
];

/**
 * The rooms, as one rail rather than a column beside them.
 *
 * It is the board's counter rail, reused: the same pill container, the same
 * primary ground under the live one. Three rooms do not fill a sidebar — they
 * left a tall rule with nothing against it and took a third of the width off
 * the orders table. Across the top the content gets the whole frame, and the
 * rail sticks under the site header so it is still there when the reader is
 * halfway down a docket.
 */
export function ProfileNav() {
  const pathname = usePathname();
  const { logout, loggingOut } = useLogout();

  // `/profile` is a prefix of the other two, so only it matches exactly.
  const isActive = (href: string) =>
    href === "/profile" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="sticky top-16 z-30 border-b border-border/50 bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4 border-x border-border/50 px-5 py-3 sm:px-8">
          <nav aria-label="Account sections" className="min-w-0">
            <ul
              role="list"
              className="scrollbar-hide flex items-center gap-1 overflow-x-auto rounded-full border border-border bg-card/60 p-1 backdrop-blur-sm"
            >
              {sections.map((section) => {
                const active = isActive(section.href);

                return (
                  <li key={section.href} className="shrink-0">
                    <Link
                      href={section.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium tracking-[-0.01em] whitespace-nowrap transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        active
                          ? "bg-primary text-background"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <section.icon className="size-4 shrink-0" />
                      {section.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => logout()}
            disabled={loggingOut}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-[13px] font-medium backdrop-blur-sm transition-colors duration-200 hover:border-danger/40 hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogoutIcon className="size-4 shrink-0" />
            <span className="hidden sm:inline">
              {loggingOut ? "Signing out…" : "Sign out"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
