import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Pagination } from "@/components/shared/Pagination";
import { NewsCard } from "@/components/public/news/NewsCard";
import { getNewsArticlesByPage } from "@/lib/api/news";

export const metadata: Metadata = {
  title: "Tin tức",
  description: "Tin tức về sản phẩm và giải pháp trạm xăng dầu từ Ánh Sáng Toàn Cầu.",
  alternates: { canonical: "/tin-tuc" },
};

type SearchParams = Promise<{ page?: string }>;

export default async function TinTucPage({ searchParams }: { searchParams: SearchParams }) {
  const { page: pageStr } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageStr ?? "1", 10));

  const { articles, totalPages } = await getNewsArticlesByPage(currentPage);

  function getPageHref(p: number) {
    return p > 1 ? `/tin-tuc?page=${p}` : "/tin-tuc";
  }

  return (
    <>
      <PageHero
        title="Tin Tức & Sự Kiện"
        subtitle="Cập nhật mới nhất về sản phẩm, dự án và xu hướng ngành nhiên liệu công nghiệp"
        breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Tin tức" }]}
      />

      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16 py-8 lg:py-16">
        {/* 1 col mobile → 2 col sm+ */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-center font-sans text-[15px] text-content-muted py-20">
            Chưa có bài viết nào.
          </p>
        )}

        {totalPages > 1 && (
          <div className="mt-10 lg:mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              getPageHref={getPageHref}
            />
          </div>
        )}
      </div>
    </>
  );
}
