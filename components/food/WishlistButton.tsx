"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { useWishlist } from "@/hooks/useWishlist";
import { AUTH_ROUTES } from "@/lib/auth/constants";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  foodId: string;
  foodName: string;
  /**
   * `overlay` sits on a photograph (frosted disc); `inline` sits in a row of
   * controls next to other buttons.
   */
  appearance?: "overlay" | "inline";
  className?: string;
}

/**
 * The heart. Fills the moment it is tapped — the store saves optimistically —
 * and every other heart for the same dish on the page follows it.
 *
 * Signed out, it does not pretend: it says saving needs an account and offers
 * the way in, bringing the customer back to this page afterwards.
 */
export function WishlistButton({
  foodId,
  foodName,
  appearance = "overlay",
  className,
}: WishlistButtonProps) {
  const { has, toggle, isPending } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();

  const saved = has(foodId);
  const busy = isPending(foodId);

  const onClick = async (event: React.MouseEvent) => {
    // Cards are often one big link; the heart must not also open the dish.
    event.preventDefault();
    event.stopPropagation();

    const result = await toggle(foodId);

    if (result.signedOut) {
      toast("Sign in to save your favourites", {
        description: "Your wishlist follows your account to every device.",
        action: {
          label: "Sign in",
          onClick: () =>
            router.push(
              `${AUTH_ROUTES.login}?callbackUrl=${encodeURIComponent(pathname)}`,
            ),
        },
      });
      return;
    }

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    // `saved` is what it was before the tap.
    toast.success(
      saved
        ? `${foodName} removed from your wishlist`
        : `${foodName} saved to your wishlist`,
    );
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-busy={busy}
      aria-label={
        saved
          ? `Remove ${foodName} from your wishlist`
          : `Save ${foodName} to your wishlist`
      }
      title={saved ? "Saved to your wishlist" : "Save to your wishlist"}
      className={cn(
        "group/heart relative z-10 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full transition-[background-color,border-color,color,transform] duration-200 ease-out active:scale-90",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        appearance === "overlay"
          ? "size-9 border border-border/60 bg-background/85 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-sm hover:border-primary/40"
          : "size-9 border border-border bg-card hover:border-primary/40",
        saved ? "text-danger" : "text-foreground",
        className,
      )}
    >
      <Heart
        aria-hidden
        className={cn(
          "size-4.5 transition-transform duration-200",
          saved ? "scale-110 fill-current" : "group-hover/heart:scale-110",
        )}
        strokeWidth={1.8}
      />
    </button>
  );
}
