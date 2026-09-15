import Link from "next/link";
import { getData } from "@/lib/api";
import buildQueryParams from "@/lib/buildQueryParams";
import { categoryFilter, getCategoryBySlug } from "@/lib/categories";
import { BlogPagination } from "./BlogPagination";
import BlogCard from "./BlogCard";
import { Leaf } from "lucide-react";
import { BlogListItem, normalizeBlog, toBlogPost } from "../_type";

interface BlogClientProps {
  searchTerm: string;
  category: string;
  page: string | number;
}

export async function BlogContent({
  searchTerm,
  category,
  page,
}: BlogClientProps) {
  const limit = 9;
  const currentPage = Number(page) || 1;

  // The URL carries a readable slug; the API filters on an ObjectId. One call
  // to `/categories/slug/:slug` resolves it — and the `parent` it comes back
  // with is what says whether this is a category or a sub-category, so the
  // whole tree no longer has to be threaded down here to find out.
  const activeCategory = await getCategoryBySlug(category);

  const queryParams = buildQueryParams({
    page: currentPage,
    limit,
    searchTerm,
    ...categoryFilter(activeCategory),
  });

  const data = await getData<BlogListItem[]>(`/blogs?${queryParams}`, {
    tags: ["blogs"],
  });
  const blogs = (data?.data ?? []).map(normalizeBlog);
  const totalPost = data?.meta?.total ?? 0;

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto max-w-7xl px-3 py-10 sm:px-6 sm:py-14 lg:px-8">
        {blogs.length > 0 ? (
          <>
            {/* A count, so the rail's filtering is legible */}
            <p className="mb-8 text-[11px] font-semibold tracking-[0.25em] text-(--rc-premium-muted) uppercase dark:text-white/50">
              {totalPost} {totalPost === 1 ? "story" : "stories"}
              {activeCategory
                ? ` from the ${activeCategory.name.toLowerCase()} desk`
                : ""}
            </p>

            <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog, i) => (
                <BlogCard
                  key={blog._id}
                  index={(currentPage - 1) * limit + i}
                  post={toBlogPost(blog)}
                />
              ))}
            </div>

            <div className="mt-14 border-t border-primary/12 pt-6">
              <BlogPagination
                currentPage={currentPage}
                limit={limit}
                totalItems={totalPost}
              />
            </div>
          </>
        ) : (
          /* Nothing matched — said plainly, with the way back */
          <div className="mx-auto max-w-md py-16 text-center sm:py-24">
            <Leaf className="mx-auto size-6 text-primary/40" />

            <h2 className="mt-5 font-title text-2xl font-medium tracking-tight text-(--rc-premium-dark) dark:text-white">
              Nothing under that one yet
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-(--rc-premium-muted) dark:text-white/60">
              {searchTerm ? (
                <>
                  No story matches &ldquo;{searchTerm}&rdquo;
                  {activeCategory ? ` in ${activeCategory.name}` : ""}. Try a
                  shorter word, or read the lot.
                </>
              ) : (
                <>
                  That desk has not filed anything yet. Have a look at
                  what&rsquo;s been written so far.
                </>
              )}
            </p>

            <Link
              href="/blog"
              className="mt-7 inline-flex items-center rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Read everything
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
