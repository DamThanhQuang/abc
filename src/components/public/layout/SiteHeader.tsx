import Link from "next/link";
import { SiteNav } from "./SiteNav";
import { MobileNav } from "./MobileNav";
import { LogoMark } from "@/components/shared/LogoMark";
import { companyInfo } from "@/config/site";

// Số trong config có dấu chấm phân cách để dễ đọc; tel: cần số thuần.
function telHref(phone: string) {
  return `tel:${phone.replace(/\D/g, "")}`;
}

function HeaderPhone({ phone }: { phone: string }) {
  return (
    <a href={telHref(phone)} className="transition-colors hover:underline">
      {phone}
    </a>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M4.6 2.2 6 4.4 4.9 5.8a7.6 7.6 0 0 0 3.3 3.3l1.4-1.1 2.2 1.4v1.9c0 .5-.4.9-.9.8A10.3 10.3 0 0 1 1.9 2.9c0-.5.3-.9.8-.9h1.9Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-surface-page border-b border-border-ui w-full">
      <div
        className="
          mx-auto flex h-16 lg:h-20 w-full max-w-content
          items-center justify-between gap-4
          px-4 sm:px-6 lg:px-16
        "
      >
        {/* Logo + nhận diện công ty */}
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/" className="flex shrink-0 items-center">
            <LogoMark className="h-12 w-auto lg:h-16" />
          </Link>

          {/* Chỉ hiện từ xl: tên pháp lý trên một dòng chiếm khoảng 350px, mà
              từ 1024px đến 1279px phần còn lại sau logo và nav không đủ chỗ. */}
          <div className="hidden shrink-0 border-l border-border-ui pl-4 xl:flex xl:flex-col xl:justify-center">
            <p className="whitespace-nowrap font-sans text-[12px] font-medium leading-4 text-content-heading">
              {companyInfo.legalName}
            </p>
            <p className="mt-1 flex items-center gap-2 whitespace-nowrap font-sans text-[14px] font-semibold leading-5 text-brand-dark">
              <PhoneIcon />
              <HeaderPhone phone={companyInfo.phone} />
              <span aria-hidden="true" className="font-normal text-border-ui">
                |
              </span>
              <HeaderPhone phone={companyInfo.phoneSecondary} />
            </p>
          </div>
        </div>

        {/* Desktop nav — hidden on mobile */}
        <div className="hidden lg:flex items-center">
          <SiteNav />
        </div>

        {/* Mobile hamburger — hidden on desktop */}
        <MobileNav />
      </div>
    </header>
  );
}
