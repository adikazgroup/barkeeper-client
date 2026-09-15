import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategoryTree } from "@/lib/categories";
import { BlogHero } from "./_components/BlogHero";
import { BlogContent } from "./_components/BlogContent";
import BlogFilter from "./_components/BlogFilter";
import { BlogSkeleton } from "./_components/BlogSkeleton";

export const metadata: Metadata = {
  title: "Duffy’s Burger & Wings Blog | Food Stories, Tips & News",
  description:
    "Read the latest from Duffy’s Burger & Wings — mouth-watering food blogs, menu tips, new recipes, and stories behind your favorite burgers and wings.",
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

  // The rail is drawn from the live category tree rather than a hand-kept
  // list, so a desk the admin adds appears here without a deploy. Only the
  // categories that actually have posts filed under them are offered — a
  // filter that can only ever return nothing is worse than no filter.
  //
  // `totalBlogs` is only trustworthy while every post still points at a
  // category that exists. When a re-seed leaves posts filed under ids that
  // have since been deleted, every count reads zero — and a rail holding
  // nothing but "All" looks broken. Fall back to the whole tree there.
  const tree = await getCategoryTree();
  const filed = tree.filter((node) => node.totalBlogs > 0);
  const categories = filed.length > 0 ? filed : tree;

  return (
    <>
      <BlogHero />

      <BlogFilter
        searchTerm={search}
        category={category}
        categories={categories}
      />

      {/* Keyed on the query so a new search swaps in the skeleton rather than
          leaving the previous page's results on screen while it loads. */}
      <Suspense
        key={`${category}-${search}-${page}`}
        fallback={<BlogSkeleton />}
      >
        <BlogContent searchTerm={search} category={category} page={page} />
      </Suspense>
    </>
  );
}
