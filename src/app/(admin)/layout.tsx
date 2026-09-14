import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";

// A CMS must never serve a snapshot. Without this the admin screens were
// prerendered at build time and kept showing build-time data — a contact
// request submitted on the public site would not appear here at all.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {children}
      </div>
    </div>
  );
}
