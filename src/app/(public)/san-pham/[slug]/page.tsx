import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/public/products/ProductGallery";
import { RelatedProducts } from "@/components/public/products/RelatedProducts";
import { PageHero } from "@/components/shared/PageHero";
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
      <PageHero
        title={product.name}
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Sản phẩm", href: "/san-pham" },
          { label: product.name },
        ]}
      />

      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16 py-8 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          <div className="lg:col-span-7">
            <ProductGallery
              images={productImages.length > 0 ? productImages : [PRODUCT_IMAGE_PLACEHOLDER]}
              name={product.name}
              imageAlt={product.imageAlt}
            />
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="flex flex-col gap-5 lg:gap-6 rounded-card bg-white p-5 lg:p-7 shadow-card border border-border-ui/40">
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

              <h1 className="font-heading font-bold text-[22px] sm:text-[26px] lg:text-[28px] leading-[30px] sm:leading-[34px] lg:leading-[36px] tracking-[-0.01em] text-content-heading">
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
                  href="/lien-he"
                  className="inline-flex items-center justify-center bg-brand text-white rounded-btn px-6 py-[13px] font-sans text-[14px] leading-4 tracking-[0.05em] shadow-btn hover:bg-brand/90 transition-colors"
                >
                  Yêu cầu báo giá
                </Link>
                <Link
                  href="/san-pham"
                  className="inline-flex items-center justify-center border border-brand text-brand rounded-btn px-6 py-[13px] font-sans text-[14px] leading-4 tracking-[0.05em] hover:bg-surface-card transition-colors"
                >
                  Xem tất cả sản phẩm
                </Link>
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
                    <tr key={spec.label} className={i % 2 === 0 ? "bg-white" : "bg-surface-card"}>
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

        <RelatedProducts productId={product.id} categoryId={product.categoryId} />
      </div>
    </>
  );
}
