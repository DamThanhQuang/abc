import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { ProjectFormFields } from "@/components/admin/projects/ProjectFormFields";
import { SubmitButton } from "@/components/admin/shared/SubmitButton";
import { createProject } from "@/lib/actions/projects";
import { requireAdmin } from "@/lib/auth-guard";
import { projectInputFromForm } from "@/lib/project-form";

export const metadata: Metadata = { title: "Thêm dự án | Admin" };

export default function AdminCreateProjectPage() {
  async function handleCreate(formData: FormData) {
    "use server";
    // Closure này có action id riêng và gọi trực tiếp được, nên phải chặn người
    // dùng ẩn danh trước khi chạm vào dữ liệu form.
    const guard = await requireAdmin();
    if (!guard.ok) return;

    const result = await createProject(projectInputFromForm(formData));
    if (result.success) redirect("/admin/du-an");
  }

  return (
    <>
      <AdminHeader
        breadcrumb={[
          { label: "Tổng quan", href: "/admin" },
          { label: "Dự án", href: "/admin/du-an" },
          { label: "Thêm mới" },
        ]}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-[22px] text-content-heading">Thêm dự án tiêu biểu</h1>
            <p className="font-sans text-[13px] text-content-muted">Điền thông tin dự án bên dưới</p>
          </div>
          <Link href="/admin/du-an" className="font-sans text-[13px] text-brand hover:underline">
            &larr; Quay lại
          </Link>
        </div>

        <form action={handleCreate}>
          <ProjectFormFields />
          <div className="mt-5 flex items-center gap-2">
            <SubmitButton
              pendingText="Đang lưu..."
              className="rounded-btn bg-brand px-5 py-2.5 font-sans text-[13px] font-medium text-white shadow-btn hover:bg-brand/90 transition-colors"
            >
              Lưu dự án
            </SubmitButton>
            <Link
              href="/admin/du-an"
              className="rounded-btn border border-border-ui px-5 py-2.5 font-sans text-[13px] text-content-body hover:bg-surface-card transition-colors"
            >
              Hủy
            </Link>
          </div>
        </form>
      </main>
    </>
  );
}
