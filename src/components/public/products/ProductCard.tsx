import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductCardProps = {
  product: Product;
  /**
   * "featured"  — Used on the homepage. Landscape image, Heading 3, spec line.
   * "catalog"   — Used on the product listing page. Square image, model code,
   *               Heading 4, 2-line truncated description.
   * @default "catalog"
   */
  variant?: "featured" | "catalog";
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Category badge rendered on top of the product image */
function CategoryBadge({ label }: { label: string }) {
  return (
    <span
      className="
        absolute top-2 left-2 z-10
        backdrop-blur-sm
        bg-white/70 border border-white/50
        rounded-pill
        px-2.5 py-0.5
        font-sans text-[12px] leading-[14px] text-content-heading
        whitespace-nowrap
      "
    >
      {label}
    </span>
  );
}

// ─── Featured variant ─────────────────────────────────────────────────────────
// Used in the homepage "Sản Phẩm Nổi Bật" 3-column row.
// 368px wide, landscape image (~16:9), H3 title, spec line, outline CTA.

function FeaturedCard({ product }: { product: Product }) {
  return (
    <article
      className="
        flex flex-col
        bg-white rounded-card shadow-card
        overflow-hidden
        h-full
      "
    >
      {/* Image */}
      <div className="relative mx-[25px] mt-[25px] aspect-[318/179] rounded-[8px] overflow-hidden bg-surface-hero shrink-0">
        <Image
          src={product.image}
          alt={product.imageAlt ?? product.name}
          fill
          className="object-cover object-center"
          sizes="(max-width: 1280px) 33vw, 368px"
        />
        <CategoryBadge label={product.category.name} />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-[25px] pt-[24px] pb-[25px] gap-3">
        {/* Title — H3 */}
        <h3
          className="
            font-heading font-semibold
            text-[20px] leading-[28px] tracking-[-0.01em]
            text-content-heading
            line-clamp-2
          "
        >
          {product.name}
        </h3>

        {/* Spec */}
        {product.spec && (
          <p className="font-sans text-[14px] leading-5 text-content-muted">
            {product.spec}
          </p>
        )}

        {/* Spacer pushes button to bottom */}
        <div className="flex-1" />

        {/* CTA */}
        <Link
          href={`/san-pham/${product.slug}`}
          className="
            mt-2
            inline-flex items-center justify-center w-full
            border border-brand text-brand
            font-sans text-[14px] leading-4 tracking-[0.05em]
            rounded-btn px-6 py-[13px]
            hover:bg-surface-card transition-colors
          "
        >
          Chi tiết
        </Link>
      </div>
    </article>
  );
}

// ─── Catalog variant ──────────────────────────────────────────────────────────
// Used on the /san-pham product listing page.
// 270px wide, square image, model code, H4 title, 2-line desc, border-top CTA.

function CatalogCard({ product }: { product: Product }) {
  return (
    <article
      className="
        flex flex-col
        bg-white rounded-card shadow-card
        overflow-hidden
        h-full
      "
    >
      {/* Image — square 1:1 */}
      <div className="relative mx-[25px] mt-[25px] aspect-square rounded-[8px] overflow-hidden bg-surface-hero shrink-0">
        <Image
          src={product.image}
          alt={product.imageAlt ?? product.name}
          fill
          className="object-cover object-center"
          sizes="(max-width: 1024px) 50vw, 270px"
        />
        <CategoryBadge label={product.category.name} />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-[25px] pt-[18px]">
        {/* Model code */}
        {product.model && (
          <p className="font-sans text-[12px] leading-[14px] text-content-muted mb-[18px]">
            Mẫu: {product.model}
          </p>
        )}

        {/* Title — H4 */}
        <h4
          className="
            font-heading font-semibold
            text-[16px] leading-[24px] tracking-[-0.01em]
            text-content-heading
            line-clamp-3
            mb-3
          "
        >
          {product.name}
        </h4>

        {/* Description */}
        {product.description && (
          <p
            className="
              font-sans text-[14px] leading-5
              text-content-body
              line-clamp-2
              mb-3
            "
          >
            {product.description}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Border-top divider + CTA */}
        <div className="border-t border-border-ui mt-3 pt-[17px] pb-[25px]">
          <Link
            href={`/san-pham/${product.slug}`}
            className="
              inline-flex items-center justify-center w-full
              border border-brand text-brand
              font-sans text-[14px] leading-4 tracking-[0.05em]
              rounded-btn px-6 py-[9px]
              hover:bg-surface-card transition-colors
            "
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────

export function ProductCard({ product, variant = "catalog" }: ProductCardProps) {
  if (variant === "featured") return <FeaturedCard product={product} />;
  return <CatalogCard product={product} />;
}
