import { notFound } from "next/navigation";
import Link from "next/link";
import { getData } from "@/lib/api";
import buildQueryParams from "@/lib/buildQueryParams";
import SafeImage from "@/components/ui/SafeImage";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
} from "@/components/icons/Icons";
import { Clock, Leaf, Phone } from "lucide-react";
import { COMPANY } from "@/lib/dummyData";
import { Blog, BlogDetail, BlogListItem, normalizeBlog } from "../_type";

/** One post by its slug, with the category resolved the same way the list does. */
async function getBlog(slug: string): Promise<Blog | null> {
  const res = await getData<BlogDetail>(`/blogs/slug/${slug}`, {
    tags: ["blogs", `blog:${slug}`],
  });
  return res?.data ? normalizeBlog(res.data) : null;
}

const stripHtml = (html: string) =>
  (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** The body may arrive as a run of `<p>` tags or as plain prose with blank
 *  lines between paragraphs, depending on what the editor saved. Splitting on
 *  both keeps the markup ours — no `dangerouslySetInnerHTML` — and lets the
 *  first paragraph be set larger as a standfirst. */
const toParagraphs = (html: string) =>
  (html || "")
    .split(/<\/p>|\n\s*\n/i)
    .map((chunk) => stripHtml(chunk))
    .filter(Boolean);

const readingTime = (html: string) =>
  Math.max(1, Math.ceil(stripHtml(html).split(" ").length / 200));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlog(slug);

  if (!post) {
    return {
      title: "Post Not Found - Duffy’s Blog",
      description: "The blog post you're looking for could not be found.",
    };
  }

  const description =
    post.metaDescription || stripHtml(post.content).substring(0, 160);

  return {
    title: post.metaTitle || `${post.title} - Duffy’s Blog`,
    description,
    keywords: ["Duffy’s", post.category?.name, post.subCategory?.name, "blog"]
      .filter(Boolean)
      .join(", "),
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle || post.title,
      description,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: ["Duffy’s"],
      images: post.featuredImage?.url
        ? [
            {
              url: post.featuredImage.url,
              width: 1200,
              height: 630,
              alt: post.featuredImage.alt || post.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description,
      images: post.featuredImage?.url ? [post.featuredImage.url] : [],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const [standfirst, ...body] = toParagraphs(blog.content);
  const minutes = readingTime(blog.content);
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Three more off the same desk, the current one dropped out. Four are asked
  // for because this post is very likely one of them.
  const relatedRes = blog.category
    ? await getData<BlogListItem[]>(
        `/blogs?${buildQueryParams({
          page: 1,
          limit: 4,
          categoryId: blog.category._id,
        })}`,
        { tags: ["blogs"] },
      )
    : null;

  const related = (relatedRes?.data ?? [])
    .filter((b) => b.slug !== blog.slug)
    .slice(0, 3);

  return (
    <div className="bg-background">
      <article className="pt-22 pb-16 sm:pt-26 sm:pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-(--rc-premium-muted) uppercase transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-white/50"
          >
            <ArrowLeftIcon className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to the journal
          </Link>

          <header className="mt-7">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.35em] text-primary uppercase">
              <Leaf className="size-3.5" />
              {blog.category?.name ?? "Journal"}
              {blog.subCategory ? ` · ${blog.subCategory.name}` : ""}
            </span>

            <h1 className="mt-4 font-title text-3xl leading-tight font-medium tracking-tight text-(--rc-premium-dark) sm:text-4xl lg:text-[2.75rem] dark:text-white">
              {blog.title}
            </h1>

            {blog.metaDescription && (
              <p className="mt-5 text-base leading-relaxed text-(--rc-premium-muted) sm:text-lg dark:text-white/70">
                {blog.metaDescription}
              </p>
            )}

            {/* Byline, ruled off above and below the way a masthead is */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-primary/15 py-4">
              <span className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 font-title text-sm font-semibold text-primary">
                  D
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-(--rc-premium-dark) dark:text-white">
                    Duffy&rsquo;s
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-(--rc-premium-muted) uppercase dark:text-white/50">
                    From the kitchen
                  </span>
                </span>
              </span>

              <span
                aria-hidden
                className="hidden h-8 w-px bg-primary/15 sm:block"
              />

              <span className="flex items-center gap-2 text-sm text-(--rc-premium-muted) dark:text-white/60">
                <CalendarIcon className="size-3.5 text-primary" />
                {formattedDate}
              </span>

              <span className="flex items-center gap-2 text-sm text-(--rc-premium-muted) dark:text-white/60">
                <Clock className="size-3.5 text-primary" />
                {minutes} min read
              </span>
            </div>
          </header>

          {/* The plate */}
          <figure className="my-10 sm:my-12">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-primary/15">
              <SafeImage
                src={blog.featuredImage?.url}
                alt={blog.featuredImage?.alt || blog.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 768px"
                className="object-cover"
                fallbackClassName="flex h-full w-full items-center justify-center bg-primary/5"
              />
            </div>
            {blog.featuredImage?.title && (
              <figcaption className="mt-3 text-center text-xs text-(--rc-premium-muted) dark:text-white/50">
                {blog.featuredImage.title}
              </figcaption>
            )}
          </figure>

          {/* The body */}
          <div className="text-(--rc-premium-dark)/85 dark:text-white/75">
            {standfirst && (
              <p className="font-title text-lg leading-relaxed text-(--rc-premium-dark) sm:text-xl dark:text-white">
                {standfirst}
              </p>
            )}

            {body.map((para) => (
              <p key={para.slice(0, 48)} className="mt-6 leading-[1.85]">
                {para}
              </p>
            ))}
          </div>

          {/* Foot: the one thing to do after reading */}
          <div className="mt-12 flex flex-col items-start justify-between gap-5 border-t border-primary/15 pt-8 sm:flex-row sm:items-center">
            <p className="font-title text-xl font-medium tracking-tight text-(--rc-premium-dark) sm:text-2xl dark:text-white">
              Question about any of this? Ask the counter.
            </p>

            <a
              href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
              className="inline-flex shrink-0 items-center gap-2.5 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Phone className="size-4" />
              {COMPANY.phone}
            </a>
          </div>
        </div>
      </article>

      {/* ── More off the same desk ───────────────────────────────────── */}
      {related.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className="border-t border-primary/12 py-14 sm:py-20"
        >
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-4">
              <h2
                id="related-heading"
                className="inline-flex shrink-0 items-center gap-2 text-[10px] font-semibold tracking-[0.3em] text-primary uppercase"
              >
                <Leaf className="size-3.5" />
                More from the {(
                  blog.category?.name ?? "journal"
                ).toLowerCase()}{" "}
                desk
              </h2>
              <span aria-hidden className="h-px flex-1 bg-primary/20" />
            </div>

            <ul role="list" className="grid gap-x-8 gap-y-6 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r._id}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="group flex h-full items-start gap-4 rounded-lg border border-primary/15 bg-card p-4 transition-colors duration-300 hover:border-primary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className="relative size-20 shrink-0 overflow-hidden rounded-md">
                      <SafeImage
                        src={r.featuredImage?.url}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        fallbackClassName="flex h-full w-full items-center justify-center bg-primary/5"
                      />
                    </span>

                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-[10px] font-semibold tracking-[0.2em] text-(--rc-premium-muted) uppercase dark:text-white/50">
                        {readingTime(r.content)} min read
                      </span>
                      <span className="mt-1.5 line-clamp-2 text-sm leading-snug font-semibold text-(--rc-premium-dark) transition-colors group-hover:text-primary dark:text-white">
                        {r.title}
                      </span>
                      <span className="mt-auto pt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-primary">
                        Read
                        <ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
