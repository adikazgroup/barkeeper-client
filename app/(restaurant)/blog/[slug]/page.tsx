import { notFound } from "next/navigation";
import Link from "next/link";

import { getData } from "@/lib/api";
import buildQueryParams from "@/lib/buildQueryParams";
import SafeImage from "@/components/ui/SafeImage";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronRightIcon,
} from "@/components/icons/Icons";
import { COMPANY } from "@/lib/dummyData";

import { BeamBorder } from "../../_components/home/BeamBorder";
import { HeroBackdrop } from "../../_components/home/HeroBackdrop";
import { Reveal } from "../../_components/home/Reveal";
import { Blog, BlogDetail, BlogListItem, normalizeBlog } from "../_type";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

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
      title: "Post not found | Barkeeper’s",
      description: "The story you're looking for could not be found.",
    };
  }

  const description =
    post.metaDescription || stripHtml(post.content).substring(0, 160);

  return {
    title: post.metaTitle || `${post.title} | Barkeeper’s`,
    description,
    keywords: [
      COMPANY.name,
      post.category?.name,
      post.subCategory?.name,
      "journal",
    ]
      .filter(Boolean)
      .join(", "),
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle || post.title,
      description,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [COMPANY.name],
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

  const desk = blog.category?.name ?? "Journal";

  return (
    <main>
      {/* ── The masthead ─────────────────────────────────────────────── */}
      <section
        aria-labelledby="post-heading"
        className="relative -mt-16 overflow-hidden border-b border-border/50 pt-28"
      >
        <HeroBackdrop />

        <div
          className={`relative mx-auto max-w-7xl border-x border-border/50 pb-12 text-center sm:pb-14 ${CELL}`}
        >
          <p className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card/20 py-1.5 pr-4 pl-2 text-[12px] font-medium text-muted-foreground backdrop-blur-sm">
            <BeamBorder />
            <span
              aria-hidden
              className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold tracking-wide text-background uppercase"
            >
              {desk}
            </span>
            {blog.subCategory ? blog.subCategory.name : `${minutes} min read`}
          </p>

          <h1
            id="post-heading"
            className="mx-auto mt-5 max-w-[22ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[34px] leading-[1.07] font-medium tracking-[-0.04em] text-balance text-transparent sm:text-[48px]"
          >
            {blog.title}
          </h1>

          {blog.metaDescription && (
            <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-pretty text-muted-foreground sm:text-[17px]">
              {blog.metaDescription}
            </p>
          )}

          {/* The byline, set as one quiet line rather than a ruled masthead —
              the frame above already separates it from the page. */}
          <p className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
            <span className="text-foreground">{COMPANY.name}</span>
            <span aria-hidden className="size-1 rounded-full bg-border" />
            <time dateTime={blog.createdAt}>{formattedDate}</time>
            <span aria-hidden className="size-1 rounded-full bg-border" />
            <span>{minutes} min read</span>
          </p>
        </div>
      </section>

      {/* ── The plate ────────────────────────────────────────────────── */}
      <section className="border-b border-border/50">
        <div className="mx-auto max-w-7xl border-x border-border/50">
          <figure className={`py-6 ${CELL}`}>
            <div className="relative aspect-16/9 w-full overflow-hidden rounded-lg border border-border/60 bg-card">
              <SafeImage
                src={blog.featuredImage?.url}
                alt={blog.featuredImage?.alt || blog.title}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
                fallbackClassName="flex h-full w-full items-center justify-center bg-muted text-muted-foreground"
              />
            </div>
            {blog.featuredImage?.title && (
              <figcaption className="mt-3 text-center text-[12.5px] text-muted-foreground">
                {blog.featuredImage.title}
              </figcaption>
            )}
          </figure>
        </div>
      </section>

      {/* ── The body, with the post's particulars alongside ──────────── */}
      <section className="border-b border-border/50">
        <div className="mx-auto max-w-7xl border-x border-border/50">
          <div className="grid lg:grid-cols-[16rem_minmax(0,1fr)]">
            {/* the particulars — the same rail the FAQ carries, so a long
                read keeps its context on screen on wide screens */}
            <aside className="border-b border-border/50 lg:border-r lg:border-b-0">
              <div className={`py-10 lg:sticky lg:top-20 lg:py-9 ${CELL}`}>
                <Link
                  href="/blog"
                  className="group inline-flex items-center gap-2 font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase transition-colors duration-200 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <ArrowLeftIcon className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                  All stories
                </Link>

                <dl className="mt-8 space-y-5">
                  <div>
                    <dt className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
                      Filed under
                    </dt>
                    <dd className="mt-1.5 text-[13.5px]">
                      {desk}
                      {blog.subCategory ? ` · ${blog.subCategory.name}` : ""}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
                      Published
                    </dt>
                    <dd className="mt-1.5 text-[13.5px]">{formattedDate}</dd>
                  </div>

                  <div>
                    <dt className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
                      Written by
                    </dt>
                    <dd className="mt-1.5 text-[13.5px]">
                      {COMPANY.name} — from the pass
                    </dd>
                  </div>
                </dl>

                <p className="mt-8 max-w-[28ch] border-t border-border/50 pt-6 text-[12.5px] leading-[1.7] text-muted-foreground">
                  Question about any of this? A person answers, usually the same
                  day.
                </p>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-[12.5px] font-medium transition-colors duration-200 hover:border-primary/30 hover:text-primary"
                >
                  Write to us
                  <ChevronRightIcon aria-hidden className="size-3.5" />
                </Link>
              </div>
            </aside>

            {/* the prose */}
            <div className="min-w-0">
              <article className={`py-10 sm:py-12 ${CELL}`}>
                <div className="max-w-[68ch]">
                  {standfirst && (
                    <p className="text-[17px] leading-[1.7] font-medium tracking-[-0.01em] text-balance sm:text-[19px]">
                      {standfirst}
                    </p>
                  )}

                  {body.map((para) => (
                    <p
                      key={para.slice(0, 48)}
                      className="mt-6 text-[15px] leading-[1.85] text-muted-foreground"
                    >
                      {para}
                    </p>
                  ))}
                </div>

                {/* The one thing to do after reading */}
                <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-lg border border-border/60 bg-card/40 p-6 sm:flex-row sm:items-center sm:p-7">
                  <p className="max-w-[26ch] text-[20px] leading-[1.15] font-medium tracking-[-0.035em] sm:text-[24px]">
                    Hungry after all that? The kitchen is on.
                  </p>

                  <Link
                    href="/menu"
                    className="group inline-flex h-10 shrink-0 items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-4 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    See the menu
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
                      <ChevronRightIcon className="size-4" />
                    </span>
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ── More off the same desk ───────────────────────────────────── */}
      {related.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className="border-b border-border/50"
        >
          <div className="mx-auto max-w-7xl border-x border-border/50">
            <Reveal className={`border-b border-border/50 py-8 ${CELL}`}>
              <h2
                id="related-heading"
                className="text-[22px] leading-[1.2] font-medium tracking-[-0.035em] sm:text-[26px]"
              >
                More from the {desk.toLowerCase()} desk
              </h2>
              <p className="mt-2 max-w-[52ch] text-[13.5px] leading-[1.65] text-muted-foreground">
                Three more off the same counter, if this one was your sort of
                thing.
              </p>
            </Reveal>

            <ul
              role="list"
              className={`grid gap-4 py-6 sm:gap-5 lg:grid-cols-3 ${CELL}`}
            >
              {related.map((r) => (
                <li key={r._id}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="group flex h-full items-start gap-4 rounded-lg border border-border/60 bg-card/40 p-4 transition-colors duration-300 hover:border-primary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className="relative size-20 shrink-0 overflow-hidden rounded-md border border-border/50">
                      <SafeImage
                        src={r.featuredImage?.url}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        fallbackClassName="flex h-full w-full items-center justify-center bg-muted"
                      />
                    </span>

                    <span className="flex min-w-0 flex-1 flex-col self-stretch">
                      <span className="font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
                        {readingTime(r.content)} min read
                      </span>
                      <span className="mt-1.5 line-clamp-2 text-[14.5px] leading-snug font-medium tracking-[-0.02em] transition-colors duration-200 group-hover:text-primary">
                        {r.title}
                      </span>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[12px] font-medium text-primary">
                        Read
                        <ArrowRightIcon className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
