import Link from "next/link";
import { getHeroSlides } from "@/lib/api/hero-slides";
import { HeroCarousel } from "./HeroCarousel";

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

// Đồng hồ đo: thiết bị đo đếm chính xác.
function GaugeIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4.5 17a8 8 0 1 1 15 0" />
      <path d="m12 13 3.5-4" />
      <circle cx="12" cy="13.5" r="1.3" />
      <path d="M7 10.5 6 9.8M17 10.5l1-.7M12 7V6" />
    </svg>
  );
}

// Các nút nối với nhau: thiết bị tích hợp, tự động trao đổi dữ liệu.
function IntegrationIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="3.5" width="6" height="6" rx="1.5" />
      <rect x="15" y="3.5" width="6" height="6" rx="1.5" />
      <rect x="9" y="14.5" width="6" height="6" rx="1.5" />
      <path d="M6 9.5v2.5h12V9.5M12 12v2.5" />
    </svg>
  );
}

// Bảng điều khiển: quản lý tập trung nhiều trạm.
function DashboardIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 20.5h8M12 17v3.5" />
      <path d="m7 13 3-3 2.5 2L17 8" />
    </svg>
  );
}

const features = [
  { icon: <GaugeIcon />, title: "Thiết bị", subtitle: "chính xác" },
  { icon: <IntegrationIcon />, title: "Tích hợp", subtitle: "tự động" },
  { icon: <DashboardIcon />, title: "Quản lý", subtitle: "tập trung" },
];

export async function HeroSection() {
  const heroSlides = await getHeroSlides();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-[680px] overflow-hidden bg-[#06264a]"
    >
      <HeroCarousel slides={heroSlides} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(6,38,74,0.98)_0%,rgba(6,38,74,0.94)_34%,rgba(6,38,74,0.62)_56%,rgba(6,38,74,0.08)_100%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(3,24,48,0.45)_0%,transparent_45%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-green-400/15 blur-[140px]" />
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-blue-400/15 blur-[160px]" />

      <div className="relative mx-auto grid min-h-[680px] max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:px-8">
        <div className="z-10 py-14 sm:py-16">
          <HeroBrand />

          <h1
            id="hero-heading"
            className="max-w-3xl text-4xl font-extrabold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Giải pháp thiết bị &amp; công nghệ
            <span className="mt-2 block text-green-400">trạm xăng dầu</span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Đo bồn tự động <span aria-hidden="true">•</span> Thiết bị trạm xăng dầu{" "}
            <span aria-hidden="true">•</span> Phần mềm quản lý
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="#thiet-bi"
              className="inline-flex items-center gap-3 rounded-full bg-[linear-gradient(90deg,#4ade80,#22d3ee)] px-8 py-4 text-base font-bold text-white shadow-lg shadow-green-500/20 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06264a]"
            >
              KHÁM PHÁ GIẢI PHÁP
              <span aria-hidden="true" className="text-xl">→</span>
            </Link>
            <Link
              href="/lien-he#dang-ky-tu-van"
              className="inline-flex items-center rounded-full border border-white/40 px-7 py-[15px] text-base font-semibold text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06264a]"
            >
              Nhận tư vấn
            </Link>
          </div>

          <div className="mt-14 grid max-w-2xl grid-cols-1 gap-5 sm:grid-cols-3">
            {features.map((feature) => (
              <Feature key={feature.title} {...feature} />
            ))}
          </div>
        </div>

        <div className="relative hidden h-[600px] lg:block" aria-hidden="true" />
      </div>
    </section>
  );
}

function HeroBrand() {
  return (
    <div className="mb-10 flex items-center gap-3" aria-label="Ánh Sáng Toàn Cầu">
      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        className="h-14 w-14 shrink-0 text-green-400"
        fill="none"
      >
        <path d="M10 30C10 18 20 8 32 8s22 10 22 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M15 30c0-9.4 7.6-17 17-17s17 7.6 17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".75" />
        <path d="M7 29c7 3 12 9 15 17l5 13C16 54 9 44 7 29Z" fill="currentColor" />
        <path d="M57 29c-7 3-12 9-15 17l-5 13c11-5 18-15 20-30Z" fill="currentColor" />
      </svg>
      <div className="font-bold uppercase leading-none tracking-tight text-white">
        <span className="block text-xl sm:text-2xl">Ánh Sáng</span>
        <span className="mt-1 block text-xl sm:text-2xl">Toàn Cầu</span>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden="true"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-green-400/70 bg-green-400/10 text-green-400"
      >
        {icon}
      </div>
      <div className="text-sm text-white">
        <div className="font-semibold">{title}</div>
        <div className="text-white/70">{subtitle}</div>
      </div>
    </div>
  );
}
