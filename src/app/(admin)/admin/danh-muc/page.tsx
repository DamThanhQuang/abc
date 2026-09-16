import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { getCategories } from "@/lib/api/categories";
import { createCategory, deleteCategory } from "@/lib/actions/categories";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Quản lý danh mục | Admin" };

const inputClass = "h-10 w-full rounded-btn border border-border-ui bg-white px-3 font-sans text-[13px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors";

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
                      {["Thứ tự", "Tên danh mục", "Slug", "Sản phẩm", "Thao tác"].map((h) => (
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
                        <td className="px-5 py-4 font-sans text-[13px] font-medium text-content-heading">{cat.name}</td>
                        <td className="px-5 py-4 font-sans text-[12px] text-content-muted font-mono">{cat.slug}</td>
                        <td className="px-5 py-4 font-sans text-[13px] text-content-body">{countMap.get(cat.id) ?? 0}</td>
                        <td className="px-5 py-4">
                          <form action={async () => {
                            "use server";
                            await deleteCategory(cat.id);
                          }}>
                            <button
                              type="submit"
                              className="rounded-[6px] border border-red-200 px-3 py-1.5 font-sans text-[12px] text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Xóa
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center font-sans text-[13px] text-content-muted">
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
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-[12px] font-semibold text-content-heading">Tên danh mục *</label>
                  <input type="text" name="name" required className={inputClass} placeholder="VD: May bom" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-[12px] font-semibold text-content-heading">Mô tả</label>
                  <input type="text" name="description" className={inputClass} placeholder="Mô tả ngắn gọn" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-[12px] font-semibold text-content-heading">Thứ tự hiển thị</label>
                  <input type="number" name="order" className={inputClass} defaultValue="0" min="0" />
                </div>
                <button type="submit" className="w-full rounded-btn bg-brand py-2.5 font-sans text-[13px] font-medium text-white shadow-btn hover:bg-brand/90 transition-colors">
                  Tạo danh mục
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
