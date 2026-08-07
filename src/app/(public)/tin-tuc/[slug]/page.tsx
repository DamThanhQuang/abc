import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/PageHero";
import { NewsCard } from "@/components/public/news/NewsCard";
import { getNewsArticleBySlug, NEWS_ARTICLES } from "@/lib/api/news";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return NEWS_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsArticleBySlug(slug);
  if (!article) return { title: "Bài viết không tồn tại" };
  return {
    title: `${article.title} | FuelPrecision`,
    description: article.excerpt,
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
  const article = getNewsArticleBySlug(slug);
  if (!article) notFound();

  const related = NEWS_ARTICLES.filter(
    (a) => a.id !== article.id && a.category === article.category,
  ).slice(0, 2);

  return (
    <>
      <PageHero
        title={article.title}
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Tin tức", href: "/tin-tuc" },
          { label: article.category },
        ]}
      />

      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16 py-8 lg:py-16">
        {/*
          Mobile:  single column — article then sidebar below
          Desktop: 8 + 4 column grid
        */}
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
                  {article.readingTime} phút đọc
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

            {/* Body */}
            <div className="space-y-4">
              <p className="font-sans text-[14px] lg:text-[15px] leading-7 text-content-body">
                Trong bối cảnh ngành công nghiệp nhiên liệu ngày càng đặt ra những yêu cầu khắt khe
                hơn về hiệu suất, độ chính xác và độ tin cậy, FuelPrecision Industrial tiếp tục
                khẳng định vị thế tiên phong với những giải pháp kỹ thuật tiên tiến nhất.
              </p>
              <p className="font-sans text-[14px] lg:text-[15px] leading-7 text-content-body">
                Đội ngũ kỹ sư của chúng tôi đã dành nhiều năm nghiên cứu và phát triển để mang
                đến những thiết bị không chỉ đáp ứng các tiêu chuẩn quốc tế hiện hành mà còn
                vượt xa kỳ vọng của khách hàng trong môi trường vận hành thực tế.
              </p>
              <h2 className="font-heading font-semibold text-[18px] lg:text-[22px] leading-8 text-content-heading mt-6 lg:mt-8 mb-2 lg:mb-3">
                Ứng dụng thực tiễn
              </h2>
              <p className="font-sans text-[14px] lg:text-[15px] leading-7 text-content-body">
                Từ các trạm xăng thương mại đến hệ thống phân phối nhiên liệu quy mô lớn tại cảng
                biển và nhà máy công nghiệp, giải pháp của chúng tôi đã được triển khai thành công
                tại hơn 50 quốc gia trên thế giới.
              </p>
              <p className="font-sans text-[14px] lg:text-[15px] leading-7 text-content-body">
                Mỗi dự án đều được theo dõi chặt chẽ bởi đội ngũ kỹ thuật giàu kinh nghiệm, đảm
                bảo rằng mọi thiết bị hoạt động đúng thông số kỹ thuật ngay từ ngày đầu tiên.
              </p>
            </div>

            {/* Back link */}
            <div className="mt-8 lg:mt-10 border-t border-border-ui pt-6 lg:pt-8">
              <Link
                href="/tin-tuc"
                className="inline-flex items-center gap-2 font-sans text-[14px] text-brand hover:underline transition-colors"
              >
                <svg width="7" height="11" viewBox="0 0 7 11" fill="none" aria-hidden="true">
                  <path d="M6 1L1 5.5 6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Quay lại danh sách tin tức
              </Link>
            </div>
          </article>

          {/* Sidebar — below article on mobile, sticky on lg */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 flex flex-col gap-5 lg:gap-0">
              <h2 className="mb-4 lg:mb-5 font-heading font-semibold text-[17px] lg:text-[18px] text-content-heading">
                Bài viết liên quan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-5">
                {related.length > 0 ? (
                  related.map((a) => <NewsCard key={a.id} article={a} />)
                ) : (
                  <p className="font-sans text-[14px] text-content-muted">
                    Chưa có bài viết liên quan.
                  </p>
                )}
              </div>

              {/* CTA box */}
              <div className="mt-6 lg:mt-8 rounded-card bg-surface-card p-5 lg:p-6">
                <h3 className="mb-2 font-heading font-semibold text-[15px] lg:text-[16px] text-content-heading">
                  Cần tư vấn sản phẩm?
                </h3>
                <p className="mb-4 font-sans text-[13px] leading-5 text-content-body">
                  Đội ngũ kỹ thuật của chúng tôi sẵn sàng hỗ trợ bạn.
                </p>
                <Link
                  href="/lien-he"
                  className="inline-flex w-full items-center justify-center bg-brand text-white rounded-btn px-4 py-[10px] font-sans text-[13px] leading-4 tracking-[0.05em] hover:bg-brand/90 transition-colors"
                >
                  Liên hệ ngay
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
