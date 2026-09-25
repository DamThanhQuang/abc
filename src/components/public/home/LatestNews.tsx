import Link from "next/link";
import { NewsCard } from "@/components/public/news/NewsCard";
import type { NewsArticle } from "@/types/news";

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M1.5 6.5h10M7.5 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LatestNews({ articles }: { articles: NewsArticle[] }) {
  // Chưa có bài nào thì bỏ hẳn khối, không để một khối trống trên trang chủ.
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="latest-news-heading" className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-16 lg:py-20">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
        <div className="max-w-2xl">
          <p className="font-sans text-[16px] font-semibold uppercase leading-6 tracking-[0.1em] text-brand sm:text-[18px]">
            Tin tức
          </p>
          <h2
            id="latest-news-heading"
            className="mt-3 font-heading text-[24px] font-semibold leading-[32px] tracking-[-0.01em] text-content-heading sm:text-[28px] sm:leading-[36px] lg:text-[32px] lg:leading-[40px]"
          >
            Cập nhật mới nhất
          </h2>
        </div>
        <Link
          href="/tin-tuc"
          className="inline-flex shrink-0 items-center gap-2 font-sans text-[14px] font-medium tracking-[0.03em] text-brand-dark hover:underline"
        >
          Xem tất cả tin tức
          <ArrowIcon />
        </Link>
      </div>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <li key={article.id}>
            <NewsCard article={article} />
          </li>
        ))}
      </ul>
    </section>
  );
}
