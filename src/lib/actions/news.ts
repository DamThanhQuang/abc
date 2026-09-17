"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { idSchema, newsSchema, type NewsInput } from "@/lib/validations";

type ActionResult = { success: boolean; error?: string; id?: string };

// The editor runs in the browser and cannot be trusted to have produced this
// markup. Clean it on the way in so the stored copy is already safe; the
// article page cleans again on the way out, which covers rows written before
// this existed.
function withCleanContent<T extends { content?: string }>(data: T): T {
  if (data.content === undefined) return data;
  return { ...data, content: sanitizeArticleHtml(data.content) };
}

export async function createArticle(data: NewsInput): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  const parsed = newsSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const article = await db.newsArticle.create({ data: withCleanContent(parsed.data) });
    revalidatePath("/tin-tuc");
    revalidatePath("/admin/tin-tuc");
    revalidatePath("/admin"); // dashboard totals
    return { success: true, id: article.id };
  } catch (err) {
    console.error("createArticle:", err);
    return { success: false, error: "Không thể tạo bài viết." };
  }
}

export async function updateArticle(id: string, data: Partial<NewsInput>): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  if (!idSchema.safeParse(id).success) return { success: false, error: "ID không hợp lệ." };

  const parsed = newsSchema.partial().safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    await db.newsArticle.update({ where: { id }, data: withCleanContent(parsed.data) });
    revalidatePath("/tin-tuc");
    revalidatePath("/admin/tin-tuc");
    revalidatePath("/admin"); // dashboard totals
    return { success: true };
  } catch (err) {
    console.error("updateArticle:", err);
    return { success: false, error: "Không thể cập nhật bài viết." };
  }
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  if (!idSchema.safeParse(id).success) return { success: false, error: "ID không hợp lệ." };

  try {
    await db.newsArticle.delete({ where: { id } });
    revalidatePath("/tin-tuc");
    revalidatePath("/admin/tin-tuc");
    revalidatePath("/admin"); // dashboard totals
    return { success: true };
  } catch (err) {
    console.error("deleteArticle:", err);
    return { success: false, error: "Không thể xóa bài viết." };
  }
}
