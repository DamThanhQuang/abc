import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { getProducts } from "@/lib/api/products";
import { getNewsArticles } from "@/lib/api/news";
import { getContactStats, getContacts } from "@/lib/api/contacts";

export const metadata: Metadata = { title: "Tong quan | Admin FuelPrecision" };

function StatCard({
  label,
  value,
  trend,
  trendUp,
  alert,
  icon,
}: {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  alert?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden rounded-card bg-white p-5 shadow-card border ${alert ? "border-red-200" : "border-border-ui"}`}>
      <div className="flex items-start justify-between mb-3">
        <p className="font-sans text-[13px] text-content-muted">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-[8px] ${alert ? "bg-red-50 text-red-500" : "bg-surface-card text-brand"}`}>
          {icon}
        </span>
      </div>
      <p className="font-heading font-semibold text-[28px] leading-8 text-content-heading">
        {value}
      </p>
      {trend && (
        <span className={`mt-2 inline-flex items-center gap-1 rounded-pill px-2 py-0.5 font-sans text-[12px] font-medium ${alert ? "bg-red-50 text-red-600" : trendUp ? "bg-green-50 text-green-600" : "bg-surface-card text-content-muted"}`}>
          {trendUp ? "^" : "-"} {trend}
        </span>
      )}
      <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-[0.06] ${alert ? "bg-red-500" : "bg-brand"}`} />
    </div>
  );
}

function ProductIcon() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2L2 6v8l8 4 8-4V6L10 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M2 6l8 4 8-4M10 10v8" stroke="currentColor" strokeWidth="1.6"/></svg>;
}
function NewsIcon() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M5 7h10M5 10h10M5 13h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
}
function RequestIcon() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 4h12M4 8h12M4 12h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
}
function AlertIcon() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6"/><path d="M10 6v4M10 13.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}

function statusLabel(status: string) {
  if (status === "new") return <span className="rounded-pill bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 text-[11px] font-medium">Moi</span>;
  if (status === "in-progress") return <span className="rounded-pill bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 text-[11px] font-medium">Dang xu ly</span>;
  return <span className="rounded-pill bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 text-[11px] font-medium">Da xu ly</span>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function AdminDashboard() {
  const [products, articles, stats, recentContacts] = await Promise.all([
    getProducts(),
    getNewsArticles(),
    getContactStats(),
    getContacts().then((c) => c.slice(0, 5)),
  ]);

  return (
    <>
      <AdminHeader breadcrumb={[{ label: "Tong quan" }]} />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Page title */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-[22px] text-content-heading">Tong quan</h1>
            <p className="font-sans text-[13px] text-content-muted">Xin chao, Admin. Day la tong quan he thong.</p>
          </div>
          <Link
            href="/admin/yeu-cau"
            className="inline-flex items-center gap-2 rounded-btn bg-brand px-4 py-2 font-sans text-[13px] text-white shadow-btn hover:bg-brand/90 transition-colors"
          >
            Xem yeu cau moi
            {stats.newCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-brand text-[11px] font-bold">
                {stats.newCount}
              </span>
            )}
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Tong san pham" value={products.length} icon={<ProductIcon />} />
          <StatCard label="Bai viet" value={articles.length} icon={<NewsIcon />} />
          <StatCard label="Yeu cau" value={stats.total} trend={`${stats.resolvedCount} da xu ly`} icon={<RequestIcon />} />
          <StatCard label="Cho xu ly" value={stats.newCount} trend="Can phan hoi" alert icon={<AlertIcon />} />
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Recent contact requests */}
          <div className="lg:col-span-8 rounded-card bg-white border border-border-ui shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-ui">
              <h2 className="font-heading font-semibold text-[15px] text-content-heading">Yeu cau gan day</h2>
              <Link href="/admin/yeu-cau" className="font-sans text-[13px] text-brand hover:underline">Xem tat ca</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-ui">
                    {["Nguoi gui", "Chu de", "Ngay", "Trang thai"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left font-sans text-[12px] font-semibold uppercase tracking-[0.06em] text-content-muted">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentContacts.map((c, i) => (
                    <tr key={c.id} className={`border-b border-border-ui last:border-0 ${i % 2 === 1 ? "bg-surface-card/40" : ""}`}>
                      <td className="px-5 py-3">
                        <p className="font-sans text-[13px] font-medium text-content-heading">{c.name}</p>
                        <p className="font-sans text-[12px] text-content-muted">{c.company ?? c.email}</p>
                      </td>
                      <td className="px-5 py-3 font-sans text-[13px] text-content-body max-w-[200px] truncate">{c.subject}</td>
                      <td className="px-5 py-3 font-sans text-[12px] text-content-muted whitespace-nowrap">{formatDate(c.createdAt)}</td>
                      <td className="px-5 py-3">{statusLabel(c.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="rounded-card bg-white border border-border-ui shadow-card p-5">
              <h2 className="mb-4 font-heading font-semibold text-[15px] text-content-heading">Quan ly nhanh</h2>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Them san pham moi", href: "/admin/san-pham/tao-moi", color: "bg-brand text-white" },
                  { label: "Dang bai viet", href: "/admin/tin-tuc/tao-moi", color: "bg-surface-card text-content-heading hover:bg-border-ui" },
                  { label: "Xem yeu cau cho xu ly", href: "/admin/yeu-cau", color: "bg-surface-card text-content-heading hover:bg-border-ui" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-btn px-4 py-3 font-sans text-[13px] font-medium transition-colors ${item.color}`}
                  >
                    {item.label}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-card bg-brand-gradient p-5">
              <p className="font-sans text-[12px] text-white/70 mb-1">Truy cap trang chu</p>
              <Link href="/" target="_blank" className="font-heading font-semibold text-[14px] text-white hover:underline">
                fuelprecision.vn &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
