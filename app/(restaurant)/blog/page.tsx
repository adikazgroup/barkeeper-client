import type { Metadata } from "next";
import { Suspense } from "react";

import { getCategoryTree } from "@/lib/categories";
import { BlogHero } from "./_components/BlogHero";
import { BlogContent } from "./_components/BlogContent";
import { BlogCount, BlogCountSkeleton } from "./_components/BlogCount";
import BlogFilter from "./_components/BlogFilter";
import { BlogSkeleton } from "./_components/BlogSkeleton";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

export const metadata: Metadata = {
  title: "Journal | Barkeeper’s",
  description:
    "Notes from behind the counter at Barkeeper’s — how the food gets made, who makes it, and what we learned getting it right.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const page = params?.page ? Number(params.page) : 1;
  const category = (params?.category as string) ?? "";
  const search = (params?.search as string) ?? "";


  const tree = await getCategoryTree();
  const filed = tree.filter((node) => node.totalBlogs > 0);
  const categories = filed.length > 0 ? filed : tree;

  const query = { searchTerm: search, category, page };

  return (
    <main>
      <BlogHero />

      {/* The toolbar. It rides above the grid and sticks under the bar, and
          it lives outside the Suspense boundary below so typing a search
          swaps only the stories — the field the reader is using keeps its
          place and its focus. */}
      <section className="sticky top-16 z-40 border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl border-x border-border/50">
          <div
            className={`flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between ${CELL}`}
          >
            {/* Keyed with the grid so both go quiet on the same query. */}
            <Suspense
              key={`count-${category}-${search}-${page}`}
              fallback={<BlogCountSkeleton />}
            >
              <BlogCount {...query} />
            </Suspense>

            <BlogFilter
              searchTerm={search}
              category={category}
              categories={categories}
            />
          </div>
        </div>
      </section>


      <Suspense
        key={`${category}-${search}-${page}`}
        fallback={<BlogSkeleton />}
      >
        <BlogContent {...query} />
      </Suspense>
    </main>
  );
}
