import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import { CopyPhoneButton } from "@/components/public/contact/CopyPhoneButton";
import { PageHero } from "@/components/shared/PageHero";
import { companyInfo } from "@/config/site";

export const metadata: Metadata = {
  title: "Liên Hệ | Ánh Sáng Toàn Cầu",
  description: "Liên hệ Ánh Sáng Toàn Cầu qua Zalo để trao đổi nhu cầu về thiết bị và giải pháp trạm xăng dầu.",
};

type Props = {
  searchParams: Promise<{ "san-pham"?: string | string[] }>;
};

function ZaloIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5.5 4.5h13a3 3 0 0 1 3 3v7.5a3 3 0 0 1-3 3H11l-4.5 3v-3h-1a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M7 9h4l-4 5h4M13 14V9h2.5a2.5 2.5 0 0 1 0 5H13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 5.5V10l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function LienHePage({ searchParams }: Props) {
  const params = await searchParams;
  const productParam = Array.isArray(params["san-pham"])
    ? params["san-pham"][0]
    : params["san-pham"];
  const productName = productParam?.trim().slice(0, 200) ?? "";
  const rawZaloId = process.env.NEXT_PUBLIC_ZALO_ID?.trim() ?? "";
  const zaloId = rawZaloId.replace(/\D/g, "");
  const displayPhone = process.env.NEXT_PUBLIC_PHONE_DISPLAY?.trim() || rawZaloId;
  const hasZaloContact = Boolean(zaloId && displayPhone);
  const hasQr = existsSync(join(process.cwd(), "public", "images", "zalo-qr.png"));

  return (
    <>
      <PageHero
        title="Liên hệ qua Zalo"
        subtitle="Quét mã QR hoặc mở Zalo để trao đổi nhu cầu về thiết bị và giải pháp trạm xăng dầu"
        breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Liên hệ" }]}
      />

      <main className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-16 lg:py-16">
        <section
          aria-labelledby="zalo-contact-heading"
          className="mx-auto max-w-4xl overflow-hidden rounded-[24px] border border-border-ui bg-white shadow-card"
        >
          <div className="grid lg:grid-cols-[300px_1fr]">
            <div className="flex min-h-[300px] items-center justify-center bg-surface-card p-8">
              {hasQr ? (
                <div className="rounded-2xl bg-white p-3 shadow-card">
                  <Image
                    src="/images/zalo-qr.png"
                    alt="Mã QR Zalo của Ánh Sáng Toàn Cầu"
                    width={180}
                    height={180}
                    className="h-[180px] w-[180px] object-contain"
                    priority
                  />
                </div>
              ) : (
                <div className="flex h-[206px] w-[206px] items-center justify-center rounded-2xl border border-dashed border-border-ui bg-white p-6 text-center">
                  <p className="font-sans text-[13px] leading-5 text-content-muted">
                    Mã QR Zalo đang được cập nhật
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0068ff]/10 text-[#0068ff]">
                <ZaloIcon />
              </span>
              <h2
                id="zalo-contact-heading"
                className="font-heading text-[26px] font-semibold leading-9 text-content-heading sm:text-[30px]"
              >
                Liên hệ với chúng tôi
              </h2>
              <p className="mt-3 max-w-xl font-sans text-[14px] leading-6 text-content-body sm:text-[15px]">
                Sử dụng Zalo để trao đổi thông tin sản phẩm và nhu cầu tư vấn.
                Bạn có thể quét mã QR, mở liên kết hoặc sao chép số để tìm trên Zalo.
              </p>

              {productName ? (
                <div className="mt-5 rounded-xl border border-border-tag bg-surface-tag px-4 py-3">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-content-muted">
                    Sản phẩm đang quan tâm
                  </p>
                  <p className="mt-1 font-heading text-[15px] font-semibold leading-6 text-content-heading">
                    {productName}
                  </p>
                </div>
              ) : null}

              {hasZaloContact ? (
                <>
                  <div className="mt-6 rounded-xl border border-border-ui bg-surface-card p-4">
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-content-muted">
                      Số điện thoại / Zalo
                    </p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                      <p className="font-heading text-[20px] font-semibold text-content-heading">
                        {displayPhone}
                      </p>
                      <CopyPhoneButton value={displayPhone} />
                    </div>
                  </div>

                  <a
                    href={`https://zalo.me/${zaloId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-btn bg-[#0068ff] px-6 py-3.5 font-sans text-[14px] font-semibold text-white shadow-btn transition-colors hover:bg-[#0057d9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068ff]/40"
                  >
                    <ZaloIcon />
                    {productName ? "Nhắn Zalo về sản phẩm" : "Nhắn Zalo"}
                  </a>
                </>
              ) : (
                <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 font-sans text-[13px] leading-5 text-amber-800">
                  Kênh Zalo đang được cập nhật.
                </p>
              )}

              <div className="mt-5 flex items-start gap-3 border-t border-border-ui pt-5 text-content-muted">
                <span className="mt-0.5 shrink-0 text-brand-dark"><ClockIcon /></span>
                <p className="font-sans text-[13px] leading-5 sm:text-[14px]">
                  Phản hồi trong giờ hành chính, Thứ 2–Thứ 7, 8:00–17:30.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="company-information-heading"
          className="mx-auto mt-8 max-w-4xl rounded-[24px] border border-border-ui bg-surface-card p-6 sm:p-8 lg:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-brand">
                Thông tin doanh nghiệp
              </p>
              <h2
                id="company-information-heading"
                className="mt-2 font-heading text-[22px] font-semibold leading-8 text-content-heading sm:text-[26px]"
              >
                {companyInfo.brandName}
              </h2>
              <p className="mt-3 font-sans text-[14px] leading-6 text-content-body">
                Thông tin pháp lý và địa chỉ liên hệ chính thức của doanh nghiệp.
              </p>
            </div>

            <dl className="divide-y divide-border-ui overflow-hidden rounded-xl border border-border-ui bg-white px-5">
              <div className="py-4">
                <dt className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-content-muted">
                  Tên pháp lý
                </dt>
                <dd className="mt-1 font-sans text-[14px] leading-6 text-content-heading">
                  {companyInfo.legalName}
                </dd>
              </div>
              <div className="py-4">
                <dt className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-content-muted">
                  Mã số thuế
                </dt>
                <dd className="mt-1 font-sans text-[14px] font-semibold text-content-heading">
                  {companyInfo.taxCode}
                </dd>
              </div>
              <div className="py-4">
                <dt className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-content-muted">
                  Địa chỉ
                </dt>
                <dd className="mt-1 font-sans text-[14px] leading-6 text-content-heading">
                  {companyInfo.address}
                </dd>
              </div>
              <div className="py-4">
                <dt className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-content-muted">
                  Email nhận hóa đơn
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${companyInfo.invoiceEmail}`}
                    className="font-sans text-[14px] font-medium text-brand-dark hover:underline"
                  >
                    {companyInfo.invoiceEmail}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </main>
    </>
  );
}
