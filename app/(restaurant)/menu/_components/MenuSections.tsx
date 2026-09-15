import { getData } from "@/lib/api";
import { getCategoryTree } from "@/lib/categories";
import type { CategoryNode } from "@/lib/types";
import { UtensilsCrossed } from "lucide-react";
import type { FoodItem, MenuGroup } from "../_type";
import { MenuHero } from "./MenuHero";
import { MenuTabs } from "./MenuTabs";

function groupFoods(foods: FoodItem[], tree: CategoryNode[]): MenuGroup[] {
  const byCategory = new Map<string, FoodItem[]>();

  for (const food of foods) {
    const key = food.category?._id;
    if (!key) continue;
    const bucket = byCategory.get(key);
    if (bucket) bucket.push(food);
    else byCategory.set(key, [food]);
  }

  const ordered: CategoryNode[] = [...tree];
  const known = new Set(tree.map((c) => c._id));

  for (const food of foods) {
    const category = food.category;
    if (!category || known.has(category._id)) continue;
    known.add(category._id);
    ordered.push({ ...category, totalFoods: 0, totalBlogs: 0 });
  }

  return ordered
    .map((category) => {
      const items = byCategory.get(category._id) ?? [];
      if (items.length === 0) return null;

      return {
        key: category._id,
        title: category.name,
        slug: category.slug,
        // An unnumbered food sinks to the end rather than jumping the queue.
        items: [...items].sort(
          (a, b) =>
            (a.sortOrder ?? Number.MAX_SAFE_INTEGER) -
            (b.sortOrder ?? Number.MAX_SAFE_INTEGER),
        ),
      } satisfies MenuGroup;
    })
    .filter((group): group is MenuGroup => group !== null);
}

/** As many plates as one request will carry; the board wants the lot. */
const MENU_PAGE_SIZE = 100;

async function getAllFoods(): Promise<FoodItem[]> {
  const first = await getData<FoodItem[]>(`/foods?limit=${MENU_PAGE_SIZE}`, {
    tags: ["foods"],
  });
  if (!first) return [];

  const totalPage = first.meta?.totalPage ?? 1;
  if (totalPage <= 1) return first.data ?? [];

  const rest = await Promise.all(
    Array.from({ length: totalPage - 1 }, (_, i) =>
      getData<FoodItem[]>(`/foods?limit=${MENU_PAGE_SIZE}&page=${i + 2}`, {
        tags: ["foods"],
      }),
    ),
  );

  return [...(first.data ?? []), ...rest.flatMap((res) => res?.data ?? [])];
}

export async function MenuSections() {
  const [foods, tree] = await Promise.all([getAllFoods(), getCategoryTree()]);

  const groups = groupFoods(foods, tree);

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
