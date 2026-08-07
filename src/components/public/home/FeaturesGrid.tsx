import Image from "next/image";
import Link from "next/link";

function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      <path d="M1 5.5h9M6 1l4.5 4.5L6 10" stroke="#00355f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Large Feature Card — full-bleed image, text at bottom
function LargeFeatureCard() {
  return (
    <div
      className="
        relative w-full lg:flex-1 lg:min-w-0
        min-h-[220px] lg:h-[280px]
        rounded-card overflow-hidden bg-surface-hero
      "
    >
      <Image
        src="/images/features/high-flow-dispensers.svg"
        alt="High-Flow Dispensers"
        fill
        className="object-cover object-center"
        sizes="(max-width: 1024px) 100vw, 67vw"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
        <span className="inline-block mb-2 lg:mb-3 backdrop-blur-sm bg-white/20 border border-white/30 rounded-pill px-2.5 py-1 font-sans text-[12px] leading-[14px] text-white">
          Máy bơm &amp; Phân phối
        </span>
        <h3 className="font-heading font-semibold text-[18px] lg:text-[20px] leading-7 text-white mb-1">
          High-Flow Dispensers
        </h3>
        <p className="font-sans text-[13px] lg:text-[14px] leading-5 text-white/80 line-clamp-2">
          Commercial-grade dispensing systems engineered for high-volume fuel distribution with precision metering.
        </p>
      </div>
    </div>
  );
}

// Small info card
type SmallCardProps = { icon: React.ReactNode; title: string; description: string };

function SmallCard({ icon, title, description }: SmallCardProps) {
  return (
    <div
      className="
        w-full sm:flex-1 lg:w-[376px] lg:shrink-0
        min-h-[180px] lg:h-[280px]
        bg-white rounded-card shadow-card
        p-5 lg:p-6 flex flex-col
      "
    >
      <div className="w-12 h-12 rounded-[10px] mb-auto bg-surface-card flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="mt-4 lg:mt-auto">
        <h3 className="font-heading font-semibold text-[18px] lg:text-[20px] leading-7 text-content-heading mb-2">
          {title}
        </h3>
        <p className="font-sans text-[13px] lg:text-[14px] leading-5 text-content-body line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}

// CTA card with brand gradient
function CTACard() {
  return (
    <div
      className="
        w-full lg:flex-1 lg:min-w-0
        min-h-[200px] lg:h-[280px]
        rounded-card overflow-hidden relative
        bg-brand-gradient
      "
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)",
        }}
      />
      <div className="relative p-5 lg:p-6 flex flex-col h-full">
        <h3
          className="
            font-heading font-semibold
            text-[20px] lg:text-[24px] leading-8 tracking-[-0.01em]
            text-white mt-3 lg:mt-[46px]
          "
        >
          Xây dựng cấu hình
          <br />
          tùy chỉnh của bạn
        </h3>
        <p className="mt-3 font-sans text-[13px] lg:text-[14px] leading-5 text-white/75 max-w-[426px]">
          Mô tả nhu cầu cụ thể của bạn và chúng tôi sẽ thiết kế một hệ thống nhiên liệu phù hợp chính xác với yêu cầu hoạt động của bạn.
        </p>
        <Link
          href="/lien-he"
          className="mt-5 lg:mt-6 self-start inline-flex items-center justify-center bg-white text-brand font-sans text-[14px] leading-4 tracking-[0.05em] rounded-btn px-6 py-[10px] hover:bg-surface-card transition-colors"
        >
          Liên hệ tư vấn
        </Link>
      </div>
    </div>
  );
}

function USTIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="1" y="5" width="16" height="10" rx="2" stroke="#0f4c81" strokeWidth="1.6" />
      <path d="M5 5V4a4 4 0 0 1 8 0v1" stroke="#0f4c81" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="9" cy="10" r="1.5" fill="#0f4c81" />
    </svg>
  );
}

function MonitoringIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="18" height="12" rx="2" stroke="#0f4c81" strokeWidth="1.6" />
      <path d="M7 15h6M10 13v2" stroke="#0f4c81" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4 8l3-3 2.5 2.5L13 4l3 3" stroke="#0f4c81" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FeaturesGrid() {
  return (
    <section
      aria-labelledby="features-heading"
      className="mx-auto max-w-content px-4 sm:px-6 lg:px-16 py-12 lg:py-20"
    >
      {/* Heading row */}
      <div className="flex items-start sm:items-end justify-between gap-4 mb-8 lg:mb-12">
        <div>
          <h2
            id="features-heading"
            className="
              font-heading font-semibold
              text-[24px] sm:text-[28px] lg:text-[32px]
              leading-[32px] sm:leading-[36px] lg:leading-[40px]
              tracking-[-0.01em] text-content-heading
            "
          >
            Giải Pháp Hạ Tầng Nhiên Liệu
          </h2>
          <p className="mt-2 font-sans text-[14px] lg:text-[16px] leading-6 text-content-muted">
            Hệ thống tích hợp từ bồn chứa đến điểm phân phối.
          </p>
        </div>
        <Link
          href="/san-pham"
          className="inline-flex items-center gap-1 shrink-0 pb-1 font-sans text-[14px] leading-4 tracking-[0.05em] text-brand-dark hover:underline transition-colors"
        >
          Xem tất cả
          <ArrowIcon />
        </Link>
      </div>

      {/*
        Mobile / sm:  all cards full-width stacked
        md:           Large + UST side by side, then Remote + CTA side by side
        lg+:          Bento: row1=[Large(flex-1) + Small(376px)], row2=[Small(376px) + CTA(flex-1)]
      */}
      <div className="flex flex-col gap-3">
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row gap-3">
          <LargeFeatureCard />
          <SmallCard
            icon={<USTIcon />}
            title="UST Systems"
            description="Double-walled underground storage tanks with continuous leak detection."
          />
        </div>
        {/* Row 2 */}
        <div className="flex flex-col md:flex-row gap-3">
          <SmallCard
            icon={<MonitoringIcon />}
            title="Viễn thám & Giám sát"
            description="Real-time inventory management and predictive maintenance software."
          />
          <CTACard />
        </div>
      </div>
    </section>
  );
}
