"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { categorySchema, type CategoryInput } from "@/lib/validations";

type ActionResult = { success: boolean; error?: string; id?: string };

export async function createCategory(data: CategoryInput): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const category = await db.category.create({ data: parsed.data });
    revalidatePath("/admin/danh-muc");
    revalidatePath("/san-pham");
    return { success: true, id: category.id };
  } catch (err) {
    console.error("createCategory:", err);
    return { success: false, error: "Khong the tao danh muc." };
  }
}

export async function updateCategory(id: string, data: Partial<CategoryInput>): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  const parsed = categorySchema.partial().safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    await db.category.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/danh-muc");
    revalidatePath("/san-pham");
    return { success: true };
  } catch (err) {
    console.error("updateCategory:", err);
    return { success: false, error: "Khong the cap nhat danh muc." };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  try {
    const count = await db.product.count({ where: { categoryId: id } });
    if (count > 0) {
      return { success: false, error: `Danh muc dang chua ${count} san pham. Vui long chuyen san pham sang danh muc khac truoc.` };
    }
    await db.category.delete({ where: { id } });
    revalidatePath("/admin/danh-muc");
    return { success: true };
  } catch (err) {
    console.error("deleteCategory:", err);
    return { success: false, error: "Khong the xoa danh muc." };
  }
}
