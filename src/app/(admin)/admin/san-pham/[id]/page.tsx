import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { updateProduct } from "@/lib/actions/products";
import { requireAdmin } from "@/lib/auth-guard";
import { getCategories } from "@/lib/api/categories";
import { MultiImageUpload } from "@/components/admin/shared/MultiImageUpload";
import { db } from "@/lib/db";
import { normalizeProductImages, parseProductImages, PRODUCT_IMAGE_PLACEHOLDER } from "@/lib/product-images";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id }, select: { name: true } });
  return { title: product ? `Sửa: ${product.name} | Admin` : "Không tìm thấy" };
}

const inputClass = "h-10 w-full rounded-btn border border-border-ui bg-white px-3 font-sans text-[13px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors";
const textareaClass = "w-full resize-none rounded-btn border border-border-ui bg-white px-3 py-2 font-sans text-[13px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors";
const labelClass = "font-sans text-[12px] font-semibold text-content-heading";

export default async function AdminEditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    include: { technicalSpecs: { orderBy: { order: "asc" } } },
  });
  if (!product) notFound();

  const categories = await getCategories();

  async function handleSave(formData: FormData) {
    "use server";
    // This closure has its own action id and is directly invocable, so it must
    // refuse anonymous callers before it touches the submitted form data.
    const guard = await requireAdmin();
    if (!guard.ok) return;

    const images = parseProductImages(formData.get("images"));
    const result = await updateProduct(id, {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      categoryId: formData.get("categoryId") as string,
      model: (formData.get("model") as string) || undefined,
      spec: (formData.get("spec") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      image: images[0] ?? PRODUCT_IMAGE_PLACEHOLDER,
      images,
      features: (formData.get("features") as string)
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      technicalSpecs: JSON.parse((formData.get("technicalSpecs") as string) || "[]"),
    });
    if (result.success) redirect("/admin/san-pham");
  }

  return (
    <>
      <AdminHeader
        breadcrumb={[
          { label: "Tổng quan", href: "/admin" },
          { label: "Sản phẩm", href: "/admin/san-pham" },
          { label: "Chỉnh sửa" },
        ]}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-[22px] text-content-heading">Chỉnh sửa sản phẩm</h1>
            <p className="font-sans text-[13px] text-content-muted">{product.name}</p>
          </div>
          <Link href="/admin/san-pham" className="font-sans text-[13px] text-brand hover:underline">
            &larr; Quay lại
          </Link>
        </div>

        <form action={handleSave}>
          <input type="hidden" name="slug" value={product.slug} />
          {/* Images are handled by MultiImageUpload in the sidebar. */}
          <input
            type="hidden"
            name="technicalSpecs"
            value={JSON.stringify(product.technicalSpecs.map((s) => ({ label: s.label, value: s.value, order: s.order })))}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main form */}
            <div className="lg:col-span-8 flex flex-col gap-5">
              <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
                <h2 className="mb-5 font-heading font-semibold text-[15px] text-content-heading border-b border-border-ui pb-4">
                  Thông tin cơ bản
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Tên sản phẩm</label>
                    <input type="text" name="name" defaultValue={product.name} className={inputClass} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Mã sản phẩm</label>
                      <input type="text" name="model" defaultValue={product.model ?? ""} className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Thông số nổi bật</label>
                      <input type="text" name="spec" defaultValue={product.spec ?? ""} className={inputClass} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Mô tả</label>
                    <textarea rows={4} name="description" defaultValue={product.description ?? ""} className={textareaClass} />
                  </div>
                </div>
              </div>

              <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
                <h2 className="mb-5 font-heading font-semibold text-[15px] text-content-heading border-b border-border-ui pb-4">
                  Tính năng nổi bật
                </h2>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Mỗi dòng một tính năng</label>
                  <textarea
                    rows={6}
                    name="features"
                    defaultValue={(product.features ?? []).join("\n")}
                    className={textareaClass}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
                <h2 className="mb-4 font-heading font-semibold text-[15px] text-content-heading">Danh mục</h2>
                <select
                  name="categoryId"
                  defaultValue={product.categoryId}
                  className="h-10 w-full rounded-btn border border-border-ui bg-white px-3 font-sans text-[13px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 appearance-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
                <h2 className="mb-4 font-heading font-semibold text-[15px] text-content-heading">Ảnh sản phẩm</h2>
                <MultiImageUpload
                  name="images"
                  defaultValues={normalizeProductImages(product.images, product.image)}
                  label="Ảnh sản phẩm"
                />
              </div>

              {/* Save button */}
              <div className="flex flex-col gap-2">
                <button type="submit" className="w-full rounded-btn bg-brand py-2.5 font-sans text-[13px] font-medium text-white shadow-btn hover:bg-brand/90 transition-colors">
                  Lưu thay đổi
                </button>
                <Link href="/admin/san-pham" className="w-full rounded-btn border border-border-ui py-2.5 text-center font-sans text-[13px] text-content-body hover:bg-surface-card transition-colors">
                  Hủy
                </Link>
              </div>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
