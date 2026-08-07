import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { getProductBySlug, PRODUCTS } from "@/lib/api/products";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);
  return { title: product ? `Sửa: ${product.name} | Admin` : "Không tìm thấy" };
}

const inputClass = "h-10 w-full rounded-btn border border-border-ui bg-white px-3 font-sans text-[13px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors";
const textareaClass = "w-full resize-none rounded-btn border border-border-ui bg-white px-3 py-2 font-sans text-[13px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors";
const labelClass = "font-sans text-[12px] font-semibold text-content-heading";

export default async function AdminEditProductPage({ params }: Props) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) notFound();

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
            ← Quay lại
          </Link>
        </div>

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
                  <input type="text" defaultValue={product.name} className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Mã sản phẩm</label>
                    <input type="text" defaultValue={product.model ?? ""} className={inputClass} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Thông số nổi bật</label>
                    <input type="text" defaultValue={product.spec ?? ""} className={inputClass} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Mô tả</label>
                  <textarea rows={4} defaultValue={product.description ?? ""} className={textareaClass} />
                </div>
              </div>
            </div>

            <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
              <h2 className="mb-5 font-heading font-semibold text-[15px] text-content-heading border-b border-border-ui pb-4">
                Tính năng nổi bật
              </h2>
              <div className="flex flex-col gap-2">
                {(product.features ?? []).map((f, i) => (
                  <input key={i} type="text" defaultValue={f} className={inputClass} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
              <h2 className="mb-4 font-heading font-semibold text-[15px] text-content-heading">Danh mục</h2>
              <select defaultValue={product.categorySlug ?? ""} className="h-10 w-full rounded-btn border border-border-ui bg-white px-3 font-sans text-[13px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 appearance-none">
                <option value="may-bom">Máy bơm</option>
                <option value="dong-ho-do-luu-luong">Đồng hồ đo lưu lượng</option>
                <option value="he-thong-bon-chua">Hệ thống bồn chứa</option>
                <option value="voi-bom-tu-dong">Vòi bơm tự động</option>
              </select>
            </div>

            <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
              <h2 className="mb-4 font-heading font-semibold text-[15px] text-content-heading">Ảnh sản phẩm</h2>
              <div className="aspect-square overflow-hidden rounded-[8px] bg-surface-hero mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <button type="button" className="w-full rounded-btn border border-border-ui py-2 font-sans text-[13px] text-content-body hover:bg-surface-card transition-colors">
                Thay ảnh
              </button>
            </div>

            {/* Save button */}
            <div className="flex flex-col gap-2">
              <button type="button" className="w-full rounded-btn bg-brand py-2.5 font-sans text-[13px] font-medium text-white shadow-btn hover:bg-brand/90 transition-colors">
                Lưu thay đổi
              </button>
              <Link href="/admin/san-pham" className="w-full rounded-btn border border-border-ui py-2.5 text-center font-sans text-[13px] text-content-body hover:bg-surface-card transition-colors">
                Hủy
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
