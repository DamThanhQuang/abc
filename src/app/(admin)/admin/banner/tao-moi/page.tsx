import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { BannerSlideFields } from "@/components/admin/banner/BannerSlideFields";
import { SubmitButton } from "@/components/admin/shared/SubmitButton";
import { createHeroSlide } from "@/lib/actions/hero-slides";
import { requireAdmin } from "@/lib/auth-guard";
import { heroSlideInputFromForm } from "@/lib/hero-slide-form";

export const metadata: Metadata = { title: "Thêm ảnh banner | Admin" };

export default function AdminCreateBannerPage() {
  async function handleCreate(formData: FormData) {
    "use server";
    // Closure này có action id riêng và gọi trực tiếp được, nên phải chặn người
    // dùng ẩn danh trước khi chạm vào dữ liệu form.
    const guard = await requireAdmin();
    if (!guard.ok) return;

    const result = await createHeroSlide(heroSlideInputFromForm(formData));
    if (result.success) redirect("/admin/banner");
  }

  return (
    <>
      <AdminHeader
        breadcrumb={[
          { label: "Tổng quan", href: "/admin" },
          { label: "Banner", href: "/admin/banner" },
          { label: "Thêm mới" },
        ]}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-[22px] text-content-heading">Thêm ảnh banner</h1>
            <p className="font-sans text-[13px] text-content-muted">Ảnh mới được xếp cuối danh sách</p>
          </div>
          <Link href="/admin/banner" className="font-sans text-[13px] text-brand hover:underline">
            &larr; Quay lại
          </Link>
        </div>

        <form action={handleCreate}>
          <BannerSlideFields />
          <div className="mt-5 flex items-center gap-2">
            <SubmitButton
              pendingText="Đang lưu..."
              className="rounded-btn bg-brand px-5 py-2.5 font-sans text-[13px] font-medium text-white shadow-btn hover:bg-brand/90 transition-colors"
            >
              Lưu ảnh banner
            </SubmitButton>
            <Link
              href="/admin/banner"
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
