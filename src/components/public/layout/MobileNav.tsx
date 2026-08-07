"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mainNav } from "@/config/site";
import { LogoMark } from "@/components/shared/LogoMark";

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <line x1="2" y1="5"  x2="20" y2="5"  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="2" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <line x1="4" y1="4"  x2="18" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="18" y1="4" x2="4"  y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Hamburger button — only on mobile */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Mở menu điều hướng"
        className="lg:hidden flex h-10 w-10 items-center justify-center rounded-btn text-brand-dark hover:bg-surface-card transition-colors"
      >
        <MenuIcon />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-in drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-[280px] max-w-full",
          "bg-surface-page border-l border-border-ui shadow-xl",
          "flex flex-col",
          "transition-transform duration-300 ease-in-out",
          "lg:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Drawer header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-border-ui">
          <Link href="/" className="inline-flex items-center gap-1.5">
            <LogoMark size={18} />
            <span className="font-heading font-bold text-[18px] text-brand-dark">FuelPrecision</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Đóng menu"
            className="flex h-10 w-10 items-center justify-center rounded-btn text-content-muted hover:bg-surface-card transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Nav links */}
        <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="flex flex-col">
            {mainNav.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center h-12 px-3 rounded-btn",
                      "font-sans text-[16px] transition-colors",
                      isActive
                        ? "bg-surface-card text-brand-dark font-semibold"
                        : "text-content-body hover:bg-surface-card",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom CTA */}
        <div className="px-4 pb-6 pt-4 border-t border-border-ui">
          <Link
            href="/lien-he"
            className="
              flex w-full items-center justify-center
              bg-brand text-white rounded-btn
              px-6 py-3
              font-sans text-[14px] leading-4 tracking-[0.05em]
              hover:bg-brand/90 transition-colors
            "
          >
            Liên hệ kinh doanh
          </Link>
        </div>
      </div>
    </>
  );
}
