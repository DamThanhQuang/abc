"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mainNav, type NavItem } from "@/config/site";

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="flex items-center gap-6">
      {mainNav.map((item: NavItem) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-[16px] leading-6 transition-colors",
              // Active: brand-dark color + 2px bottom border underline
              isActive
                ? "text-brand-dark border-b-2 border-brand-dark pb-1.5 font-normal"
                : "text-content-muted hover:text-content-body pb-1",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
