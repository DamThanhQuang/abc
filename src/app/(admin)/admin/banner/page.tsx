import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { listHeroSlidesForAdmin } from "@/lib/api/hero-slides";
import { deleteHeroSlide, moveHeroSlide, toggleHeroSlidePublished } from "@/lib/actions/hero-slides";
import { SubmitButton } from "@/components/admin/shared/SubmitButton";

export const metadata: Metadata = { title: "Quản lý banner | Admin" };

const smallButtonClass = "rounded-[6px] border border-border-ui px-3 py-1.5 font-sans text-[12px] text-content-body hover:bg-surface-card transition-colors";
const orderButtonClass = "flex h-7 w-7 items-center justify-center rounded-[6px] border border-border-ui text-content-body hover:bg-surface-card transition-colors disabled:opacity-30 disabled:hover:bg-transparent";

export default async function AdminBannerPage() {
  const slides = await listHeroSlidesForAdmin();
  const hiddenCount = slides.filter((slide) => !slide.published).length;

  return (
    <>
      <AdminHeader breadcrumb={[{ label: "Tổng quan", href: "/admin" }, { label: "Banner" }]} />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-[22px] text-content-heading">Quản lý banner trang chủ</h1>
            <p className="font-sans text-[13px] text-content-muted">
              {slides.length} ảnh
              {hiddenCount > 0 && ` — ${hiddenCount} đang ẩn`}
              {" · "}Ảnh chạy lần lượt theo thứ tự bên dưới.
            </p>
          </div>
          <Link
            href="/admin/banner/tao-moi"
            className="inline-flex items-center gap-2 rounded-btn bg-brand px-4 py-2.5 font-sans text-[13px] font-medium text-white shadow-btn hover:bg-brand/90 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Thêm ảnh banner
          </Link>
        </div>

        {slides.length === 0 ? (
          <div className="rounded-card border border-border-ui bg-white p-10 text-center shadow-card">
            <p className="font-sans text-[14px] text-content-muted">
              Chưa có ảnh banner nào. Trang chủ đang dùng ảnh mặc định.
            </p>
          </div>
        ) : (
          <div className="rounded-card bg-white border border-border-ui shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-border-ui bg-surface-card/50">
                    {["Thứ tự", "Ảnh", "Trạng thái", "Thao tác"].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left font-sans text-[12px] font-semibold uppercase tracking-[0.06em] text-content-muted">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {slides.map((slide, i) => (
                    <tr key={slide.id} className={`border-b border-border-ui last:border-0 ${i % 2 === 1 ? "bg-surface-card/30" : ""}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 font-sans text-[13px] tabular-nums text-content-muted">{i + 1}</span>
                          <form action={async () => {
                            "use server";
                            await moveHeroSlide(slide.id, "up");
                          }}>
                            <SubmitButton pendingText="…" disabled={i === 0} aria-label="Đưa lên trước" className={orderButtonClass}>
                              ↑
                            </SubmitButton>
                          </form>
                          <form action={async () => {
                            "use server";
                            await moveHeroSlide(slide.id, "down");
                          }}>
                            <SubmitButton pendingText="…" disabled={i === slides.length - 1} aria-label="Đưa xuống sau" className={orderButtonClass}>
                              ↓
                            </SubmitButton>
                          </form>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-24 shrink-0 rounded-[6px] bg-surface-hero overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={slide.image} alt="" className="h-full w-full object-cover" />
                          </div>
                          <p className="font-sans text-[13px] text-content-heading line-clamp-2 max-w-[320px]">{slide.imageAlt}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <form action={async () => {
                          "use server";
                          await toggleHeroSlidePublished(slide.id);
                        }}>
                          <SubmitButton
                            pendingText="..."
                            className={`rounded-pill px-2.5 py-0.5 font-sans text-[12px] whitespace-nowrap ${
                              slide.published
                                ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                                : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                            }`}
                          >
                            {slide.published ? "Đang hiển thị" : "Đang ẩn"}
                          </SubmitButton>
                        </form>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/banner/${slide.id}`} className={smallButtonClass}>
                            Sửa
                          </Link>
                          <form action={async () => {
                            "use server";
                            await deleteHeroSlide(slide.id);
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
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
