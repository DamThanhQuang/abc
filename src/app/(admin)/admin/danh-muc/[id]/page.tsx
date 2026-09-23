import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { CategoryFormFields } from "@/components/admin/categories/CategoryFormFields";
import { SubmitButton } from "@/components/admin/shared/SubmitButton";
import { updateCategory } from "@/lib/actions/categories";
import { getCategoryById } from "@/lib/api/categories";
import { requireAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = { title: "Sửa danh mục | Admin" };

export default async function AdminEditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryById(id);
  if (!category) notFound();

  async function handleUpdate(formData: FormData) {
    "use server";
    // Closure này có action id riêng và gọi trực tiếp được, nên phải chặn người
    // dùng ẩn danh trước khi chạm vào dữ liệu form.
    const guard = await requireAdmin();
    if (!guard.ok) return;

    // Cố ý không gửi slug: slug đang là đích của các link ở trang chủ, footer
    // và mọi URL /san-pham?category=... đã chia sẻ ra ngoài. Đổi tên danh mục
    // không được phép làm chết những link đó.
    const result = await updateCategory(id, {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      image: (formData.get("image") as string) || undefined,
      order: Number(formData.get("order")) || 0,
    });
    if (result.success) redirect("/admin/danh-muc");
  }

  return (
    <>
      <AdminHeader
        breadcrumb={[
          { label: "Tổng quan", href: "/admin" },
          { label: "Danh mục", href: "/admin/danh-muc" },
          { label: category.name },
        ]}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-[22px] text-content-heading">Sửa danh mục</h1>
            <p className="font-sans text-[13px] text-content-muted">{category.name}</p>
          </div>
          <Link href="/admin/danh-muc" className="font-sans text-[13px] text-brand hover:underline">
            &larr; Quay lại
          </Link>
        </div>

        <form action={handleUpdate} className="max-w-xl">
          <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
            <CategoryFormFields category={category} />

            <div className="mt-5 border-t border-border-ui pt-4">
              <p className="font-sans text-[12px] font-semibold text-content-heading">Slug</p>
              <p className="mt-1 font-mono font-sans text-[12px] text-content-muted">{category.slug}</p>
              <p className="mt-1 font-sans text-[12px] text-content-muted">
                Slug không đổi khi sửa tên, để các link đã chia sẻ không bị hỏng.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <SubmitButton
              pendingText="Đang lưu..."
              className="rounded-btn bg-brand px-5 py-2.5 font-sans text-[13px] font-medium text-white shadow-btn hover:bg-brand/90 transition-colors"
            >
              Lưu thay đổi
            </SubmitButton>
            <Link
              href="/admin/danh-muc"
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
