import Image from "next/image";
import Link from "next/link";
import type { NewsArticle } from "@/types/news";

type NewsCardProps = {
  article: NewsArticle;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <article className="flex flex-col rounded-card bg-white shadow-card overflow-hidden h-full">
      {/* Thumbnail */}
      <Link
        href={`/tin-tuc/${article.slug}`}
        className="relative block aspect-[16/9] overflow-hidden bg-surface-hero shrink-0"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={article.image}
          alt={article.imageAlt ?? article.title}
          fill
          className="object-cover object-center transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 1280px) 50vw, 580px"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 pt-5 pb-6">
        {/* Category + date row */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-pill bg-surface-tag border border-border-tag px-[10px] py-[3px] font-sans text-[12px] leading-4 text-brand-dark whitespace-nowrap">
            {article.category}
          </span>
          <time
            dateTime={article.publishedAt}
            className="font-sans text-[12px] leading-4 text-content-muted whitespace-nowrap"
          >
            {formatDate(article.publishedAt)}
          </time>
        </div>

        {/* Title */}
        <h3 className="mb-3 font-heading font-semibold text-[18px] leading-[26px] tracking-[-0.01em] text-content-heading line-clamp-2">
          <Link href={`/tin-tuc/${article.slug}`} className="hover:text-brand transition-colors">
            {article.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="mb-4 font-sans text-[14px] leading-5 text-content-body line-clamp-2 flex-1">
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border-ui pt-4">
          <Link
            href={`/tin-tuc/${article.slug}`}
            className="font-sans text-[13px] leading-4 tracking-[0.04em] text-brand hover:underline transition-colors"
          >
            Đọc thêm
          </Link>
          {article.readingTime && (
            <span className="font-sans text-[12px] text-content-muted">
              {article.readingTime} phút đọc
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
