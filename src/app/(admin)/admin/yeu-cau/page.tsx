import type { Metadata } from "next";
import Link from "next/link";
import type { ContactStatus } from "@prisma/client";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { getContacts, getContactStats } from "@/lib/api/contacts";
import { updateContactStatus, deleteContact } from "@/lib/actions/contacts";
import { SubmitButton } from "@/components/admin/shared/SubmitButton";

export const metadata: Metadata = { title: "Yêu cầu liên hệ | Admin" };

function StatusBadge({ status }: { status: string }) {
  if (status === "new")
    return <span className="inline-flex items-center gap-1 rounded-pill bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-0.5 font-sans text-[11px] font-semibold"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" />Mới</span>;
  if (status === "in-progress")
    return <span className="inline-flex items-center gap-1 rounded-pill bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-0.5 font-sans text-[11px] font-semibold"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Đang xử lý</span>;
  return <span className="inline-flex items-center gap-1 rounded-pill bg-green-50 text-green-600 border border-green-200 px-2.5 py-0.5 font-sans text-[11px] font-semibold"><span className="h-1.5 w-1.5 rounded-full bg-green-500" />Đã xử lý</span>;
}

// Server chạy giờ UTC (Vercel), nên phải chỉ định múi giờ Việt Nam.
function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  });
}

// Nội dung ngắn hiện đủ trong 2 dòng; dài hơn mới cần nút mở rộng.
const MESSAGE_PREVIEW_LENGTH = 90;

// Giá trị lọc nằm trên URL (?trang-thai=...) để giữ nguyên sau khi tải lại trang
// hoặc sau khi bấm Xử lý / Đã xử lý.
const STATUS_FILTERS = [
  { param: "moi",        status: "NEW",         label: "Mới",        activeClass: "bg-blue-600 border-blue-600 text-white",   idleClass: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" },
  { param: "dang-xu-ly", status: "IN_PROGRESS", label: "Đang xử lý", activeClass: "bg-amber-500 border-amber-500 text-white", idleClass: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100" },
  { param: "da-xu-ly",   status: "RESOLVED",    label: "Đã xử lý",   activeClass: "bg-green-600 border-green-600 text-white", idleClass: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" },
] as const satisfies ReadonlyArray<{ param: string; status: ContactStatus; label: string; activeClass: string; idleClass: string }>;

const TABLE_HEADINGS = ["Người gửi", "Nhu cầu", "Nội dung", "Ngày gửi", "Trạng thái", "Thao tác"];

export default async function AdminYeuCauPage({
  searchParams,
}: {
  searchParams: Promise<{ "trang-thai"?: string | string[] }>;
}) {
  const params = await searchParams;
  const statusParam = Array.isArray(params["trang-thai"]) ? params["trang-thai"][0] : params["trang-thai"];
  // Giá trị lạ trên URL thì coi như "Tất cả".
  const activeFilter = STATUS_FILTERS.find((filter) => filter.param === statusParam);

  const [contacts, stats] = await Promise.all([
    getContacts({ status: activeFilter?.status }),
    getContactStats(),
  ]);
  const countByStatus: Record<ContactStatus, number> = {
    NEW: stats.newCount,
    IN_PROGRESS: stats.inProgressCount,
    RESOLVED: stats.resolvedCount,
  };
  const pillClass = "flex items-center gap-2 rounded-btn border px-4 py-2 font-sans text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40";

  return (
    <>
      <AdminHeader breadcrumb={[{ label: "Tổng quan", href: "/admin" }, { label: "Yêu cầu liên hệ" }]} />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="font-heading font-bold text-[22px] text-content-heading">Yêu cầu liên hệ</h1>
          <p className="font-sans text-[13px] text-content-muted">Quản lý các yêu cầu từ khách hàng</p>
        </div>

        {/* Status filter */}
        <nav aria-label="Lọc theo trạng thái" className="mb-6 flex flex-wrap gap-3">
          <Link
            href="/admin/yeu-cau"
            aria-current={activeFilter ? undefined : "page"}
            className={`${pillClass} ${
              activeFilter
                ? "bg-white border-border-ui text-content-heading hover:bg-surface-card"
                : "bg-content-heading border-content-heading text-white"
            }`}
          >
            Tất cả
            <span className="rounded-full bg-current/20 px-1.5 py-0.5 text-[11px] font-bold">{stats.total}</span>
          </Link>
          {STATUS_FILTERS.map((filter) => {
            const isActive = filter === activeFilter;
            return (
              <Link
                key={filter.param}
                href={`/admin/yeu-cau?trang-thai=${filter.param}`}
                aria-current={isActive ? "page" : undefined}
                className={`${pillClass} ${isActive ? filter.activeClass : filter.idleClass}`}
              >
                {filter.label}
                <span className="rounded-full bg-current/20 px-1.5 py-0.5 text-[11px] font-bold">
                  {countByStatus[filter.status]}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Table */}
        <div className="rounded-card bg-white border border-border-ui shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-border-ui bg-surface-card/50">
                  {TABLE_HEADINGS.map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left font-sans text-[12px] font-semibold uppercase tracking-[0.06em] text-content-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={TABLE_HEADINGS.length} className="px-5 py-12 text-center font-sans text-[14px] text-content-muted">
                      {activeFilter
                        ? `Không có yêu cầu nào ở trạng thái "${activeFilter.label}".`
                        : "Chưa có yêu cầu nào. Yêu cầu gửi từ trang Liên hệ sẽ hiện ở đây."}
                    </td>
                  </tr>
                ) : null}
                {contacts.map((c, i) => (
                  <tr key={c.id} className={`border-b border-border-ui last:border-0 ${i % 2 === 1 ? "bg-surface-card/30" : ""}`}>
                    <td className="px-5 py-4">
                      <p className="font-sans text-[13px] font-medium text-content-heading">{c.name}</p>
                      {c.company && <p className="font-sans text-[12px] text-content-muted">{c.company}</p>}
                      {c.phone && (
                        <a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} className="mt-1 block font-sans text-[13px] font-semibold text-brand-dark hover:underline">
                          {c.phone}
                        </a>
                      )}
                      <a href={`mailto:${c.email}`} className="block font-sans text-[12px] text-content-muted hover:text-brand-dark hover:underline">
                        {c.email}
                      </a>
                    </td>
                    <td className="px-5 py-4 font-sans text-[13px] text-content-body max-w-[180px]">
                      <p className="line-clamp-2">{c.subject}</p>
                    </td>
                    <td className="px-5 py-4 font-sans text-[12px] leading-5 text-content-body max-w-[320px]">
                      {c.message.length > MESSAGE_PREVIEW_LENGTH ? (
                        <details className="group">
                          <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                            <span className="block line-clamp-2 whitespace-pre-line group-open:line-clamp-none">{c.message}</span>
                            <span className="mt-1 inline-block font-medium text-brand-dark hover:underline group-open:hidden">Xem đầy đủ</span>
                            <span className="mt-1 hidden font-medium text-brand-dark hover:underline group-open:inline-block">Thu gọn</span>
                          </summary>
                        </details>
                      ) : (
                        <p className="whitespace-pre-line">{c.message}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 font-sans text-[12px] text-content-muted whitespace-nowrap">{formatDate(c.createdAt)}</td>
                    <td className="px-5 py-4 whitespace-nowrap"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {c.status === "new" && (
                          <form action={async () => {
                            "use server";
                            await updateContactStatus(c.id, "IN_PROGRESS");
                          }}>
                            <SubmitButton pendingText="Đang lưu..." className="rounded-[6px] border border-amber-200 px-3 py-1.5 font-sans text-[12px] text-amber-600 hover:bg-amber-50 transition-colors whitespace-nowrap">
                              Xử lý
                            </SubmitButton>
                          </form>
                        )}
                        {c.status !== "resolved" && (
                          <form action={async () => {
                            "use server";
                            await updateContactStatus(c.id, "RESOLVED");
                          }}>
                            <SubmitButton pendingText="Đang lưu..." className="rounded-[6px] border border-green-200 px-3 py-1.5 font-sans text-[12px] text-green-600 hover:bg-green-50 transition-colors whitespace-nowrap">
                              Đã xử lý
                            </SubmitButton>
                          </form>
                        )}
                        <form action={async () => {
                          "use server";
                          await deleteContact(c.id);
                        }}>
                          <SubmitButton pendingText="Đang xóa..." className="rounded-[6px] border border-red-200 px-3 py-1.5 font-sans text-[12px] text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap">
                            Xóa
                          </SubmitButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
