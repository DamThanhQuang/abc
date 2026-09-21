import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { companyInfo } from "@/config/site";

export const metadata: Metadata = {
  title: "Giới thiệu | Ánh Sáng Toàn Cầu",
  description:
    "Giới thiệu Ánh Sáng Toàn Cầu — doanh nghiệp sản xuất thiết bị, hệ thống tự động hóa và giải pháp quản lý cho ngành xăng dầu.",
};

const businessAreas = [
  {
    title: "Cột bơm xăng dầu",
    description: "Sản xuất và kinh doanh cột bơm phục vụ các cửa hàng xăng dầu.",
  },
  {
    title: "Thiết bị ngành xăng dầu",
    description: "Cung cấp thiết bị chuyên dụng cho hoạt động kinh doanh xăng dầu.",
  },
  {
    title: "Đo bồn bể tự động",
    description: "Phát triển hệ thống đo và giám sát bồn bể theo hướng tự động hóa.",
  },
  {
    title: "Phần mềm quản lý bán hàng",
    description: "Giải pháp quản lý bán hàng dành cho các cửa hàng xăng dầu.",
  },
  {
    title: "Bán hàng tự động",
    description: "Hệ thống hỗ trợ tự động hóa quy trình bán hàng tại cửa hàng.",
  },
  {
    title: "Cấp dầu tự động",
    description: "Hệ thống cấp dầu cho nhà máy và doanh nghiệp vận tải, logistics.",
  },
  {
    title: "Tự động hóa doanh nghiệp",
    description: "Xây dựng hệ thống tự động hóa theo nhu cầu của từng doanh nghiệp.",
  },
] as const;

const coreValues = [
  {
    number: "01",
    title: "Khách hàng",
    description:
      "Luôn lấy khách hàng làm trọng tâm trong định hướng sản phẩm và dịch vụ.",
  },
  {
    number: "02",
    title: "Đổi mới",
    description:
      "Duy trì tinh thần học hỏi, liên tục cải tiến để nâng cao chất lượng sản phẩm.",
  },
  {
    number: "03",
    title: "Trí tín",
    description:
      "Đề cao trí tuệ, tầm nhìn, sự quyết đoán và giữ vững chữ tín trong hợp tác.",
  },
] as const;

const partners = [
  "Hải Bình Petro",
  "Hapeco",
  "Pimex",
  "Sông Vân Petro",
  "Thành Long Petro",
  "TTH Petro",
] as const;

const highlights = [
  { value: "20+", label: "Tỉnh thành có sản phẩm hiện diện" },
  { value: "07", label: "Lĩnh vực hoạt động trọng tâm" },
  { value: "2027", label: "Mục tiêu trở thành thương hiệu Top 10" },
] as const;

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="m4 9.25 3.1 3.1L14.25 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function GioiThieuPage() {
  return (
    <>
      <PageHero
        title="Về Ánh Sáng Toàn Cầu"
        subtitle="Năng lực sản xuất, công nghệ và tự động hóa cho ngành xăng dầu Việt Nam"
        imageSrc="/images/about/fuel-station-banner.png"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Giới thiệu" },
        ]}
      />

      <main>
        <section
          aria-labelledby="company-overview-heading"
          className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-16 lg:py-20"
        >
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
                Giới thiệu doanh nghiệp
              </p>
              <h2
                id="company-overview-heading"
                className="mt-3 font-heading text-[28px] font-semibold leading-[38px] tracking-[-0.02em] text-content-heading sm:text-[34px] sm:leading-[44px]"
              >
                Giải pháp thiết bị và tự động hóa được phát triển từ nhu cầu thực tế
              </h2>
              <p className="mt-5 font-sans text-[15px] leading-7 text-content-body lg:text-[16px]">
                {companyInfo.legalName} hoạt động trong lĩnh vực sản xuất, kinh doanh
                thiết bị và phát triển các hệ thống công nghệ cho ngành xăng dầu. Năng
                lực của công ty trải rộng từ cột bơm, thiết bị chuyên dụng đến đo bồn,
                quản lý bán hàng và cấp dầu tự động.
              </p>
              <p className="mt-4 font-sans text-[15px] leading-7 text-content-body lg:text-[16px]">
                Với định hướng kết hợp sản xuất và công nghệ, Ánh Sáng Toàn Cầu xây dựng
                các giải pháp phù hợp cho cửa hàng xăng dầu, nhà máy, doanh nghiệp vận tải
                và logistics trên toàn quốc.
              </p>
              <Link
                href="/san-pham"
                className="mt-7 inline-flex items-center gap-2 rounded-btn bg-brand px-5 py-3 font-sans text-[14px] font-semibold text-white shadow-btn transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                Khám phá sản phẩm
                <ArrowIcon />
              </Link>
            </div>

            <div className="relative lg:col-span-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-surface-card shadow-card">
                <Image
                  src="/images/about/business-areas.png"
                  alt="Giải pháp thiết bị và công nghệ tại trạm xăng dầu"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#001f38]/70 to-transparent" aria-hidden="true" />
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-[#00355f] p-5 text-white shadow-lg sm:left-auto sm:w-[280px]">
                <p className="font-heading text-[32px] font-bold leading-none">20+</p>
                <p className="mt-2 font-sans text-[13px] leading-5 text-white/80">
                  tỉnh thành trên cả nước đã có sản phẩm của công ty hiện diện
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-brand-gradient" aria-label="Dấu ấn doanh nghiệp">
          <div className="mx-auto grid max-w-content divide-y divide-white/15 px-4 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-16">
            {highlights.map((item) => (
              <div key={item.value} className="px-4 py-8 text-center md:px-8 lg:py-10">
                <p className="font-heading text-[34px] font-bold leading-none text-white sm:text-[40px]">
                  {item.value}
                </p>
                <p className="mx-auto mt-3 max-w-[220px] font-sans text-[13px] leading-5 text-white/75 sm:text-[14px]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="business-areas-heading"
          className="bg-surface-card py-12 lg:py-20"
        >
          <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16">
            <div className="max-w-3xl">
              <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
                Lĩnh vực hoạt động
              </p>
              <h2
                id="business-areas-heading"
                className="mt-3 font-heading text-[28px] font-semibold leading-[38px] tracking-[-0.02em] text-content-heading sm:text-[34px] sm:leading-[44px]"
              >
                Hệ sinh thái giải pháp toàn diện cho vận hành và quản lý
              </h2>
              <p className="mt-3 font-sans text-[15px] leading-7 text-content-muted">
                Từ thiết bị tại điểm bán đến nền tảng quản lý và hệ thống tự động hóa
                dành cho doanh nghiệp.
              </p>
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {businessAreas.map((item, index) => (
                <article
                  key={item.title}
                  className={`group rounded-[18px] border border-border-ui bg-white p-6 shadow-card transition-transform duration-200 hover:-translate-y-1 ${
                    index === businessAreas.length - 1 ? "sm:col-span-2 lg:col-span-3" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 font-heading text-[13px] font-bold text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-heading text-[17px] font-semibold leading-6 text-content-heading">
                        {item.title}
                      </h3>
                      <p className="mt-2 font-sans text-[14px] leading-6 text-content-body">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="vision-heading"
          className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-16 lg:py-20"
        >
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
            <div className="rounded-[24px] bg-brand-dark p-7 text-white shadow-card sm:p-9 lg:col-span-5">
              <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-white/60">
                Tầm nhìn & Mục tiêu
              </p>
              <h2
                id="vision-heading"
                className="mt-3 font-heading text-[26px] font-semibold leading-[36px] tracking-[-0.02em] text-white sm:text-[30px] sm:leading-[40px]"
              >
                Nâng chuẩn thiết bị xăng dầu Việt Nam
              </h2>
              <div className="mt-7 space-y-6">
                <div className="border-l-2 border-white/25 pl-5">
                  <h3 className="font-heading text-[15px] font-semibold text-white">Tầm nhìn</h3>
                  <p className="mt-2 font-sans text-[14px] leading-6 text-white/75">
                    Trở thành doanh nghiệp sản xuất và kinh doanh thiết bị xăng dầu đạt
                    chất lượng, kỹ thuật, mỹ thuật và giá thành tốt nhất.
                  </p>
                </div>
                <div className="border-l-2 border-white/25 pl-5">
                  <h3 className="font-heading text-[15px] font-semibold text-white">Mục tiêu 2027</h3>
                  <p className="mt-2 font-sans text-[14px] leading-6 text-white/75">
                    Trở thành thương hiệu Top 10 trong lĩnh vực sản xuất và kinh doanh
                    thiết bị xăng dầu, với quy mô phủ rộng khắp Việt Nam.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 lg:py-3">
              <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
                Giá trị cốt lõi
              </p>
              <h2 className="mt-3 font-heading text-[28px] font-semibold leading-[38px] tracking-[-0.02em] text-content-heading sm:text-[34px] sm:leading-[44px]">
                Nguyên tắc dẫn đường cho mọi hoạt động
              </h2>
              <div className="mt-7 space-y-3">
                {coreValues.map((item) => (
                  <article
                    key={item.number}
                    className="grid gap-3 rounded-2xl border border-border-ui bg-white p-5 shadow-card sm:grid-cols-[52px_1fr] sm:items-start"
                  >
                    <span className="font-heading text-[14px] font-bold text-brand">{item.number}</span>
                    <div>
                      <h3 className="font-heading text-[17px] font-semibold text-content-heading">
                        {item.title}
                      </h3>
                      <p className="mt-1 font-sans text-[14px] leading-6 text-content-body">
                        {item.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border-ui bg-white py-10" aria-labelledby="partners-heading">
          <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-sm">
                <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
                  Đối tác tiêu biểu
                </p>
                <h2 id="partners-heading" className="mt-2 font-heading text-[22px] font-semibold leading-8 text-content-heading">
                  Đồng hành cùng doanh nghiệp trong ngành
                </h2>
              </div>
              <ul className="flex max-w-3xl flex-wrap gap-2.5" aria-label="Danh sách đối tác">
                {partners.map((partner) => (
                  <li
                    key={partner}
                    className="inline-flex items-center gap-2 rounded-full border border-border-tag bg-surface-tag px-4 py-2.5 font-sans text-[13px] font-semibold text-brand-dark"
                  >
                    <span className="text-brand"><CheckIcon /></span>
                    {partner}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="company-info-heading"
          className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-16 lg:py-20"
        >
          <div className="overflow-hidden rounded-[24px] border border-border-ui bg-surface-card">
            <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
              <div className="bg-brand-gradient p-7 text-white sm:p-9 lg:p-10">
                <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-white/60">
                  Thông tin doanh nghiệp
                </p>
                <h2 id="company-info-heading" className="mt-3 font-heading text-[26px] font-semibold leading-9 text-white sm:text-[30px]">
                  {companyInfo.brandName}
                </h2>
                <p className="mt-4 font-sans text-[14px] leading-6 text-white/75">
                  Kết nối với chúng tôi để trao đổi về thiết bị, phần mềm và giải pháp
                  tự động hóa phù hợp với nhu cầu thực tế.
                </p>
                <a
                  href={`tel:${companyInfo.phone.replace(/\D/g, "")}`}
                  className="mt-7 inline-flex items-center gap-2 rounded-btn bg-white px-5 py-3 font-sans text-[14px] font-semibold text-brand-dark transition-colors hover:bg-surface-card"
                >
                  {companyInfo.phone}
                  <ArrowIcon />
                </a>
              </div>

              <dl className="grid gap-px bg-border-ui sm:grid-cols-2">
                <InfoItem label="Tên pháp lý" value={companyInfo.legalName} />
                <InfoItem label="Mã số thuế" value={companyInfo.taxCode} />
                <InfoItem label="Trụ sở" value={companyInfo.address} />
                <InfoItem label="Xưởng sản xuất" value={companyInfo.workshopAddress} />
              </dl>
            </div>
          </div>
        </section>

        <section className="bg-brand-dark py-12 lg:py-16">
          <div className="mx-auto flex max-w-content flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-16">
            <div className="max-w-2xl">
              <h2 className="font-heading text-[26px] font-semibold leading-9 text-white sm:text-[30px]">
                Cùng xây dựng giải pháp phù hợp cho doanh nghiệp của bạn
              </h2>
              <p className="mt-2 font-sans text-[14px] leading-6 text-white/70">
                Trao đổi trực tiếp với Ánh Sáng Toàn Cầu về nhu cầu thiết bị, quản lý
                hoặc tự động hóa.
              </p>
            </div>
            <Link
              href="/lien-he"
              className="inline-flex shrink-0 items-center gap-2 rounded-btn bg-white px-6 py-3.5 font-sans text-[14px] font-semibold text-brand-dark transition-colors hover:bg-surface-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Liên hệ tư vấn
              <ArrowIcon />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-6 sm:p-7">
      <dt className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-content-muted">
        {label}
      </dt>
      <dd className="mt-2 font-sans text-[14px] font-medium leading-6 text-content-heading">
        {value}
      </dd>
    </div>
  );
}
