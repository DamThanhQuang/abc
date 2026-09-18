import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { companyInfo } from "@/config/site";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: `${companyInfo.legalName} — thiết bị và giải pháp cho trạm xăng dầu.`,
};

// ─── Placeholder data — thay nội dung thật vào đây ─────────────────────────

const stats = [
  { value: "XX+", label: "Năm kinh nghiệm" },
  { value: "XXX+", label: "Trạm xăng dầu" },
  { value: "X,XXX+", label: "Thiết bị đã cung cấp" },
  { value: "XX+", label: "Tỉnh thành phủ sóng" },
];

const coreValues = [
  {
    title: "Chất lượng",
    description:
      "Cam kết cung cấp thiết bị đạt tiêu chuẩn đo lường, vận hành ổn định trong điều kiện thực tế tại trạm.",
  },
  {
    title: "Uy tín",
    description:
      "Đồng hành cùng khách hàng từ tư vấn, lắp đặt đến bảo hành — đảm bảo hỗ trợ kỹ thuật nhanh chóng.",
  },
  {
    title: "Đổi mới",
    description:
      "Liên tục cập nhật công nghệ đo bồn tự động, phần mềm quản lý và thiết bị thế hệ mới.",
  },
];

const solutionGroups = [
  {
    number: "01",
    title: "Đo bồn tự động",
    description:
      "Giải pháp theo dõi dữ liệu bồn chứa theo nhu cầu triển khai thực tế.",
  },
  {
    number: "02",
    title: "Thiết bị trạm xăng dầu",
    description:
      "Danh mục thiết bị phục vụ hoạt động tại trạm xăng dầu.",
  },
  {
    number: "03",
    title: "Phần mềm quản lý",
    description:
      "Công cụ hỗ trợ quản lý thông tin vận hành tại trạm.",
  },
];

const certifications = [
  "Chứng nhận 1 (VD: ISO 9001:2015)",
  "Chứng nhận 2 (VD: Giấy phép phân phối)",
  "Chứng nhận 3 (VD: Chứng nhận đo lường)",
  "Chứng nhận 4 (VD: Chứng nhận PCCC)",
];

// ─── Page ───────────────────────────────────────────────────────────────────

export default function GioiThieuPage() {
  return (
    <>
      <PageHero
        title="Về Ánh Sáng Toàn Cầu"
        subtitle="Đơn vị chuyên cung cấp thiết bị và giải pháp toàn diện cho trạm xăng dầu"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Giới thiệu" },
        ]}
      />

      <main>
        {/* ── Section 1: Company story + Legal info ── */}
        <section className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-brand">
                Câu chuyện của chúng tôi
              </p>
              <h2 className="mt-3 font-heading text-[28px] font-semibold leading-[38px] text-content-heading sm:text-[34px] sm:leading-[44px]">
                {companyInfo.legalName}
              </h2>

              {/* TODO: Thay nội dung thật — năm thành lập, quá trình phát triển */}
              <p className="mt-5 font-sans text-[15px] leading-7 text-content-body lg:text-[16px]">
                Được thành lập từ năm [XXXX], Ánh Sáng Toàn Cầu khởi đầu với
                [mô tả hoạt động ban đầu]. Qua hơn [XX] năm hoạt động, công ty
                đã phát triển thành đơn vị chuyên cung cấp thiết bị và giải pháp
                toàn diện cho trạm xăng dầu trên khắp cả nước.
              </p>
              <p className="mt-4 font-sans text-[15px] leading-7 text-content-body lg:text-[16px]">
                Với đội ngũ kỹ thuật giàu kinh nghiệm và mạng lưới phân phối
                rộng khắp, chúng tôi tự hào đồng hành cùng [XX+] đối tác và
                hàng trăm trạm xăng dầu trong việc nâng cao hiệu quả vận hành
                và đảm bảo an toàn đo lường.
              </p>
              <p className="mt-3 font-sans text-[14px] leading-6 text-content-muted">
                Thông số kỹ thuật, khả năng tương thích và phạm vi triển khai
                được xác nhận theo từng sản phẩm và nhu cầu cụ thể.
              </p>
            </div>

            <div className="rounded-[20px] border border-border-ui bg-surface-card p-6 sm:p-8 lg:col-span-5">
              <h2 className="font-heading text-[20px] font-semibold text-content-heading">
                Thông tin pháp lý
              </h2>
              <dl className="mt-5 divide-y divide-border-ui">
                <InfoRow label="Tên giao dịch" value={companyInfo.brandName} />
                <InfoRow label="Mã số thuế" value={companyInfo.taxCode} />
                <InfoRow label="Địa chỉ" value={companyInfo.address} />
                <InfoRow
                  label="Email hóa đơn"
                  value={companyInfo.invoiceEmail}
                  href={`mailto:${companyInfo.invoiceEmail}`}
                />
              </dl>
            </div>
          </div>
        </section>

        {/* ── Section 2: Stats counter ── */}
        {/* TODO: Thay XX bằng số liệu thật */}
        <section className="bg-brand-gradient py-10 lg:py-14">
          <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16">
            <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-heading text-[36px] font-bold leading-none text-white sm:text-[44px] lg:text-[48px]">
                    {stat.value}
                  </p>
                  <p className="mt-2 font-sans text-[13px] leading-5 text-white/70 sm:text-[14px]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 3: Mission + Vision + Core Values ── */}
        <section className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-brand">
                Tầm nhìn & Sứ mệnh
              </p>
              {/* TODO: Thay nội dung thật */}
              <h2 className="mt-3 font-heading text-[26px] font-semibold leading-[34px] text-content-heading sm:text-[30px] sm:leading-[40px]">
                Kiến tạo tiêu chuẩn mới cho trạm xăng dầu Việt Nam
              </h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-card border border-border-ui bg-surface-card p-5">
                  <h3 className="font-heading text-[15px] font-semibold text-content-heading">
                    Tầm nhìn
                  </h3>
                  <p className="mt-2 font-sans text-[14px] leading-6 text-content-body">
                    Trở thành đơn vị hàng đầu Việt Nam trong lĩnh vực cung cấp
                    thiết bị và giải pháp công nghệ cho trạm xăng dầu.
                  </p>
                </div>
                <div className="rounded-card border border-border-ui bg-surface-card p-5">
                  <h3 className="font-heading text-[15px] font-semibold text-content-heading">
                    Sứ mệnh
                  </h3>
                  <p className="mt-2 font-sans text-[14px] leading-6 text-content-body">
                    Nâng cao hiệu quả vận hành và đảm bảo an toàn đo lường cho
                    mọi trạm xăng dầu thông qua thiết bị chất lượng và dịch vụ
                    tận tâm.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-brand">
                Giá trị cốt lõi
              </p>
              <h2 className="mt-3 font-heading text-[26px] font-semibold leading-[34px] text-content-heading sm:text-[30px] sm:leading-[40px]">
                Nền tảng để phát triển bền vững
              </h2>
              {/* TODO: Chỉnh lại mô tả cho phù hợp thực tế */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {coreValues.map((item, i) => (
                  <div
                    key={item.title}
                    className="rounded-card border border-border-ui bg-white p-5 shadow-card"
                  >
                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-brand/10 font-heading text-[16px] font-bold text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 font-heading text-[16px] font-semibold text-content-heading">
                      {item.title}
                    </h3>
                    <p className="mt-2 font-sans text-[14px] leading-6 text-content-body">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 4: Solution groups ── */}
        <section
          className="bg-surface-card py-12 lg:py-20"
          aria-labelledby="solution-groups-heading"
        >
          <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16">
            <div className="max-w-2xl">
              <h2
                id="solution-groups-heading"
                className="font-heading text-[26px] font-semibold leading-9 text-content-heading sm:text-[32px] sm:leading-10"
              >
                Nhóm giải pháp
              </h2>
              <p className="mt-2 font-sans text-[14px] leading-6 text-content-muted lg:text-[16px]">
                Ba trụ cột giải pháp phục vụ toàn diện hoạt động tại trạm xăng
                dầu.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {solutionGroups.map((item) => (
                <article
                  key={item.number}
                  className="rounded-card border border-border-ui bg-white p-6 shadow-card"
                >
                  <span className="font-mono text-[13px] font-bold text-brand">
                    {item.number}
                  </span>
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

        {/* ── Section 5: Certifications ── */}
        {/* TODO: Thay tên chứng nhận thật */}
        <section className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-16 lg:py-20">
          <div className="text-center">
            <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-brand">
              Chứng nhận & Tiêu chuẩn
            </p>
            <h2 className="mt-3 font-heading text-[26px] font-semibold leading-9 text-content-heading sm:text-[32px] sm:leading-10">
              Cam kết chất lượng được chứng nhận
            </h2>
            <p className="mx-auto mt-3 max-w-xl font-sans text-[14px] leading-6 text-content-muted lg:text-[15px]">
              Sản phẩm và dịch vụ của chúng tôi tuân thủ các tiêu chuẩn trong
              nước và quốc tế.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((cert) => (
              <div
                key={cert}
                className="flex items-center gap-3 rounded-card border border-border-ui bg-surface-card p-5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33-3.87-3.77 5.34-.78L10 1z"
                      stroke="#0f4c81"
                      strokeWidth="1.3"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="font-sans text-[14px] font-medium leading-5 text-content-heading">
                  {cert}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 6: CTA ── */}
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

function InfoRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[140px_1fr] sm:gap-4">
      <dt className="font-sans text-[12px] font-semibold uppercase tracking-[0.06em] text-content-muted">
        {label}
      </dt>
      <dd className="font-sans text-[14px] leading-6 text-content-heading">
        {href ? (
          <a
            href={href}
            className="font-medium text-brand-dark hover:underline"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
