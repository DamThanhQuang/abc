import Image from "next/image";
import Link from "next/link";
import {
  getCategoriesWithProductCount,
  type CategoryWithProductCount,
} from "@/lib/api/categories";

function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      <path
        d="M1 5.5h9M6 1l4.5 4.5L6 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Icon mặc định cho danh mục chưa có ảnh riêng (Category.image còn trống).
function CategoryIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="7.5" height="7.5" rx="1.8" stroke="currentColor" strokeWidth="1.6" />
      <rect x="12" y="2.5" width="7.5" height="7.5" rx="1.8" stroke="currentColor" strokeWidth="1.6" />
      <rect x="2.5" y="12" width="7.5" height="7.5" rx="1.8" stroke="currentColor" strokeWidth="1.6" />
      <rect x="12" y="12" width="7.5" height="7.5" rx="1.8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

// Trang chủ chỉ giới thiệu một phần; phần còn lại xem ở /san-pham.
const HOME_CATEGORY_LIMIT = 9;

function CategoryCard({ category }: { category: CategoryWithProductCount }) {
  return (
    <li>
      <Link
        href={`/san-pham?category=${encodeURIComponent(category.slug)}`}
        className="group flex h-full flex-col overflow-hidden rounded-card border border-border-ui/60 bg-white transition-colors hover:border-brand/50 hover:bg-surface-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {/* Vùng ảnh giữ nguyên chiều cao kể cả khi danh mục chưa có ảnh, để
            lưới không bị so le giữa thẻ có ảnh và thẻ chưa có. */}
        <span
          aria-hidden="true"
          className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden bg-surface-card text-brand"
        >
          {category.image ? (
            <Image
              src={category.image}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <CategoryIcon />
          )}
        </span>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1.5">
            <h3 className="font-heading text-[17px] font-semibold leading-6 text-content-heading">
              {category.name}
            </h3>
            {category.productCount > 0 ? (
              <span className="rounded-pill border border-border-tag bg-surface-tag px-2 py-0.5 font-sans text-[11px] leading-4 tabular-nums text-brand-dark">
                {category.productCount}
              </span>
            ) : null}
          </div>

          {category.description ? (
            <p className="mt-2 font-sans text-[13px] leading-5 text-content-body line-clamp-2">
              {category.description}
            </p>
          ) : null}

          <span className="mt-4 inline-flex items-center gap-1 pt-1 font-sans text-[13px] leading-5 tracking-[0.05em] text-brand-dark group-hover:underline">
            Xem sản phẩm
            <ArrowIcon />
          </span>
        </div>
      </Link>
    </li>
  );
}

export async function ProductLineup() {
  const categories = await getCategoriesWithProductCount();
  const visibleCategories = categories.slice(0, HOME_CATEGORY_LIMIT);
  const hiddenCount = categories.length - visibleCategories.length;

  return (
    <section
      id="thiet-bi"
      aria-labelledby="lineup-heading"
      className="bg-white"
    >
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-16 lg:py-20">
        <header className="max-w-2xl">
          <p className="font-sans text-[13px] uppercase leading-5 tracking-[0.12em] text-brand">
            Giới thiệu
          </p>
          <h2
            id="lineup-heading"
            className="mt-3 font-heading text-[24px] font-semibold leading-[32px] tracking-[-0.01em] text-content-heading sm:text-[28px] sm:leading-[36px] lg:text-[32px] lg:leading-[40px]"
          >
            Thiết bị và phần mềm cho trạm xăng dầu
          </h2>
          <p className="mt-4 font-sans text-[15px] leading-6 text-content-body lg:text-[16px]">
            Các nhóm sản phẩm đang được giới thiệu. Chọn một danh mục để xem
            toàn bộ sản phẩm thuộc nhóm đó. Thông số kỹ thuật và phạm vi triển
            khai được xác nhận theo từng dự án.
          </p>
        </header>

        {visibleCategories.length > 0 ? (
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </ul>
        ) : (
          <p className="mt-10 font-sans text-[14px] leading-6 text-content-muted">
            Danh mục sản phẩm đang được cập nhật.
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          {hiddenCount > 0 ? (
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-1 font-sans text-[14px] font-medium leading-4 tracking-[0.05em] text-brand-dark transition-colors hover:underline"
            >
              Xem tất cả {categories.length} danh mục
              <ArrowIcon />
            </Link>
          ) : null}
          <Link
            href="/lien-he"
            className="inline-flex items-center gap-1 font-sans text-[14px] leading-4 tracking-[0.05em] text-content-body transition-colors hover:underline"
          >
            Liên hệ tư vấn cấu hình
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
