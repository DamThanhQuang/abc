import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/PageHero";
import { NewsCard } from "@/components/public/news/NewsCard";
import { getNewsArticleBySlug, getNewsArticles } from "@/lib/api/news";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);
  if (!article) return { title: "Bai viet khong ton tai" };
  return {
    title: `${article.title} | FuelPrecision`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.image ? [{ url: article.image }] : undefined,
      type: "article",
      publishedTime: article.publishedAt ?? undefined,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);
  if (!article) notFound();

  const allArticles = await getNewsArticles();
  const related = allArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.publishedAt,
    author: { "@type": "Organization", name: "FuelPrecision Industrial" },
    publisher: { "@type": "Organization", name: "FuelPrecision Industrial" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        title={article.title}
        breadcrumbs={[
          { label: "Trang chu", href: "/" },
          { label: "Tin tuc", href: "/tin-tuc" },
          { label: article.category },
        ]}
      />

      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Article content */}
          <article className="lg:col-span-8 min-w-0">
            {/* Meta */}
            <div className="mb-5 lg:mb-6 flex flex-wrap items-center gap-3 border-b border-border-ui pb-5 lg:pb-6">
              <span className="rounded-pill bg-surface-tag border border-border-tag px-[10px] py-[3px] font-sans text-[12px] leading-4 text-brand-dark">
                {article.category}
              </span>
              <time dateTime={article.publishedAt} className="font-sans text-[13px] text-content-muted">
                {formatDate(article.publishedAt)}
              </time>
              {article.readingTime && (
                <span className="font-sans text-[13px] text-content-muted">
                  {article.readingTime} phut doc
                </span>
              )}
            </div>

            {/* Hero image */}
            <div className="relative mb-6 lg:mb-8 aspect-[16/9] overflow-hidden rounded-card bg-surface-hero">
              <Image
                src={article.image}
                alt={article.imageAlt ?? article.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 760px"
                preload
              />
            </div>

            {/* Lead */}
            <p className="mb-5 lg:mb-6 font-sans text-[15px] lg:text-[17px] leading-7 text-content-body font-medium">
              {article.excerpt}
            </p>

            {/* Body — render content if available, otherwise placeholder */}
            {article.content ? (
              <div
                className="prose prose-sm lg:prose-base max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <div className="space-y-4">
                <p className="font-sans text-[14px] lg:text-[15px] leading-7 text-content-body">
                  Trong boi canh nganh cong nghiep nhien lieu ngay cang dat ra nhung yeu cau khat khe
                  hon ve hieu suat, do chinh xac va do tin cay, FuelPrecision Industrial tiep tuc
                  khang dinh vi the tien phong voi nhung giai phap ky thuat tien tien nhat.
                </p>
                <p className="font-sans text-[14px] lg:text-[15px] leading-7 text-content-body">
                  Doi ngu ky su cua chung toi da danh nhieu nam nghien cuu va phat trien de mang
                  den nhung thiet bi khong chi dap ung cac tieu chuan quoc te hien hanh ma con
                  vuot xa ky vong cua khach hang trong moi truong van hanh thuc te.
                </p>
              </div>
            )}

            {/* Back link */}
            <div className="mt-8 lg:mt-10 border-t border-border-ui pt-6 lg:pt-8">
              <Link
                href="/tin-tuc"
                className="inline-flex items-center gap-2 font-sans text-[14px] text-brand hover:underline transition-colors"
              >
                <svg width="7" height="11" viewBox="0 0 7 11" fill="none" aria-hidden="true">
                  <path d="M6 1L1 5.5 6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Quay lai danh sach tin tuc
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 flex flex-col gap-5 lg:gap-0">
              <h2 className="mb-4 lg:mb-5 font-heading font-semibold text-[17px] lg:text-[18px] text-content-heading">
                Bai viet lien quan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-5">
                {related.length > 0 ? (
                  related.map((a) => <NewsCard key={a.id} article={a} />)
                ) : (
                  <p className="font-sans text-[14px] text-content-muted">
                    Chua co bai viet lien quan.
                  </p>
                )}
              </div>

              {/* CTA box */}
              <div className="mt-6 lg:mt-8 rounded-card bg-surface-card p-5 lg:p-6">
                <h3 className="mb-2 font-heading font-semibold text-[15px] lg:text-[16px] text-content-heading">
                  Can tu van san pham?
                </h3>
                <p className="mb-4 font-sans text-[13px] leading-5 text-content-body">
                  Doi ngu ky thuat cua chung toi san sang ho tro ban.
                </p>
                <Link
                  href="/lien-he"
                  className="inline-flex w-full items-center justify-center bg-brand text-white rounded-btn px-4 py-[10px] font-sans text-[13px] leading-4 tracking-[0.05em] hover:bg-brand/90 transition-colors"
                >
                  Lien he ngay
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
