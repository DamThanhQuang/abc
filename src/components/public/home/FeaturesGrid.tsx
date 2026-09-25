import Image from "next/image";
import Link from "next/link";

const DEPLOYMENT_STEPS = [
  {
    number: "01",
    title: "Khảo sát & tư vấn",
    description:
      "Tiếp nhận hiện trạng, nhu cầu vận hành và các yêu cầu kỹ thuật của từng trạm.",
  },
  {
    number: "02",
    title: "Cấu hình & lắp đặt",
    description:
      "Đề xuất cấu hình phù hợp, phối hợp lắp đặt và kết nối thiết bị theo phương án đã thống nhất.",
  },
  {
    number: "03",
    title: "Bàn giao & hỗ trợ",
    description:
      "Hướng dẫn vận hành, bàn giao hệ thống và tiếp tục hỗ trợ kỹ thuật sau triển khai.",
  },
] as const;

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M1.5 6.5h10M7.5 2.5l4 4-4 4"
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
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m3 8.25 3.1 3.1L13 4.75"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FeaturesGrid() {
  return (
    <section aria-labelledby="deployment-heading" className="bg-brand-dark">
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-16 lg:py-20">
        <div className="mb-8 grid gap-5 lg:mb-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="font-sans text-[16px] font-semibold uppercase leading-6 tracking-[0.1em] sm:text-[18px] text-green-300">
              Dự án &amp; năng lực triển khai
            </p>
            <h2
              id="deployment-heading"
              className="mt-3 max-w-3xl font-heading text-[24px] font-semibold leading-[32px] tracking-[-0.01em] text-white sm:text-[28px] sm:leading-[36px] lg:text-[32px] lg:leading-[40px]"
            >
              Đồng hành từ khảo sát đến vận hành
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-[14px] leading-6 text-white/70 lg:text-[16px]">
              Mỗi phương án được xây dựng theo hiện trạng, mục tiêu quản lý và
              điều kiện vận hành thực tế của từng trạm xăng dầu.
            </p>
          </div>

          <div className="lg:col-span-4 lg:text-right">
            <Link
              href="/lien-he"
              className="inline-flex items-center gap-2 rounded-btn bg-white px-5 py-3 font-sans text-[14px] font-medium leading-4 tracking-[0.03em] text-brand-dark transition-colors hover:bg-green-50"
            >
              Trao đổi dự án
              <ArrowIcon />
            </Link>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="relative min-h-[340px] overflow-hidden rounded-card bg-surface-hero sm:min-h-[420px] lg:col-span-7 lg:min-h-[520px]">
            <Image
              src="/images/home/astc-installation-technician.png"
              alt="Kỹ thuật viên Ánh Sáng Toàn Cầu kiểm tra hệ thống tại trạm xăng dầu"
              fill
              className="object-cover object-[44%_center]"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,29,54,0.04)_30%,rgba(0,29,54,0.9)_100%)]"
            />

            <div className="absolute left-5 top-5 rounded-pill border border-white/25 bg-brand-dark/55 px-3 py-1.5 font-sans text-[12px] leading-4 text-white backdrop-blur-md lg:left-6 lg:top-6">
              Giải pháp theo nhu cầu thực tế
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8">
              <h3 className="max-w-lg font-heading text-[22px] font-semibold leading-8 text-white sm:text-[26px] sm:leading-9">
                Một đầu mối xuyên suốt quá trình triển khai
              </h3>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-white/80">
                {[
                  "Thiết bị phù hợp",
                  "Kết nối đồng bộ",
                  "Hỗ trợ sau bàn giao",
                ].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 font-sans text-[13px] leading-5"
                  >
                    <span className="text-green-300">
                      <CheckIcon />
                    </span>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <ol className="grid gap-4 lg:col-span-5 lg:grid-rows-3">
            {DEPLOYMENT_STEPS.map((step) => (
              <li
                key={step.number}
                className="group flex gap-4 rounded-card border border-white/10 bg-white/[0.06] p-5 transition-colors hover:bg-white/[0.1] sm:gap-5 sm:p-6"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-green-300/30 bg-green-300/10 font-heading text-[13px] font-semibold text-green-300">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-heading text-[18px] font-semibold leading-7 text-white lg:text-[20px]">
                    {step.title}
                  </h3>
                  <p className="mt-2 font-sans text-[13px] leading-5 text-white/65 lg:text-[14px] lg:leading-6">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
