import Link from "next/link";
import { LogoMark } from "@/components/shared/LogoMark";
import {
  companyInfo,
  contactPhones,
  footerNav,
  footerCopyright,
} from "@/config/site";

function ArrowIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 11 11" fill="none" aria-hidden="true">
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

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.1 3.5 9.4 7a1.5 1.5 0 0 1-.2 1.9L7.8 10.3a14.2 14.2 0 0 0 5.9 5.9l1.4-1.4a1.5 1.5 0 0 1 1.9-.2l3.5 2.3a1.5 1.5 0 0 1 .6 1.8l-.7 2a2 2 0 0 1-1.9 1.3C9.4 22 2 14.6 2 5.5a2 2 0 0 1 1.3-1.9l2-.7a1.5 1.5 0 0 1 1.8.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-surface-card border-t border-border-ui">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16">

        {/* Main row — stacks on mobile, side-by-side on lg+ */}
        <div className="flex flex-col gap-10 pt-10 lg:flex-row lg:items-start lg:justify-between lg:pt-12">

          {/* Left — logo + tagline + CTA link */}
          <div className="w-full lg:w-[368px] lg:shrink-0">
            <Link
              href="/"
              className="mb-4 inline-flex items-center"
            >
              <LogoMark className="h-20 w-auto" />
            </Link>
            {/* Hotline thay cho tagline cũ — hai số, mỗi số là một link gọi riêng. */}
            <div className="mb-5">
              <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-content-muted">
                Hotline
              </p>
              <ul className="flex flex-col gap-1.5">
                {contactPhones.map((phone) => (
                  <li key={phone}>
                    <a
                      href={`tel:${phone.replace(/\D/g, "")}`}
                      aria-label={`Gọi ${phone}`}
                      className="inline-flex items-center gap-2 rounded-sm font-heading text-[20px] font-semibold leading-7 text-content-heading transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                    >
                      <span className="text-brand-dark">
                        <PhoneIcon />
                      </span>
                      {phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-5 space-y-1 font-sans text-[12px] leading-5 text-content-muted">
              <p className="font-medium text-content-body">{companyInfo.legalName}</p>
              <p>Mã số thuế: {companyInfo.taxCode}</p>
              <p>{companyInfo.address}</p>
            </div>
            <Link
              href="/lien-he"
              className="inline-flex items-center gap-1.5 font-sans text-[13px] leading-4 tracking-[0.04em] text-brand-dark hover:underline transition-colors"
            >
              Liên hệ tư vấn
              <ArrowIcon />
            </Link>
          </div>

          {/* Right — nav columns — wrap on small tablet, side by side on sm+ */}
          <div className="flex flex-wrap gap-8 sm:gap-12 lg:gap-16 lg:shrink-0">
            {footerNav.map((col) => (
              <div key={col.heading} className="flex flex-col min-w-[120px]">
                <p className="mb-5 font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-content-heading">
                  {col.heading}
                </p>
                <ul className="flex flex-col gap-3 lg:gap-[14px]">
                  {col.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="font-sans text-[14px] leading-5 text-content-body hover:text-brand transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright bar */}
        <div className="mt-10 lg:mt-[72px] border-t border-border-ui pt-[13px] pb-8 lg:pb-12">
          <p className="font-sans text-[13px] leading-5 text-content-muted">
            {footerCopyright}
          </p>
        </div>

      </div>
    </footer>
  );
}
