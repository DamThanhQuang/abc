import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/public/products/ProductGallery";
import { RelatedProducts } from "@/components/public/products/RelatedProducts";
import { getProductBySlug } from "@/lib/api/products";
import { normalizeProductImages, PRODUCT_IMAGE_PLACEHOLDER } from "@/lib/product-images";
import { jsonLdScript } from "@/lib/sanitize";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "San pham khong ton tai" };
  const productImages = normalizeProductImages(product.images, product.image);
  return {
    title: product.name,
    description: product.description ?? `${product.name} — sản phẩm của Ánh Sáng Toàn Cầu`,
    openGraph: {
      title: product.name,
      description: product.description ?? `${product.name} — sản phẩm của Ánh Sáng Toàn Cầu`,
      images: productImages.map((url) => ({ url })),
      type: "website",
    },
  };
}

function RelatedProductsSkeleton() {
  return (
    <section className="mt-12 lg:mt-20 border-t border-border-ui pt-10 lg:pt-14">
      <div className="mb-6 lg:mb-8 h-8 w-56 rounded bg-surface-card animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-card bg-white border border-border-ui shadow-card overflow-hidden">
            <div className="aspect-[4/3] bg-surface-card animate-pulse" />
            <div className="p-5 flex flex-col gap-3">
              <div className="h-3 w-16 rounded bg-surface-card animate-pulse" />
              <div className="h-5 w-3/4 rounded bg-surface-card animate-pulse" />
              <div className="h-3 w-2/3 rounded bg-surface-card animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const productImages = normalizeProductImages(product.images, product.image);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: productImages,
    brand: { "@type": "Brand", name: "Ánh Sáng Toàn Cầu" },
    ...(product.model && { model: product.model }),
    category: product.category.name,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <div className="border-b border-border-ui/60 bg-white">
        <nav
          aria-label="Điều hướng trang sản phẩm"
          className="mx-auto max-w-content px-4 py-4 sm:px-6 lg:px-16"
        >
          <ol className="flex min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap font-sans text-[13px] leading-5 text-content-muted">
            <li className="shrink-0">
              <Link href="/" className="transition-colors hover:text-brand-dark">
                Trang chủ
              </Link>
            </li>
            <li aria-hidden="true" className="text-border-ui">/</li>
            <li className="shrink-0">
              <Link
                href="/san-pham"
                className="transition-colors hover:text-brand-dark"
              >
                Sản phẩm
              </Link>
            </li>
            <li aria-hidden="true" className="text-border-ui">/</li>
            <li className="truncate font-medium text-content-heading" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-16 lg:py-12">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">

          <div className="order-2 min-w-0 lg:order-1 lg:col-span-7">
            <ProductGallery
              images={productImages.length > 0 ? productImages : [PRODUCT_IMAGE_PLACEHOLDER]}
              name={product.name}
              imageAlt={product.imageAlt}
            />
          </div>

          <div className="order-1 min-w-0 lg:order-2 lg:col-span-5 lg:sticky lg:top-24">
            <div className="flex flex-col gap-5 rounded-card border border-border-ui/50 bg-white p-5 shadow-card sm:p-6 lg:gap-6 lg:p-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-pill bg-surface-tag border border-border-tag px-[10px] py-[3px] font-sans text-[12px] leading-4 text-brand-dark">
                  {product.category.name}
                </span>
                {product.model && (
                  <span className="font-sans text-[13px] text-content-muted tracking-wide">
                    Mã SP: {product.model}
                  </span>
                )}
              </div>

              <h1 className="break-words font-heading text-[22px] font-bold leading-[30px] tracking-[-0.01em] text-content-heading sm:text-[26px] sm:leading-[34px] lg:text-[28px] lg:leading-[36px]">
                {product.name}
              </h1>

              {product.spec && (
                <p className="font-sans text-[15px] font-semibold text-brand">
                  {product.spec}
                </p>
              )}

              {product.description && (
                <p className="font-sans text-[14px] leading-6 text-content-body border-t border-border-ui/60 pt-4">
                  {product.description}
                </p>
              )}

              {product.features && product.features.length > 0 && (
                <div className="border-t border-border-ui/60 pt-4">
                  <h2 className="mb-3 font-heading font-semibold text-[15px] text-content-heading">
                    Tính năng nổi bật
                  </h2>
                  <ul className="flex flex-col gap-2">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <circle cx="8" cy="8" r="7" stroke="#0f4c81" strokeWidth="1.4" />
                          <path d="M5 8l2.5 2.5 4-4" stroke="#0f4c81" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="font-sans text-[14px] leading-5 text-content-body">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2 border-t border-border-ui/60">
                <Link
                  href={`/lien-he?san-pham=${encodeURIComponent(product.name)}`}
                  className="inline-flex items-center justify-center rounded-btn bg-brand px-6 py-[13px] font-sans text-[14px] font-semibold leading-4 tracking-[0.03em] text-white shadow-btn transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  Nhận báo giá sản phẩm
                </Link>
                <Link
                  href="/san-pham"
                  className="inline-flex items-center justify-center gap-2 py-1 font-sans text-[13px] font-medium leading-5 text-brand-dark transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <span aria-hidden="true">←</span>
                  Quay lại danh mục sản phẩm
                </Link>
                <p className="text-center font-sans text-[12px] leading-5 text-content-muted">
                  Thông số và phạm vi triển khai được xác nhận theo nhu cầu thực tế.
                </p>
              </div>
            </div>
          </div>
        </div>

        {product.technicalSpecs && product.technicalSpecs.length > 0 && (
          <div className="mt-10 lg:mt-16">
            <h2 className="mb-5 lg:mb-6 font-heading font-semibold text-[20px] lg:text-[24px] leading-8 text-content-heading">
              Thông số kỹ thuật
            </h2>
            <div className="overflow-x-auto rounded-card border border-border-ui">
              <table className="w-full min-w-[400px]">
                <tbody>
                  {product.technicalSpecs.map((spec, i) => (
                    <tr
                      key={spec.label}
                      className={`${i % 2 === 0 ? "bg-white" : "bg-surface-card"} [&:last-child>td]:border-b-0`}
                    >
                      <td className="border-b border-border-ui px-4 lg:px-6 py-3 lg:py-3.5 w-2/5 font-sans text-[13px] lg:text-[14px] font-medium text-content-heading">
                        {spec.label}
                      </td>
                      <td className="border-b border-border-ui px-4 lg:px-6 py-3 lg:py-3.5 font-sans text-[13px] lg:text-[14px] text-content-body">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts productId={product.id} categoryId={product.categoryId} />
        </Suspense>
      </div>
    </>
  );
}
