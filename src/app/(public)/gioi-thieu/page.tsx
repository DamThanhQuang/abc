import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { companyInfo } from "@/config/site";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: `${companyInfo.legalName} cung cấp thông tin về thiết bị và giải pháp cho trạm xăng dầu.`,
};

const solutionGroups = [
  {
    number: "01",
    title: "Đo bồn tự động",
    description: "Giải pháp theo dõi dữ liệu bồn chứa theo nhu cầu triển khai thực tế.",
  },
  {
    number: "02",
    title: "Thiết bị trạm xăng dầu",
    description: "Danh mục thiết bị phục vụ hoạt động tại trạm xăng dầu.",
  },
  {
    number: "03",
    title: "Phần mềm quản lý",
    description: "Công cụ hỗ trợ quản lý thông tin vận hành tại trạm.",
  },
];

export default function GioiThieuPage() {
  return (
    <>
      <PageHero
        title="Về Ánh Sáng Toàn Cầu"
        subtitle="Thông tin doanh nghiệp và các nhóm giải pháp đang được giới thiệu"
        breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Giới thiệu" }]}
      />

      <main>
        <section className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-brand">
                Giới thiệu
              </p>
              <h2 className="mt-3 font-heading text-[28px] font-semibold leading-[38px] text-content-heading sm:text-[34px] sm:leading-[44px]">
                {companyInfo.legalName}
              </h2>
              <p className="mt-5 font-sans text-[15px] leading-7 text-content-body lg:text-[16px]">
                Ánh Sáng Toàn Cầu giới thiệu các sản phẩm và giải pháp phục vụ
                trạm xăng dầu. Nội dung trên website tập trung vào đo bồn tự động,
                thiết bị tại trạm và phần mềm quản lý.
              </p>
              <p className="mt-3 font-sans text-[14px] leading-6 text-content-muted">
                Thông số kỹ thuật, khả năng tương thích và phạm vi triển khai được
                xác nhận theo từng sản phẩm và nhu cầu cụ thể.
              </p>
            </div>

            <div className="rounded-[20px] border border-border-ui bg-surface-card p-6 sm:p-8 lg:col-span-6">
              <h2 className="font-heading text-[20px] font-semibold text-content-heading">
                Thông tin pháp lý
              </h2>
              <dl className="mt-5 divide-y divide-border-ui">
                <InfoRow label="Tên giao dịch" value={companyInfo.brandName} />
                <InfoRow label="Mã số thuế" value={companyInfo.taxCode} />
                <InfoRow label="Địa chỉ" value={companyInfo.address} />
                <InfoRow
                  label="Email nhận hóa đơn"
                  value={companyInfo.invoiceEmail}
                  href={`mailto:${companyInfo.invoiceEmail}`}
                />
              </dl>
            </div>
          </div>
        </section>

        <section className="bg-surface-card py-12 lg:py-20" aria-labelledby="solution-groups-heading">
          <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16">
            <div className="max-w-2xl">
              <h2
                id="solution-groups-heading"
                className="font-heading text-[26px] font-semibold leading-9 text-content-heading sm:text-[32px] sm:leading-10"
              >
                Nhóm giải pháp
              </h2>
              <p className="mt-2 font-sans text-[14px] leading-6 text-content-muted lg:text-[16px]">
                Các nội dung chính được công bố trên website.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {solutionGroups.map((item) => (
                <article key={item.number} className="rounded-card border border-border-ui bg-white p-6 shadow-card">
                  <span className="font-mono text-[13px] font-bold text-brand">{item.number}</span>
                  <h3 className="mt-5 font-heading text-[19px] font-semibold text-content-heading">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-sans text-[14px] leading-6 text-content-body">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-brand-gradient py-12 lg:py-16">
          <div className="mx-auto flex max-w-content flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-16">
            <div>
              <h2 className="font-heading text-[26px] font-semibold leading-9 text-white sm:text-[30px]">
                Cần trao đổi về sản phẩm?
              </h2>
              <p className="mt-2 font-sans text-[14px] leading-6 text-white/75">
                Liên hệ qua Zalo để gửi nhu cầu và nhận thông tin phù hợp.
              </p>
            </div>
            <Link
              href="/lien-he"
              className="inline-flex shrink-0 items-center justify-center rounded-btn bg-white px-6 py-3 font-sans text-[14px] font-semibold text-brand transition-colors hover:bg-surface-card"
            >
              Liên hệ qua Zalo
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

function InfoRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[140px_1fr] sm:gap-4">
      <dt className="font-sans text-[12px] font-semibold uppercase tracking-[0.06em] text-content-muted">
        {label}
      </dt>
      <dd className="font-sans text-[14px] leading-6 text-content-heading">
        {href ? (
          <a href={href} className="font-medium text-brand-dark hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
