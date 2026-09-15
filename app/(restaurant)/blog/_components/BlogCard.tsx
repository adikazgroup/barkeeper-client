import Link from "next/link";

import { Leaf } from "lucide-react";
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
  // One pass on the server and the client — parsing via the DOM on one side
  // and a regex on the other risked a hydration mismatch.
  const readingTime = Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
  const href = `/blog/${post?.slug}`;

  return (
    <article className="group flex h-full flex-col border border-border p-2 rounded-md relative overflow-hidden">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className="relative block aspect-square overflow-hidden rounded-sm border border-primary/15 bg-card transition-colors duration-500 "
      >
        <SafeImage
          src={post.image}
          alt=""
          fill
          fallbackClassName="flex h-full w-full items-center justify-center bg-primary/5"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        <span className="absolute top-3 left-3 rounded-md bg-primary px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] text-white uppercase">
          {post.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col pt-5 p-1 z-10 relative">
        <div className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-(--rc-premium-muted) uppercase dark:text-white/50">
          {index !== undefined && (
            <span className="text-primary tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <span>{post.date}</span>
          <Leaf className="size-3 shrink-0 text-primary" />
          <span>{readingTime} min read</span>
        </div>

        <h3 className="mt-3 text-lg leading-snug font-medium! tracking-tight text-(--rc-premium-dark) transition-colors duration-300 group-hover:text-primary dark:text-white">
          <Link href={href}>{post.title}</Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-(--rc-premium-muted) dark:text-white/60">
          {text}
        </p>
      </div>
    </article>
  );
}
