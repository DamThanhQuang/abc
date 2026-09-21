import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { Pagination } from "@/components/shared/Pagination";
import { ProductCard } from "@/components/public/products/ProductCard";
import { ProductFilters } from "@/components/public/products/ProductFilters";
import { ProductSortBar } from "@/components/public/products/ProductSortBar";
import { getProductsByPage } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";

export const metadata: Metadata = {
  title: "Danh mục sản phẩm",
  description: "Danh mục thiết bị và giải pháp trạm xăng dầu của Ánh Sáng Toàn Cầu.",
  alternates: { canonical: "/san-pham" },
};

type SearchParams = Promise<{
  category?: string;
  page?: string;
  search?: string;
  sort?: string;
}>;

export default async function SanPhamPage({ searchParams }: { searchParams: SearchParams }) {
  const { category, page: pageStr, search, sort } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageStr ?? "1", 10));

  const { products, total, totalPages } = await getProductsByPage(currentPage, {
    categorySlug: category,
    search,
    sort,
  });
  const categories = await getCategories();

  function getPageHref(p: number) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search)   params.set("search", search);
    if (sort)     params.set("sort", sort);
    if (p > 1)    params.set("page", String(p));
    const qs = params.toString();
    return `/san-pham${qs ? `?${qs}` : ""}`;
  }

  return (
    <>
      <PageHero
        title="Danh Mục Sản Phẩm"
        subtitle="Thiết bị hệ thống nhiên liệu công nghiệp chính xác, bền vững"
        breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Sản phẩm" }]}
      />

      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-[18px] items-start">

          {/* Filters sidebar / mobile toggle */}
          <Suspense fallback={<div className="lg:w-[270px] lg:shrink-0" />}>
            <ProductFilters categories={categories} />
          </Suspense>

          {/* Product grid */}
          <div className="flex-1 min-w-0 flex flex-col w-full">

            {/* SortBar is "use client" (reads searchParams) — needs Suspense */}
            <Suspense fallback={<div className="min-h-[52px] lg:h-[62px] rounded-t-[8px] border border-border-ui bg-white" />}>
              <ProductSortBar showing={products.length} total={total} />
            </Suspense>

            {products.length > 0 ? (
              <div className="border border-t-0 border-border-ui rounded-b-[8px] p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} variant="catalog" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="border border-t-0 border-border-ui rounded-b-[8px] p-8 sm:p-12 text-center">
                <p className="font-sans text-[15px] text-content-muted">
                  Không tìm thấy sản phẩm phù hợp.
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 lg:mt-10">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  getPageHref={getPageHref}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
