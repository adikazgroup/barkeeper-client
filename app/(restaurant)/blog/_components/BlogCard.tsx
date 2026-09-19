import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons/Icons";
import SafeImage from "@/components/ui/SafeImage";
import { BlogPost } from "../_type";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");

export default function BlogCard({
  post,
  index,
}: {
  post: BlogPost;
  index?: number;
}) {
  const text = stripHtml(post?.excerpt || "").trim();
  const readingTime = Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
  const href = `/blog/${post?.slug}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/30 transition-colors duration-300 hover:border-primary/30 p-1.5">
      <div className="relative aspect-16/12 overflow-hidden border-b border-border/50 rounded-xl">
        <SafeImage
          src={post.image}
          alt=""
          fill
          fallbackClassName="flex h-full w-full items-center justify-center bg-muted"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        <span className="absolute top-3 left-3 rounded-full bg-background/80 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-foreground uppercase backdrop-blur-sm">
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2.5 font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
          {index !== undefined && (
            <span className="tabular-nums text-primary/70">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <span>{post.date}</span>
          <span aria-hidden className="size-1 rounded-full bg-border" />
          <span>{readingTime} min</span>
        </div>

        <h3 className="mt-3.5 text-[18px] leading-[1.25] font-medium tracking-[-0.03em] transition-colors duration-200 group-hover:text-primary">
          {/* The whole tile is the target; the rest of the card sits under a
              spread pseudo-element, so there is still exactly one link here. */}
          <Link
            href={href}
            className="after:absolute after:inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {post.title}
          </Link>
        </h3>

        <p className="mt-2.5 line-clamp-2 text-[13.5px] leading-[1.7] text-muted-foreground">
          {text}
        </p>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[12.5px] font-medium text-primary">
          Read the story
          <ArrowRightIcon
            aria-hidden
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </article>
  );
}
