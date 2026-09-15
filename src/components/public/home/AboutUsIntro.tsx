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

function TankIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" aria-hidden="true">
      <rect x="4" y="3" width="17" height="19" rx="4" stroke="#0f4c81" strokeWidth="1.8" />
      <path d="M8 15c2-2 3 2 5 0s3 2 5 0" stroke="#0f4c81" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12.5 7v4" stroke="#0f4c81" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function StationIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" aria-hidden="true">
      <path d="M5 22V4h10v18M3 22h14" stroke="#0f4c81" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="7.5" y="7" width="5" height="5" rx="1" stroke="#0f4c81" strokeWidth="1.6" />
      <path d="M15 8h2l3 3v7a2 2 0 0 0 4 0v-5l-2-2" stroke="#0f4c81" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type InfoCardProps = {
  icon: React.ReactNode;
  title: string;
  label: string;
};

function InfoCard({ icon, title, label }: InfoCardProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1 rounded-card bg-surface-card p-5 shadow-card lg:p-6">
      <div className="mb-1">{icon}</div>
      <p className="font-heading text-[20px] font-semibold leading-7 text-content-heading lg:text-[22px]">
        {title}
      </p>
      <p className="font-sans text-[13px] leading-5 text-content-body lg:text-[14px]">
        {label}
      </p>
    </div>
  );
}

export function AboutUsIntro() {
  return (
    <section
      aria-labelledby="about-heading"
      className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-16 lg:py-20"
    >
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col gap-3 lg:col-span-5">
          <h2
            id="about-heading"
            className="font-heading text-[24px] font-semibold leading-[32px] tracking-[-0.01em] text-content-heading sm:text-[28px] sm:leading-[36px] lg:text-[32px] lg:leading-[40px]"
          >
            Giải pháp cho trạm xăng dầu
          </h2>
          <p className="font-sans text-[15px] leading-6 text-content-body lg:text-[16px]">
            Ánh Sáng Toàn Cầu giới thiệu các giải pháp về đo bồn tự động,
            thiết bị trạm xăng dầu và phần mềm quản lý. Thông tin kỹ thuật và
            phạm vi triển khai được xác nhận theo từng sản phẩm và nhu cầu thực tế.
          </p>
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-1 self-start pt-2 font-sans text-[14px] leading-4 tracking-[0.05em] text-brand-dark transition-colors hover:underline"
          >
            Xem danh mục sản phẩm
            <ArrowIcon />
          </Link>
        </div>

        <div className="hidden lg:col-span-1 lg:block" aria-hidden="true" />

        <div className="flex gap-3 lg:col-span-6 lg:h-[144px]">
          <InfoCard
            icon={<TankIcon />}
            title="Đo bồn"
            label="Giải pháp đo bồn tự động"
          />
          <InfoCard
            icon={<StationIcon />}
            title="Thiết bị & phần mềm"
            label="Dành cho hoạt động tại trạm xăng dầu"
          />
        </div>
      </div>
    </section>
  );
}
