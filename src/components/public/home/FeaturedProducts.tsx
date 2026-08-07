import Link from "next/link";
import { ProductCard } from "@/components/public/products/ProductCard";
import type { Product } from "@/types/product";

type FeaturedProductsProps = {
  products: Product[];
};

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section
      aria-labelledby="featured-heading"
      className="mx-auto max-w-content px-4 sm:px-6 lg:px-16 py-12 lg:py-20"
    >
      <div className="mb-8 lg:mb-12">
        <h2
          id="featured-heading"
          className="
            font-heading font-semibold
            text-[24px] sm:text-[28px] lg:text-[32px]
            leading-[32px] sm:leading-[36px] lg:leading-[40px]
            tracking-[-0.01em] text-content-heading
          "
        >
          Sản Phẩm Nổi Bật
        </h2>
        <p className="mt-2 font-sans text-[14px] lg:text-[16px] leading-6 text-content-muted">
          Các thiết bị kỹ thuật chính xác cho hệ thống nhiên liệu hiện đại.
        </p>
      </div>

      {/* 1 col mobile → 2 col tablet → 3 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant="featured" />
        ))}
      </div>

      {/* View all link */}
      <div className="mt-8 text-center">
        <Link
          href="/san-pham"
          className="font-sans text-[14px] leading-5 text-brand-dark hover:underline transition-colors"
        >
          Xem tất cả sản phẩm →
        </Link>
      </div>
    </section>
  );
}
