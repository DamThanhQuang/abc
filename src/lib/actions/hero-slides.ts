"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { heroSlideSchema, idSchema, type HeroSlideInput } from "@/lib/validations";

type ActionResult = { success: boolean; error?: string; id?: string };

const SLIDE_ORDER = [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }];

function revalidateHeroViews() {
  revalidatePath("/"); // banner trang chủ
  revalidatePath("/admin/banner");
}

export async function createHeroSlide(data: HeroSlideInput): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  const parsed = heroSlideSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    // Slide mới xếp cuối danh sách.
    const last = await db.heroSlide.aggregate({ _max: { sortOrder: true } });
    const slide = await db.heroSlide.create({
      data: { ...parsed.data, sortOrder: (last._max.sortOrder ?? -1) + 1 },
    });
    revalidateHeroViews();
    return { success: true, id: slide.id };
  } catch (err) {
    console.error("createHeroSlide:", err);
    return { success: false, error: "Không thể tạo slide." };
  }
}

export async function updateHeroSlide(id: string, data: Partial<HeroSlideInput>): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  if (!idSchema.safeParse(id).success) return { success: false, error: "ID không hợp lệ." };

  const parsed = heroSlideSchema.partial().safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    await db.heroSlide.update({ where: { id }, data: parsed.data });
    revalidateHeroViews();
    return { success: true };
  } catch (err) {
    console.error("updateHeroSlide:", err);
    return { success: false, error: "Không thể cập nhật slide." };
  }
}

export async function deleteHeroSlide(id: string): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  if (!idSchema.safeParse(id).success) return { success: false, error: "ID không hợp lệ." };

  try {
    await db.heroSlide.delete({ where: { id } });
    revalidateHeroViews();
    return { success: true };
  } catch (err) {
    console.error("deleteHeroSlide:", err);
    return { success: false, error: "Không thể xóa slide." };
  }
}

export async function toggleHeroSlidePublished(id: string): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  if (!idSchema.safeParse(id).success) return { success: false, error: "ID không hợp lệ." };

  try {
    const slide = await db.heroSlide.findUnique({ where: { id }, select: { published: true } });
    if (!slide) return { success: false, error: "Không tìm thấy slide." };
    await db.heroSlide.update({ where: { id }, data: { published: !slide.published } });
    revalidateHeroViews();
    return { success: true };
  } catch (err) {
    console.error("toggleHeroSlidePublished:", err);
    return { success: false, error: "Không thể đổi trạng thái slide." };
  }
}

export async function moveHeroSlide(id: string, direction: "up" | "down"): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  if (!idSchema.safeParse(id).success) return { success: false, error: "ID không hợp lệ." };
  if (direction !== "up" && direction !== "down") return { success: false, error: "Hướng không hợp lệ." };

  try {
    const slides = await db.heroSlide.findMany({ orderBy: SLIDE_ORDER, select: { id: true } });
    const index = slides.findIndex((slide) => slide.id === id);
    const target = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || target < 0 || target >= slides.length) return { success: true };

    [slides[index], slides[target]] = [slides[target], slides[index]];

    // Đánh lại số thứ tự liên tục cho toàn bộ danh sách, nên các slide cũ có
    // sortOrder trùng nhau cũng được sửa luôn.
    await db.$transaction(
      slides.map((slide, sortOrder) =>
        db.heroSlide.update({ where: { id: slide.id }, data: { sortOrder } }),
      ),
    );
    revalidateHeroViews();
    return { success: true };
  } catch (err) {
    console.error("moveHeroSlide:", err);
    return { success: false, error: "Không thể đổi thứ tự slide." };
  }
}
