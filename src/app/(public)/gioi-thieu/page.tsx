import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StatCard } from "@/components/shared/StatCard";

export const metadata: Metadata = {
  title: "Giới Thiệu | FuelPrecision Industrial",
  description: "Hai thập kỷ tiên phong trong ngành kỹ thuật hệ thống nhiên liệu công nghiệp tại Việt Nam và khu vực.",
};

function PrecisionIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="14" stroke="#0f4c81" strokeWidth="1.8" />
      <circle cx="16" cy="16" r="5" fill="#0f4c81" />
      <line x1="16" y1="2"  x2="16" y2="6"  stroke="#0f4c81" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16" y1="26" x2="16" y2="30" stroke="#0f4c81" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="2"  y1="16" x2="6"  y2="16" stroke="#0f4c81" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="26" y1="16" x2="30" y2="16" stroke="#0f4c81" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function ReliabilityIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 3L4 8v10c0 6 5.5 10.5 12 13 6.5-2.5 12-7 12-13V8L16 3Z" stroke="#0f4c81" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M11 16l3.5 3.5 7-7" stroke="#0f4c81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function InnovationIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 4a9 9 0 0 1 6.5 15.2L21 22H11l-1.5-2.8A9 9 0 0 1 16 4Z" stroke="#0f4c81" strokeWidth="1.8" />
      <line x1="12" y1="26" x2="20" y2="26" stroke="#0f4c81" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="13" y1="29" x2="19" y2="29" stroke="#0f4c81" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 8v5M13 11l3 3 3-3" stroke="#0f4c81" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SustainabilityIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="13" stroke="#0f4c81" strokeWidth="1.8" />
      <path d="M10 20c0-5 4-9 9-7-1 3-3 5-6 5h-3Z" stroke="#0f4c81" strokeWidth="1.6" strokeLinejoin="round" />
      <line x1="16" y1="24" x2="16" y2="16" stroke="#0f4c81" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const VALUES = [
  { icon: <PrecisionIcon />,     title: "Độ Chính Xác",  description: "Mọi sản phẩm đều được gia công với dung sai nghiêm ngặt và kiểm định kép trước khi xuất xưởng." },
  { icon: <ReliabilityIcon />,   title: "Độ Tin Cậy",    description: "Cam kết 99.9% thời gian hoạt động với chính sách hỗ trợ kỹ thuật 24/7 và phụ tùng thay thế sẵn sàng." },
  { icon: <InnovationIcon />,    title: "Đổi Mới",       description: "Liên tục đầu tư vào R&D, tích hợp IoT và tự động hóa để giữ vững vị thế tiên phong công nghệ." },
  { icon: <SustainabilityIcon />,title: "Bền Vững",      description: "Thiết kế thiết bị tiết kiệm năng lượng, giảm rò rỉ và tối ưu vòng đời sản phẩm vì môi trường." },
];

const MILESTONES = [
  { year: "2003", text: "Thành lập tại Hà Nội với 12 kỹ sư và xưởng lắp ráp đầu tiên." },
  { year: "2008", text: "Xuất khẩu sản phẩm đầu tiên sang thị trường Đông Nam Á." },
  { year: "2014", text: "Đạt chứng nhận ISO 9001 và mở văn phòng khu vực tại TP. Hồ Chí Minh." },
  { year: "2019", text: "Ra mắt nền tảng giám sát IoT FuelConnect, phục vụ 200+ trạm nhiên liệu." },
  { year: "2024", text: "Vượt mốc 500 dự án hoàn thành tại 50 quốc gia, đội ngũ 380 nhân viên." },
];

export default function GioiThieuPage() {
  return (
    <>
      <PageHero
        title="Về FuelPrecision Industrial"
        subtitle="Hai thập kỷ tiên phong trong kỹ thuật hệ thống nhiên liệu công nghiệp"
        breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Giới thiệu" }]}
      />

      {/* ── Mission ── */}
      <section className="mx-auto max-w-content px-4 sm:px-6 lg:px-16 py-12 lg:py-20">
        {/* Mobile: stacked. Desktop: image + text side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          <div className="lg:col-span-6 flex flex-col gap-4 lg:gap-5">
            <SectionHeading heading="Sứ mệnh của chúng tôi" className="mb-0" />
            <p className="font-sans text-[15px] lg:text-[16px] leading-7 text-content-body">
              FuelPrecision ra đời với một mục tiêu duy nhất: đảm bảo rằng mọi lít nhiên liệu được
              đo lường chính xác, vận chuyển an toàn và phân phối hiệu quả. Từ những trạm xăng nhỏ
              lẻ đến cảng biển quốc tế và nhà máy công nghiệp nặng, chúng tôi xây dựng hạ tầng cho
              phép doanh nghiệp vận hành không gián đoạn.
            </p>
            <p className="font-sans text-[15px] lg:text-[16px] leading-7 text-content-body">
              Với đội ngũ hơn 380 kỹ sư và chuyên gia có kinh nghiệm thực chiến, chúng tôi không
              chỉ cung cấp thiết bị mà còn đồng hành trong toàn bộ vòng đời dự án — từ thiết kế,
              thi công, đào tạo đến bảo trì dài hạn.
            </p>
            <Link
              href="/lien-he"
              className="self-start inline-flex items-center justify-center bg-brand text-white rounded-btn px-6 py-[13px] font-sans text-[14px] leading-4 tracking-[0.05em] shadow-btn hover:bg-brand/90 transition-colors"
            >
              Liên hệ tư vấn
            </Link>
          </div>

          {/* Image — below text on mobile */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface-hero">
              <Image
                src="/images/about/mission.svg"
                alt="Đội ngũ kỹ sư FuelPrecision"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 580px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-surface-card py-10 lg:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16">
          {/* 2 col grid on mobile → 4 flex on lg */}
          <div className="grid grid-cols-2 lg:flex gap-4 lg:gap-6">
            <StatCard value="20+"   label="Năm kinh nghiệm" />
            <StatCard value="50+"   label="Quốc gia phục vụ" />
            <StatCard value="99.9%" label="Thời gian hoạt động" />
            <StatCard value="500+"  label="Dự án hoàn thành" />
          </div>
        </div>
      </section>

      {/* ── Core values ── */}
      <section className="mx-auto max-w-content px-4 sm:px-6 lg:px-16 py-12 lg:py-20">
        <SectionHeading
          heading="Giá Trị Cốt Lõi"
          subtitle="Những nguyên tắc định hướng mọi quyết định thiết kế và vận hành của chúng tôi."
          align="center"
        />
        {/* 1 col → 2 col → 4 col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {VALUES.map((v) => (
            <div key={v.title} className="flex flex-col gap-4 rounded-card bg-white p-5 lg:p-7 shadow-card">
              <div className="flex h-14 w-14 items-center justify-center rounded-[10px] bg-surface-card">
                {v.icon}
              </div>
              <h3 className="font-heading font-semibold text-[16px] lg:text-[18px] leading-6 text-content-heading">
                {v.title}
              </h3>
              <p className="font-sans text-[13px] lg:text-[14px] leading-5 text-content-body">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="bg-surface-card py-12 lg:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16">
          <SectionHeading
            heading="Hành Trình Của Chúng Tôi"
            subtitle="Những dấu mốc quan trọng trong 20 năm phát triển."
          />
          <ol className="relative border-l-2 border-border-ui pl-8 lg:pl-10 flex flex-col gap-8 lg:gap-10">
            {MILESTONES.map((m) => (
              <li key={m.year} className="relative">
                <span className="absolute -left-[37px] lg:-left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-brand ring-4 ring-surface-card">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
                <p className="mb-1 font-heading font-bold text-[14px] lg:text-[15px] text-brand-dark">{m.year}</p>
                <p className="font-sans text-[14px] lg:text-[15px] leading-6 text-content-body">{m.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-brand-gradient py-12 lg:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16 text-center">
          <h2 className="font-heading font-bold text-[26px] sm:text-[30px] lg:text-[36px] leading-[34px] sm:leading-[38px] lg:leading-[44px] text-white mb-4">
            Sẵn sàng hợp tác với chúng tôi?
          </h2>
          <p className="mb-6 lg:mb-8 font-sans text-[14px] lg:text-[16px] leading-6 text-white/80 max-w-xl mx-auto">
            Hãy để chúng tôi giúp bạn thiết kế hệ thống nhiên liệu phù hợp nhất với nhu cầu
            hoạt động của doanh nghiệp.
          </p>
          {/* Stack on mobile, row on sm+ */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/lien-he"
              className="inline-flex w-full sm:w-auto items-center justify-center bg-white text-brand rounded-btn px-6 py-[13px] font-sans text-[14px] leading-4 tracking-[0.05em] hover:bg-surface-card transition-colors"
            >
              Liên hệ ngay
            </Link>
            <Link
              href="/san-pham"
              className="inline-flex w-full sm:w-auto items-center justify-center border border-white/60 text-white rounded-btn px-6 py-[13px] font-sans text-[14px] leading-4 tracking-[0.05em] hover:bg-white/10 transition-colors"
            >
              Xem sản phẩm
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
