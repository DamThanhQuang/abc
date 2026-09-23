"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { idSchema, projectSchema, type ProjectInput } from "@/lib/validations";

type ActionResult = { success: boolean; error?: string; id?: string };

function revalidateProjectViews() {
  revalidatePath("/"); // trang chủ hiển thị khối dự án tiêu biểu
  revalidatePath("/admin/du-an");
  revalidatePath("/admin"); // số liệu tổng quan
}

export async function createProject(data: ProjectInput): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const project = await db.project.create({ data: parsed.data });
    revalidateProjectViews();
    return { success: true, id: project.id };
  } catch (err) {
    console.error("createProject:", err);
    return { success: false, error: "Không thể tạo dự án." };
  }
}

export async function updateProject(id: string, data: Partial<ProjectInput>): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  if (!idSchema.safeParse(id).success) return { success: false, error: "ID không hợp lệ." };

  const parsed = projectSchema.partial().safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    await db.project.update({ where: { id }, data: parsed.data });
    revalidateProjectViews();
    return { success: true };
  } catch (err) {
    console.error("updateProject:", err);
    return { success: false, error: "Không thể cập nhật dự án." };
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  if (!idSchema.safeParse(id).success) return { success: false, error: "ID không hợp lệ." };

  try {
    await db.project.delete({ where: { id } });
    revalidateProjectViews();
    return { success: true };
  } catch (err) {
    console.error("deleteProject:", err);
    return { success: false, error: "Không thể xóa dự án." };
  }
}
