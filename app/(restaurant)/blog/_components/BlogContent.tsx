import Link from "next/link";
import { FileText } from "lucide-react";

import { BlogPagination } from "./BlogPagination";
import BlogCard from "./BlogCard";
import { BLOG_PAGE_SIZE, BlogQuery, getBlogPage } from "../_query";
import { toBlogPost } from "../_type";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

export async function BlogContent(query: BlogQuery) {
  const { blogs, total, currentPage, activeCategory } =
    await getBlogPage(query);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="border-x border-border/50">
        {blogs.length > 0 ? (
          <>
            <div
              className={`grid grid-cols-1 gap-4 py-6 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 ${CELL}`}
            >
              {blogs.map((blog, i) => (
                <BlogCard
                  key={blog._id}
                  index={(currentPage - 1) * BLOG_PAGE_SIZE + i}
                  post={toBlogPost(blog)}
                />
              ))}
            </div>

            {total > BLOG_PAGE_SIZE && (
              <div className={`border-t border-border/50 py-5 ${CELL}`}>
                <BlogPagination
                  currentPage={currentPage}
                  limit={BLOG_PAGE_SIZE}
                  totalItems={total}
                />
              </div>
            )}
          </>
        ) : (
          /* Nothing matched — said plainly, with the way back */
          <div className={`py-24 text-center sm:py-32 ${CELL}`}>
            <span className="mx-auto grid size-11 place-items-center rounded-full border border-border bg-card text-muted-foreground">
              <FileText aria-hidden className="size-5" />
            </span>

            <h2 className="mt-6 text-[26px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[32px]">
              Nothing filed under that one yet
            </h2>

            <p className="mx-auto mt-4 max-w-[46ch] text-[14px] leading-[1.7] text-muted-foreground">
              {query.searchTerm ? (
                <>
                  No story matches &ldquo;{query.searchTerm}&rdquo;
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
              className="mt-8 inline-flex h-10 items-center rounded-full bg-primary px-5 text-[13px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Read everything
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
