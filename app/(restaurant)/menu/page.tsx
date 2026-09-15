import { Suspense } from "react";
import type { Metadata } from "next";
import { MenuSections } from "./_components/MenuSections";
import { MenuSkeleton } from "./_components/MenuSkeleton";

export const metadata: Metadata = {
  title: "Menu | Barkeeper’s",
  description:
    "The full menu at Barkeeper’s — burgers, wings and rice bowls from the kitchen, whiskey, draught and cocktails from the bar.",
};

export default function MenuPage() {
  // The hero carries the counter rail now, so the board draws its own header —
  // the skeleton draws the same hero, and only the plates arrive late.
  return (
    <Suspense fallback={<MenuSkeleton />}>
      <MenuSections />
    </Suspense>
  );
}
