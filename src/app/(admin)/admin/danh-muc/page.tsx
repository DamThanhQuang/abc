import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { getCategories } from "@/lib/api/categories";
import { createCategory, deleteCategory } from "@/lib/actions/categories";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { SubmitButton } from "@/components/admin/shared/SubmitButton";
import { CategoryFormFields } from "@/components/admin/categories/CategoryFormFields";
import Link from "next/link";

export const metadata: Metadata = { title: "Quản lý danh mục | Admin" };

export default async function AdminDanhMucPage() {
  const categories = await getCategories();

  // Count products per category
  const productCounts = await db.product.groupBy({
    by: ["categoryId"],
    _count: { id: true },
  });
  const countMap = new Map(productCounts.map((pc) => [pc.categoryId, pc._count.id]));

  async function handleCreate(formData: FormData) {
    "use server";
    // This closure has its own action id and is directly invocable, so it must
    // refuse anonymous callers before it touches the submitted form data.
    const guard = await requireAdmin();
    if (!guard.ok) return;

    const name = formData.get("name") as string;
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const result = await createCategory({
      slug,
      name,
      description: (formData.get("description") as string) || undefined,
      image: (formData.get("image") as string) || undefined,
      order: Number(formData.get("order")) || 0,
    });
    if (result.success) redirect("/admin/danh-muc");
  }

  return (
    <>
      <AdminHeader breadcrumb={[{ label: "Tổng quan", href: "/admin" }, { label: "Danh mục" }]} />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="font-heading font-bold text-[22px] text-content-heading">Quản lý danh mục</h1>
          <p className="font-sans text-[13px] text-content-muted">{categories.length} danh mục trong hệ thống</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Category list */}
          <div className="lg:col-span-8">
            <div className="rounded-card bg-white border border-border-ui shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-border-ui bg-surface-card/50">
                      {["Thứ tự", "Ảnh", "Tên danh mục", "Slug", "Sản phẩm", "Thao tác"].map((h) => (
                        <th key={h} className="px-5 py-3.5 text-left font-sans text-[12px] font-semibold uppercase tracking-[0.06em] text-content-muted">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat, i) => (
                      <tr key={cat.id} className={`border-b border-border-ui last:border-0 ${i % 2 === 1 ? "bg-surface-card/30" : ""}`}>
                        <td className="px-5 py-4 font-sans text-[13px] text-content-body w-16">{cat.order}</td>
                        <td className="px-5 py-4">
                          <div className="h-10 w-16 overflow-hidden rounded-[6px] bg-surface-hero">
                            {cat.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={cat.image} alt="" className="h-full w-full object-cover" />
                            ) : null}
                          </div>
                        </td>
                        <td className="px-5 py-4 font-sans text-[13px] font-medium text-content-heading">{cat.name}</td>
                        <td className="px-5 py-4 font-sans text-[12px] text-content-muted font-mono">{cat.slug}</td>
                        <td className="px-5 py-4 font-sans text-[13px] text-content-body">{countMap.get(cat.id) ?? 0}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/danh-muc/${cat.id}`}
                            className="rounded-[6px] border border-border-ui px-3 py-1.5 font-sans text-[12px] text-content-body hover:bg-surface-card transition-colors"
                          >
                            Sửa
                          </Link>
                          <form action={async () => {
                            "use server";
                            await deleteCategory(cat.id);
                          }}>
                            <SubmitButton
                              pendingText="Đang xóa..."
                              className="rounded-[6px] border border-red-200 px-3 py-1.5 font-sans text-[12px] text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Xóa
                            </SubmitButton>
                          </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center font-sans text-[13px] text-content-muted">
                          Chưa có danh mục nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Create form */}
          <div className="lg:col-span-4">
            <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
              <h2 className="mb-5 font-heading font-semibold text-[15px] text-content-heading border-b border-border-ui pb-4">
                Thêm danh mục mới
              </h2>
              <form action={handleCreate} className="flex flex-col gap-4">
                <CategoryFormFields />
                <SubmitButton pendingText="Đang tạo..." className="w-full rounded-btn bg-brand py-2.5 font-sans text-[13px] font-medium text-white shadow-btn hover:bg-brand/90 transition-colors">
                  Tạo danh mục
                </SubmitButton>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
