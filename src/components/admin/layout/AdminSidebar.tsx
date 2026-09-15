"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/shared/LogoMark";
import { adminMainNav, type AdminNavItem } from "@/config/admin-nav";
import { logout } from "@/lib/actions/auth";

// ── Icons ─────────────────────────────────────────────────────────────────────
function NavIcon({ type }: { type: AdminNavItem["icon"] }) {
  const props = { width: 18, height: 18, viewBox: "0 0 20 20", fill: "none", "aria-hidden": true as const };
  switch (type) {
    case "dashboard":
      return <svg {...props}><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/></svg>;
    case "category":
      return <svg {...props}><path d="M3 4h5l2 2h7a1 1 0 011 1v9a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>;
    case "product":
      return <svg {...props}><path d="M10 2L2 6v8l8 4 8-4V6L10 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M2 6l8 4 8-4M10 10v8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>;
    case "news":
      return <svg {...props}><path d="M4 4h12M4 8h12M4 12h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/></svg>;
    case "request":
      return <svg {...props}><path d="M3 4h14M3 8h14M3 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="16" cy="15" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M16 14v1.5l1 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
    case "logout":
      return <svg {...props}><path d="M8 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4M13 15l4-5-4-5M17 10H8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    default:
      return null;
  }
}

// ── Nav link ──────────────────────────────────────────────────────────────────
function NavLink({ item, active }: { item: AdminNavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 h-[36px] px-3 rounded-[6px] transition-colors",
        "font-sans text-[14px] leading-5",
        active
          ? "bg-brand text-white"
          : "text-[#94a3b8] hover:bg-white/10 hover:text-white",
      )}
    >
      <span className="shrink-0 w-5 flex items-center justify-center">
        <NavIcon type={item.icon} />
      </span>
      {item.label}
    </Link>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col bg-[#0f172a]">
      {/* Header */}
      <div className="flex h-[77px] items-center gap-3 px-4 border-b border-white/10">
        <LogoMark className="h-14 w-auto shrink-0 rounded-[6px]" />
        <div>
          <p className="font-sans text-[12px] text-[#94a3b8]">Admin Console</p>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#475569]">
          Điều hướng
        </p>
        <ul className="flex flex-col gap-1">
          {adminMainNav.map((item) => (
            <li key={item.href}>
              <NavLink item={item} active={isActive(item.href)} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Sign out — a real action that clears the session cookie */}
      <div className="border-t border-white/10 px-3 py-3">
        <form action={logout}>
          <button
            type="submit"
            className={cn(
              "flex w-full items-center gap-3 h-[36px] px-3 rounded-[6px] transition-colors",
              "font-sans text-[14px] leading-5",
              "text-[#94a3b8] hover:bg-white/10 hover:text-white",
            )}
          >
            <span className="shrink-0 w-5 flex items-center justify-center">
              <NavIcon type="logout" />
            </span>
            Đăng xuất
          </button>
        </form>
      </div>
    </aside>
  );
}
