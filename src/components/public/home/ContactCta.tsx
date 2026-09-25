import Link from "next/link";
import { companyInfo } from "@/config/site";

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 4h3.5l1.5 4.5-2 1.5a11 11 0 0 0 6 6l1.5-2 4.5 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Lời kêu gọi cuối trang chủ, dẫn tới form "Để lại thông tin" hoặc gọi điện.
export function ContactCta() {
  return (
    <section aria-labelledby="contact-cta-heading" className="mx-auto max-w-content px-4 pb-12 sm:px-6 lg:px-16 lg:pb-20">
      <div className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(120deg,#06264a_0%,#0b3a66_55%,#0e4a5c_100%)] px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-400/20 blur-[90px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-400/15 blur-[100px]" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2
              id="contact-cta-heading"
              className="text-balance font-heading text-[24px] font-semibold leading-[32px] tracking-[-0.01em] text-white sm:text-[28px] sm:leading-[36px] lg:text-[32px] lg:leading-[40px]"
            >
              Cần tư vấn cấu hình cho trạm của bạn?
            </h2>
            <p className="mt-3 font-sans text-[15px] leading-6 text-white/75 lg:text-[16px]">
              Để lại thông tin hoặc gọi trực tiếp, đội ngũ kỹ thuật sẽ trao đổi
              phương án phù hợp với hiện trạng trạm.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href="/lien-he#dang-ky-tu-van"
              className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(90deg,#4ade80,#22d3ee)] px-7 py-3.5 font-sans text-[15px] font-bold text-white shadow-lg shadow-green-500/20 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06264a]"
            >
              Để lại thông tin
            </Link>
            {/* Hai số chung một khung như trên header; mỗi số là một link gọi riêng. */}
            <div className="inline-flex items-center justify-center gap-3 rounded-full border border-white/40 px-6 py-3.5 font-sans text-[15px] font-semibold text-white">
              <span className="text-green-300"><PhoneIcon /></span>
              {[companyInfo.phone, companyInfo.phoneSecondary].map((phone, index) => (
                <span key={phone} className="flex items-center gap-3">
                  {index > 0 ? <span aria-hidden="true" className="h-4 w-px bg-white/35" /> : null}
                  <a
                    href={`tel:${phone.replace(/\D/g, "")}`}
                    aria-label={`Gọi ${phone}`}
                    className="rounded-sm transition-colors hover:text-green-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                  >
                    {phone}
                  </a>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
