import Image from "next/image";
import Link from "next/link";

function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      <path
        d="M1 5.5h9M6 1l4.5 4.5L6 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LargeFeatureCard() {
  return (
    <div className="relative min-h-[220px] w-full overflow-hidden rounded-card bg-surface-hero lg:h-[280px] lg:min-w-0 lg:flex-1">
      <Image
        src="/images/hero-fuel-station-clean.png"
        alt="Thiết bị tại trạm xăng dầu"
        fill
        className="object-cover object-[70%_center]"
        sizes="(max-width: 1024px) 100vw, 67vw"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(0deg,rgba(3,24,48,0.92)_0%,rgba(3,24,48,0.32)_65%,transparent_100%)]"
      />
      <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
        <span className="mb-2 inline-block rounded-pill border border-green-300/30 bg-green-400/15 px-2.5 py-1 font-sans text-[12px] leading-[14px] text-green-200 backdrop-blur-sm lg:mb-3">
          Thiết bị trạm xăng dầu
        </span>
        <h3 className="mb-1 font-heading text-[18px] font-semibold leading-7 text-white lg:text-[20px]">
          Giải pháp thiết bị tại trạm
        </h3>
        <p className="max-w-xl font-sans text-[13px] leading-5 text-white/80 lg:text-[14px]">
          Danh mục sản phẩm được cập nhật và quản lý trực tiếp trên website.
        </p>
      </div>
    </div>
  );
}

type SmallCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function SmallCard({ icon, title, description }: SmallCardProps) {
  return (
    <div className="flex min-h-[180px] w-full flex-col rounded-card bg-white p-5 shadow-card sm:flex-1 lg:h-[280px] lg:w-[376px] lg:shrink-0 lg:p-6">
      <div className="mb-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-surface-card">
        {icon}
      </div>
      <div className="mt-4 lg:mt-auto">
        <h3 className="mb-2 font-heading text-[18px] font-semibold leading-7 text-content-heading lg:text-[20px]">
          {title}
        </h3>
        <p className="font-sans text-[13px] leading-5 text-content-body lg:text-[14px]">
          {description}
        </p>
      </div>
    </div>
  );
}

function CTACard() {
  return (
    <div className="relative min-h-[200px] w-full overflow-hidden rounded-card bg-brand-gradient lg:h-[280px] lg:min-w-0 lg:flex-1">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(74,222,128,0.18)_0%,transparent_60%)]"
      />
      <div className="relative flex h-full flex-col p-5 lg:p-6">
        <h3 className="mt-3 font-heading text-[20px] font-semibold leading-8 tracking-[-0.01em] text-white lg:mt-[46px] lg:text-[24px]">
          Trao đổi nhu cầu
          <br />
          của bạn
        </h3>
        <p className="mt-3 max-w-[426px] font-sans text-[13px] leading-5 text-white/75 lg:text-[14px]">
          Gửi thông tin về nhu cầu thiết bị hoặc phần mềm để được liên hệ và
          trao đổi nội dung phù hợp.
        </p>
        <Link
          href="/lien-he"
          className="mt-5 inline-flex self-start items-center justify-center rounded-btn bg-white px-6 py-[10px] font-sans text-[14px] leading-4 tracking-[0.05em] text-brand transition-colors hover:bg-surface-card lg:mt-6"
        >
          Liên hệ tư vấn
        </Link>
      </div>
    </div>
  );
}

function TankIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="2" width="14" height="16" rx="3" stroke="#0f4c81" strokeWidth="1.6" />
      <path d="M6 12c1.6-1.7 2.7 1.7 4.3 0 1.6-1.7 2.7 1.7 4.3 0" stroke="#0f4c81" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 5v4" stroke="#0f4c81" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function MonitoringIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="18" height="12" rx="2" stroke="#0f4c81" strokeWidth="1.6" />
      <path d="M7 15h6M10 13v2" stroke="#0f4c81" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4 9l3-3 2.5 2.5L13 5l3 2" stroke="#0f4c81" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FeaturesGrid() {
  return (
    <section
      aria-labelledby="features-heading"
      className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-16 lg:py-20"
    >
      <div className="mb-8 flex items-start justify-between gap-4 sm:items-end lg:mb-12">
        <div>
          <h2
            id="features-heading"
            className="font-heading text-[24px] font-semibold leading-[32px] tracking-[-0.01em] text-content-heading sm:text-[28px] sm:leading-[36px] lg:text-[32px] lg:leading-[40px]"
          >
            Thiết bị &amp; giải pháp trạm xăng dầu
          </h2>
          <p className="mt-2 font-sans text-[14px] leading-6 text-content-muted lg:text-[16px]">
            Đo bồn tự động • Thiết bị trạm xăng dầu • Phần mềm quản lý
          </p>
        </div>
        <Link
          href="/san-pham"
          className="inline-flex shrink-0 items-center gap-1 pb-1 font-sans text-[14px] leading-4 tracking-[0.05em] text-brand-dark transition-colors hover:underline"
        >
          Xem tất cả
          <ArrowIcon />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 md:flex-row">
          <LargeFeatureCard />
          <SmallCard
            icon={<TankIcon />}
            title="Đo bồn tự động"
            description="Một trong các nhóm giải pháp đang được giới thiệu trên website."
          />
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <SmallCard
            icon={<MonitoringIcon />}
            title="Phần mềm quản lý"
            description="Giải pháp hỗ trợ quản lý thông tin phục vụ hoạt động tại trạm."
          />
          <CTACard />
        </div>
      </div>
    </section>
  );
}
