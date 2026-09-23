import Link from "next/link";
import { HeroCarousel, type HeroSlide } from "./HeroCarousel";

const features = [
  { icon: "◎", title: "Thiết bị", subtitle: "chính xác" },
  { icon: "⚙", title: "Tích hợp", subtitle: "tự động" },
  { icon: "☁", title: "Quản lý", subtitle: "tập trung" },
];

const heroSlides: readonly HeroSlide[] = [
  {
    src: "/images/hero-fuel-station-clean.png",
    alt: "Trạm xăng dầu được trang bị thiết bị của Ánh Sáng Toàn Cầu",
  },
  {
    src: "/images/home/astc-fuel-station.png",
    alt: "Cột bơm và thiết bị đo tại trạm xăng dầu",
  },
  {
    src: "/images/home/astc-smart-tank.png",
    alt: "Hệ thống đo bồn tự động",
  },
  {
    src: "/images/home/astc-installation-technician.png",
    alt: "Kỹ thuật viên lắp đặt thiết bị tại trạm",
  },
];

export function HeroSection() {
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

          <Link
            href="#solutions"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[linear-gradient(90deg,#4ade80,#22d3ee)] px-8 py-4 text-base font-bold text-white shadow-lg shadow-green-500/20 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06264a]"
          >
            KHÁM PHÁ GIẢI PHÁP
            <span aria-hidden="true" className="text-xl">→</span>
          </Link>

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
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden="true"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-green-400 text-2xl text-green-400"
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
