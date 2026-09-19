import { UtensilsCrossed } from "lucide-react";

import { getFullMenu } from "@/lib/foods";
import { MenuHero } from "./MenuHero";
import { MenuTabs } from "./MenuTabs";


export async function MenuSections() {
  const groups = await getFullMenu();

  if (groups.length === 0) {
    return (
      <>
        <MenuHero />
        <section className="min-h-125">
          <div className="mx-auto max-w-7xl">
            <div className="border-x border-border/50 px-5 py-24 text-center sm:px-8 sm:py-32">
              <span className="mx-auto grid size-11 place-items-center rounded-full border border-border bg-card text-muted-foreground">
                <UtensilsCrossed aria-hidden className="size-5" />
              </span>
              <h2 className="mt-6 text-[26px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[32px]">
                The board is being rewritten
              </h2>
              <p className="mx-auto mt-4 max-w-[46ch] text-[14px] leading-[1.7] text-muted-foreground">
                Nothing is up at the moment. Ring the counter and we&rsquo;ll
                tell you what the kitchen has on.
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }
  return <MenuTabs groups={groups} />;
}
