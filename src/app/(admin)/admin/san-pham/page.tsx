import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { getProducts } from "@/lib/api/products";
import { deleteProduct } from "@/lib/actions/products";

export const metadata: Metadata = { title: "Quan ly san pham | Admin" };

export default async function AdminSanPhamPage() {
  const products = await getProducts();

  return (
    <>
      <AdminHeader breadcrumb={[{ label: "Tong quan", href: "/admin" }, { label: "San pham" }]} />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Page header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-[22px] text-content-heading">Quan ly san pham</h1>
            <p className="font-sans text-[13px] text-content-muted">{products.length} san pham trong he thong</p>
          </div>
          <Link
            href="/admin/san-pham/tao-moi"
            className="inline-flex items-center gap-2 rounded-btn bg-brand px-4 py-2.5 font-sans text-[13px] font-medium text-white shadow-btn hover:bg-brand/90 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Them san pham
          </Link>
        </div>

        {/* Table */}
        <div className="rounded-card bg-white border border-border-ui shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border-ui bg-surface-card/50">
                  {["San pham", "Danh muc", "Ma san pham", "Thong so", "Thao tac"].map((h) => (
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
                          {product.model && <p className="font-sans text-[12px] text-content-muted">Mau: {product.model}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-pill bg-surface-tag border border-border-tag px-2.5 py-0.5 font-sans text-[12px] text-brand-dark">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-sans text-[13px] text-content-body font-mono">{product.model ?? "-"}</td>
                    <td className="px-5 py-4 font-sans text-[13px] text-content-body">{product.spec ?? "-"}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/san-pham/${product.id}`}
                          className="rounded-[6px] border border-border-ui px-3 py-1.5 font-sans text-[12px] text-content-body hover:bg-surface-card transition-colors"
                        >
                          Sua
                        </Link>
                        <form action={async () => {
                          "use server";
                          await deleteProduct(product.id);
                        }}>
                          <button
                            type="submit"
                            className="rounded-[6px] border border-red-200 px-3 py-1.5 font-sans text-[12px] text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Xoa
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
