import type { Metadata } from "next";
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function AdminYeuCauPage() {
  const [contacts, stats] = await Promise.all([getContacts(), getContactStats()]);

  return (
    <>
      <AdminHeader breadcrumb={[{ label: "Tổng quan", href: "/admin" }, { label: "Yêu cầu liên hệ" }]} />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="font-heading font-bold text-[22px] text-content-heading">Yêu cầu liên hệ</h1>
          <p className="font-sans text-[13px] text-content-muted">Quản lý các yêu cầu từ khách hàng</p>
        </div>

        {/* Stats pills */}
        <div className="mb-6 flex flex-wrap gap-3">
          {[
            { label: "Tất cả", value: stats.total, color: "bg-white border-border-ui text-content-heading" },
            { label: "Mới", value: stats.newCount, color: "bg-blue-50 border-blue-200 text-blue-700" },
            { label: "Đang xử lý", value: stats.inProgressCount, color: "bg-amber-50 border-amber-200 text-amber-700" },
            { label: "Đã xử lý", value: stats.resolvedCount, color: "bg-green-50 border-green-200 text-green-700" },
          ].map((s) => (
            <div key={s.label} className={`flex items-center gap-2 rounded-btn border px-4 py-2 font-sans text-[13px] font-medium ${s.color}`}>
              {s.label}
              <span className="rounded-full bg-current/20 px-1.5 py-0.5 text-[11px] font-bold">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-card bg-white border border-border-ui shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-border-ui bg-surface-card/50">
                  {["Người gửi", "Chủ đề", "Nội dung", "Ngày gửi", "Trạng thái", "Thao tác"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left font-sans text-[12px] font-semibold uppercase tracking-[0.06em] text-content-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contacts.map((c, i) => (
                  <tr key={c.id} className={`border-b border-border-ui last:border-0 ${i % 2 === 1 ? "bg-surface-card/30" : ""}`}>
                    <td className="px-5 py-4">
                      <p className="font-sans text-[13px] font-medium text-content-heading">{c.name}</p>
                      {c.company && <p className="font-sans text-[12px] text-content-muted">{c.company}</p>}
                      <p className="font-sans text-[12px] text-content-muted">{c.email}</p>
                    </td>
                    <td className="px-5 py-4 font-sans text-[13px] text-content-body max-w-[180px]">
                      <p className="line-clamp-2">{c.subject}</p>
                    </td>
                    <td className="px-5 py-4 font-sans text-[12px] text-content-muted max-w-[220px]">
                      <p className="line-clamp-2">{c.message}</p>
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
