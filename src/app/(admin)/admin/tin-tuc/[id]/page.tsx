import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { updateArticle } from "@/lib/actions/news";
import { ImageUpload } from "@/components/admin/shared/ImageUpload";
import { RichTextEditor } from "@/components/admin/shared/RichTextEditor";
import { db } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await db.newsArticle.findUnique({ where: { id }, select: { title: true } });
  return { title: article ? `Sua: ${article.title} | Admin` : "Khong tim thay" };
}

const inputClass = "h-10 w-full rounded-btn border border-border-ui bg-white px-3 font-sans text-[13px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors";
const textareaClass = "w-full resize-none rounded-btn border border-border-ui bg-white px-3 py-2 font-sans text-[13px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors";
const labelClass = "font-sans text-[12px] font-semibold text-content-heading";

export default async function AdminEditArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await db.newsArticle.findUnique({ where: { id } });
  if (!article) notFound();

  async function handleSave(formData: FormData) {
    "use server";
    const result = await updateArticle(id, {
      title: formData.get("title") as string,
      excerpt: formData.get("excerpt") as string,
      content: (formData.get("content") as string) || undefined,
      category: formData.get("category") as string,
      image: formData.get("image") as string,
      readingTime: Number(formData.get("readingTime")) || undefined,
    });
    if (result.success) redirect("/admin/tin-tuc");
  }

  return (
    <>
      <AdminHeader
        breadcrumb={[
          { label: "Tong quan", href: "/admin" },
          { label: "Tin tuc", href: "/admin/tin-tuc" },
          { label: "Chinh sua" },
        ]}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-[22px] text-content-heading">Chinh sua bai viet</h1>
            <p className="font-sans text-[13px] text-content-muted">{article.title}</p>
          </div>
          <Link href="/admin/tin-tuc" className="font-sans text-[13px] text-brand hover:underline">
            &larr; Quay lai
          </Link>
        </div>

        <form action={handleSave}>
          {/* image is handled by ImageUpload component in sidebar */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex flex-col gap-5">
              <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
                <h2 className="mb-5 font-heading font-semibold text-[15px] text-content-heading border-b border-border-ui pb-4">
                  Noi dung bai viet
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Tieu de</label>
                    <input type="text" name="title" defaultValue={article.title} className={inputClass} required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Tom tat</label>
                    <textarea rows={3} name="excerpt" defaultValue={article.excerpt} className={textareaClass} required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Noi dung chi tiet</label>
                    <RichTextEditor name="content" defaultValue={article.content ?? ""} placeholder="Noi dung day du cua bai viet..." />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-5">
              <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
                <h2 className="mb-4 font-heading font-semibold text-[15px] text-content-heading">Phan loai</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Danh muc</label>
                    <select
                      name="category"
                      defaultValue={article.category}
                      className="h-10 w-full rounded-btn border border-border-ui bg-white px-3 font-sans text-[13px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 appearance-none"
                    >
                      <option value="San pham moi">San pham moi</option>
                      <option value="Tin cong ty">Tin cong ty</option>
                      <option value="Kien thuc nganh">Kien thuc nganh</option>
                      <option value="Du an noi bat">Du an noi bat</option>
                      <option value="Su kien">Su kien</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Thoi gian doc (phut)</label>
                    <input type="number" name="readingTime" min="1" max="60" defaultValue={article.readingTime ?? ""} className={inputClass} />
                  </div>
                </div>
              </div>

              <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
                <h2 className="mb-4 font-heading font-semibold text-[15px] text-content-heading">Anh dai dien</h2>
                <ImageUpload name="image" defaultValue={article.image} label="Anh bai viet" />
              </div>

              <div className="flex flex-col gap-2">
                <button type="submit" className="w-full rounded-btn bg-brand py-2.5 font-sans text-[13px] font-medium text-white shadow-btn hover:bg-brand/90 transition-colors">
                  Luu thay doi
                </button>
                <Link href="/admin/tin-tuc" className="w-full rounded-btn border border-border-ui py-2.5 text-center font-sans text-[13px] text-content-body hover:bg-surface-card transition-colors">
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
