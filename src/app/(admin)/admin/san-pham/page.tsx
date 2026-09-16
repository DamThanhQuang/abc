import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { listProductsForAdmin } from "@/lib/api/products";
import { deleteProduct } from "@/lib/actions/products";

export const metadata: Metadata = { title: "Quản lý sản phẩm | Admin" };

export default async function AdminSanPhamPage() {
  const products = await listProductsForAdmin();
  const draftCount = products.filter((product) => !product.published).length;

  return (
    <>
      <AdminHeader breadcrumb={[{ label: "Tổng quan", href: "/admin" }, { label: "Sản phẩm" }]} />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Page header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-[22px] text-content-heading">Quản lý sản phẩm</h1>
            <p className="font-sans text-[13px] text-content-muted">
              {products.length} sản phẩm trong hệ thống
              {draftCount > 0 && ` — ${draftCount} chưa xuất bản`}
            </p>
          </div>
          <Link
            href="/admin/san-pham/tao-moi"
            className="inline-flex items-center gap-2 rounded-btn bg-brand px-4 py-2.5 font-sans text-[13px] font-medium text-white shadow-btn hover:bg-brand/90 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Thêm sản phẩm
          </Link>
        </div>

        {/* Table */}
        <div className="rounded-card bg-white border border-border-ui shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border-ui bg-surface-card/50">
                  {["Sản phẩm", "Danh mục", "Mã sản phẩm", "Thông số", "Trạng thái", "Thao tác"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left font-sans text-[12px] font-semibold uppercase tracking-[0.06em] text-content-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => (
                  <tr key={product.id} className={`border-b border-border-ui last:border-0 ${i % 2 === 1 ? "bg-surface-card/30" : ""}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-[6px] bg-surface-hero overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={product.image} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-sans text-[13px] font-medium text-content-heading line-clamp-1">{product.name}</p>
                          {product.model && <p className="font-sans text-[12px] text-content-muted">Mẫu: {product.model}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-pill bg-surface-tag border border-border-tag px-2.5 py-0.5 font-sans text-[12px] text-brand-dark">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-sans text-[13px] text-content-body font-mono">{product.model ?? "-"}</td>
                    <td className="px-5 py-4 font-sans text-[13px] text-content-body">{product.spec ?? "-"}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-pill px-2.5 py-0.5 font-sans text-[12px] ${
                          product.published
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {product.published ? "Đã xuất bản" : "Bản nháp"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/san-pham/${product.id}`}
                          className="rounded-[6px] border border-border-ui px-3 py-1.5 font-sans text-[12px] text-content-body hover:bg-surface-card transition-colors"
                        >
                          Sửa
                        </Link>
                        <form action={async () => {
                          "use server";
                          await deleteProduct(product.id);
                        }}>
                          <button
                            type="submit"
                            className="rounded-[6px] border border-red-200 px-3 py-1.5 font-sans text-[12px] text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Xóa
                          </button>
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
