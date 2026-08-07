import Link from "next/link";

function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      <path d="M1 5.5h9M6 1l4.5 4.5L6 10" stroke="#00355f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UptimeIcon() {
  return (
    <svg width="23" height="24" viewBox="0 0 23 24" fill="none" aria-hidden="true">
      <path d="M11.5 2C6.25 2 2 6.25 2 11.5S6.25 21 11.5 21 21 16.75 21 11.5 16.75 2 11.5 2Z" stroke="#0f4c81" strokeWidth="1.8" />
      <path d="M11.5 6.5v5l3.5 2" stroke="#0f4c81" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" aria-hidden="true">
      <circle cx="12.5" cy="12.5" r="10.5" stroke="#0f4c81" strokeWidth="1.8" />
      <ellipse cx="12.5" cy="12.5" rx="5" ry="10.5" stroke="#0f4c81" strokeWidth="1.8" />
      <path d="M2 12.5h21M12.5 2a16 16 0 0 1 0 21M12.5 2a16 16 0 0 0 0 21" stroke="#0f4c81" strokeWidth="1.8" />
    </svg>
  );
}

type StatCardProps = {
  icon: React.ReactNode;
  value: string;
  label: string;
};

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="flex flex-1 min-w-0 flex-col gap-1 bg-surface-card rounded-card p-5 lg:p-6 shadow-card">
      <div className="mb-1">{icon}</div>
      <p className="font-heading font-semibold text-[22px] lg:text-[24px] leading-8 text-content-heading">
        {value}
      </p>
      <p className="font-sans text-[13px] lg:text-[14px] leading-5 text-content-body">
        {label}
      </p>
    </div>
  );
}

export function AboutUsIntro() {
  return (
    <section
      aria-labelledby="about-heading"
      className="mx-auto max-w-content px-4 sm:px-6 lg:px-16 py-12 lg:py-20"
    >
      {/*
        Mobile:  single column — text then stat cards
        Desktop: 12-col grid — text (5 cols) | gap (1) | stats (6)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">

        {/* Left — heading + body + link */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <h2
            id="about-heading"
            className="
              font-heading font-semibold
              text-[24px] sm:text-[28px] lg:text-[32px]
              leading-[32px] sm:leading-[36px] lg:leading-[40px]
              tracking-[-0.01em] text-content-heading
            "
          >
            Được thiết kế để tin cậy
          </h2>
          <p className="font-sans text-[15px] lg:text-[16px] leading-6 text-content-body">
            For over two decades, FuelPrecision has set the industry standard
            for commercial fueling infrastructure. Our commitment to precision
            engineering ensures that every component—from underground storage
            to point-of-sale systems—operates seamlessly under the most
            demanding industrial conditions.
          </p>
          <Link
            href="/gioi-thieu"
            className="inline-flex items-center gap-1 pt-2 self-start font-sans text-[14px] leading-4 tracking-[0.05em] text-brand-dark hover:underline transition-colors"
          >
            Khám phá di sản của chúng tôi
            <ArrowIcon />
          </Link>
        </div>

        {/* Gap col — desktop only */}
        <div className="hidden lg:block lg:col-span-1" aria-hidden="true" />

        {/* Right — two stat cards */}
        {/* Mobile: horizontal row. Desktop: constrained to h-[144px] */}
        <div className="lg:col-span-6 flex gap-3 lg:h-[144px]">
          <StatCard icon={<UptimeIcon />} value="99.9%" label="Đảm bảo thời gian hoạt động" />
          <StatCard icon={<GlobeIcon />}  value="50+"   label="Quốc gia phục vụ" />
        </div>

      </div>
    </section>
  );
}
