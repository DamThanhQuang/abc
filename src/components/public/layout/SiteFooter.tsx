import Link from "next/link";
import { LogoMark } from "@/components/shared/LogoMark";
import {
  siteConfig,
  footerNav,
  footerTagline,
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
              className="inline-flex items-center gap-1.5 mb-4"
              aria-label={siteConfig.name}
            >
              <LogoMark size={18} />
              <span className="font-heading font-bold text-[20px] leading-6 text-brand-dark">
                {siteConfig.name}
              </span>
            </Link>
            <p className="font-sans text-[14px] leading-[22px] text-content-body max-w-[310px] mb-5">
              {footerTagline}
            </p>
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
