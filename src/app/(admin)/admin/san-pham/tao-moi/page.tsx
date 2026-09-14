import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { createProduct } from "@/lib/actions/products";
import { requireAdmin } from "@/lib/auth-guard";
import { getCategories } from "@/lib/api/categories";
import { ImageUpload } from "@/components/admin/shared/ImageUpload";

export const metadata: Metadata = { title: "Them san pham | Admin" };

const inputClass = "h-10 w-full rounded-btn border border-border-ui bg-white px-3 font-sans text-[13px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors";
const textareaClass = "w-full resize-none rounded-btn border border-border-ui bg-white px-3 py-2 font-sans text-[13px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors";
const labelClass = "font-sans text-[12px] font-semibold text-content-heading";

export default async function AdminCreateProductPage() {
  const categories = await getCategories();

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

    const categoryId = formData.get("categoryId") as string;

    const result = await createProduct({
      slug,
      name,
      categoryId,
      model: (formData.get("model") as string) || undefined,
      spec: (formData.get("spec") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      image: (formData.get("image") as string) || "/images/products/placeholder.svg",
      published: true,
      features: (formData.get("features") as string)
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      technicalSpecs: [],
    });
    if (result.success) redirect("/admin/san-pham");
  }

  return (
    <>
      <AdminHeader
        breadcrumb={[
          { label: "Tong quan", href: "/admin" },
          { label: "San pham", href: "/admin/san-pham" },
          { label: "Them moi" },
        ]}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-[22px] text-content-heading">Them san pham moi</h1>
            <p className="font-sans text-[13px] text-content-muted">Dien thong tin san pham ben duoi</p>
          </div>
          <Link href="/admin/san-pham" className="font-sans text-[13px] text-brand hover:underline">
            &larr; Quay lai
          </Link>
        </div>

        <form action={handleCreate}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main form */}
            <div className="lg:col-span-8 flex flex-col gap-5">
              <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
                <h2 className="mb-5 font-heading font-semibold text-[15px] text-content-heading border-b border-border-ui pb-4">
                  Thong tin co ban
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Ten san pham *</label>
                    <input type="text" name="name" className={inputClass} required placeholder="VD: May Bom Chuyen Nhien Lieu" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Ma san pham</label>
                      <input type="text" name="model" className={inputClass} placeholder="VD: FP-500X" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Thong so noi bat</label>
                      <input type="text" name="spec" className={inputClass} placeholder="VD: 500 L/min" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Mo ta</label>
                    <textarea rows={4} name="description" className={textareaClass} placeholder="Mo ta chi tiet ve san pham..." />
                  </div>
                </div>
              </div>

              <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
                <h2 className="mb-5 font-heading font-semibold text-[15px] text-content-heading border-b border-border-ui pb-4">
                  Tinh nang noi bat
                </h2>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Moi dong mot tinh nang</label>
                  <textarea rows={6} name="features" className={textareaClass} placeholder={"Tinh nang 1\nTinh nang 2\nTinh nang 3"} />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
                <h2 className="mb-4 font-heading font-semibold text-[15px] text-content-heading">Danh muc</h2>
                <select
                  name="categoryId"
                  required
                  defaultValue=""
                  className="h-10 w-full rounded-btn border border-border-ui bg-white px-3 font-sans text-[13px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 appearance-none"
                >
                  <option value="" disabled>Chon danh muc...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
                <h2 className="mb-4 font-heading font-semibold text-[15px] text-content-heading">Anh san pham</h2>
                <ImageUpload name="image" defaultValue="/images/products/placeholder.svg" label="Anh san pham" />
              </div>

              <div className="flex flex-col gap-2">
                <button type="submit" className="w-full rounded-btn bg-brand py-2.5 font-sans text-[13px] font-medium text-white shadow-btn hover:bg-brand/90 transition-colors">
                  Tao san pham
                </button>
                <Link href="/admin/san-pham" className="w-full rounded-btn border border-border-ui py-2.5 text-center font-sans text-[13px] text-content-body hover:bg-surface-card transition-colors">
                  Huy
                </Link>
              </div>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
