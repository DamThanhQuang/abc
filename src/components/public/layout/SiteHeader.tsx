import Link from "next/link";
import { SiteNav } from "./SiteNav";
import { MobileNav } from "./MobileNav";
import { LogoMark } from "@/components/shared/LogoMark";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-surface-page border-b border-border-ui w-full">
      <div
        className="
          mx-auto flex h-16 lg:h-20 w-full max-w-content
          items-center justify-between
          px-4 sm:px-6 lg:px-16
        "
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1 shrink-0"
          aria-label={siteConfig.name}
        >
          <LogoMark />
          <span className="font-heading font-bold text-xl lg:text-2xl leading-8 text-brand-dark whitespace-nowrap">
            {siteConfig.name}
          </span>
        </Link>

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
